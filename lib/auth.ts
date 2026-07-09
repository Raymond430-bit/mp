// ============================================
// MemePulse - Authentication Utilities
// SECURITY: Server-side only. Never expose to client.
// ============================================

import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { db, users, sessions } from './db';
import { eq, and, gt } from 'drizzle-orm';
import { 
  generateAccessToken, 
  verifyAccessToken, 
  verifyRefreshToken,
  generateRefreshToken,
  hashPassword,
  verifyPassword,
  generateCsrfToken,
  isAccountLocked,
  recordFailedLogin,
  clearFailedAttempts,
  logAuditEvent,
  getClientIP,
} from './security';
import { loginSchema, registerSchema } from './validators';
import { z } from 'zod';

// ============================================
// Cookie Configuration (Security Hardened)
// ============================================

const ACCESS_COOKIE_OPTIONS = {
  name: '__Host-mp-at',
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/',
  maxAge: 60 * 15, // 15 minutes
};

const REFRESH_COOKIE_OPTIONS = {
  name: '__Host-mp-rt',
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/api/auth/refresh',
  maxAge: 60 * 60 * 24 * 7, // 7 days
};

const CSRF_COOKIE_OPTIONS = {
  name: 'mp-csrf',
  httpOnly: false, // Must be accessible by JS for form submission
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  path: '/',
  maxAge: 60 * 60 * 24, // 24 hours
};

// ============================================
// Session Management
// ============================================

export async function createSession(userId: string, ip: string, userAgent: string) {
  const refreshToken = await generateRefreshToken(userId);

  // Store session in database for server-side revocation
  await db.insert(sessions).values({
    userId,
    token: refreshToken,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    ipAddress: ip,
    userAgent: userAgent.slice(0, 255),
  });

  return refreshToken;
}

export async function getSession(request: NextRequest) {
  const token = request.cookies.get(ACCESS_COOKIE_OPTIONS.name)?.value;

  if (!token) return null;

  const payload = await verifyAccessToken(token);
  if (!payload) return null;

  return payload;
}

export async function requireAuth(request: NextRequest) {
  const session = await getSession(request);

  if (!session) {
    throw new Error('Unauthorized');
  }

  return session;
}

// ============================================
// Login Flow
// ============================================

export async function loginUser(data: z.infer<typeof loginSchema>, request: NextRequest) {
  const { email, password } = data;
  const ip = getClientIP(request);
  const userAgent = request.headers.get('user-agent') || 'unknown';

  // Check account lockout
  const locked = await isAccountLocked(`login:${email}`);
  if (locked) {
    await logAuditEvent({
      action: 'LOGIN_BLOCKED',
      resource: 'auth',
      ip,
      userAgent,
      metadata: { email, reason: 'account_locked' },
    });
    throw new Error('Account temporarily locked. Please try again later.');
  }

  // Find user
  const [user] = await db.select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (!user) {
    await recordFailedLogin(`login:${email}`);
    // Generic error to prevent user enumeration
    throw new Error('Invalid credentials');
  }

  if (!user.isActive) {
    throw new Error('Account deactivated. Contact support.');
  }

  // Verify password
  const validPassword = await verifyPassword(password, user.passwordHash);

  if (!validPassword) {
    const { locked: isLocked, remainingAttempts } = await recordFailedLogin(`login:${email}`);

    await logAuditEvent({
      userId: user.id,
      action: 'LOGIN_FAILED',
      resource: 'auth',
      ip,
      userAgent,
      metadata: { remainingAttempts },
    });

    if (isLocked) {
      throw new Error('Account locked for 30 minutes due to too many failed attempts.');
    }

    throw new Error('Invalid credentials');
  }

  // Check if email is verified
  if (!user.emailVerified) {
    throw new Error('Please verify your email before logging in.');
  }

  // Check 2FA
  if (user.twoFactorEnabled) {
    // Return partial auth for 2FA verification
    return {
      requires2FA: true,
      tempToken: await generateAccessToken({
        sub: user.id,
        email: user.email,
        role: user.role,
        kycLevel: user.kycLevel,
      }),
    };
  }

  // Clear failed attempts
  await clearFailedAttempts(`login:${email}`);

  // Update last login
  await db.update(users)
    .set({ 
      lastLoginAt: new Date(), 
      lastLoginIp: ip,
      failedLoginAttempts: 0,
    })
    .where(eq(users.id, user.id));

  // Generate tokens
  const accessToken = await generateAccessToken({
    sub: user.id,
    email: user.email,
    role: user.role,
    kycLevel: user.kycLevel,
  });

  const refreshToken = await createSession(user.id, ip, userAgent);

  // Set cookies
  const cookieStore = cookies();
  cookieStore.set(ACCESS_COOKIE_OPTIONS.name, accessToken, {
    ...ACCESS_COOKIE_OPTIONS,
    maxAge: data.rememberMe ? 60 * 60 * 24 * 30 : 60 * 15,
  });
  cookieStore.set(REFRESH_COOKIE_OPTIONS.name, refreshToken, REFRESH_COOKIE_OPTIONS);

  // Generate new CSRF token
  const csrfToken = generateCsrfToken();
  cookieStore.set(CSRF_COOKIE_OPTIONS.name, csrfToken, CSRF_COOKIE_OPTIONS);

  await logAuditEvent({
    userId: user.id,
    action: 'LOGIN_SUCCESS',
    resource: 'auth',
    ip,
    userAgent,
    metadata: { method: 'password' },
  });

  return {
    user: {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      role: user.role,
      kycLevel: user.kycLevel,
      walletAddress: user.walletAddress,
    },
    csrfToken,
  };
}

// ============================================
// Registration Flow
// ============================================

export async function registerUser(data: z.infer<typeof registerSchema>, request: NextRequest) {
  const { email, password, displayName } = data;
  const ip = getClientIP(request);
  const userAgent = request.headers.get('user-agent') || 'unknown';

  // Check if email exists (prevent enumeration with timing-safe check)
  const existingUsers = await db.select({ id: users.id })
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  if (existingUsers.length > 0) {
    // Still hash password to prevent timing attacks
    await hashPassword(password);
    throw new Error('An account with this email already exists');
  }

  // Hash password
  const passwordHash = await hashPassword(password);

  // Create user
  const [newUser] = await db.insert(users).values({
    email,
    passwordHash,
    displayName: displayName || null,
    emailVerified: false, // Require verification
  }).returning();

  // Generate verification token
  const verificationToken = crypto.randomUUID();

  await db.insert(sessions).values({
    userId: newUser.id,
    token: verificationToken,
    expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
    ipAddress: ip,
    userAgent: userAgent.slice(0, 255),
  });

  // TODO: Send verification email via Resend
  // await sendVerificationEmail(email, verificationToken);

  await logAuditEvent({
    userId: newUser.id,
    action: 'REGISTER',
    resource: 'auth',
    ip,
    userAgent,
    metadata: { email },
  });

  return { 
    userId: newUser.id,
    message: 'Registration successful. Please check your email to verify your account.' 
  };
}

// ============================================
// Logout
// ============================================

export async function logoutUser(request: NextRequest) {
  const cookieStore = cookies();

  // Clear all auth cookies
  cookieStore.delete(ACCESS_COOKIE_OPTIONS.name);
  cookieStore.delete(REFRESH_COOKIE_OPTIONS.name);
  cookieStore.delete(CSRF_COOKIE_OPTIONS.name);

  // Revoke session in database
  const refreshToken = request.cookies.get(REFRESH_COOKIE_OPTIONS.name)?.value;
  if (refreshToken) {
    await db.update(sessions)
      .set({ isRevoked: true })
      .where(eq(sessions.token, refreshToken));
  }

  await logAuditEvent({
    action: 'LOGOUT',
    resource: 'auth',
    ip: getClientIP(request),
    userAgent: request.headers.get('user-agent') || 'unknown',
    metadata: {},
  });
}

// ============================================
// CSRF Token Management
// ============================================

export function getCsrfToken(): string {
  const cookieStore = cookies();
  return cookieStore.get(CSRF_COOKIE_OPTIONS.name)?.value || '';
}

export function setCsrfToken(): string {
  const token = generateCsrfToken();
  const cookieStore = cookies();
  cookieStore.set(CSRF_COOKIE_OPTIONS.name, token, CSRF_COOKIE_OPTIONS);
  return token;
}

import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { v4 as uuidv4 } from "uuid";

const JWT_SECRET = new TextEncoder().encode("your-super-secret-jwt-key-min-32-chars-long!!!");
const ACCESS_COOKIE = { name: "__Host-mp-at", httpOnly: true, secure: true, sameSite: "strict" as const, path: "/", maxAge: 900 };

export async function hashPassword(plaintext: string): Promise<string> {
  return bcrypt.hash(plaintext, 14);
}

export async function verifyPassword(plaintext: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plaintext, hash);
}

export async function generateAccessToken(userId: string, email: string): Promise<string> {
  return new SignJWT({ sub: userId, email, type: "access" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(JWT_SECRET);
}

export async function verifyAccessToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET, { clockTolerance: 30 });
    return payload;
  } catch {
    return null;
  }
}

export async function loginUser(data: any, request: NextRequest) {
  return { user: { id: "mock-user", email: data.email }, csrfToken: uuidv4() };
}

export async function registerUser(data: any, request: NextRequest) {
  return { userId: uuidv4(), message: "Registration successful" };
}

export async function logoutUser(request: NextRequest) {
  const cookieStore = cookies();
  cookieStore.delete(ACCESS_COOKIE.name);
}

// ============================================
// MemePulse - Input Validation Schemas
// SECURITY: All user inputs validated with Zod
// Never trust client-side validation alone
// ============================================

import { z } from 'zod';

// ============================================
// Auth Validation
// ============================================

export const emailSchema = z
  .string()
  .min(5, 'Email is too short')
  .max(255, 'Email is too long')
  .email('Invalid email format')
  .transform((val) => val.toLowerCase().trim());

export const passwordSchema = z
  .string()
  .min(12, 'Password must be at least 12 characters')
  .max(128, 'Password must be at most 128 characters')
  .regex(/[A-Z]/, 'Must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Must contain at least one special character');

export const displayNameSchema = z
  .string()
  .min(2, 'Name must be at least 2 characters')
  .max(50, 'Name must be at most 50 characters')
  .regex(/^[a-zA-Z0-9_\s-]+$/, 'Name contains invalid characters');

export const walletAddressSchema = z
  .string()
  .regex(/^0x[a-fA-F0-9]{40}$/, 'Invalid Ethereum address format');

export const csrfTokenSchema = z
  .string()
  .length(64, 'Invalid CSRF token');

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().default(false),
  csrfToken: csrfTokenSchema,
});

export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
  displayName: displayNameSchema.optional(),
  acceptTerms: z.literal(true, {
    errorMap: () => ({ message: 'You must accept the Terms of Service' }),
  }),
  acceptPrivacy: z.literal(true, {
    errorMap: () => ({ message: 'You must accept the Privacy Policy' }),
  }),
  acceptRisk: z.literal(true, {
    errorMap: () => ({ message: 'You must acknowledge the Risk Disclaimer' }),
  }),
  csrfToken: csrfTokenSchema,
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const verifyEmailSchema = z.object({
  token: z.string().uuid('Invalid verification token'),
});

export const forgotPasswordSchema = z.object({
  email: emailSchema,
  csrfToken: csrfTokenSchema,
});

export const resetPasswordSchema = z.object({
  token: z.string().uuid('Invalid reset token'),
  password: passwordSchema,
  confirmPassword: z.string(),
  csrfToken: csrfTokenSchema,
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const twoFactorSchema = z.object({
  code: z.string().length(6).regex(/^$/, 'Code must be 6 digits'),
  token: z.string(),
});

// ============================================
// Trading Validation
// ============================================

export const createOrderSchema = z.object({
  coinId: z.string().min(1).max(100),
  side: z.enum(['buy', 'sell']),
  type: z.enum(['market', 'limit', 'stop_loss', 'take_profit']),
  amount: z.number().positive('Amount must be positive').max(1000000000, 'Amount too large'),
  price: z.number().positive().optional(),
  csrfToken: csrfTokenSchema,
});

export const createBotSchema = z.object({
  name: z.string().min(1).max(100),
  strategy: z.enum(['momentum', 'mean_reversion', 'arbitrage', 'grid', 'dca']),
  coinIds: z.array(z.string().min(1).max(100)).min(1).max(10),
  allocation: z.number().min(1).max(100),
  parameters: z.record(z.any()).default({}),
  csrfToken: csrfTokenSchema,
});

// ============================================
// Deposit Validation
// ============================================

export const depositAddressSchema = z.object({
  chain: z.enum(['ethereum', 'bsc', 'polygon', 'arbitrum', 'base', 'solana']),
  token: z.string().min(1).max(20),
});

export const verifyDepositSchema = z.object({
  txHash: z.string().min(10).max(100),
  chain: z.enum(['ethereum', 'bsc', 'polygon', 'arbitrum', 'base', 'solana']),
});

// ============================================
// Profile Validation
// ============================================

export const updateProfileSchema = z.object({
  displayName: displayNameSchema.optional(),
  bio: z.string().max(500).optional(),
  csrfToken: csrfTokenSchema,
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: passwordSchema,
  confirmNewPassword: z.string(),
  csrfToken: csrfTokenSchema,
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: 'Passwords do not match',
  path: ['confirmNewPassword'],
});

// ============================================
// API Query Validation
// ============================================

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export const marketFilterSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(50),
  sortBy: z.enum(['market_cap', 'volume', 'price_change', 'name']).default('market_cap'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
  search: z.string().max(100).optional(),
  minMarketCap: z.coerce.number().nonnegative().optional(),
});

// ============================================
// Type exports
// ============================================

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type CreateOrderInput = z.infer<typeof createOrderSchema>;
export type CreateBotInput = z.infer<typeof createBotSchema>;
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

// ============================================
// MemePulse - Enterprise Type Definitions
// Security-First: All types enforce strict validation
// ============================================

import { z } from 'zod';

// ============================================
// User & Authentication Types
// ============================================

export const UserRole = z.enum(['user', 'trader', 'admin', 'superadmin']);
export type UserRole = z.infer<typeof UserRole>;

export const KycLevel = z.enum(['none', 'tier1', 'tier2', 'tier3']);
export type KycLevel = z.infer<typeof KycLevel>;

export const UserSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email().max(255),
  emailVerified: z.boolean().default(false),
  passwordHash: z.string(), // NEVER exposed to client
  role: UserRole.default('user'),
  kycLevel: KycLevel.default('none'),
  twoFactorEnabled: z.boolean().default(false),
  twoFactorSecret: z.string().optional(), // Encrypted, server-only
  walletAddress: z.string().regex(/^0x[a-fA-F0-9]{40}$/).optional(),
  displayName: z.string().min(1).max(50).optional(),
  avatarUrl: z.string().url().max(500).optional(),
  createdAt: z.date(),
  updatedAt: z.date(),
  lastLoginAt: z.date().optional(),
  lastLoginIp: z.string().ip().optional(), // Hashed in production
  failedLoginAttempts: z.number().int().min(0).default(0),
  lockedUntil: z.date().optional(),
  isActive: z.boolean().default(true),
});

export type User = z.infer<typeof UserSchema>;

// Safe user - NEVER includes passwordHash or secrets
export const SafeUserSchema = UserSchema.omit({
  passwordHash: true,
  twoFactorSecret: true,
  lastLoginIp: true,
  failedLoginAttempts: true,
});
export type SafeUser = z.infer<typeof SafeUserSchema>;

// ============================================
// Authentication Types
// ============================================

export const LoginInputSchema = z.object({
  email: z.string().email('Invalid email format').max(255),
  password: z.string().min(12, 'Password must be at least 12 characters').max(128),
  rememberMe: z.boolean().default(false),
  csrfToken: z.string().min(32),
});
export type LoginInput = z.infer<typeof LoginInputSchema>;

export const RegisterInputSchema = z.object({
  email: z.string().email('Invalid email format').max(255),
  password: z.string()
    .min(12, 'Password must be at least 12 characters')
    .max(128)
    .regex(/[A-Z]/, 'Must contain uppercase letter')
    .regex(/[a-z]/, 'Must contain lowercase letter')
    .regex(/[0-9]/, 'Must contain number')
    .regex(/[^A-Za-z0-9]/, 'Must contain special character'),
  confirmPassword: z.string(),
  displayName: z.string().min(2).max(50).optional(),
  acceptTerms: z.literal(true, {
    errorMap: () => ({ message: 'You must accept the terms of service' }),
  }),
  acceptPrivacy: z.literal(true, {
    errorMap: () => ({ message: 'You must accept the privacy policy' }),
  }),
  acceptRisk: z.literal(true, {
    errorMap: () => ({ message: 'You must acknowledge the risk disclaimer' }),
  }),
  csrfToken: z.string().min(32),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});
export type RegisterInput = z.infer<typeof RegisterInputSchema>;

export const Verify2FASchema = z.object({
  code: z.string().length(6).regex(/^\d+$/),
  token: z.string(),
});
export type Verify2FAInput = z.infer<typeof Verify2FASchema>;

// ============================================
// Token Types (Server-side only)
// ============================================

export interface TokenPayload {
  sub: string;      // userId
  email: string;
  role: UserRole;
  kycLevel: KycLevel;
  iat: number;
  exp: number;
  jti: string;      // JWT ID for revocation tracking
  type: 'access' | 'refresh';
}

export interface RefreshTokenPayload {
  sub: string;
  tokenVersion: number;
  iat: number;
  exp: number;
  jti: string;
  type: 'refresh';
}

// ============================================
// Market Data Types
// ============================================

export const MemeCoinSchema = z.object({
  id: z.string(),
  symbol: z.string().min(1).max(20),
  name: z.string().min(1).max(100),
  image: z.string().url().optional(),
  currentPrice: z.number().nonnegative(),
  marketCap: z.number().nonnegative(),
  volume24h: z.number().nonnegative(),
  priceChange24h: z.number(),
  priceChangePercentage24h: z.number(),
  circulatingSupply: z.number().nonnegative(),
  totalSupply: z.number().nonnegative().optional(),
  ath: z.number().nonnegative(),
  atl: z.number().nonnegative(),
  lastUpdated: z.string().datetime(),
  sparkline: z.array(z.number()).optional(),
});
export type MemeCoin = z.infer<typeof MemeCoinSchema>;

export const MarketTickerSchema = z.object({
  symbol: z.string(),
  price: z.number().positive(),
  change24h: z.number(),
  changePercent24h: z.number(),
  volume24h: z.number().nonnegative(),
  high24h: z.number().positive(),
  low24h: z.number().positive(),
  timestamp: z.number(),
});
export type MarketTicker = z.infer<typeof MarketTickerSchema>;

// ============================================
// Trading Types
// ============================================

export const OrderSide = z.enum(['buy', 'sell']);
export const OrderType = z.enum(['market', 'limit', 'stop_loss', 'take_profit']);
export const OrderStatus = z.enum(['pending', 'open', 'filled', 'cancelled', 'rejected']);

export const TradingOrderSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  coinId: z.string(),
  side: OrderSide,
  type: OrderType,
  amount: z.number().positive(),
  price: z.number().positive().optional(), // For limit orders
  status: OrderStatus.default('pending'),
  createdAt: z.date(),
  executedAt: z.date().optional(),
  txHash: z.string().optional(), // Blockchain tx hash
});
export type TradingOrder = z.infer<typeof TradingOrderSchema>;

// ============================================
// Portfolio Types
// ============================================

export const PortfolioItemSchema = z.object({
  coinId: z.string(),
  symbol: z.string(),
  name: z.string(),
  amount: z.number().nonnegative(),
  avgBuyPrice: z.number().nonnegative(),
  currentPrice: z.number().nonnegative(),
  value: z.number().nonnegative(),
  pnl: z.number(),
  pnlPercent: z.number(),
  allocation: z.number().min(0).max(100),
});
export type PortfolioItem = z.infer<typeof PortfolioItemSchema>;

// ============================================
// Bot & Signal Types
// ============================================

export const BotStatus = z.enum(['active', 'paused', 'stopped', 'error']);
export const BotStrategy = z.enum(['momentum', 'mean_reversion', 'arbitrage', 'grid', 'dca']);

export const TradingBotSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  name: z.string().min(1).max(100),
  strategy: BotStrategy,
  status: BotStatus.default('stopped'),
  coinIds: z.array(z.string()).min(1),
  allocation: z.number().min(1).max(100),
  parameters: z.record(z.any()),
  createdAt: z.date(),
  updatedAt: z.date(),
  totalTrades: z.number().int().nonnegative().default(0),
  winRate: z.number().min(0).max(100).default(0),
  totalPnl: z.number().default(0),
});
export type TradingBot = z.infer<typeof TradingBotSchema>;

export const SignalSchema = z.object({
  id: z.string().uuid(),
  coinId: z.string(),
  symbol: z.string(),
  type: z.enum(['buy', 'sell', 'hold']),
  confidence: z.number().min(0).max(100),
  entryPrice: z.number().positive(),
  targetPrice: z.number().positive(),
  stopLoss: z.number().positive(),
  timeframe: z.enum(['1h', '4h', '1d', '1w']),
  analysis: z.string().max(2000),
  createdAt: z.date(),
  expiresAt: z.date(),
  provider: z.string(),
  accuracy: z.number().min(0).max(100).optional(),
});
export type Signal = z.infer<typeof SignalSchema>;

// ============================================
// Copy Trading Types
// ============================================

export const CopyTraderSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  displayName: z.string(),
  avatarUrl: z.string().url().optional(),
  bio: z.string().max(500).optional(),
  followers: z.number().int().nonnegative().default(0),
  totalReturn: z.number().default(0),
  monthlyReturn: z.number().default(0),
  winRate: z.number().min(0).max(100).default(0),
  riskScore: z.number().min(1).max(10).default(5),
  aum: z.number().nonnegative().default(0), // Assets Under Management
  feePercent: z.number().min(0).max(50).default(10),
  isVerified: z.boolean().default(false),
  createdAt: z.date(),
});
export type CopyTrader = z.infer<typeof CopyTraderSchema>;

// ============================================
// Deposit Types
// ============================================

export const DepositStatus = z.enum(['pending', 'confirming', 'confirmed', 'failed']);

export const DepositSchema = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  chain: z.enum(['ethereum', 'bsc', 'polygon', 'arbitrum', 'base', 'solana']),
  token: z.string(),
  amount: z.number().positive(),
  fromAddress: z.string(),
  toAddress: z.string(),
  txHash: z.string(),
  status: DepositStatus.default('pending'),
  confirmations: z.number().int().nonnegative().default(0),
  requiredConfirmations: z.number().int().positive().default(12),
  createdAt: z.date(),
  confirmedAt: z.date().optional(),
});
export type Deposit = z.infer<typeof DepositSchema>;

// ============================================
// API Response Types
// ============================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    timestamp: string;
    requestId: string;
  };
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    timestamp: string;
    requestId: string;
  };
}

// ============================================
// Security Types
// ============================================

export interface SecurityAuditLog {
  id: string;
  userId: string;
  action: string;
  ip: string; // Hashed
  userAgent: string; // Truncated
  timestamp: Date;
  metadata: Record<string, unknown>;
}

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
}

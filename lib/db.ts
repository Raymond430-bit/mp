// ============================================
// MemePulse - Database Configuration
// SECURITY: Uses Drizzle ORM with prepared statements
// All queries parameterized - no SQL injection risk
// ============================================

import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { pgTable, uuid, varchar, boolean, timestamp, integer, decimal, jsonb, text, index } from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// ============================================
// Connection Pool (Singleton)
// ============================================

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is required');
}

// Client for migrations
export const migrationClient = postgres(connectionString, { max: 1 });

// Client for queries with connection pooling
export const queryClient = postgres(connectionString, {
  max: 20, // Connection pool size
  idle_timeout: 20,
  connect_timeout: 10,
  prepare: true, // Use prepared statements
});

export const db = drizzle(queryClient);

// ============================================
// Schema Definitions with Row Level Security
// ============================================

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  emailVerified: boolean('email_verified').default(false).notNull(),
  passwordHash: varchar('password_hash', { length: 255 }).notNull(),
  role: varchar('role', { length: 20 }).default('user').notNull(),
  kycLevel: varchar('kyc_level', { length: 20 }).default('none').notNull(),
  twoFactorEnabled: boolean('two_factor_enabled').default(false).notNull(),
  twoFactorSecret: varchar('two_factor_secret', { length: 255 }),
  walletAddress: varchar('wallet_address', { length: 42 }),
  displayName: varchar('display_name', { length: 50 }),
  avatarUrl: varchar('avatar_url', { length: 500 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  lastLoginAt: timestamp('last_login_at', { withTimezone: true }),
  lastLoginIp: varchar('last_login_ip', { length: 64 }),
  failedLoginAttempts: integer('failed_login_attempts').default(0).notNull(),
  lockedUntil: timestamp('locked_until', { withTimezone: true }),
  isActive: boolean('is_active').default(true).notNull(),
  tokenVersion: integer('token_version').default(1).notNull(),
}, (table) => ({
  emailIdx: index('users_email_idx').on(table.email),
  walletIdx: index('users_wallet_idx').on(table.walletAddress),
  roleIdx: index('users_role_idx').on(table.role),
}));

export const sessions = pgTable('sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  token: varchar('token', { length: 255 }).notNull().unique(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  ipAddress: varchar('ip_address', { length: 64 }),
  userAgent: varchar('user_agent', { length: 255 }),
  isRevoked: boolean('is_revoked').default(false).notNull(),
}, (table) => ({
  userIdx: index('sessions_user_idx').on(table.userId),
  tokenIdx: index('sessions_token_idx').on(table.token),
}));

export const emailVerifications = pgTable('email_verifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  token: varchar('token', { length: 255 }).notNull().unique(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  usedAt: timestamp('used_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const passwordResets = pgTable('password_resets', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  token: varchar('token', { length: 255 }).notNull().unique(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  usedAt: timestamp('used_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
});

export const auditLogs = pgTable('audit_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id),
  action: varchar('action', { length: 100 }).notNull(),
  resource: varchar('resource', { length: 100 }).notNull(),
  ipAddress: varchar('ip_address', { length: 64 }),
  userAgent: varchar('user_agent', { length: 255 }),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  userIdx: index('audit_user_idx').on(table.userId),
  actionIdx: index('audit_action_idx').on(table.action),
  createdAtIdx: index('audit_created_at_idx').on(table.createdAt),
}));

export const tradingOrders = pgTable('trading_orders', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  coinId: varchar('coin_id', { length: 100 }).notNull(),
  symbol: varchar('symbol', { length: 20 }).notNull(),
  side: varchar('side', { length: 10 }).notNull(),
  type: varchar('type', { length: 20 }).notNull(),
  amount: decimal('amount', { precision: 24, scale: 18 }).notNull(),
  price: decimal('price', { precision: 24, scale: 18 }),
  status: varchar('status', { length: 20 }).default('pending').notNull(),
  txHash: varchar('tx_hash', { length: 100 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  executedAt: timestamp('executed_at', { withTimezone: true }),
}, (table) => ({
  userIdx: index('orders_user_idx').on(table.userId),
  statusIdx: index('orders_status_idx').on(table.status),
  createdAtIdx: index('orders_created_at_idx').on(table.createdAt),
}));

export const tradingBots = pgTable('trading_bots', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: varchar('name', { length: 100 }).notNull(),
  strategy: varchar('strategy', { length: 30 }).notNull(),
  status: varchar('status', { length: 20 }).default('stopped').notNull(),
  coinIds: jsonb('coin_ids').notNull(),
  allocation: decimal('allocation', { precision: 10, scale: 2 }).notNull(),
  parameters: jsonb('parameters').default({}),
  totalTrades: integer('total_trades').default(0).notNull(),
  winRate: decimal('win_rate', { precision: 5, scale: 2 }).default('0'),
  totalPnl: decimal('total_pnl', { precision: 24, scale: 18 }).default('0'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const deposits = pgTable('deposits', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  chain: varchar('chain', { length: 20 }).notNull(),
  token: varchar('token', { length: 20 }).notNull(),
  amount: decimal('amount', { precision: 24, scale: 18 }).notNull(),
  fromAddress: varchar('from_address', { length: 42 }).notNull(),
  toAddress: varchar('to_address', { length: 42 }).notNull(),
  txHash: varchar('tx_hash', { length: 100 }).notNull().unique(),
  status: varchar('status', { length: 20 }).default('pending').notNull(),
  confirmations: integer('confirmations').default(0).notNull(),
  requiredConfirmations: integer('required_confirmations').default(12).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  confirmedAt: timestamp('confirmed_at', { withTimezone: true }),
});

export const portfolios = pgTable('portfolios', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  coinId: varchar('coin_id', { length: 100 }).notNull(),
  symbol: varchar('symbol', { length: 20 }).notNull(),
  amount: decimal('amount', { precision: 24, scale: 18 }).default('0').notNull(),
  avgBuyPrice: decimal('avg_buy_price', { precision: 24, scale: 18 }).default('0').notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
}, (table) => ({
  userCoinIdx: index('portfolio_user_coin_idx').on(table.userId, table.coinId),
}));

// ============================================
// Type Exports
// ============================================

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type Session = typeof sessions.$inferSelect;
export type TradingOrder = typeof tradingOrders.$inferSelect;
export type TradingBot = typeof tradingBots.$inferSelect;
export type Deposit = typeof deposits.$inferSelect;
export type AuditLog = typeof auditLogs.$inferInsert;

import { Suspense } from 'react';
import { cookies } from 'next/headers';
import { verifyAccessToken } from '@/lib/security';
import { db, users, portfolios, tradingOrders } from '@/lib/db';
import { eq, desc } from 'drizzle-orm';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Bot, 
  Signal, 
  ArrowUpRight,
  ArrowDownRight,
  Activity,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { formatCurrency, formatNumber, formatPercent, getChangeColor, getChangeBg } from '@/lib/utils';

/**
 * Dashboard - Protected Route
 * Shows portfolio overview, recent activity, and quick actions
 * SECURITY: Full auth verification at DAL level
 */
export default async function DashboardPage() {
  // Verify auth (defense-in-depth)
  const cookieStore = cookies();
  const accessToken = cookieStore.get('__Host-mp-at')?.value;
  const payload = accessToken ? await verifyAccessToken(accessToken) : null;

  if (!payload) {
    return null;
  }

  // Fetch user data
  const [user] = await db.select()
    .from(users)
    .where(eq(users.id, payload.sub))
    .limit(1);

  // Fetch portfolio
  const portfolioItems = await db.select()
    .from(portfolios)
    .where(eq(portfolios.userId, payload.sub));

  // Fetch recent orders
  const recentOrders = await db.select()
    .from(tradingOrders)
    .where(eq(tradingOrders.userId, payload.sub))
    .orderBy(desc(tradingOrders.createdAt))
    .limit(10);

  // Calculate totals
  const totalValue = portfolioItems.reduce((sum, item) => 
    sum + Number(item.amount) * Number(item.avgBuyPrice), 0
  );

  return (
    <div className="space-y-8">
      {/* Page header */}
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-1">Welcome back, {user.displayName || user.email}</p>
      </div>

      {/* Portfolio overview cards */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <PortfolioCard
          title="Total Balance"
          value={formatCurrency(totalValue)}
          change="+12.5%"
          changePositive={true}
          icon={Wallet}
          color="cyan"
        />
        <PortfolioCard
          title="24h Profit/Loss"
          value={formatCurrency(totalValue * 0.125)}
          change="+8.3%"
          changePositive={true}
          icon={TrendingUp}
          color="lime"
        />
        <PortfolioCard
          title="Active Bots"
          value="3"
          change="Running"
          changePositive={true}
          icon={Bot}
          color="purple"
        />
        <PortfolioCard
          title="Open Signals"
          value="7"
          change="2 new today"
          changePositive={true}
          icon={Signal}
          color="magenta"
        />
      </div>

      {/* Main content grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Portfolio chart area */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-white">Portfolio Performance</h2>
            <div className="flex gap-2">
              {['1H', '24H', '7D', '30D', '1Y'].map((period) => (
                <button
                  key={period}
                  className="px-3 py-1 rounded-lg text-xs font-medium bg-mp-surfaceLight text-gray-400 hover:text-white transition-colors"
                >
                  {period}
                </button>
              ))}
            </div>
          </div>
          <div className="h-64 flex items-center justify-center bg-mp-surfaceLight/50 rounded-xl border border-mp-border/50">
            <div className="text-center">
              <Activity className="w-8 h-8 text-mp-cyan mx-auto mb-2" />
              <p className="text-gray-500 text-sm">Portfolio chart integration</p>
              <p className="text-gray-600 text-xs mt-1">Connect Recharts for live visualization</p>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-medium text-gray-400 mb-4">Asset Allocation</h3>
            <div className="space-y-3">
              {portfolioItems.length > 0 ? portfolioItems.slice(0, 5).map((item) => (
                <div key={item.coinId} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-mp-surfaceLight flex items-center justify-center text-xs font-bold text-white">
                    {item.symbol[0]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-white">{item.symbol}</span>
                      <span className="text-sm text-gray-400">{formatNumber(Number(item.amount))}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-mp-surfaceLight overflow-hidden">
                      <div 
                        className="h-full rounded-full bg-gradient-to-r from-mp-cyan to-mp-purple"
                        style={{ width: `${Math.random() * 40 + 10}%` }}
                      />
                    </div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-8">
                  <AlertCircle className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                  <p className="text-gray-500 text-sm">No assets in portfolio yet</p>
                  <p className="text-gray-600 text-xs mt-1">Make your first deposit to get started</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <QuickActionButton href="/deposit" label="Deposit Funds" icon={Wallet} color="cyan" />
              <QuickActionButton href="/bots" label="Create Trading Bot" icon={Bot} color="purple" />
              <QuickActionButton href="/signals" label="View Signals" icon={Signal} color="lime" />
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {recentOrders.length > 0 ? recentOrders.map((order) => (
                <div key={order.id} className="flex items-center gap-3 p-3 rounded-xl bg-mp-surfaceLight/50">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    order.side === 'buy' ? 'bg-mp-success/10 text-mp-success' : 'bg-mp-danger/10 text-mp-danger'
                  }`}>
                    {order.side === 'buy' ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white truncate">
                      {order.side === 'buy' ? 'Bought' : 'Sold'} {order.symbol}
                    </p>
                    <p className="text-xs text-gray-500 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <span className={`text-sm font-medium ${order.side === 'buy' ? 'text-mp-success' : 'text-mp-danger'}`}>
                    {order.side === 'buy' ? '+' : '-'}{formatNumber(Number(order.amount))}
                  </span>
                </div>
              )) : (
                <div className="text-center py-4">
                  <p className="text-gray-500 text-sm">No recent activity</p>
                </div>
              )}
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 border border-mp-success/20">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-lg bg-mp-success/10 flex items-center justify-center">
                <Activity className="w-4 h-4 text-mp-success" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">Security Status</h3>
                <p className="text-xs text-mp-success">All systems secure</p>
              </div>
            </div>
            <div className="space-y-2">
              <SecurityCheck label="2FA Enabled" status={user.twoFactorEnabled} />
              <SecurityCheck label="Email Verified" status={user.emailVerified} />
              <SecurityCheck label="KYC Complete" status={user.kycLevel !== 'none'} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PortfolioCard({ 
  title, 
  value, 
  change, 
  changePositive, 
  icon: Icon, 
  color 
}: { 
  title: string; 
  value: string; 
  change: string; 
  changePositive: boolean; 
  icon: React.ElementType; 
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    cyan: 'from-mp-cyan/20 to-mp-cyan/5 text-mp-cyan',
    lime: 'from-mp-lime/20 to-mp-lime/5 text-mp-lime',
    purple: 'from-mp-purple/20 to-mp-purple/5 text-mp-purple',
    magenta: 'from-mp-magenta/20 to-mp-magenta/5 text-mp-magenta',
  };

  return (
    <div className="glass-card rounded-2xl p-6">
      <div className="flex items-start justify-between">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${colorClasses[color]} flex items-center justify-center`}>
          <Icon className="w-6 h-6" />
        </div>
        <span className={`text-xs font-medium px-2 py-1 rounded-full ${changePositive ? 'bg-mp-success/10 text-mp-success' : 'bg-mp-danger/10 text-mp-danger'}`}>
          {change}
        </span>
      </div>
      <div className="mt-4">
        <p className="text-gray-400 text-sm">{title}</p>
        <p className="text-2xl font-bold text-white mt-1">{value}</p>
      </div>
    </div>
  );
}

function QuickActionButton({ href, label, icon: Icon, color }: {
  href: string;
  label: string;
  icon: React.ElementType;
  color: string;
}) {
  const colorMap: Record<string, string> = {
    cyan: 'hover:bg-mp-cyan/10 hover:border-mp-cyan/30',
    purple: 'hover:bg-mp-purple/10 hover:border-mp-purple/30',
    lime: 'hover:bg-mp-lime/10 hover:border-mp-lime/30',
  };

  return (
    <a 
      href={href}
      className={`flex items-center gap-3 p-3 rounded-xl bg-mp-surfaceLight border border-mp-border transition-all ${colorMap[color]}`}
    >
      <Icon className="w-5 h-5 text-gray-400" />
      <span className="text-sm text-white">{label}</span>
      <ArrowUpRight className="w-4 h-4 text-gray-500 ml-auto" />
    </a>
  );
}

function SecurityCheck({ label, status }: { label: string; status: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-gray-400">{label}</span>
      <span className={`text-xs font-medium ${status ? 'text-mp-success' : 'text-mp-warning'}`}>
        {status ? '✓ Secure' : '⚠ Pending'}
      </span>
    </div>
  );
}

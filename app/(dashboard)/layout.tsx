import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { verifyAccessToken } from '@/lib/security';
import { db, users } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { DashboardSidebar } from '@/components/layout/DashboardSidebar';
import { DashboardHeader } from '@/components/layout/DashboardHeader';

/**
 * Dashboard Layout - PROTECTED ROUTE
 * SECURITY: Verifies auth at Data Access Layer (defense-in-depth)
 * Middleware provides fast rejection, this provides security guarantee
 */
export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = cookies();
  const accessToken = cookieStore.get('__Host-mp-at')?.value;

  if (!accessToken) {
    redirect('/login?error=session_expired');
  }

  const payload = await verifyAccessToken(accessToken);
  if (!payload) {
    redirect('/login?error=invalid_token');
  }

  const [user] = await db.select({
    id: users.id,
    email: users.email,
    displayName: users.displayName,
    role: users.role,
    kycLevel: users.kycLevel,
    walletAddress: users.walletAddress,
    twoFactorEnabled: users.twoFactorEnabled,
    emailVerified: users.emailVerified,
    isActive: users.isActive,
  })
    .from(users)
    .where(eq(users.id, payload.sub))
    .limit(1);

  if (!user || !user.isActive) {
    redirect('/login?error=account_inactive');
  }

  return (
    <div className="min-h-screen bg-mp-bg">
      <DashboardSidebar user={user} />
      <div className="lg:ml-72">
        <DashboardHeader user={user} />
        <main className="p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

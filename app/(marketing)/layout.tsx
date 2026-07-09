import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { LiveTicker } from '@/components/layout/LiveTicker';

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen">
      <div className="fixed inset-0 bg-mesh pointer-events-none" />
      <div className="fixed inset-0 bg-gradient-to-b from-mp-bg via-transparent to-mp-bg pointer-events-none" />

      <LiveTicker />
      <Navbar />

      <main className="relative z-10">
        {children}
      </main>

      <Footer />
    </div>
  );
}

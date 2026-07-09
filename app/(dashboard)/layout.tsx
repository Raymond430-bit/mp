export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-mp-bg">
      <div className="p-6 lg:p-8">
        {children}
      </div>
    </div>
  );
}

export default async function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>
        <p className="text-gray-400 mt-1">Welcome to MemePulse</p>
      </div>
      
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Total Balance", value: "$12,450.00", change: "+12.5%", color: "cyan" },
          { title: "24h Profit/Loss", value: "$1,556.25", change: "+8.3%", color: "lime" },
          { title: "Active Bots", value: "3", change: "Running", color: "purple" },
          { title: "Open Signals", value: "7", change: "2 new today", color: "magenta" },
        ].map((card) => (
          <div key={card.title} className="glass-card rounded-2xl p-6">
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-xl bg-mp-surfaceLight flex items-center justify-center text-mp-cyan font-bold">
                {card.title[0]}
              </div>
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-mp-success/10 text-mp-success">{card.change}</span>
            </div>
            <div className="mt-4">
              <p className="text-gray-400 text-sm">{card.title}</p>
              <p className="text-2xl font-bold text-white mt-1">{card.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

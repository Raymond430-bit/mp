"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Bot, Signal, Copy, Shield, BarChart3, Globe } from "lucide-react";

const features = [
  { icon: Bot, title: "AI Trading Bots", description: "Deploy sophisticated trading algorithms that monitor markets 24/7. Momentum, mean reversion, grid, and DCA strategies.", color: "from-mp-cyan to-mp-purple" },
  { icon: Signal, title: "Real-Time Signals", description: "Get institutional-grade trading signals with confidence scores, entry/exit points, and risk management.", color: "from-mp-purple to-mp-magenta" },
  { icon: Copy, title: "Copy Trading", description: "Follow and copy top-performing traders automatically. Transparent performance metrics and risk scores.", color: "from-mp-magenta to-mp-lime" },
  { icon: Shield, title: "Bank-Grade Security", description: "Multi-signature wallets, hardware security modules, real-time threat detection, and comprehensive insurance.", color: "from-mp-lime to-mp-cyan" },
  { icon: BarChart3, title: "Advanced Analytics", description: "Deep portfolio analytics with P&L tracking, correlation analysis, Sharpe ratio, and custom reporting.", color: "from-mp-cyan to-mp-lime" },
  { icon: Globe, title: "Multi-Chain Support", description: "Trade across Ethereum, BSC, Polygon, Arbitrum, Base, and Solana. Bridge assets seamlessly.", color: "from-mp-purple to-mp-cyan" },
];

export function FeaturesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}
          className="text-center mb-20">
          <span className="text-mp-cyan font-mono text-sm tracking-wider uppercase">Features</span>
          <h2 className="mt-4 text-4xl sm:text-5xl font-bold text-white">Everything You Need to <span className="gradient-text">Win</span></h2>
          <p className="mt-4 text-gray-400 max-w-2xl mx-auto">Professional-grade tools designed for meme coin traders. From automated strategies to social trading.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div key={feature.title} initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card-hover p-8 rounded-2xl group relative overflow-hidden">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6`}>
                  <Icon className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-mp-cyan transition-colors">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed text-sm">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

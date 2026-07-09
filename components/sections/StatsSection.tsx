"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { TrendingUp, Users, Bot, Shield } from "lucide-react";

const stats = [
  { icon: TrendingUp, label: "Total Volume", value: 2400000000, prefix: "$", suffix: "" },
  { icon: Users, label: "Active Traders", value: 89200, prefix: "", suffix: "" },
  { icon: Bot, label: "Active Bots", value: 12400, prefix: "", suffix: "" },
  { icon: Shield, label: "Security Score", value: 99.9, prefix: "", suffix: "%" },
];

function AnimatedCounter({ value, prefix, suffix }: { value: number; prefix: string; suffix: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const end = value;
    const duration = 2000;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else { setCount(start); }
    }, 16);
    return () => clearInterval(timer);
  }, [isInView, value]);

  const format = (num: number) => {
    if (num >= 1e9) return (num / 1e9).toFixed(1) + "B";
    if (num >= 1e6) return (num / 1e6).toFixed(1) + "M";
    if (num >= 1e3) return (num / 1e3).toFixed(1) + "K";
    return num.toFixed(1);
  };

  return <span ref={ref}>{prefix}{format(count)}{suffix}</span>;
}

export function StatsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-20 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}
          className="glass-card rounded-3xl p-8 lg:p-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-center">
                  <div className="w-12 h-12 rounded-xl bg-mp-surfaceLight flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-mp-cyan" />
                  </div>
                  <div className="text-3xl lg:text-4xl font-bold text-white">
                    <AnimatedCounter value={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                  </div>
                  <div className="text-sm text-gray-400 mt-2">{stat.label}</div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

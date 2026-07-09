"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Star, Quote } from "lucide-react";

const testimonials = [
  { name: "Alex K.", role: "Pro Trader", content: "MemePulse's bots generated 47% ROI in my first month. The security gives me peace of mind.", rating: 5 },
  { name: "Sarah M.", role: "Crypto Investor", content: "Finally a platform that takes security seriously. SOC 2 certified and audited smart contracts.", rating: 5 },
  { name: "James R.", role: "DeFi Developer", content: "The copy trading feature is transparent and the risk scores are accurate. Best in class.", rating: 5 },
];

export function TestimonialsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  return (
    <section ref={ref} className="py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} className="text-center mb-20">
          <span className="text-mp-cyan font-mono text-sm tracking-wider uppercase">Testimonials</span>
          <h2 className="mt-4 text-4xl sm:text-5xl font-bold text-white">Trusted by <span className="gradient-text">Thousands</span></h2>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div key={t.name} initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ delay: i * 0.1 }}
              className="glass-card p-8 rounded-2xl">
              <Quote className="w-8 h-8 text-mp-cyan/30 mb-4" />
              <p className="text-gray-300 leading-relaxed mb-6">{t.content}</p>
              <div className="flex items-center gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} className="w-4 h-4 text-mp-warning fill-mp-warning" />
                ))}
              </div>
              <div>
                <div className="font-medium text-white">{t.name}</div>
                <div className="text-sm text-gray-500">{t.role}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

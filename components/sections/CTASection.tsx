"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Shield } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-mp-bg via-mp-purple/5 to-mp-bg" />
      <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
            Ready to <span className="gradient-text">Trade Smarter</span>?
          </h2>
          <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto">
            Join 89,000+ traders who trust MemePulse with their meme coin investments. Start in under 60 seconds.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/register" className="btn-primary text-lg px-8 py-4 flex items-center gap-3">
              Create Free Account <ArrowRight className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-2 text-mp-success text-sm">
              <Shield className="w-4 h-4" />
              <span>No credit card required</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

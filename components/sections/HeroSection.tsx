"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Shield, Zap, TrendingUp, Lock, ChevronDown } from "lucide-react";

export function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const particles: any[] = [];
    const colors = ["#00f0ff", "#a855f7", "#ec4899", "#84cc16"];

    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.5 + 0.2,
      });
    }

    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, i) => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        particles.slice(i + 1).forEach((p2: any) => {
          const dx = p.x - p2.x, dy = p.y - p2.y, dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 150) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = p.color;
            ctx.globalAlpha = (1 - dist / 150) * 0.1;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });
      ctx.globalAlpha = 1;
      animationId = requestAnimationFrame(animate);
    };
    animate();
    return () => { window.removeEventListener("resize", resize); cancelAnimationFrame(animationId); };
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24">
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-mp-purple/20 rounded-full blur-[128px] animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-mp-cyan/20 rounded-full blur-[128px] animate-pulse delay-1000" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-mp-success/10 border border-mp-success/20 text-mp-success text-sm font-medium mb-8">
          <Shield className="w-4 h-4" /> SOC 2 Type II Certified
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black leading-tight tracking-tight">
          <span className="block text-white">Trade Meme Coins</span>
          <span className="block gradient-text mt-2">Like a Pro</span>
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
          The most secure and advanced meme coin trading platform. Real-time signals, AI-powered bots, copy trading, and institutional-grade security.
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/register" className="btn-primary text-lg px-8 py-4 flex items-center gap-3 group">
            <Zap className="w-5 h-5 group-hover:animate-pulse" />
            Start Trading Now
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link href="/market" className="btn-secondary text-lg px-8 py-4 flex items-center gap-3">
            <TrendingUp className="w-5 h-5" /> Explore Markets
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-500">
          <div className="flex items-center gap-2"><Lock className="w-4 h-4 text-mp-cyan" /><span>256-bit Encryption</span></div>
          <div className="flex items-center gap-2"><Shield className="w-4 h-4 text-mp-purple" /><span>Multi-Sig Wallets</span></div>
          <div className="flex items-center gap-2"><Zap className="w-4 h-4 text-mp-lime" /><span>&lt;100ms Latency</span></div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-20 glass-card rounded-3xl p-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[{ label: "24h Volume", value: "$2.4B", change: "+12.5%" },
              { label: "Active Traders", value: "89.2K", change: "+8.3%" },
              { label: "Trading Bots", value: "12.4K", change: "+23.1%" },
              { label: "Avg. ROI", value: "34.7%", change: "+5.2%" }].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-2xl sm:text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-sm text-gray-400 mt-1">{stat.label}</div>
                <div className="text-sm text-mp-success mt-1">{stat.change}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }} className="mt-16">
          <ChevronDown className="w-6 h-6 text-gray-500 mx-auto" />
        </motion.div>
      </div>
    </section>
  );
}

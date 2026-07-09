"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, TrendingUp, TrendingDown } from "lucide-react";
import { formatNumber, formatPercent, getChangeColor } from "@/lib/utils";

const mockCoins = [
  { symbol: "DOGE", name: "Dogecoin", price: 0.1245, change24h: 5.23, volume: 1250000000, marketCap: 18000000000 },
  { symbol: "SHIB", name: "Shiba Inu", price: 0.00001823, change24h: -2.14, volume: 890000000, marketCap: 10700000000 },
  { symbol: "PEPE", name: "Pepe", price: 0.00000789, change24h: 12.45, volume: 456000000, marketCap: 3300000000 },
  { symbol: "FLOKI", name: "Floki", price: 0.0001523, change24h: 8.91, volume: 234000000, marketCap: 1450000000 },
  { symbol: "BONK", name: "Bonk", price: 0.00002345, change24h: -5.67, volume: 198000000, marketCap: 1420000000 },
  { symbol: "WIF", name: "dogwifhat", price: 2.34, change24h: 15.23, volume: 345000000, marketCap: 2340000000 },
];

export function MarketPreview() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  return (
    <section ref={ref} className="py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}
          className="flex items-end justify-between mb-12">
          <div>
            <span className="text-mp-cyan font-mono text-sm tracking-wider uppercase">Live Markets</span>
            <h2 className="mt-4 text-4xl sm:text-5xl font-bold text-white">Top Meme Coins</h2>
            <p className="mt-2 text-gray-400">Real-time prices and market data</p>
          </div>
          <Link href="/market" className="hidden sm:flex items-center gap-2 text-mp-cyan hover:text-mp-purple transition-colors font-medium">
            View All Markets <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.2 }}
          className="glass-card rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-mp-border">
                  <th className="text-left px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Coin</th>
                  <th className="text-right px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="text-right px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">24h Change</th>
                  <th className="text-right px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Volume</th>
                  <th className="text-right px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Market Cap</th>
                  <th className="text-right px-6 py-4 text-xs font-medium text-gray-500 uppercase tracking-wider">Chart</th>
                </tr>
              </thead>
              <tbody>
                {mockCoins.map((coin) => (
                  <tr key={coin.symbol}
                    className="border-b border-mp-border/50 transition-colors hover:bg-mp-surfaceLight/50"
                    onMouseEnter={() => setHoveredRow(coin.symbol)}
                    onMouseLeave={() => setHoveredRow(null)}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-mp-surfaceLight flex items-center justify-center text-white font-bold text-sm">
                          {coin.symbol[0]}
                        </div>
                        <div>
                          <div className="font-medium text-white">{coin.name}</div>
                          <div className="text-sm text-gray-500">{coin.symbol}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className="font-mono text-white">${coin.price < 0.001 ? coin.price.toExponential(4) : coin.price.toFixed(coin.price < 1 ? 6 : 4)}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`inline-flex items-center gap-1 font-medium ${getChangeColor(coin.change24h)}`}>
                        {coin.change24h >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                        {formatPercent(coin.change24h)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right text-gray-400">${formatNumber(coin.volume)}</td>
                    <td className="px-6 py-4 text-right text-gray-400">${formatNumber(coin.marketCap)}</td>
                    <td className="px-6 py-4">
                      <div className="flex justify-end">
                        <div className="w-24 h-8 flex items-end gap-0.5">
                          {Array.from({ length: 12 }, (_, i) => (
                            <div key={i} className={`w-1.5 rounded-sm ${coin.change24h >= 0 ? 'bg-mp-success' : 'bg-mp-danger'}`}
                              style={{ height: `${20 + Math.random() * 60}%`, opacity: 0.3 + Math.random() * 0.7 }} />
                          ))}
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        <div className="mt-6 text-center sm:hidden">
          <Link href="/market" className="inline-flex items-center gap-2 text-mp-cyan hover:text-mp-purple transition-colors font-medium">
            View All Markets <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

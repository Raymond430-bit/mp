'use client';

import { useEffect, useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn, formatNumber, formatPercent } from '@/lib/utils';

interface TickerItem {
  symbol: string;
  price: number;
  change24h: number;
  volume24h: number;
}

const MOCK_TICKER: TickerItem[] = [
  { symbol: 'DOGE', price: 0.1245, change24h: 5.23, volume24h: 1250000000 },
  { symbol: 'SHIB', price: 0.00001823, change24h: -2.14, volume24h: 890000000 },
  { symbol: 'PEPE', price: 0.00000789, change24h: 12.45, volume24h: 456000000 },
  { symbol: 'FLOKI', price: 0.0001523, change24h: 8.91, volume24h: 234000000 },
  { symbol: 'BONK', price: 0.00002345, change24h: -5.67, volume24h: 198000000 },
  { symbol: 'WIF', price: 2.34, change24h: 15.23, volume24h: 345000000 },
  { symbol: 'BOME', price: 0.00891, change24h: 3.45, volume24h: 123000000 },
  { symbol: 'POPCAT', price: 0.567, change24h: -1.23, volume24h: 89000000 },
];

export function LiveTicker() {
  const [tickerData, setTickerData] = useState<TickerItem[]>(MOCK_TICKER);

  useEffect(() => {
    const interval = setInterval(() => {
      setTickerData(prev => prev.map(item => ({
        ...item,
        price: item.price * (1 + (Math.random() - 0.5) * 0.002),
        change24h: item.change24h + (Math.random() - 0.5) * 0.5,
      })));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const renderTickerItem = (item: TickerItem, index: number) => (
    <div key={`${item.symbol}-${index}`} className="flex items-center gap-4 px-6 border-r border-mp-border/30 shrink-0">
      <div className="flex items-center gap-2">
        <span className="font-mono font-bold text-sm text-white">{item.symbol}</span>
        <span className="text-xs text-gray-500">/USDT</span>
      </div>
      <span className="font-mono text-sm tabular-nums">
        ${item.price < 0.001 ? item.price.toExponential(4) : item.price.toFixed(item.price < 1 ? 6 : 4)}
      </span>
      <span className={cn(
        'flex items-center gap-1 text-xs font-medium',
        item.change24h >= 0 ? 'text-mp-success' : 'text-mp-danger'
      )}>
        {item.change24h >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
        {formatPercent(item.change24h)}
      </span>
      <span className="text-xs text-gray-500">
        Vol: ${formatNumber(item.volume24h)}
      </span>
    </div>
  );

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-mp-surface/90 backdrop-blur-md border-b border-mp-border/50">
      <div className="flex overflow-hidden py-2">
        <div className="flex animate-[scroll_30s_linear_infinite]">
          {[...tickerData, ...tickerData].map((item, i) => renderTickerItem(item, i))}
        </div>
      </div>
    </div>
  );
}

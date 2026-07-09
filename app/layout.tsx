import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'MemePulse | Professional Meme Coin Trading Platform',
    template: '%s | MemePulse',
  },
  description: 'The most secure and advanced meme coin trading platform. Real-time signals, automated bots, copy trading, and institutional-grade security.',
  keywords: ['meme coin', 'crypto trading', 'DeFi', 'blockchain', 'trading bots', 'copy trading'],
  authors: [{ name: 'MemePulse' }],
  creator: 'MemePulse',
  publisher: 'MemePulse',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: 'MemePulse',
    title: 'MemePulse | Professional Meme Coin Trading Platform',
    description: 'Trade meme coins with institutional-grade security and advanced automation tools.',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@memepulse',
    creator: '@memepulse',
  },
};

export const viewport: Viewport = {
  themeColor: '#0a0a0f',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://api.coingecko.com" />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans bg-mp-bg text-white min-h-screen`}>
        {children}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}

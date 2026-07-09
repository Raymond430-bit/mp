'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  Wallet,
  Bot,
  Signal,
  Copy,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  Shield,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/portfolio', label: 'Portfolio', icon: Wallet },
  { href: '/bots', label: 'Trading Bots', icon: Bot },
  { href: '/signals', label: 'Signals', icon: Signal },
  { href: '/copy-trading', label: 'Copy Trading', icon: Copy },
  { href: '/settings', label: 'Settings', icon: Settings },
];

interface DashboardSidebarProps {
  user: {
    id: string;
    email: string;
    displayName: string | null;
    role: string;
    kycLevel: string;
    walletAddress: string | null;
  };
}

export function DashboardSidebar({ user }: DashboardSidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside className={cn(
      'fixed left-0 top-0 bottom-0 z-40 bg-mp-surface border-r border-mp-border transition-all duration-300 hidden lg:block',
      collapsed ? 'w-20' : 'w-72'
    )}>
      <div className="h-16 flex items-center px-4 border-b border-mp-border">
        <Link href="/dashboard" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-mp-cyan to-mp-purple flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5 text-mp-bg" />
          </div>
          {!collapsed && (
            <span className="text-xl font-bold gradient-text">MemePulse</span>
          )}
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="ml-auto p-2 rounded-lg hover:bg-mp-surfaceLight transition-colors"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      <nav className="p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200',
                isActive
                  ? 'bg-gradient-to-r from-mp-cyan/10 to-mp-purple/10 text-mp-cyan border border-mp-cyan/20'
                  : 'text-gray-400 hover:text-white hover:bg-mp-surfaceLight'
              )}
            >
              <Icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span className="font-medium">{item.label}</span>}
              {isActive && !collapsed && (
                <motion.div
                  layoutId="sidebar-indicator"
                  className="ml-auto w-1.5 h-1.5 rounded-full bg-mp-cyan"
                />
              )}
            </Link>
          );
        })}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-mp-border">
        <div className={cn(
          'flex items-center gap-3 p-3 rounded-xl bg-mp-surfaceLight',
          collapsed && 'justify-center'
        )}>
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-mp-purple to-mp-magenta flex items-center justify-center text-white font-bold">
            {user.displayName?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
          </div>
          {!collapsed && (
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {user.displayName || user.email}
              </p>
              <p className="text-xs text-gray-500 capitalize">{user.kycLevel} KYC</p>
            </div>
          )}
        </div>

        <button
          className={cn(
            'mt-2 flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-400 hover:text-mp-danger hover:bg-mp-danger/10 transition-all w-full',
            collapsed && 'justify-center'
          )}
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span className="font-medium">Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}

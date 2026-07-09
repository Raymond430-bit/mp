'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Bell,
  Search,
  Shield,
  Menu,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DashboardHeaderProps {
  user: {
    id: string;
    email: string;
    displayName: string | null;
    role: string;
    kycLevel: string;
  };
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="h-16 border-b border-mp-border bg-mp-surface/80 backdrop-blur-xl flex items-center px-6 lg:px-8 sticky top-0 z-30">
      <div className="flex items-center justify-between w-full">
        {/* Mobile menu button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-xl hover:bg-mp-surfaceLight transition-colors"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Search */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-4">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search coins, bots, signals..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-mp-surfaceLight border border-mp-border text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-mp-cyan/50 transition-colors"
            />
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Security badge */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full bg-mp-success/10 border border-mp-success/20">
            <Shield className="w-3.5 h-3.5 text-mp-success" />
            <span className="text-xs text-mp-success font-medium">Secure</span>
          </div>

          {/* Notifications */}
          <button className="relative p-2 rounded-xl hover:bg-mp-surfaceLight transition-colors">
            <Bell className="w-5 h-5 text-gray-400" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-mp-danger" />
          </button>

          {/* User avatar */}
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-mp-purple to-mp-magenta flex items-center justify-center text-white font-bold text-sm">
            {user.displayName?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
          </div>
        </div>
      </div>
    </header>
  );
}

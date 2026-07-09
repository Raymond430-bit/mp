'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap,
  TrendingUp,
  BookOpen,
  Users,
  Shield,
  Menu,
  X,
  ChevronDown,
  Wallet,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', label: 'Home', icon: Zap },
  { href: '/market', label: 'Market', icon: TrendingUp },
  { href: '/education', label: 'Education', icon: BookOpen },
  { href: '/community', label: 'Community', icon: Users },
  { href: '/security', label: 'Security', icon: Shield },
];

const dropdownLinks = [
  { href: '/privacy', label: 'Privacy Policy' },
  { href: '/terms', label: 'Terms of Service' },
  { href: '/risk', label: 'Risk Disclaimer' },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const pathname = usePathname();

  return (
    <nav className="fixed top-8 left-0 right-0 z-50 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="glass-card rounded-2xl px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-mp-cyan to-mp-purple flex items-center justify-center">
                <Zap className="w-5 h-5 text-mp-bg" />
                <div className="absolute inset-0 rounded-xl bg-mp-cyan/20 blur-lg group-hover:bg-mp-cyan/40 transition-all" />
              </div>
              <span className="text-xl font-bold gradient-text">MemePulse</span>
            </Link>

            <div className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cn(
                      'relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2',
                      isActive 
                        ? 'text-mp-cyan' 
                        : 'text-gray-400 hover:text-white hover:bg-mp-surfaceLight'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    {link.label}
                    {isActive && (
                      <motion.div
                        layoutId="nav-indicator"
                        className="absolute bottom-0 left-4 right-4 h-0.5 bg-gradient-to-r from-mp-cyan to-mp-purple rounded-full"
                      />
                    )}
                  </Link>
                );
              })}

              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="px-4 py-2 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-mp-surfaceLight transition-all flex items-center gap-2"
                >
                  More
                  <ChevronDown className={cn('w-4 h-4 transition-transform', dropdownOpen && 'rotate-180')} />
                </button>

                <AnimatePresence>
                  {dropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      className="absolute top-full right-0 mt-2 w-48 glass-card py-2"
                    >
                      {dropdownLinks.map((link) => (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="block px-4 py-2 text-sm text-gray-400 hover:text-white hover:bg-mp-surfaceLight transition-colors"
                          onClick={() => setDropdownOpen(false)}
                        >
                          {link.label}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-3">
              <Link href="/login" className="btn-secondary text-sm">
                Sign In
              </Link>
              <Link href="/register" className="btn-primary text-sm flex items-center gap-2">
                <Wallet className="w-4 h-4" />
                Get Started
              </Link>
            </div>

            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden p-2 rounded-xl hover:bg-mp-surfaceLight transition-colors"
            >
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="lg:hidden overflow-hidden"
              >
                <div className="pt-4 pb-2 space-y-1">
                  {navLinks.map((link) => {
                    const Icon = link.icon;
                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-mp-surfaceLight transition-colors"
                        onClick={() => setMobileOpen(false)}
                      >
                        <Icon className="w-5 h-5" />
                        {link.label}
                      </Link>
                    );
                  })}
                  <div className="border-t border-mp-border my-2" />
                  <div className="flex gap-3 px-4 pt-2">
                    <Link href="/login" className="btn-secondary flex-1 text-center text-sm">
                      Sign In
                    </Link>
                    <Link href="/register" className="btn-primary flex-1 text-center text-sm">
                      Get Started
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </nav>
  );
}

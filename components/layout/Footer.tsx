import Link from 'next/link';
import { Zap, Shield, Mail, Twitter, MessageCircle } from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-mp-border bg-mp-surface/50 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-mp-cyan to-mp-purple flex items-center justify-center">
                <Zap className="w-5 h-5 text-mp-bg" />
              </div>
              <span className="text-xl font-bold gradient-text">MemePulse</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed">
              The most secure and advanced meme coin trading platform. Built for traders who demand excellence.
            </p>
            <div className="flex gap-4 mt-6">
              <a href="https://twitter.com/memepulse" className="w-10 h-10 rounded-xl bg-mp-surfaceLight flex items-center justify-center text-gray-400 hover:text-mp-cyan hover:bg-mp-cyan/10 transition-all">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="https://discord.gg/memepulse" className="w-10 h-10 rounded-xl bg-mp-surfaceLight flex items-center justify-center text-gray-400 hover:text-mp-purple hover:bg-mp-purple/10 transition-all">
                <MessageCircle className="w-5 h-5" />
              </a>
              <a href="mailto:support@memepulse.io" className="w-10 h-10 rounded-xl bg-mp-surfaceLight flex items-center justify-center text-gray-400 hover:text-mp-magenta hover:bg-mp-magenta/10 transition-all">
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="text-white font-semibold mb-4">Product</h3>
            <ul className="space-y-3">
              <li><Link href="/market" className="text-gray-400 hover:text-mp-cyan transition-colors text-sm">Market Monitor</Link></li>
              <li><Link href="/bots" className="text-gray-400 hover:text-mp-cyan transition-colors text-sm">Trading Bots</Link></li>
              <li><Link href="/signals" className="text-gray-400 hover:text-mp-cyan transition-colors text-sm">Signals</Link></li>
              <li><Link href="/copy-trading" className="text-gray-400 hover:text-mp-cyan transition-colors text-sm">Copy Trading</Link></li>
              <li><Link href="/education" className="text-gray-400 hover:text-mp-cyan transition-colors text-sm">Education</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-white font-semibold mb-4">Company</h3>
            <ul className="space-y-3">
              <li><Link href="/security" className="text-gray-400 hover:text-mp-cyan transition-colors text-sm">Security</Link></li>
              <li><Link href="/community" className="text-gray-400 hover:text-mp-cyan transition-colors text-sm">Community</Link></li>
              <li><a href="https://docs.memepulse.io" className="text-gray-400 hover:text-mp-cyan transition-colors text-sm">Documentation</a></li>
              <li><a href="https://status.memepulse.io" className="text-gray-400 hover:text-mp-cyan transition-colors text-sm">Status</a></li>
              <li><a href="https://blog.memepulse.io" className="text-gray-400 hover:text-mp-cyan transition-colors text-sm">Blog</a></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-semibold mb-4">Legal</h3>
            <ul className="space-y-3">
              <li><Link href="/privacy" className="text-gray-400 hover:text-mp-cyan transition-colors text-sm">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-gray-400 hover:text-mp-cyan transition-colors text-sm">Terms of Service</Link></li>
              <li><Link href="/risk" className="text-gray-400 hover:text-mp-cyan transition-colors text-sm">Risk Disclaimer</Link></li>
              <li><Link href="/security" className="text-gray-400 hover:text-mp-cyan transition-colors text-sm">Security</Link></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-mp-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © 2026 MemePulse. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-mp-success text-sm">
            <Shield className="w-4 h-4" />
            <span>SOC 2 Type II Certified</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

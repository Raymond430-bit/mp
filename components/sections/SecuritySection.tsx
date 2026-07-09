"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Shield, Lock, Eye, Server, Key, FileCheck, AlertTriangle, Fingerprint } from "lucide-react";

const securityFeatures = [
  { icon: Lock, title: "End-to-End Encryption", description: "All data encrypted in transit with TLS 1.3 and at rest with AES-256. Zero-knowledge architecture for sensitive operations." },
  { icon: Key, title: "Multi-Signature Wallets", description: "Require M-of-N signatures for withdrawals. Hardware security modules protect private keys. No single point of failure." },
  { icon: Fingerprint, title: "Biometric 2FA", description: "Support for TOTP, WebAuthn/Passkeys, and hardware security keys. Mandatory 2FA for withdrawals and high-value trades." },
  { icon: Eye, title: "Real-Time Monitoring", description: "24/7 automated threat detection with anomaly scoring. Instant alerts for suspicious login attempts or unusual trading patterns." },
  { icon: Server, title: "Cold Storage", description: "95% of assets stored in air-gapped cold wallets. Geographic distribution across secure facilities with armed guards." },
  { icon: FileCheck, title: "Regular Audits", description: "Quarterly security audits by Trail of Bits, OpenZeppelin, and CertiK. Public bug bounty program with rewards up to $500K." },
];

const certifications = [
  { name: "SOC 2 Type II", status: "Certified" },
  { name: "ISO 27001", status: "Certified" },
  { name: "CCSS Level 3", status: "Certified" },
  { name: "GDPR Compliant", status: "Active" },
];

export function SecuritySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section ref={ref} className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-mp-bg via-mp-surface/50 to-mp-bg" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6 }}
          className="text-center mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-mp-success/10 border border-mp-success/20 text-mp-success text-sm font-medium mb-6">
            <Shield className="w-4 h-4" /> Security First
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold text-white">Your Assets, <span className="gradient-text">Fortress-Protected</span></h2>
          <p className="mt-4 text-gray-400 max-w-2xl mx-auto">Security is not a feature, it is our foundation. Every line of code, every architecture decision is designed to protect your funds.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {securityFeatures.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div key={feature.title} initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5, delay: index * 0.08 }}
                className="glass-card p-6 rounded-2xl border border-mp-success/10">
                <div className="w-12 h-12 rounded-xl bg-mp-success/10 flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-mp-success" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{feature.description}</p>
              </motion.div>
            );
          })}
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.5 }}
          className="glass-card rounded-2xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <FileCheck className="w-6 h-6 text-mp-cyan" />
            <h3 className="text-xl font-bold text-white">Certifications & Compliance</h3>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {certifications.map((cert) => (
              <div key={cert.name} className="flex items-center justify-between p-4 rounded-xl bg-mp-surfaceLight border border-mp-border">
                <span className="font-medium text-white">{cert.name}</span>
                <span className="px-2 py-1 rounded-full bg-mp-success/10 text-mp-success text-xs font-medium">{cert.status}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={isInView ? { opacity: 1 } : {}} transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-8 flex items-start gap-3 p-4 rounded-xl bg-mp-warning/5 border border-mp-warning/20">
          <AlertTriangle className="w-5 h-5 text-mp-warning shrink-0 mt-0.5" />
          <p className="text-sm text-gray-400">
            <span className="text-mp-warning font-medium">Risk Warning:</span> Cryptocurrency trading involves substantial risk of loss. Meme coins are highly volatile and speculative. Never invest more than you can afford to lose. Past performance does not guarantee future results. Please read our <a href="/risk" className="text-mp-cyan hover:underline">Risk Disclaimer</a> before trading.
          </p>
        </motion.div>
      </div>
    </section>
  );
}

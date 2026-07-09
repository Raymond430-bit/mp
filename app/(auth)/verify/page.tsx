"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Zap, Mail, Loader2, CheckCircle } from "lucide-react";
import Link from "next/link";

function VerifyForm() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleVerify() {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setVerified(true);
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative">
      <div className="absolute inset-0 bg-mesh" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 w-full max-w-md text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-mp-cyan to-mp-purple flex items-center justify-center mx-auto mb-6">
          <Zap className="w-8 h-8 text-mp-bg" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">Verify Your Email</h1>
        <p className="text-gray-400 mb-8">
          We&apos;ve sent a verification link to <span className="text-white">{email}</span>
        </p>
        
        {verified ? (
          <div className="glass-card rounded-2xl p-8">
            <CheckCircle className="w-12 h-12 text-mp-success mx-auto mb-4" />
            <h2 className="text-xl font-bold text-white mb-2">Email Verified!</h2>
            <p className="text-gray-400 mb-6">Your account is now active. You can start trading.</p>
            <Link href="/login" className="btn-primary inline-flex items-center gap-2">Go to Login <Zap className="w-4 h-4" /></Link>
          </div>
        ) : (
          <div className="glass-card rounded-2xl p-8">
            <Mail className="w-12 h-12 text-mp-cyan mx-auto mb-4" />
            <button onClick={handleVerify} disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50">
              {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Verifying...</> : "I&apos;ve Clicked the Link"}
            </button>
            <p className="mt-4 text-sm text-gray-500">Didn&apos;t receive it? <button className="text-mp-cyan hover:underline">Resend</button></p>
          </div>
        )}
      </motion.div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="text-white">Loading...</div></div>}>
      <VerifyForm />
    </Suspense>
  );
}

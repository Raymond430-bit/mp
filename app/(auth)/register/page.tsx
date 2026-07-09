"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Zap, Mail, Lock, Eye, EyeOff, Shield, AlertTriangle, Loader2, Check } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: "", password: "", confirmPassword: "", displayName: "",
    acceptTerms: false, acceptPrivacy: false, acceptRisk: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match"); return;
    }
    if (formData.password.length < 12) {
      setError("Password must be at least 12 characters"); return;
    }
    if (!formData.acceptTerms || !formData.acceptPrivacy || !formData.acceptRisk) {
      setError("You must accept all terms and disclaimers"); return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, csrfToken: "placeholder" }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Registration failed");
      router.push("/verify?email=" + encodeURIComponent(formData.email));
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }

  const passwordChecks = [
    { label: "12+ characters", met: formData.password.length >= 12 },
    { label: "Uppercase letter", met: /[A-Z]/.test(formData.password) },
    { label: "Lowercase letter", met: /[a-z]/.test(formData.password) },
    { label: "Number", met: /[0-9]/.test(formData.password) },
    { label: "Special character", met: /[^A-Za-z0-9]/.test(formData.password) },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative py-20">
      <div className="absolute inset-0 bg-mesh" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-mp-purple/10 rounded-full blur-[128px]" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-mp-cyan/10 rounded-full blur-[128px]" />

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-mp-cyan to-mp-purple flex items-center justify-center">
              <Zap className="w-6 h-6 text-mp-bg" />
            </div>
            <span className="text-2xl font-bold gradient-text">MemePulse</span>
          </Link>
          <h1 className="mt-6 text-3xl font-bold text-white">Create your account</h1>
          <p className="mt-2 text-gray-400">Start trading meme coins securely</p>
        </div>

        <div className="flex items-center justify-center gap-2 mb-6 text-mp-success text-sm">
          <Shield className="w-4 h-4" />
          <span>Military-grade encryption</span>
        </div>

        {error && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-4 rounded-xl bg-mp-danger/10 border border-mp-danger/20 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-mp-danger shrink-0 mt-0.5" />
            <p className="text-sm text-mp-danger">{error}</p>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-8 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}
                required className="input-field pl-12" placeholder="you@example.com" autoComplete="email" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Display Name</label>
            <input type="text" value={formData.displayName} onChange={(e) => setFormData({...formData, displayName: e.target.value})}
              className="input-field" placeholder="TraderPro" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input type={showPassword ? "text" : "password"} value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required minLength={12} className="input-field pl-12 pr-12" placeholder="••••••••••••" />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors">
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <div className="mt-2 space-y-1">
              {passwordChecks.map((check) => (
                <div key={check.label} className={`flex items-center gap-2 text-xs ${check.met ? "text-mp-success" : "text-gray-500"}`}>
                  <Check className={`w-3 h-3 ${check.met ? "opacity-100" : "opacity-30"}`} />
                  {check.label}
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
            <input type="password" value={formData.confirmPassword} onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              required className="input-field" placeholder="••••••••••••" />
          </div>

          <div className="space-y-3 pt-2">
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={formData.acceptTerms} onChange={(e) => setFormData({...formData, acceptTerms: e.target.checked})}
                className="mt-1 w-4 h-4 rounded border-mp-border bg-mp-surface text-mp-cyan" />
              <span className="text-sm text-gray-400">I agree to the <Link href="/terms" className="text-mp-cyan hover:underline">Terms of Service</Link></span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={formData.acceptPrivacy} onChange={(e) => setFormData({...formData, acceptPrivacy: e.target.checked})}
                className="mt-1 w-4 h-4 rounded border-mp-border bg-mp-surface text-mp-cyan" />
              <span className="text-sm text-gray-400">I agree to the <Link href="/privacy" className="text-mp-cyan hover:underline">Privacy Policy</Link></span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input type="checkbox" checked={formData.acceptRisk} onChange={(e) => setFormData({...formData, acceptRisk: e.target.checked})}
                className="mt-1 w-4 h-4 rounded border-mp-border bg-mp-surface text-mp-cyan" />
              <span className="text-sm text-gray-400">I acknowledge the <Link href="/risk" className="text-mp-cyan hover:underline">Risk Disclaimer</Link></span>
            </label>
          </div>

          <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50">
            {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Creating account...</> : <>Create Account <Zap className="w-5 h-5" /></>}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account? <Link href="/login" className="text-mp-cyan hover:text-mp-purple transition-colors font-medium">Sign in</Link>
        </p>
      </motion.div>
    </div>
  );
}

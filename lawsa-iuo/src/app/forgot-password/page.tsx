"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowLeft01Icon,
  MailIcon,
  CheckmarkCircle01Icon,
  AlertCircleIcon,
  Loading03Icon,
} from "@hugeicons/core-free-icons";
import { Scale } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  const getSiteUrl = () => {
    // Use environment variable if available, otherwise fall back to window.location
    const envUrl = process.env.NEXT_PUBLIC_SITE_URL;
    if (envUrl) return envUrl;
    
    // For production, explicitly use the production URL
    if (typeof window !== 'undefined') {
      const hostname = window.location.hostname;
      if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return window.location.origin;
      }
      // Production URL
      return 'https://lawsa-iuo-1.onrender.com';
    }
    return 'https://lawsa-iuo-1.onrender.com';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }
    
    setIsLoading(true);
    setError(null);

    try {
      const siteUrl = getSiteUrl();
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email.trim(),
        {
          redirectTo: `${siteUrl}/auth/reset-password`,
        }
      );

      if (resetError) {
        setError(resetError.message);
        setIsLoading(false);
        return;
      }

      setIsSuccess(true);
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500/20 via-background to-background p-4">
      <Link href="/" className="mb-8 flex items-center gap-2 group">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-white shadow-lg transition-transform group-hover:scale-105">
          <Scale size={20} />
        </div>
        <span className="font-serif text-2xl font-bold text-foreground">
          LAWSA<span className="text-brand">.IUO</span>
        </span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8">
          <Link
            href="/sign-in"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} className="w-4 h-4" />
            Back to sign in
          </Link>

          {isSuccess ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-4"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <HugeiconsIcon icon={CheckmarkCircle01Icon} className="w-10 h-10 text-green-600 dark:text-green-400" />
              </motion.div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-3">
                Check Your Email
              </h1>
              <p className="text-muted-foreground mb-6">
                We&apos;ve sent a password reset link to <strong>{email}</strong>. Please check your inbox and follow the instructions to reset your password.
              </p>
              <div className="space-y-3">
                <Link
                  href="/sign-in"
                  className="inline-flex items-center justify-center w-full px-6 py-3 rounded-xl bg-brand text-white font-semibold hover:bg-brand-dim transition-colors"
                >
                  Return to Sign In
                </Link>
                <button
                  onClick={() => {
                    setIsSuccess(false);
                    setEmail("");
                  }}
                  className="inline-flex items-center justify-center w-full px-6 py-3 rounded-xl bg-muted text-foreground font-semibold hover:bg-muted/80 transition-colors"
                >
                  Try Different Email
                </button>
              </div>
            </motion.div>
          ) : (
            <>
              <div className="text-center mb-6">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="w-16 h-16 sm:w-20 sm:h-20 bg-brand/10 rounded-2xl flex items-center justify-center mx-auto mb-4"
                >
                  <HugeiconsIcon icon={MailIcon} className="w-8 h-8 sm:w-10 sm:h-10 text-brand" />
                </motion.div>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-2">
                  Reset Password
                </h1>
                <p className="text-muted-foreground text-sm">
                  Enter your email address and we&apos;ll send you a link to reset your password
                </p>
              </div>

              <AnimatePresence mode="wait">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, height: 0 }}
                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                    exit={{ opacity: 0, y: -10, height: 0 }}
                    className="mb-4 p-3 sm:p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-start gap-2"
                  >
                    <HugeiconsIcon icon={AlertCircleIcon} className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <HugeiconsIcon
                      icon={MailIcon}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"
                    />
                    <input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError(null);
                      }}
                      className="w-full pl-10 pr-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all text-base"
                      placeholder="you@example.com"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full bg-brand hover:bg-brand-dim text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-base"
                >
                  {isLoading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <HugeiconsIcon icon={Loading03Icon} className="w-5 h-5" />
                      </motion.div>
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      Send Reset Link
                      <HugeiconsIcon icon={ArrowLeft01Icon} className="w-4 h-4 rotate-180" />
                    </>
                  )}
                </motion.button>
              </form>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                Remember your password?{" "}
                <Link
                  href="/sign-in"
                  className="text-brand hover:text-brand-dim font-semibold transition-colors"
                >
                  Sign in
                </Link>
              </p>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}

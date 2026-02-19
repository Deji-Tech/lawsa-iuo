"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  ViewIcon,
  ViewOffIcon,
  LockPasswordIcon,
  CheckmarkCircle01Icon,
  AlertCircleIcon,
  Loading03Icon,
} from "@hugeicons/core-free-icons";
import { Scale } from "lucide-react";
import { useRouter } from "next/navigation";

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
}

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isValidLink, setIsValidLink] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    // Check if we have a valid session from the reset link
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setIsValidLink(false);
        setError("This password reset link has expired or is invalid. Please request a new one.");
      }
    };
    checkSession();
  }, [supabase]);

  const calculatePasswordStrength = (pass: string): PasswordStrength => {
    let score = 0;
    if (pass.length >= 8) score++;
    if (/[A-Z]/.test(pass)) score++;
    if (/[a-z]/.test(pass)) score++;
    if (/[0-9]/.test(pass)) score++;
    if (/[^A-Za-z0-9]/.test(pass)) score++;

    const labels = ["Very Weak", "Weak", "Fair", "Good", "Strong", "Very Strong"];
    const colors = [
      "bg-destructive",
      "bg-destructive",
      "bg-amber-500",
      "bg-brand",
      "bg-green-500",
      "bg-green-600",
    ];

    return {
      score,
      label: labels[score],
      color: colors[score],
    };
  };

  const passwordStrength = calculatePasswordStrength(password);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    
    if (passwordStrength.score < 3) {
      setError("Password is too weak. Include uppercase, lowercase, and numbers.");
      return;
    }
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    setIsLoading(true);
    setError(null);

    try {
      const { error: updateError } = await supabase.auth.updateUser({
        password: password,
      });

      if (updateError) {
        setError(updateError.message);
        setIsLoading(false);
        return;
      }

      setIsSuccess(true);
      // Redirect to sign in after a delay
      setTimeout(() => {
        router.push("/sign-in");
      }, 3000);
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
          {!isValidLink ? (
            <div className="text-center py-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
                className="w-20 h-20 bg-destructive/10 rounded-full flex items-center justify-center mx-auto mb-6"
              >
                <HugeiconsIcon icon={AlertCircleIcon} className="w-10 h-10 text-destructive" />
              </motion.div>
              <h1 className="font-serif text-2xl font-bold text-foreground mb-3">
                Link Expired
              </h1>
              <p className="text-muted-foreground mb-6">
                {error}
              </p>
              <Link
                href="/forgot-password"
                className="inline-flex items-center justify-center w-full px-6 py-3 rounded-xl bg-brand text-white font-semibold hover:bg-brand-dim transition-colors"
              >
                Request New Link
              </Link>
            </div>
          ) : isSuccess ? (
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
                Password Reset!
              </h1>
              <p className="text-muted-foreground mb-6">
                Your password has been successfully reset. You can now sign in with your new password.
              </p>
              <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
                <motion.div
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 3, ease: "linear" }}
                  className="h-full bg-brand"
                />
              </div>
              <p className="text-sm text-muted-foreground mt-3">
                Redirecting to sign in...
              </p>
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
                  <HugeiconsIcon icon={LockPasswordIcon} className="w-8 h-8 sm:w-10 sm:h-10 text-brand" />
                </motion.div>
                <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-2">
                  Create New Password
                </h1>
                <p className="text-muted-foreground text-sm">
                  Enter your new password below
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
                    htmlFor="password"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    New Password
                  </label>
                  <div className="relative">
                    <HugeiconsIcon
                      icon={LockPasswordIcon}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"
                    />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (error) setError(null);
                      }}
                      className="w-full pl-10 pr-12 py-3 rounded-xl border border-border bg-background focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all text-base"
                      placeholder="Create a strong password"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                      disabled={isLoading}
                    >
                      <HugeiconsIcon
                        icon={showPassword ? ViewOffIcon : ViewIcon}
                        className="w-5 h-5"
                      />
                    </button>
                  </div>
                  {password && (
                    <div className="mt-2">
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex-1 h-1.5 bg-muted rounded-full overflow-hidden mr-3">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                            className={`h-full ${passwordStrength.color} transition-all duration-300`}
                          />
                        </div>
                        <span className={`text-xs font-medium ${
                          passwordStrength.score >= 4 ? 'text-green-600' : 
                          passwordStrength.score >= 3 ? 'text-brand' : 
                          passwordStrength.score >= 2 ? 'text-amber-500' : 'text-destructive'
                        }`}>
                          {passwordStrength.label}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Use 8+ characters with uppercase, lowercase, numbers, and symbols
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-foreground mb-2"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <HugeiconsIcon
                      icon={LockPasswordIcon}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"
                    />
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (error) setError(null);
                      }}
                      className={`w-full pl-10 pr-12 py-3 rounded-xl border bg-background focus:outline-none focus:ring-2 transition-all text-base ${
                        confirmPassword && password === confirmPassword
                          ? 'border-green-500 focus:border-green-500 focus:ring-green-500/20'
                          : 'border-border focus:border-brand focus:ring-brand/20'
                      }`}
                      placeholder="Confirm your password"
                      disabled={isLoading}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors p-1"
                      disabled={isLoading}
                    >
                      <HugeiconsIcon
                        icon={showConfirmPassword ? ViewOffIcon : ViewIcon}
                        className="w-5 h-5"
                      />
                    </button>
                  </div>
                </div>

                <motion.button
                  type="submit"
                  disabled={isLoading}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full bg-brand hover:bg-brand-dim text-white font-semibold py-3.5 rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-base mt-6"
                >
                  {isLoading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <HugeiconsIcon icon={Loading03Icon} className="w-5 h-5" />
                      </motion.div>
                      <span>Resetting...</span>
                    </>
                  ) : (
                    <>
                      Reset Password
                      <HugeiconsIcon icon={ArrowRight01Icon} className="w-4 h-4" />
                    </>
                  )}
                </motion.button>
              </form>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
}

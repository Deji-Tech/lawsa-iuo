"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ArrowRight01Icon,
  ViewIcon,
  ViewOffIcon,
  MailIcon,
  LockPasswordIcon,
  AlertCircleIcon,
} from "@hugeicons/core-free-icons";
import { useRouter } from "next/navigation";

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState({ email: false, password: false });
  
  const router = useRouter();
  const supabase = createClient();

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!password) {
      newErrors.password = "Password is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setTouched({ email: true, password: true });
      return;
    }
    
    setIsLoading(true);
    setErrors({});

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        setErrors({ 
          general: error.message === "Invalid login credentials" 
            ? "Invalid email or password. Please try again."
            : error.message
        });
        setIsLoading(false);
        return;
      }

      if (data.user) {
        // Small delay to ensure session is properly set
        setTimeout(() => {
          router.push("/dashboard");
          router.refresh();
        }, 100);
      }
    } catch (err) {
      setErrors({ general: "An unexpected error occurred. Please try again." });
      setIsLoading(false);
    }
  };

  const handleBlur = (field: 'email' | 'password') => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateForm();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto px-4 sm:px-0"
    >
      <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl sm:rounded-3xl shadow-xl p-6 sm:p-8">
        <div className="text-center mb-6 sm:mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-16 h-16 sm:w-20 sm:h-20 bg-brand/10 rounded-2xl flex items-center justify-center mx-auto mb-4"
          >
            <HugeiconsIcon icon={LockPasswordIcon} className="w-8 h-8 sm:w-10 sm:h-10 text-brand" />
          </motion.div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Welcome Back
          </h1>
          <p className="text-muted-foreground text-sm">
            Sign in to continue your legal education journey
          </p>
        </div>

        <AnimatePresence mode="wait">
          {errors.general && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="mb-4 p-3 sm:p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-start gap-2"
            >
              <HugeiconsIcon icon={AlertCircleIcon} className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{errors.general}</span>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
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
                  if (errors.email) validateForm();
                }}
                onBlur={() => handleBlur('email')}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-background focus:outline-none focus:ring-2 transition-all text-base ${
                  errors.email && touched.email
                    ? 'border-destructive focus:border-destructive focus:ring-destructive/20'
                    : 'border-border focus:border-brand focus:ring-brand/20'
                }`}
                placeholder="you@example.com"
                disabled={isLoading}
              />
            </div>
            <AnimatePresence>
              {errors.email && touched.email && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-destructive text-xs mt-1.5 ml-1"
                >
                  {errors.email}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-foreground"
              >
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs text-brand hover:text-brand-dim transition-colors"
              >
                Forgot password?
              </Link>
            </div>
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
                  if (errors.password) validateForm();
                }}
                onBlur={() => handleBlur('password')}
                className={`w-full pl-10 pr-12 py-3 rounded-xl border bg-background focus:outline-none focus:ring-2 transition-all text-base ${
                  errors.password && touched.password
                    ? 'border-destructive focus:border-destructive focus:ring-destructive/20'
                    : 'border-border focus:border-brand focus:ring-brand/20'
                }`}
                placeholder="Enter your password"
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
            <AnimatePresence>
              {errors.password && touched.password && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-destructive text-xs mt-1.5 ml-1"
                >
                  {errors.password}
                </motion.p>
              )}
            </AnimatePresence>
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
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Signing in...</span>
              </>
            ) : (
              <>
                Sign In
                <HugeiconsIcon icon={ArrowRight01Icon} className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </form>

        <p className="mt-6 sm:mt-8 text-center text-sm text-muted-foreground">
          Don&apos;t have an account?{" "}
          <Link
            href="/sign-up"
            className="text-brand hover:text-brand-dim font-semibold transition-colors"
          >
            Create account
          </Link>
        </p>
      </div>
    </motion.div>
  );
}

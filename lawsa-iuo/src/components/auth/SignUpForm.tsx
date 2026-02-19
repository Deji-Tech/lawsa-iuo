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
  UserIcon,
  MailIcon,
  LockPasswordIcon,
  CheckmarkCircle01Icon,
  AlertCircleIcon,
} from "@hugeicons/core-free-icons";
import { useRouter } from "next/navigation";

interface FormErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

interface PasswordStrength {
  score: number;
  label: string;
  color: string;
}

export default function SignUpForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState({
    fullName: false,
    email: false,
    password: false,
    confirmPassword: false,
  });
  const [isSuccess, setIsSuccess] = useState(false);
  
  const router = useRouter();
  const supabase = createClient();

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

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    if (!fullName.trim()) {
      newErrors.fullName = "Full name is required";
    } else if (fullName.trim().length < 2) {
      newErrors.fullName = "Name must be at least 2 characters";
    }
    
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }
    
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    } else if (passwordStrength.score < 3) {
      newErrors.password = "Password is too weak. Include uppercase, lowercase, and numbers.";
    }
    
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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
    
    setTouched({
      fullName: true,
      email: true,
      password: true,
      confirmPassword: true,
    });
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setErrors({});

    try {
      const siteUrl = getSiteUrl();
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
          },
          emailRedirectTo: `${siteUrl}/auth/callback`,
        },
      });

      if (signUpError) {
        setErrors({ 
          general: signUpError.message === "User already registered"
            ? "An account with this email already exists. Please sign in instead."
            : signUpError.message
        });
        setIsLoading(false);
        return;
      }

      if (data.user) {
        setIsSuccess(true);
        // Redirect after a short delay to show success message
        setTimeout(() => {
          router.push("/dashboard");
          router.refresh();
        }, 2000);
      }
    } catch (err) {
      setErrors({ general: "An unexpected error occurred. Please try again." });
      setIsLoading(false);
    }
  };

  const handleBlur = (field: keyof typeof touched) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    validateForm();
  };

  if (isSuccess) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md mx-auto px-4 sm:px-0"
      >
        <div className="bg-card/80 backdrop-blur-xl border border-border/50 rounded-2xl sm:rounded-3xl shadow-xl p-8 sm:p-12 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <HugeiconsIcon icon={CheckmarkCircle01Icon} className="w-10 h-10 text-green-600 dark:text-green-400" />
          </motion.div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-3">
            Account Created!
          </h2>
          <p className="text-muted-foreground mb-6">
            Welcome to LAWSA-IUO. Redirecting you to your dashboard...
          </p>
          <div className="w-full bg-muted rounded-full h-2 overflow-hidden">
            <motion.div
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2, ease: "linear" }}
              className="h-full bg-brand"
            />
          </div>
        </div>
      </motion.div>
    );
  }

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
            <HugeiconsIcon icon={UserIcon} className="w-8 h-8 sm:w-10 sm:h-10 text-brand" />
          </motion.div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-2">
            Create Account
          </h1>
          <p className="text-muted-foreground text-sm">
            Start your legal education journey today
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
              htmlFor="fullName"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Full Name
            </label>
            <div className="relative">
              <HugeiconsIcon
                icon={UserIcon}
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"
              />
              <input
                id="fullName"
                type="text"
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  if (errors.fullName) validateForm();
                }}
                onBlur={() => handleBlur('fullName')}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-background focus:outline-none focus:ring-2 transition-all text-base ${
                  errors.fullName && touched.fullName
                    ? 'border-destructive focus:border-destructive focus:ring-destructive/20'
                    : 'border-border focus:border-brand focus:ring-brand/20'
                }`}
                placeholder="John Doe"
                disabled={isLoading}
              />
            </div>
            <AnimatePresence>
              {errors.fullName && touched.fullName && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-destructive text-xs mt-1.5 ml-1"
                >
                  {errors.fullName}
                </motion.p>
              )}
            </AnimatePresence>
          </div>

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
            <label
              htmlFor="password"
              className="block text-sm font-medium text-foreground mb-2"
            >
              Password
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
                  if (errors.password) validateForm();
                }}
                onBlur={() => handleBlur('password')}
                className={`w-full pl-10 pr-12 py-3 rounded-xl border bg-background focus:outline-none focus:ring-2 transition-all text-base ${
                  errors.password && touched.password
                    ? 'border-destructive focus:border-destructive focus:ring-destructive/20'
                    : 'border-border focus:border-brand focus:ring-brand/20'
                }`}
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
                  if (errors.confirmPassword) validateForm();
                }}
                onBlur={() => handleBlur('confirmPassword')}
                className={`w-full pl-10 pr-12 py-3 rounded-xl border bg-background focus:outline-none focus:ring-2 transition-all text-base ${
                  errors.confirmPassword && touched.confirmPassword
                    ? 'border-destructive focus:border-destructive focus:ring-destructive/20'
                    : confirmPassword && password === confirmPassword
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
            <AnimatePresence>
              {errors.confirmPassword && touched.confirmPassword && (
                <motion.p
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-destructive text-xs mt-1.5 ml-1"
                >
                  {errors.confirmPassword}
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
                <span>Creating account...</span>
              </>
            ) : (
              <>
                Create Account
                <HugeiconsIcon icon={ArrowRight01Icon} className="w-4 h-4" />
              </>
            )}
          </motion.button>
        </form>

        <p className="mt-6 sm:mt-8 text-center text-sm text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/sign-in"
            className="text-brand hover:text-brand-dim font-semibold transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </motion.div>
  );
}

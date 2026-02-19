"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { JusticeScale01Icon, Menu01Icon, Cancel01Icon, Moon02Icon, Sun03Icon, UserAccountIcon } from "@hugeicons/core-free-icons";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import UserButton from "@/components/auth/UserButton";
import { useAuth } from "@/contexts/AuthContext";

const navLinks = [
  { label: "Home", href: "/", isRoute: true },
  { label: "Dashboard", href: "/dashboard", isRoute: true },
  { label: "Learn", href: "#levels", isRoute: false },
  { label: "About", href: "#about", isRoute: false },
  { label: "Contact", href: "#contact", isRoute: false },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const { user, isLoading } = useAuth();
  const { theme, setTheme } = useTheme();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!isLoading) {
      setIsAuthenticated(!!user);
    }
  }, [isLoading, user]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
        ? "border-b border-border/50 bg-background/95 backdrop-blur-xl shadow-lg shadow-black/5"
        : "border-transparent bg-transparent"
        }`}
    >
      <div className="container mx-auto flex h-20 items-center justify-between px-5 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-3">
          <motion.div 
            whileHover={{ rotate: 5, scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-brand to-brand-dim text-white shadow-lg shadow-brand/25 transition-all duration-300 ring-1 ring-white/20"
          >
            <HugeiconsIcon icon={JusticeScale01Icon} className="w-5 h-5" />
          </motion.div>
          <span className="font-display text-xl font-semibold tracking-tight text-foreground">
            LAWSA<span className="text-brand">.</span>IUO
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link, index) => (
            <motion.div 
              key={link.label} 
              className="relative group"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.1 }}
            >
              {link.isRoute ? (
                <Link
                  href={link.href}
                  className="text-sm font-medium text-foreground/80 transition-colors duration-300 hover:text-brand relative"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  href={link.href}
                  className="text-sm font-medium text-foreground/80 transition-colors duration-300 hover:text-brand relative"
                >
                  {link.label}
                </a>
              )}
              <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-gradient-to-r from-brand to-brand-dim transition-all duration-300 group-hover:w-full" />
            </motion.div>
          ))}

          {/* Right Side Controls - Profile Logo & Theme Toggle */}
          <div className="flex items-center gap-3 pl-4 border-l border-border/50">
            {isAuthenticated ? (
              <>
                {/* Theme Toggle Logo */}
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleTheme}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-muted hover:bg-brand/10 border border-border hover:border-brand/30 transition-all"
                  aria-label="Toggle theme"
                >
                  {mounted && (
                    <HugeiconsIcon 
                      icon={theme === "dark" ? Sun03Icon : Moon02Icon} 
                      className="w-5 h-5 text-foreground" 
                    />
                  )}
                </motion.button>
                
                {/* Profile Logo/Button */}
                <UserButton />
              </>
            ) : (
              <>
                {/* Theme Toggle Logo for guests */}
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleTheme}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-muted hover:bg-brand/10 border border-border hover:border-brand/30 transition-all"
                  aria-label="Toggle theme"
                >
                  {mounted && (
                    <HugeiconsIcon 
                      icon={theme === "dark" ? Sun03Icon : Moon02Icon} 
                      className="w-5 h-5 text-foreground" 
                    />
                  )}
                </motion.button>
                
                {/* Profile Logo for guests (redirects to login) */}
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Link
                    href="/sign-in"
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-white shadow-lg shadow-brand/25 hover:bg-brand-dim transition-all"
                    aria-label="Login"
                  >
                    <HugeiconsIcon icon={UserAccountIcon} className="w-5 h-5" />
                  </Link>
                </motion.div>
              </>
            )}
          </div>
        </div>

        {/* Mobile Controls - Profile & Theme Logos */}
        <div className="flex items-center gap-3 md:hidden">
          {/* Theme Toggle Logo */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 15 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-full bg-muted hover:bg-brand/10 border border-border hover:border-brand/30 transition-all"
            aria-label="Toggle theme"
          >
            {mounted && (
              <HugeiconsIcon 
                icon={theme === "dark" ? Sun03Icon : Moon02Icon} 
                className="w-5 h-5 text-foreground" 
              />
            )}
          </motion.button>
          
          {/* Profile Logo */}
          {isAuthenticated ? (
            <UserButton />
          ) : (
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Link
                href="/sign-in"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-white shadow-md shadow-brand/20 hover:bg-brand-dim transition-all"
                aria-label="Login"
              >
                <HugeiconsIcon icon={UserAccountIcon} className="w-5 h-5" />
              </Link>
            </motion.div>
          )}

          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => setOpen(!open)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background/80 text-foreground backdrop-blur-md transition-colors hover:bg-brand/10 hover:text-brand"
            aria-label={open ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            <AnimatePresence mode="wait">
              {open ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <HugeiconsIcon icon={Cancel01Icon} className="w-5 h-5" />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <HugeiconsIcon icon={Menu01Icon} className="w-5 h-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute top-full left-0 right-0 overflow-hidden bg-background/95 backdrop-blur-xl border-b border-border/50 md:hidden"
            role="navigation"
            aria-label="Mobile navigation"
          >
            <div className="flex flex-col gap-2 px-6 py-8">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
                >
                  {link.isRoute ? (
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="block py-3 text-xl font-display text-foreground hover:text-brand transition-colors"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="block py-3 text-xl font-display text-foreground hover:text-brand transition-colors"
                    >
                      {link.label}
                    </a>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;

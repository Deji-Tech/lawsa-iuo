"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Scale, Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignedIn, SignedOut, SignInButton, UserButton, useAuth } from "@clerk/nextjs";

const navLinks = [
  { label: "Home", href: "/", isRoute: true },
  { label: "CBT Center", href: "/cbt", isRoute: true },
  { label: "Learn", href: "#levels", isRoute: false },
  { label: "About", href: "#about", isRoute: false },
  { label: "Contact", href: "#contact", isRoute: false },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { isLoaded, userId } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled
        ? "border-b border-border/50 bg-background/95 backdrop-blur-xl shadow-sm"
        : "border-transparent bg-background/20 backdrop-blur-sm"
        }`}
    >
      <div className="container mx-auto flex h-20 items-center justify-between px-5 sm:px-6 lg:px-8">
        <Link href="/" className="group flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-brand text-primary-foreground shadow-lg transition-transform duration-300 group-hover:rotate-3 group-hover:scale-105 ring-1 ring-white/10">
            <Scale size={20} className="text-white" />
          </div>
          <span className="font-serif text-xl font-medium tracking-tight text-foreground">
            LAWSA<span className="text-brand">.</span>IUO
          </span>
        </Link>

        {/* Desktop links */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <div key={link.label} className="relative group">
              {link.isRoute ? (
                <Link
                  href={link.href}
                  className="text-sm font-medium text-foreground transition-colors duration-300 hover:text-brand"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  href={link.href}
                  className="text-sm font-medium text-foreground transition-colors duration-300 hover:text-brand"
                >
                  {link.label}
                </a>
              )}
              <span className="absolute -bottom-1 left-0 h-[2px] w-0 bg-brand transition-all duration-300 group-hover:w-full" />
            </div>
          ))}

          {/* Desktop Auth */}
          {userId ? (
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "h-10 w-10 ring-2 ring-brand/20 transition-all hover:scale-105 hover:ring-brand",
                }
              }}
            />
          ) : (
            <Link
              href="/sign-in"
              className="rounded-full bg-brand px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-brand/20 transition-all duration-300 hover:brightness-110 hover:scale-105"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Controls (Auth + Hamburger) */}
        <div className="flex items-center gap-4 md:hidden">
          {userId ? (
            <UserButton
              afterSignOutUrl="/"
              appearance={{
                elements: {
                  avatarBox: "h-8 w-8 ring-1 ring-brand/20",
                }
              }}
            />
          ) : (
            <Link
              href="/sign-in"
              className="rounded-full bg-brand px-4 py-2 text-xs font-bold text-white shadow-md shadow-brand/20 transition-transform active:scale-95"
            >
              Login
            </Link>
          )}

          <button
            onClick={() => setOpen(!open)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-background/80 text-foreground backdrop-blur-md transition-colors hover:bg-brand/10 hover:text-brand"
            aria-label="Toggle menu"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "100vh", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute top-full left-0 w-full overflow-hidden bg-background md:hidden"
          >
            <div className="flex flex-col gap-4 px-6 py-8">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                >
                  {link.isRoute ? (
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="block text-2xl font-serif text-foreground"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="block text-2xl font-serif text-foreground"
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


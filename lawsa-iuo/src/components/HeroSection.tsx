"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { HugeiconsIcon } from "@hugeicons/react";
import { ArrowRight01Icon, UserAccountIcon } from "@hugeicons/core-free-icons";
import heroIllustration from "@/assets/hero-illustration.png";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-background pt-28 sm:pt-32 md:pt-40 lg:pt-48 pb-16 sm:pb-20 md:pb-24 lg:pb-32">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 right-0 -z-10 h-[300px] sm:h-[400px] md:h-[600px] w-[300px] sm:w-[400px] md:w-[600px] rounded-full bg-brand/5 blur-[80px] sm:blur-[100px] md:blur-[120px] filter animate-pulse-slow" />
      <div className="absolute bottom-0 left-0 -z-10 h-[200px] sm:h-[300px] md:h-[400px] w-[200px] sm:w-[300px] md:w-[400px] rounded-full bg-brand/3 blur-[60px] sm:blur-[80px] md:blur-[100px] filter" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10 h-[400px] sm:h-[600px] md:h-[800px] w-[400px] sm:w-[600px] md:w-[800px] rounded-full bg-gradient-radial from-brand/5 via-transparent to-transparent" />

      <div className="container mx-auto grid items-center gap-8 sm:gap-12 px-4 sm:px-5 lg:grid-cols-2 lg:gap-20 lg:px-8">
        {/* Left — Text */}
        <div className="max-w-2xl text-center lg:text-left order-2 lg:order-1">
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mb-4 sm:mb-6 inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/5 px-3 sm:px-4 py-1.5 text-[10px] sm:text-xs font-semibold uppercase tracking-widest text-brand"
          >
            <motion.span 
              className="h-1.5 w-1.5 rounded-full bg-brand"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            Excellence in Legal Education
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mb-4 sm:mb-8 font-display text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-[1.1] text-foreground"
          >
            Learn Law at <br className="hidden sm:block" />
            <motion.span 
              className="bg-gradient-to-r from-brand via-brand to-brand-light bg-clip-text text-transparent"
              initial={{ backgroundPosition: "0% 50%" }}
              animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
              transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              style={{ backgroundSize: "200% 200%" }}
            >
              Your Own Pace.
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.25 }}
            className="mx-auto lg:mx-0 mb-6 sm:mb-10 max-w-lg text-sm sm:text-base md:text-lg leading-relaxed text-muted-foreground px-2 sm:px-0"
          >
            Access comprehensive legal resources, case summaries, and lecture notes tailored for Igbinedion University students. Anywhere, anytime.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-col sm:flex-row justify-center lg:justify-start gap-3 sm:gap-4"
          >
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/sign-up"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-brand px-6 sm:px-8 py-3 sm:py-4 text-sm font-semibold text-white shadow-xl shadow-brand/30 transition-all duration-300 hover:shadow-brand/50 hover:bg-brand-dim"
              >
                Join Now — Create Account
                <HugeiconsIcon icon={ArrowRight01Icon} className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/sign-in"
                className="group inline-flex items-center justify-center gap-2 rounded-full border-2 border-brand bg-background px-6 sm:px-8 py-3 sm:py-4 text-sm font-semibold text-brand transition-all duration-300 hover:bg-brand hover:text-white shadow-lg"
              >
                <HugeiconsIcon icon={UserAccountIcon} className="w-4 h-4" />
                Login to Study
              </Link>
            </motion.div>
          </motion.div>
        </div>

        {/* Right — Illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, x: 50 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="relative flex justify-center order-1 lg:order-2"
        >
          {/* Decorative frame */}
          <motion.div 
            className="absolute inset-4 sm:inset-6 rounded-[1.5rem] sm:rounded-[2rem] border-2 border-brand/20"
            animate={{ rotate: [6, 8, 6] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          />
          <div className="relative overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] border border-border bg-gradient-to-br from-secondary to-background p-4 sm:p-8 shadow-2xl">
            <Image
              src={heroIllustration}
              alt="Student studying law"
              className="relative z-10 w-full max-w-[200px] sm:max-w-sm drop-shadow-2xl transition-transform duration-500 hover:scale-105"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;

"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import heroIllustration from "@/assets/hero-illustration.png";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-background pt-32 pb-20 sm:pt-40 sm:pb-24 lg:pt-48 lg:pb-32">
      {/* Abstract Background Shapes */}
      <div className="absolute top-0 right-0 -z-10 h-[600px] w-[600px] rounded-full bg-brand/5 blur-[120px] filter" />
      <div className="absolute bottom-0 left-0 -z-10 h-[400px] w-[400px] rounded-full bg-primary/5 blur-[100px] filter" />

      <div className="container mx-auto grid items-center gap-12 px-5 sm:px-6 lg:grid-cols-2 lg:gap-20 lg:px-8">
        {/* Left — Text */}
        <div className="max-w-2xl text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand/30 bg-brand/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-brand"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-brand animate-pulse" />
            Excellence in Legal Education
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="mb-8 font-serif text-5xl leading-[1.1] text-foreground sm:text-6xl md:text-7xl lg:text-8xl"
          >
            Learn Law at <br />
            <span className="bg-gradient-to-r from-primary via-brand to-brand-light bg-clip-text text-transparent">
              Your Own Pace.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mx-auto mb-10 max-w-lg text-lg leading-relaxed text-muted-foreground lg:mx-0"
          >
            Access comprehensive legal resources, case summaries, and lecture notes tailored for Igbinedion University students. Anywhere, anytime.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col justify-center gap-4 sm:flex-row lg:justify-start"
          >
            <Link
              href="/sign-up"
              className="inline-flex items-center justify-center rounded-full bg-brand px-8 py-4 text-sm font-bold text-white shadow-xl shadow-brand/30 transition-all duration-300 hover:brightness-110 hover:scale-105 active:scale-95"
            >
              Join Now — Create Account
            </Link>
            <Link
              href="/sign-in"
              className="inline-flex items-center justify-center rounded-full border-2 border-brand bg-white px-8 py-4 text-sm font-bold text-brand transition-all duration-300 hover:bg-brand hover:text-white shadow-lg active:scale-95"
            >
              Login to Study
            </Link>
          </motion.div>
        </div>

        {/* Right — Illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
          className="relative order-first flex justify-center lg:order-last"
        >
          {/* Decorative frame */}
          <div className="absolute inset-4 rounded-[2rem] border-2 border-brand/20 rotate-6 transform" />
          <div className="relative overflow-hidden rounded-[2rem] border border-border bg-gradient-to-br from-secondary to-background p-8 shadow-2xl">
            <Image
              src={heroIllustration}
              alt="Student studying law"
              className="relative z-10 w-full max-w-sm drop-shadow-2xl transition-transform duration-500 hover:scale-105"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};


export default HeroSection;


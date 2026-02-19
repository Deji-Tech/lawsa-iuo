"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { Moon02Icon, Sun03Icon } from "@hugeicons/core-free-icons";
import { useTheme } from "next-themes";

export default function DashboardTopBar() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed top-0 right-0 z-50 p-4 md:p-6"
    >
      {/* Theme Toggle - Only element in top bar now */}
      <motion.button
        whileHover={{ scale: 1.1, rotate: 15 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleTheme}
        className="flex h-10 w-10 items-center justify-center rounded-full bg-background/80 backdrop-blur-md border border-border hover:bg-brand/10 hover:border-brand/30 transition-all shadow-sm"
        aria-label="Toggle theme"
      >
        {mounted && (
          <HugeiconsIcon 
            icon={theme === "dark" ? Sun03Icon : Moon02Icon} 
            className="w-5 h-5 text-foreground" 
          />
        )}
      </motion.button>
    </motion.div>
  );
}

"use client";

import { motion } from "framer-motion";
import { Scale } from "lucide-react";

export default function Loading() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="text-center"
            >
                {/* Animated Logo */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="inline-flex items-center justify-center h-16 w-16 rounded-xl bg-brand text-white shadow-lg mb-4"
                >
                    <Scale size={32} />
                </motion.div>
                
                {/* Loading Text */}
                <h2 className="text-xl font-serif font-semibold text-foreground mb-2">
                    Loading...
                </h2>
                <p className="text-sm text-muted-foreground">
                    Preparing your legal resources
                </p>
                
                {/* Progress Bar */}
                <div className="mt-6 w-48 h-1 bg-secondary rounded-full overflow-hidden mx-auto">
                    <motion.div
                        className="h-full bg-brand rounded-full"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                    />
                </div>
            </motion.div>
        </div>
    );
}

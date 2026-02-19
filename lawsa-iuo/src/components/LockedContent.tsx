import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import Link from "next/link";

const LockedContent = () => {
    return (
        <div className="relative w-full overflow-hidden rounded-xl border border-border bg-card/50 p-8 md:p-12">
            {/* Blurred Content Placeholder (Shimmer Effect) */}
            <div className="absolute inset-0 -z-10 flex flex-col gap-4 p-8 opacity-20 blur-sm select-none pointer-events-none">
                <div className="h-8 w-3/4 rounded-md bg-muted animate-pulse" />
                <div className="h-4 w-full rounded-md bg-muted animate-pulse delay-75" />
                <div className="h-4 w-5/6 rounded-md bg-muted animate-pulse delay-100" />
                <div className="h-4 w-full rounded-md bg-muted animate-pulse delay-150" />
                <div className="h-32 w-full rounded-md bg-muted animate-pulse delay-200" />
            </div>

            {/* Glass Overlay */}
            <div className="absolute inset-0 bg-background/40 backdrop-blur-md" />

            {/* Lock UI */}
            <motion.div
                initial={{ scale: 0.8, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                transition={{ type: "spring", stiffness: 260, damping: 20 }}
                className="relative z-10 flex flex-col items-center justify-center text-center"
            >
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-brand/10 text-brand ring-4 ring-brand/5">
                    <Lock size={32} />
                </div>

                <h3 className="mb-2 font-serif text-2xl text-foreground">
                    Premium Content Locked
                </h3>
                <p className="mb-6 max-w-sm text-muted-foreground">
                    Sign in to access this lecture note and track your study progress.
                </p>

                <Link href="/sign-in">
                    <button className="group relative inline-flex h-11 items-center justify-center overflow-hidden rounded-full bg-brand px-8 font-medium text-white transition-all duration-300 hover:bg-brand-dim hover:ring-2 hover:ring-brand hover:ring-offset-2 hover:ring-offset-background">
                        <span className="mr-2">Unlock Now</span>
                        <Lock size={16} className="transition-transform group-hover:rotate-12" />
                        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:animate-shimmer" />
                    </button>
                </Link>

                <p className="mt-4 text-xs text-muted-foreground">
                    Secure access via Supabase authentication.
                </p>
            </motion.div>
        </div>
    );
};

export default LockedContent;

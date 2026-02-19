"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertCircle, RefreshCcw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    useEffect(() => {
        // Log error to monitoring service
        console.error("Application Error:", error);
    }, [error]);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center max-w-md"
            >
                {/* Error Icon */}
                <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-destructive/10 text-destructive mb-6">
                    <AlertCircle size={32} />
                </div>

                {/* Error Content */}
                <h1 className="text-3xl font-serif font-bold text-foreground mb-4">
                    Something Went Wrong
                </h1>
                <p className="text-muted-foreground mb-2">
                    We apologize for the inconvenience. An unexpected error has occurred.
                </p>
                
                {error.message && (
                    <p className="text-xs text-muted-foreground/60 mb-8 font-mono bg-muted p-2 rounded">
                        {error.message}
                    </p>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button 
                        onClick={reset}
                        className="bg-brand hover:bg-brand-dim text-white rounded-full px-8"
                    >
                        <RefreshCcw className="mr-2" size={18} />
                        Try Again
                    </Button>
                    <Link href="/">
                        <Button variant="outline" className="rounded-full px-8 border-brand text-brand hover:bg-brand/10">
                            <Home className="mr-2" size={18} />
                            Go Home
                        </Button>
                    </Link>
                </div>

                {/* Error Digest */}
                {error.digest && (
                    <p className="mt-8 text-xs text-muted-foreground">
                        Error ID: {error.digest}
                    </p>
                )}
            </motion.div>
        </div>
    );
}

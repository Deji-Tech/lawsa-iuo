import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Scale, Home, ArrowLeft, BookOpen } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
            <div className="text-center max-w-md">
                {/* Logo */}
                <Link href="/" className="inline-flex items-center gap-2 mb-8 group">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand text-white shadow-lg transition-transform group-hover:scale-105">
                        <Scale size={24} />
                    </div>
                    <span className="font-serif text-2xl font-bold text-foreground">
                        LAWSA<span className="text-brand">.IUO</span>
                    </span>
                </Link>

                {/* 404 Icon */}
                <div className="relative mb-8">
                    <div className="text-9xl font-serif font-bold text-brand/10">404</div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <BookOpen size={64} className="text-brand" />
                    </div>
                </div>

                {/* Content */}
                <h1 className="text-3xl font-serif font-bold text-foreground mb-4">
                    Page Not Found
                </h1>
                <p className="text-muted-foreground mb-8 leading-relaxed">
                    The page you are looking for seems to have been misplaced in our legal archives. 
                    It might have been moved, deleted, or never existed.
                </p>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="/">
                        <Button className="w-full sm:w-auto bg-brand hover:bg-brand-dim text-white rounded-full px-8 py-6 font-bold">
                            <Home className="mr-2" size={18} />
                            Back to Home
                        </Button>
                    </Link>
                    <Link href="/dashboard">
                        <Button variant="outline" className="w-full sm:w-auto rounded-full px-8 py-6 font-bold border-brand text-brand hover:bg-brand/10">
                            Go to Dashboard
                        </Button>
                    </Link>
                </div>

                {/* Help Text */}
                <div className="mt-12 pt-8 border-t border-border">
                    <p className="text-sm text-muted-foreground mb-2">Need help finding something?</p>
                    <Link 
                        href="/dashboard/steve" 
                        className="inline-flex items-center text-sm text-brand hover:text-brand-dim font-medium"
                    >
                        <ArrowLeft className="mr-1" size={14} />
                        Ask Professor Steve
                    </Link>
                </div>
            </div>
        </div>
    );
}

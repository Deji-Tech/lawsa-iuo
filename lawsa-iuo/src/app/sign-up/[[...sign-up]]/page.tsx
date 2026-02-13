import { SignUp } from "@clerk/nextjs";
import Link from "next/link";
import { Scale } from "lucide-react";

export default function Page() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-500/20 via-background to-background p-4">
            <Link href="/" className="mb-8 flex items-center gap-2 group">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-white shadow-lg transition-transform group-hover:scale-105">
                    <Scale size={20} />
                </div>
                <span className="font-serif text-2xl font-bold text-foreground">LAWSA<span className="text-brand">.IUO</span></span>
            </Link>

            <div className="w-full max-w-[400px]">
                <SignUp appearance={{
                    elements: {
                        rootBox: "w-full",
                        card: "shadow-xl border border-border/50 bg-card/80 backdrop-blur-xl w-full rounded-3xl",
                        headerTitle: "text-foreground font-serif font-bold text-xl",
                        headerSubtitle: "text-muted-foreground",
                        formButtonPrimary: "bg-brand hover:bg-brand-dim text-white !shadow-none",
                        footerActionLink: "text-brand hover:text-brand-dim font-bold",
                    }
                }} />
            </div>
        </div>
    );
}

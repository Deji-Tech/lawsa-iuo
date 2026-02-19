import SignUpForm from "@/components/auth/SignUpForm";
import Link from "next/link";
import { Scale } from "lucide-react";

export const metadata = {
  title: "Sign Up - LAWSA-IUO",
  description: "Create your LAWSA-IUO account and start your legal education journey",
};

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-brand/10 via-background to-background p-4">
      <Link 
        href="/" 
        className="mb-8 flex items-center gap-3 group"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand text-white shadow-lg shadow-brand/20 transition-all duration-300 group-hover:scale-105 group-hover:shadow-brand/30">
          <Scale size={24} />
        </div>
        <div className="flex flex-col">
          <span className="font-serif text-2xl font-bold text-foreground leading-none">
            LAWSA<span className="text-brand">.</span>IUO
          </span>
          <span className="text-[10px] text-muted-foreground tracking-wider uppercase">
            Legal Education Portal
          </span>
        </div>
      </Link>

      <SignUpForm />
      
      <p className="mt-8 text-center text-sm text-muted-foreground max-w-sm">
        By creating an account, you agree to our{" "}
        <Link href="#" className="text-brand hover:underline">
          Terms of Service
        </Link>{" "}
        and{" "}
        <Link href="#" className="text-brand hover:underline">
          Privacy Policy
        </Link>
      </p>
    </div>
  );
}

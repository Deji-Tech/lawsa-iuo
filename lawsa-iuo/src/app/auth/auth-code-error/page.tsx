import Link from "next/link";
import { Scale, AlertCircle } from "lucide-react";

export default function AuthCodeError() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="flex items-center gap-2 mb-8">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand text-white shadow-lg">
          <Scale size={20} />
        </div>
        <span className="font-serif text-2xl font-bold text-foreground">
          LAWSA<span className="text-brand">.IUO</span>
        </span>
      </div>

      <div className="max-w-md text-center">
        <div className="flex justify-center mb-4">
          <AlertCircle size={48} className="text-destructive" />
        </div>
        <h1 className="text-2xl font-bold text-foreground mb-2">
          Authentication Error
        </h1>
        <p className="text-muted-foreground mb-6">
          There was a problem authenticating your account. This could be due to an expired or invalid authentication code.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/sign-in"
            className="inline-flex items-center justify-center rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white shadow-lg hover:bg-brand-dim transition-all"
          >
            Try Again
          </Link>
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full border border-border px-6 py-3 text-sm font-semibold text-foreground hover:bg-muted transition-all"
          >
            Go Home
          </Link>
        </div>
      </div>
    </div>
  );
}

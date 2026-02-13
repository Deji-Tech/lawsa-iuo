"use client";

import { Scale } from "lucide-react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer id="about" className="border-t border-border bg-background py-16">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-3">
          {/* Brand */}
          <div>
            <div className="mb-3 flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                <Scale size={14} className="text-primary-foreground" />
              </div>
              <span className="font-serif text-lg text-foreground">LAWSA-IUO</span>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">
              A legal education portal for Nigerian law students at Igbinedion University, Okada.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-foreground">
              Levels
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {["100L", "200L", "300L", "400L", "500L"].map((level) => (
                <li key={level}>
                  <Link href={`/level/${level.replace("L", "").toLowerCase()}`} className="transition-colors hover:text-foreground">
                    {level} Curriculum
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div id="contact">
            <h4 className="mb-3 text-sm font-semibold uppercase tracking-wider text-foreground">
              Contact
            </h4>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Igbinedion University, Okada<br />
              Edo State, Nigeria
            </p>
          </div>
        </div>

        <div className="mt-12 border-t border-border pt-6 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} LAWSA-IUO. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
    title: "LAWSA-IUO | Legal EdTech Platform for Nigerian Law Students",
    description: "Access comprehensive legal resources, case summaries, lecture notes, and CBT practice tests tailored for Igbinedion University law students. Prepare for your legal career with LAWSA-IUO.",
    keywords: ["law education", "Nigerian law", "Igbinedion University", "legal studies", "CBT practice", "law notes", "LAWSA"],
    authors: [{ name: "LAWSA-IUO" }],
    icons: {
        icon: [
            { url: "/icon.svg", type: "image/svg+xml" },
        ],
        apple: [
            { url: "/apple-icon.png", sizes: "180x180" },
        ],
    },
    manifest: "/manifest.json",
    openGraph: {
        title: "LAWSA-IUO | Legal EdTech Platform",
        description: "Excellence in Legal Education for Nigerian Law Students",
        type: "website",
        locale: "en_NG",
    },
    twitter: {
        card: "summary_large_image",
        title: "LAWSA-IUO | Legal EdTech Platform",
        description: "Excellence in Legal Education for Nigerian Law Students",
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
            <body className="font-sans antialiased">
                <AuthProvider>
                    <ThemeProvider
                        attribute="class"
                        defaultTheme="light"
                        enableSystem={false}
                        disableTransitionOnChange={false}
                    >
                        {children}
                    </ThemeProvider>
                </AuthProvider>
            </body>
        </html>
    );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
    BookOpen,
    GraduationCap,
    Library,
    LayoutDashboard,
    ChevronLeft,
    ChevronRight,
    Menu,
    X,
    Sparkles
} from "lucide-react";
import { UserButton, useUser } from "@clerk/nextjs";
import { cn } from "@/lib/utils";

const navItems = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "My Materials", href: "/dashboard/materials", icon: BookOpen },
    { name: "Law CBT", href: "/dashboard/cbt", icon: GraduationCap },
    { name: "Statute Library", href: "/dashboard/library", icon: Library },
    { name: "Professor Steve", href: "/dashboard/steve", icon: Sparkles },
];

export default function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const pathname = usePathname();
    const { user } = useUser();

    return (
        <>
            {/* --- Mobile View: Top Header & Bottom Nav --- */}
            <div className="md:hidden">
                {/* Mobile Top Header */}
                <header className="fixed top-0 left-0 right-0 z-30 flex h-16 items-center justify-between border-b border-border/50 bg-background/80 px-4 backdrop-blur-md">
                    <span className="font-serif text-lg font-bold text-brand">
                        LAWSA<span className="text-foreground">.Lab</span>
                    </span>
                    <UserButton afterSignOutUrl="/" />
                </header>

                {/* Mobile Bottom Nav */}
                <nav className="fixed bottom-0 left-0 right-0 z-30 flex h-16 items-center justify-around border-t border-border/50 bg-background/90 px-2 backdrop-blur-md">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex flex-col items-center justify-center gap-1 rounded-lg p-2 transition-all",
                                    isActive ? "text-brand" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <item.icon size={20} className={cn(isActive && "fill-brand/20")} />
                                <span className="text-[10px] font-medium">{item.name.replace("My ", "").replace("Statute ", "")}</span>
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* --- Desktop View: Persistent Sidebar --- */}
            <motion.aside
                initial={false}
                animate={{ width: isCollapsed ? "80px" : "280px" }}
                className="hidden md:flex relative flex-col h-screen border-r border-border bg-card/50 backdrop-blur-xl transition-all duration-300 ease-in-out z-20"
            >
                {/* Header / Logo Area */}
                <div className="flex h-20 items-center px-6 border-b border-border/40">
                    {!isCollapsed && (
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-xl font-serif font-bold text-brand tracking-tight"
                        >
                            LAWSA <span className="text-foreground">App</span>
                        </motion.span>
                    )}
                    <button
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="absolute -right-3 top-7 flex h-6 w-6 items-center justify-center rounded-full bg-brand text-white shadow-lg shadow-brand/20 hover:scale-110 transition-transform"
                    >
                        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
                    </button>
                </div>

                {/* User Status / Level */}
                {!isCollapsed && (
                    <div className="p-6">
                        <div className="rounded-2xl bg-brand/5 border border-brand/10 p-4">
                            <p className="text-[10px] uppercase tracking-widest text-brand font-bold mb-1">Authenticated</p>
                            <p className="text-sm font-semibold truncate">{user?.fullName || "Law Student"}</p>
                            <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-brand px-2.5 py-0.5 text-[10px] font-bold text-white">
                                300L • IUO Student
                            </div>
                        </div>
                    </div>
                )}

                {/* Navigation */}
                <nav className="flex-1 space-y-2 p-4">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    "flex items-center gap-4 rounded-xl px-4 py-3 transition-all",
                                    isActive
                                        ? "bg-brand text-white shadow-lg shadow-brand/20"
                                        : "text-muted-foreground hover:bg-brand/10 hover:text-brand"
                                )}
                            >
                                <item.icon size={20} />
                                {!isCollapsed && <span className="font-medium">{item.name}</span>}
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer / Profile */}
                <div className="p-4 border-t border-border/40">
                    <div className={`flex items-center ${isCollapsed ? "justify-center" : "gap-4"} px-2`}>
                        <UserButton afterSignOutUrl="/" />
                        {!isCollapsed && (
                            <div className="flex flex-col">
                                <span className="text-xs font-bold truncate">Manage Account</span>
                                <span className="text-[10px] text-muted-foreground">Premium Member</span>
                            </div>
                        )}
                    </div>
                </div>
            </motion.aside>
        </>
    );
}

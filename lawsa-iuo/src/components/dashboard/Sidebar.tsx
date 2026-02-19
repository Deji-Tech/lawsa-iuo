"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
    DashboardSquare01Icon,
    BookOpen01Icon,
    GraduationScrollIcon,
    LibraryIcon,
    ArtificialIntelligence01Icon,
    ArrowLeft01Icon,
    ArrowRight01Icon,
    Logout01Icon,
    UserAccountIcon,
    Edit01Icon,
    Cancel01Icon,
    TelephoneIcon,
    GraduationScrollIcon as LevelIcon
} from "@hugeicons/core-free-icons";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import ProfileCompletionModal from "@/components/auth/ProfileCompletionModal";

const navItems = [
    { name: "Overview", href: "/dashboard", icon: DashboardSquare01Icon },
    { name: "My Materials", href: "/dashboard/materials", icon: BookOpen01Icon },
    { name: "Law CBT", href: "/dashboard/cbt", icon: GraduationScrollIcon },
    { name: "Statute Library", href: "/dashboard/library", icon: LibraryIcon },
    { name: "Professor Steve", href: "/dashboard/steve", icon: ArtificialIntelligence01Icon },
];

const desktopNavItems = [
    ...navItems
];

export default function Sidebar() {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [showDesktopProfileModal, setShowDesktopProfileModal] = useState(false);
    const pathname = usePathname();
    const { profile, user, refreshProfile, isProfileComplete } = useAuth();
    const router = useRouter();
    const supabase = createClient();

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.push("/");
        router.refresh();
    };

    const getInitials = (name: string | null | undefined): string => {
        if (!name) return "U";
        return name
            .split(" ")
            .map((n) => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2);
    };

    const getDisplayName = (): string => {
        if (profile?.full_name) return profile.full_name;
        if (user?.email) return user.email.split('@')[0];
        return "User";
    };

    const getDisplayLevel = (): string => {
        if (profile?.level) return profile.level;
        return "Level not set";
    };

    return (
        <>
            {/* --- Mobile View: Top Header & Bottom Nav --- */}
            <div className="md:hidden">
                {/* Mobile Top Header */}
                <motion.header 
                    initial={{ y: -100 }}
                    animate={{ y: 0 }}
                    className="fixed top-0 left-0 right-0 z-30 flex h-16 items-center justify-between border-b border-border/50 bg-background/80 px-4 backdrop-blur-md"
                >
                    <span className="font-display text-lg font-bold text-brand">
                        LAWSA<span className="text-foreground">.IUO</span>
                    </span>
                </motion.header>

                {/* Mobile Bottom Nav */}
                <nav className="fixed bottom-0 left-0 right-0 z-30 flex h-16 items-center justify-around border-t border-border/50 bg-background/90 px-2 backdrop-blur-md">
                    {navItems.map((item, index) => {
                        const isActive = pathname === item.href;
                        return (
                            <motion.div
                                key={item.href}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "flex flex-col items-center justify-center gap-1 rounded-lg p-2 transition-all",
                                        isActive ? "text-brand" : "text-muted-foreground hover:text-foreground"
                                    )}
                                >
                                    <HugeiconsIcon 
                                        icon={item.icon} 
                                        className={cn("w-5 h-5", isActive && "text-brand")} 
                                    />
                                    <span className="text-[10px] font-medium">{item.name.replace("My ", "").replace("Statute ", "")}</span>
                                </Link>
                            </motion.div>
                        );
                    })}
                    {/* Profile Button */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                    >
                        <button
                            onClick={() => setShowProfileModal(true)}
                            className="flex flex-col items-center justify-center gap-1 rounded-lg p-2 transition-all text-muted-foreground hover:text-foreground"
                        >
                            <div className="w-5 h-5 rounded-full bg-brand text-white flex items-center justify-center text-[10px] font-semibold">
                                {getInitials(profile?.full_name)}
                            </div>
                            <span className="text-[10px] font-medium">Profile</span>
                        </button>
                    </motion.div>
                </nav>

                {/* Profile Modal */}
                <ProfileCompletionModal
                    isOpen={showProfileModal}
                    onClose={() => setShowProfileModal(false)}
                    userId={user?.id || ""}
                    onComplete={refreshProfile}
                    existingProfile={profile}
                    mode={isProfileComplete ? "edit" : "complete"}
                />
            </div>

            {/* --- Desktop View: Persistent Sidebar --- */}
            <motion.aside
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="hidden md:flex relative flex-col h-screen border-r border-border bg-card/50 backdrop-blur-xl z-20"
                style={{ width: isCollapsed ? "80px" : "280px" }}
            >
                {/* Header / Logo Area */}
                <div className="flex h-20 items-center px-6 border-b border-border/40">
                    <AnimatePresence mode="wait">
                        {!isCollapsed && (
                            <motion.span
                                key="logo"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="text-xl font-display font-bold text-brand tracking-tight"
                            >
                                LAWSA <span className="text-foreground">IUO</span>
                            </motion.span>
                        )}
                    </AnimatePresence>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setIsCollapsed(!isCollapsed)}
                        className="absolute -right-3 top-7 flex h-6 w-6 items-center justify-center rounded-full bg-brand text-white shadow-lg shadow-brand/20 transition-transform"
                    >
                        <HugeiconsIcon 
                            icon={isCollapsed ? ArrowRight01Icon : ArrowLeft01Icon} 
                            className="w-3 h-3" 
                        />
                    </motion.button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-2 p-4">
                    {desktopNavItems.map((item, index) => {
                        const isActive = pathname === item.href;
                        return (
                            <motion.div
                                key={item.href}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-4 rounded-xl px-4 py-3 transition-all duration-300",
                                        isActive
                                            ? "bg-brand text-white shadow-lg shadow-brand/20"
                                            : "text-muted-foreground hover:bg-brand/10 hover:text-brand"
                                    )}
                                >
                                    <HugeiconsIcon icon={item.icon} className="w-5 h-5 flex-shrink-0" />
                                    <AnimatePresence>
                                        {!isCollapsed && (
                                            <motion.span
                                                initial={{ opacity: 0, width: 0 }}
                                                animate={{ opacity: 1, width: "auto" }}
                                                exit={{ opacity: 0, width: 0 }}
                                                className="font-medium whitespace-nowrap"
                                            >
                                                {item.name}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                    {isActive && !isCollapsed && (
                                        <motion.div
                                            layoutId="activeIndicator"
                                            className="ml-auto w-1.5 h-1.5 rounded-full bg-white"
                                        />
                                    )}
                                </Link>
                            </motion.div>
                        );
                    })}
                </nav>

                {/* Footer / Profile */}
                <div className="p-4 border-t border-border/40">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setShowDesktopProfileModal(true)}
                        className={cn("w-full flex items-center gap-3 p-2 rounded-xl hover:bg-muted/50 transition-all", isCollapsed ? "justify-center" : "justify-start")}
                    >
                        {/* Avatar - Always visible */}
                        <div className="relative">
                            <div className="h-10 w-10 rounded-full bg-brand text-white flex items-center justify-center font-semibold text-sm overflow-hidden ring-2 ring-white/50">
                                {profile?.avatar_url ? (
                                    <img
                                        src={profile.avatar_url}
                                        alt={profile.full_name || "User"}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <span>{getInitials(profile?.full_name)}</span>
                                )}
                            </div>
                        </div>
                        
                        {/* Name and Level - Only when expanded */}
                        <AnimatePresence>
                            {!isCollapsed && (
                                <motion.div
                                    initial={{ opacity: 0, width: 0 }}
                                    animate={{ opacity: 1, width: "auto" }}
                                    exit={{ opacity: 0, width: 0 }}
                                    className="flex-1 min-w-0 overflow-hidden text-left"
                                >
                                    <p className="text-sm font-semibold truncate">{profile?.full_name || "Law Student"}</p>
                                    <p className="text-xs text-muted-foreground">{profile?.level || "Student"}</p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.button>
                </div>

                {/* Desktop Profile Modal */}
                <ProfileCompletionModal
                    isOpen={showDesktopProfileModal}
                    onClose={() => setShowDesktopProfileModal(false)}
                    userId={user?.id || ""}
                    onComplete={() => {
                        refreshProfile();
                        setShowDesktopProfileModal(false);
                    }}
                    existingProfile={profile}
                    mode={isProfileComplete ? "edit" : "complete"}
                />
            </motion.aside>
        </>
    );
}

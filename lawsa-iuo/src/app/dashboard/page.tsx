"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  ArtificialIntelligence01Icon, 
  ArrowRight01Icon, 
  BookOpen01Icon, 
  GraduationScrollIcon, 
  Clock01Icon, 
  FireIcon, 
  Analytics01Icon,
  Loading03Icon
} from "@hugeicons/core-free-icons";
import Link from "next/link";
import { useAuth } from "@/contexts/AuthContext";
import ProfileCompletionModal from "@/components/auth/ProfileCompletionModal";
import { getUserDashboardStats, getUserCBTAttempts, logUserActivity } from "@/lib/api";
import { toast } from "sonner";

interface DashboardStats {
  studyHours: number;
  cbtAverage: number;
  modulesRead: number;
  totalModules: number;
  streak: number;
  longestStreak: number;
}

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.6,
            ease: "easeOut" as const
        }
    }
};

export default function DashboardPage() {
    const { user, profile, refreshProfile } = useAuth();
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [hasCheckedProfile, setHasCheckedProfile] = useState(false);
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [isLoadingStats, setIsLoadingStats] = useState(true);
    const [recentAttempts, setRecentAttempts] = useState(0);

    // Check if profile is complete on mount
    useEffect(() => {
        if (!hasCheckedProfile && profile) {
            const isComplete = profile?.full_name && profile?.phone_number && profile?.level;
            if (!isComplete) {
                setShowProfileModal(true);
            }
            setHasCheckedProfile(true);
        }
    }, [profile, hasCheckedProfile]);

    // Load user stats
    useEffect(() => {
        const loadStats = async () => {
            if (!user || !profile?.level) return;
            
            try {
                setIsLoadingStats(true);
                const dashboardStats = await getUserDashboardStats(user.id, profile.level);
                setStats(dashboardStats);
                
                // Log activity
                await logUserActivity(user.id, 'dashboard_viewed', {
                    timestamp: new Date().toISOString(),
                });
            } catch (error) {
                console.error("Error loading dashboard stats:", error);
                toast.error("Failed to load some statistics");
            } finally {
                setIsLoadingStats(false);
            }
        };

        loadStats();
    }, [user, profile?.level]);

    // Load recent CBT attempts
    useEffect(() => {
        const loadAttempts = async () => {
            if (!user) return;
            
            try {
                const attempts = await getUserCBTAttempts(user.id, 5);
                setRecentAttempts(attempts.length);
            } catch (error) {
                console.error("Error loading CBT attempts:", error);
            }
        };

        loadAttempts();
    }, [user]);

    const getFirstName = () => {
        if (profile?.full_name) {
            return profile.full_name.split(' ')[0];
        }
        return "Future Counsel";
    };

    const getUserLevel = () => {
        return profile?.level || "100L";
    };

    const getCourseProgress = () => {
        if (!stats || stats.totalModules === 0) return 0;
        return Math.round((stats.modulesRead / stats.totalModules) * 100);
    };

    const statItems = [
        { 
            label: "Study Hours", 
            value: isLoadingStats ? "-" : (stats?.studyHours || 0).toString(), 
            suffix: "h", 
            icon: Clock01Icon, 
            color: "text-blue-500", 
            bg: "bg-blue-500/10" 
        },
        { 
            label: "CBT Average", 
            value: isLoadingStats ? "-" : (stats?.cbtAverage || 0).toString(), 
            suffix: "%", 
            icon: Analytics01Icon, 
            color: "text-green-500", 
            bg: "bg-green-500/10" 
        },
        { 
            label: "Modules Read", 
            value: isLoadingStats ? "-" : `${stats?.modulesRead || 0}`, 
            suffix: `/${stats?.totalModules || 0}`, 
            icon: BookOpen01Icon, 
            color: "text-purple-500", 
            bg: "bg-purple-500/10" 
        },
        { 
            label: "Streak", 
            value: isLoadingStats ? "-" : (stats?.streak || 0).toString(), 
            suffix: " Days", 
            icon: FireIcon, 
            color: "text-orange-500", 
            bg: "bg-orange-500/10" 
        },
    ];

    return (
        <>
            <motion.div 
                className="space-y-4 sm:space-y-8"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Welcome Hero */}
                <motion.div
                    variants={itemVariants}
                    className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-brand to-brand-dim p-4 sm:p-8 md:p-12 text-white shadow-2xl shadow-brand/20"
                >
                    <div className="relative z-10 max-w-2xl">
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3, duration: 0.6 }}
                        >
                            <h1 className="mb-2 sm:mb-3 font-display text-xl sm:text-3xl md:text-5xl leading-tight">
                                Welcome back, <span className="opacity-90">{getFirstName()}.</span>
                            </h1>
                            <p className="mb-4 sm:mb-8 text-sm sm:text-base md:text-lg opacity-90 leading-relaxed max-w-lg">
                                Your legal studies ecosystem is ready. Track your progress, challenge your memory in the CBT center, or consult Professor Steve for contextual insights.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.6 }}
                            className="flex flex-col sm:flex-row gap-2 sm:gap-4"
                        >
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Link href="/dashboard/materials">
                                    <Button className="bg-white text-brand hover:bg-blue-50 rounded-full h-10 sm:h-12 px-4 sm:px-8 font-semibold shadow-lg shadow-black/10 transition-all text-sm sm:text-base w-full sm:w-auto">
                                        Continue Studying
                                    </Button>
                                </Link>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Link href="/dashboard/cbt">
                                    <Button className="bg-white/10 hover:bg-white/20 text-white border border-white/30 rounded-full h-10 sm:h-12 px-4 sm:px-8 backdrop-blur-sm transition-all w-full sm:w-auto text-sm sm:text-base">
                                        Take a Mock Exam
                                    </Button>
                                </Link>
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Abstract Background Shapes */}
                    <motion.div 
                        className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-white/10 to-transparent pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                    />
                    <motion.div 
                        className="absolute -right-10 sm:-right-20 -top-10 sm:-top-20 h-32 sm:h-64 w-32 sm:w-64 rounded-full bg-white/10 blur-3xl pointer-events-none"
                        animate={{ 
                            scale: [1, 1.2, 1],
                            opacity: [0.3, 0.5, 0.3]
                        }}
                        transition={{ duration: 4, repeat: Infinity }}
                    />
                    <motion.div 
                        className="absolute -right-5 sm:-right-10 bottom-0 h-24 sm:h-48 w-24 sm:w-48 rounded-full bg-white/10 blur-2xl pointer-events-none"
                        animate={{ 
                            scale: [1, 1.1, 1],
                            opacity: [0.2, 0.4, 0.2]
                        }}
                        transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                    />
                </motion.div>

                {/* Stats Row */}
                <motion.div 
                    className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4"
                    variants={containerVariants}
                >
                    {statItems.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            variants={itemVariants}
                            whileHover={{ y: -5, transition: { duration: 0.2 } }}
                        >
                            <Card className="p-3 sm:p-5 border-border/50 bg-card/80 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
                                <div className="flex items-center gap-2 sm:gap-3 mb-1.5 sm:mb-2">
                                    <motion.div 
                                        className={`p-1.5 sm:p-2 rounded-lg ${stat.bg} ${stat.color}`}
                                        whileHover={{ rotate: 5, scale: 1.1 }}
                                    >
                                        {isLoadingStats ? (
                                            <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                                                <HugeiconsIcon icon={Loading03Icon} className="w-4 h-4 sm:w-5 sm:h-5" />
                                            </motion.div>
                                        ) : (
                                            <HugeiconsIcon icon={stat.icon} className="w-4 h-4 sm:w-5 sm:h-5" />
                                        )}
                                    </motion.div>
                                    <span className="text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-wider">{stat.label}</span>
                                </div>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-xl sm:text-2xl font-bold font-display">{stat.value}</span>
                                    <span className="text-xs sm:text-sm text-muted-foreground font-medium">{stat.suffix}</span>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Quick Access Grid */}
                <motion.div 
                    className="grid gap-3 sm:gap-6 md:grid-cols-2 lg:grid-cols-3"
                    variants={containerVariants}
                >
                    {/* Materials Card */}
                    <motion.div variants={itemVariants}>
                        <Card className="h-full p-4 sm:p-6 hover:shadow-xl transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm group hover:-translate-y-1">
                            <div className="mb-3 sm:mb-4 flex flex-col gap-3 sm:gap-4">
                                <motion.div 
                                    className="flex h-10 sm:h-12 w-10 sm:w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300"
                                    whileHover={{ rotate: 5 }}
                                >
                                    <HugeiconsIcon icon={BookOpen01Icon} className="w-5 h-5 sm:w-6 sm:h-6" />
                                </motion.div>
                                <div>
                                    <h3 className="text-lg sm:text-xl font-display font-bold group-hover:text-blue-600 transition-colors">Your Materials</h3>
                                    <p className="mt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                                        Access your {getUserLevel()} curriculum notes.
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
                                <div className="flex justify-between text-[10px] sm:text-xs font-medium">
                                    <span className="text-muted-foreground">Course Completion</span>
                                    <span className="text-blue-600">{getCourseProgress()}%</span>
                                </div>
                                <Progress value={getCourseProgress()} className="h-1.5 sm:h-2 [&>div]:bg-blue-500" />
                            </div>

                            <Link href="/dashboard/materials">
                                <Button variant="ghost" className="w-full justify-between p-0 text-brand hover:bg-transparent group-hover:px-2 transition-all text-sm">
                                    View My Library 
                                    <HugeiconsIcon icon={ArrowRight01Icon} className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </Link>
                        </Card>
                    </motion.div>

                    {/* CBT Card */}
                    <motion.div variants={itemVariants}>
                        <Card className="h-full p-4 sm:p-6 hover:shadow-xl transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm group hover:-translate-y-1">
                            <div className="mb-3 sm:mb-4 flex flex-col gap-3 sm:gap-4">
                                <motion.div 
                                    className="flex h-10 sm:h-12 w-10 sm:w-12 items-center justify-center rounded-2xl bg-green-500/10 text-green-500 group-hover:bg-green-500 group-hover:text-white transition-colors duration-300"
                                    whileHover={{ rotate: 5 }}
                                >
                                    <HugeiconsIcon icon={GraduationScrollIcon} className="w-5 h-5 sm:w-6 sm:h-6" />
                                </motion.div>
                                <div>
                                    <h3 className="text-lg sm:text-xl font-display font-bold group-hover:text-green-600 transition-colors">CBT Center</h3>
                                    <p className="mt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                                        Prepare for exams with timed MCQs.
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-8">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3].map(i => (
                                        <motion.div 
                                            key={i} 
                                            className="h-6 sm:h-8 w-6 sm:w-8 rounded-full border-2 border-background bg-gray-100 flex items-center justify-center text-[8px] sm:text-[10px] font-bold text-gray-500"
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.1 * i }}
                                        >
                                            Law
                                        </motion.div>
                                    ))}
                                </div>
                                <span className="text-[10px] sm:text-xs text-muted-foreground">
                                    {recentAttempts > 0 ? `${recentAttempts} tests taken` : "+4 active modules"}
                                </span>
                            </div>

                            <Link href="/dashboard/cbt">
                                <Button variant="ghost" className="w-full justify-between p-0 text-green-600 hover:bg-transparent hover:text-green-700 group-hover:px-2 transition-all text-sm">
                                    Start CBT Session 
                                    <HugeiconsIcon icon={ArrowRight01Icon} className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </Link>
                        </Card>
                    </motion.div>

                    {/* Steve AI Card */}
                    <motion.div variants={itemVariants}>
                        <Card className="h-full p-4 sm:p-6 border-brand/20 bg-brand/5 backdrop-blur-sm group transition-all duration-300 hover:shadow-xl hover:shadow-brand/10 hover:-translate-y-1">
                            <div className="mb-3 sm:mb-4 flex flex-col gap-3 sm:gap-4">
                                <motion.div 
                                    className="flex h-10 sm:h-12 w-10 sm:w-12 items-center justify-center rounded-2xl bg-brand text-white shadow-lg shadow-brand/20"
                                    whileHover={{ rotate: 5, scale: 1.1 }}
                                >
                                    <HugeiconsIcon icon={ArtificialIntelligence01Icon} className="w-5 h-5 sm:w-6 sm:h-6" />
                                </motion.div>
                                <div>
                                    <h3 className="text-lg sm:text-xl font-display font-bold text-brand">Ask Steve</h3>
                                    <p className="mt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                                        Consult our AI for context on complex legal principles.
                                    </p>
                                </div>
                            </div>

                            <motion.div 
                                className="p-2 sm:p-3 rounded-xl bg-background/50 border border-brand/10 mb-4 sm:mb-6"
                                whileHover={{ scale: 1.02 }}
                            >
                                <p className="text-[10px] sm:text-xs text-muted-foreground italic">"What is the principle in Donoghue v Stevenson?"</p>
                            </motion.div>

                            <Link href="/dashboard/steve">
                                <Button variant="ghost" className="w-full justify-between p-0 text-brand hover:bg-transparent group-hover:px-2 transition-all text-sm">
                                    Open Chatbot 
                                    <HugeiconsIcon icon={ArrowRight01Icon} className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </Button>
                            </Link>
                        </Card>
                    </motion.div>
                </motion.div>
            </motion.div>

            <ProfileCompletionModal
                isOpen={showProfileModal}
                onClose={() => setShowProfileModal(false)}
                userId={user?.id || ""}
                onComplete={refreshProfile}
                existingProfile={profile}
                mode="complete"
            />
        </>
    );
}

"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Sparkles, ArrowRight, BookOpen, GraduationCap, Clock, Award, Flame, TrendingUp } from "lucide-react";
import Link from "next/link";

const stats = [
    { label: "Study Hours", value: "12.5", suffix: "h", icon: Clock, color: "text-blue-500", bg: "bg-blue-500/10" },
    { label: "CBT Average", value: "78", suffix: "%", icon: TrendingUp, color: "text-green-500", bg: "bg-green-500/10" },
    { label: "Modules Read", value: "8", suffix: "/12", icon: BookOpen, color: "text-purple-500", bg: "bg-purple-500/10" },
    { label: "Streak", value: "5", suffix: " Days", icon: Flame, color: "text-orange-500", bg: "bg-orange-500/10" },
];

export default function DashboardPage() {
    return (
        <div className="space-y-8">
            {/* Welcome Hero */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="relative overflow-hidden rounded-3xl bg-brand p-8 md:p-12 text-white shadow-2xl shadow-brand/20"
            >
                <div className="relative z-10 max-w-2xl">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h1 className="mb-3 font-serif text-3xl font-bold md:text-5xl leading-tight">
                            Welcome back, <span className="opacity-90">Future Counsel.</span>
                        </h1>
                        <p className="mb-8 text-base md:text-lg opacity-90 leading-relaxed max-w-lg">
                            Your legal studies ecosystem is ready. Track your progress, challenge your memory in the CBT center, or consult Professor Steve for contextual insights.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="flex flex-col sm:flex-row gap-4"
                    >
                        <Button className="bg-white text-brand hover:bg-blue-50 rounded-full h-12 px-8 font-bold shadow-lg shadow-black/10 transition-transform active:scale-95">
                            Continue Studying
                        </Button>
                        <Link href="/dashboard/cbt">
                            <Button variant="outline" className="border-white/30 hover:bg-white/10 text-white rounded-full h-12 px-8 backdrop-blur-sm transition-transform active:scale-95 w-full sm:w-auto">
                                Take a Mock Exam
                            </Button>
                        </Link>
                    </motion.div>
                </div>

                {/* Abstract Background Shapes */}
                <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-white/10 to-transparent pointer-events-none" />
                <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl pointer-events-none" />
                <div className="absolute -right-10 bottom-0 h-48 w-48 rounded-full bg-indigo-500/20 blur-2xl pointer-events-none" />
            </motion.div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat, i) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 * i + 0.3 }}
                    >
                        <Card className="p-5 border-border/50 bg-card/80 backdrop-blur-sm hover:shadow-md transition-all">
                            <div className="flex items-center gap-3 mb-2">
                                <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                                    <stat.icon size={18} />
                                </div>
                                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{stat.label}</span>
                            </div>
                            <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-bold font-serif">{stat.value}</span>
                                <span className="text-sm text-muted-foreground font-medium">{stat.suffix}</span>
                            </div>
                        </Card>
                    </motion.div>
                ))}
            </div>

            {/* Quick Access Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {/* Materials Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <Card className="h-full p-6 hover:shadow-xl transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm group hover:-translate-y-1">
                        <div className="mb-4 flex flex-col gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-blue-500 group-hover:bg-blue-500 group-hover:text-white transition-colors duration-300">
                                <BookOpen size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-serif font-bold group-hover:text-blue-600 transition-colors">Your Materials</h3>
                                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                                    Access your 300L curriculum notes.
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3 mb-6">
                            <div className="flex justify-between text-xs font-medium">
                                <span className="text-muted-foreground">Course Completion</span>
                                <span className="text-blue-600">65%</span>
                            </div>
                            <Progress value={65} className="h-2 bg-blue-500/10" indicatorClassName="bg-blue-500" />
                        </div>

                        <Button variant="ghost" className="w-full justify-between p-0 text-brand hover:bg-transparent group-hover:px-2 transition-all">
                            View My Library <ArrowRight size={16} />
                        </Button>
                    </Card>
                </motion.div>

                {/* CBT Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    <Card className="h-full p-6 hover:shadow-xl transition-all duration-300 border-border/50 bg-card/50 backdrop-blur-sm group hover:-translate-y-1">
                        <div className="mb-4 flex flex-col gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500/10 text-green-500 group-hover:bg-green-500 group-hover:text-white transition-colors duration-300">
                                <GraduationCap size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-serif font-bold group-hover:text-green-600 transition-colors">CBT Center</h3>
                                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                                    Prepare for exams with timed MCQs.
                                </p>
                            </div>
                        </div>

                        <div className="flex items-center gap-3 mb-8">
                            <div className="flex -space-x-2">
                                {[1, 2, 3].map(i => (
                                    <div key={i} className="h-8 w-8 rounded-full border-2 border-background bg-gray-100 flex items-center justify-center text-[10px] font-bold text-gray-500">
                                        Law
                                    </div>
                                ))}
                            </div>
                            <span className="text-xs text-muted-foreground">+4 active modules</span>
                        </div>

                        <Link href="/dashboard/cbt">
                            <Button variant="ghost" className="w-full justify-between p-0 text-green-600 hover:bg-transparent hover:text-green-700 group-hover:px-2 transition-all">
                                Start CBT Session <ArrowRight size={16} />
                            </Button>
                        </Link>
                    </Card>
                </motion.div>

                {/* Steve AI Card */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 }}
                >
                    <Card className="h-full p-6 border-brand/20 bg-brand/5 backdrop-blur-sm group transition-all duration-300 hover:shadow-xl hover:shadow-brand/10 hover:-translate-y-1">
                        <div className="mb-4 flex flex-col gap-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand text-white shadow-lg shadow-brand/20">
                                <Sparkles size={24} />
                            </div>
                            <div>
                                <h3 className="text-xl font-serif font-bold text-brand">Ask Steve</h3>
                                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                                    Consult our AI for context on complex legal principles.
                                </p>
                            </div>
                        </div>

                        <div className="p-3 rounded-xl bg-background/50 border border-brand/10 mb-6">
                            <p className="text-xs text-muted-foreground italic">"What is the principle in Donoghue v Stevenson?"</p>
                        </div>

                        <Button variant="ghost" className="w-full justify-between p-0 text-brand hover:bg-transparent group-hover:px-2 transition-all">
                            Open Chatbot <ArrowRight size={16} />
                        </Button>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}

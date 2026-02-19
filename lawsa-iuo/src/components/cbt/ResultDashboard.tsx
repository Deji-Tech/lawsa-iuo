"use client";

import { motion } from "framer-motion";
import { CheckCircle2, XCircle, RefreshCcw, Home, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { mockQuestions } from "@/data/mockQuestions";

interface ResultDashboardProps {
    score: number;
    total: number;
    onRestart: () => void;
    onGoHome: () => void;
}

const ResultDashboard = ({ score, total, onRestart, onGoHome }: ResultDashboardProps) => {
    const percentage = Math.round((score / total) * 100);
    const isPassed = percentage >= 60; // Common Nigerian Law pass mark logic

    return (
        <div className="mx-auto w-full max-w-4xl px-4 py-6 md:p-12">
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
                <Card className="overflow-hidden border-border/50 bg-card/50 backdrop-blur-xl shadow-2xl">
                    {/* Hero Result Section */}
                    <div className={`p-8 md:p-12 text-center text-white ${isPassed ? "bg-gradient-to-br from-green-600 to-brand" : "bg-gradient-to-br from-destructive to-brand"}`}>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                            className="mx-auto mb-4 md:mb-6 flex h-16 w-16 md:h-24 md:w-24 items-center justify-center rounded-full bg-white/20 backdrop-blur-md"
                        >
                            {isPassed ? <CheckCircle2 size={32} className="md:w-12 md:h-12" /> : <XCircle size={32} className="md:w-12 md:h-12" />}
                        </motion.div>
                        <h1 className="mb-2 text-4xl font-serif font-bold md:text-6xl">{percentage}%</h1>
                        <p className="text-lg md:text-xl font-medium opacity-90 px-4">
                            {isPassed ? "Excellent Progress, Counselor!" : "Requires More Study (Law 70/30 weighting applied)"}
                        </p>
                    </div>

                    <div className="p-6 md:p-12">
                        <div className="grid gap-6 md:grid-cols-2 md:gap-8">
                            {/* Analytics */}
                            <div className="space-y-6">
                                <h3 className="text-lg font-bold text-foreground">Performance Breakdown</h3>
                                <div className="space-y-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Correct Answers</span>
                                        <span className="font-bold text-green-600">{score} questions</span>
                                    </div>
                                    <Progress value={(score / total) * 100} className="h-2 [&>div]:bg-green-600" />

                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Incorrect Answers</span>
                                        <span className="font-bold text-destructive">{total - score} questions</span>
                                    </div>
                                    <Progress value={((total - score) / total) * 100} className="h-2 [&>div]:bg-red-500" />
                                </div>
                            </div>

                            {/* Steve's Feedback Section */}
                            <div className="rounded-2xl bg-brand/5 border border-brand/20 p-5 md:p-6 shadow-inner">
                                <div className="flex items-center gap-3 mb-4 text-brand">
                                    <Sparkles size={20} />
                                    <h3 className="font-bold text-sm md:text-base">Ask Steve (AI Professor)</h3>
                                </div>
                                <p className="text-xs md:text-sm text-muted-foreground mb-6 leading-relaxed">
                                    "I noticed you missed the question on **Receiving Stolen Property**. Would you like me to explain the legal principles of Section 427 for you?"
                                </p>
                                <Link href="/dashboard/steve">
                                    <Button className="w-full bg-brand hover:bg-brand-dim text-white rounded-xl h-10 md:h-12 text-sm md:text-base">
                                        Ask Steve Now <ArrowRight className="ml-2" size={16} />
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="mt-8 md:mt-12 flex flex-col gap-3 sm:flex-row sm:justify-center">
                            <Button onClick={onRestart} variant="outline" className="w-full sm:w-auto rounded-full px-8 py-6 h-12 md:h-14 border-brand text-brand hover:bg-brand/10 transition-transform active:scale-95">
                                <RefreshCcw className="mr-2" size={18} /> Retake Exam
                            </Button>
                            <Button onClick={onGoHome} className="w-full sm:w-auto rounded-full bg-foreground px-10 py-6 h-12 md:h-14 font-bold transition-transform active:scale-95">
                                <Home className="mr-2" size={18} /> Back to Dashboard
                            </Button>
                        </div>
                    </div>
                </Card>
            </motion.div>
        </div>
    );
};

export default ResultDashboard;

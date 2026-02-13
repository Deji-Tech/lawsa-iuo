"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Timer, ArrowRight, ArrowLeft, Send, CheckCircle2, XCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { mockQuestions, Question } from "@/data/mockQuestions";

interface CBTModuleProps {
    onComplete: (results: { score: number; answers: number[] }) => void;
}

const CBTModule = ({ onComplete }: CBTModuleProps) => {
    const [currentIdx, setCurrentIdx] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<number[]>(new Array(mockQuestions.length).fill(-1));
    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
    const [isFinished, setIsFinished] = useState(false);

    useEffect(() => {
        if (timeLeft <= 0) {
            handleFinish();
            return;
        }
        const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
        return () => clearInterval(timer);
    }, [timeLeft]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const currentQuestion = mockQuestions[currentIdx];
    const progress = ((currentIdx + 1) / mockQuestions.length) * 100;

    const handleSelect = (idx: number) => {
        const newAnswers = [...selectedAnswers];
        newAnswers[currentIdx] = idx;
        setSelectedAnswers(newAnswers);
    };

    const handleNext = () => {
        if (currentIdx < mockQuestions.length - 1) {
            setCurrentIdx(currentIdx + 1);
        }
    };

    const handlePrev = () => {
        if (currentIdx > 0) {
            setCurrentIdx(currentIdx - 1);
        }
    };

    const handleFinish = () => {
        const score = selectedAnswers.reduce((acc, ans, idx) => {
            return acc + (ans === mockQuestions[idx].correctAnswer ? 1 : 0);
        }, 0);
        setIsFinished(true);
        onComplete({ score, answers: selectedAnswers });
    };

    return (
        <div className="mx-auto w-full max-w-4xl px-4 py-6 md:p-8 lg:p-12">
            {/* Header — Timer & Progress */}
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center justify-between md:justify-start gap-3 rounded-2xl bg-brand/10 px-5 py-3 border border-brand/20 backdrop-blur-sm">
                    <div className="flex items-center gap-2">
                        <Timer className="text-brand animate-pulse" size={20} />
                        <span className="font-mono text-xl font-bold text-brand">
                            {formatTime(timeLeft)}
                        </span>
                    </div>
                </div>
                <div className="flex-1 max-w-md">
                    <div className="mb-2 flex justify-between text-xs font-medium uppercase tracking-wider">
                        <span className="text-muted-foreground">Progression</span>
                        <span className="text-brand">{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2 bg-brand/10" indicatorClassName="bg-brand" />
                </div>
            </div>

            {/* Main Container */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentIdx}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                >
                    <Card className="overflow-hidden border-border/50 bg-card/50 backdrop-blur-md shadow-2xl p-6 md:p-12">
                        {/* Scenario if exists */}
                        {currentQuestion.scenario && (
                            <div className="mb-6 rounded-xl bg-secondary/50 p-5 italic text-foreground/80 border-l-4 border-brand text-sm md:text-base leading-relaxed">
                                <p>{currentQuestion.scenario}</p>
                            </div>
                        )}

                        <div className="mb-8">
                            <span className="mb-3 block text-[10px] font-bold uppercase tracking-widest text-brand">Question {currentIdx + 1} of {mockQuestions.length}</span>
                            <h2 className="text-xl font-serif text-foreground leading-snug md:text-3xl font-bold">
                                {currentQuestion.text}
                            </h2>
                        </div>

                        <div className="grid gap-3 md:gap-4">
                            {currentQuestion.options.map((option, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => handleSelect(idx)}
                                    className={`group relative flex items-start gap-4 rounded-xl border-2 p-4 md:p-5 text-left transition-all duration-200 active:scale-[0.98] ${selectedAnswers[currentIdx] === idx
                                        ? "border-brand bg-brand/5 shadow-lg ring-1 ring-brand/30"
                                        : "border-border hover:border-brand/50 hover:bg-secondary/30"
                                        }`}
                                >
                                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2 text-sm font-bold transition-colors mt-0.5 ${selectedAnswers[currentIdx] === idx
                                        ? "bg-brand border-brand text-white"
                                        : "border-muted-foreground/30 text-muted-foreground group-hover:border-brand/50"
                                        }`}>
                                        {String.fromCharCode(65 + idx)}
                                    </div>
                                    <span className={`text-sm md:text-lg transition-colors leading-normal ${selectedAnswers[currentIdx] === idx ? "text-foreground font-semibold" : "text-muted-foreground"
                                        }`}>
                                        {option}
                                    </span>
                                    {selectedAnswers[currentIdx] === idx && (
                                        <motion.div layoutId="active" className="absolute inset-0 rounded-xl bg-brand/5 -z-10" />
                                    )}
                                </button>
                            ))}
                        </div>
                    </Card>
                </motion.div>
            </AnimatePresence>

            {/* Footer Controls */}
            <div className="mt-8 flex flex-col-reverse gap-3 md:flex-row md:justify-between">
                <Button
                    variant="outline"
                    onClick={handlePrev}
                    disabled={currentIdx === 0}
                    className="rounded-full w-full md:w-auto px-8 h-14 md:h-16 text-sm md:text-base"
                >
                    <ArrowLeft className="mr-2" size={18} /> Previous
                </Button>

                {currentIdx === mockQuestions.length - 1 ? (
                    <Button
                        onClick={handleFinish}
                        className="rounded-full bg-brand w-full md:w-auto px-10 h-14 md:h-16 text-base md:text-lg font-bold hover:bg-brand-dim shadow-xl shadow-brand/30 transition-transform active:scale-95"
                    >
                        Submit Exam <Send className="ml-2" size={20} />
                    </Button>
                ) : (
                    <Button
                        onClick={handleNext}
                        className="rounded-full bg-foreground w-full md:w-auto px-10 h-14 md:h-16 text-base md:text-lg font-bold hover:bg-brand transition-transform active:scale-95"
                    >
                        Next Question <ArrowRight className="ml-2" size={20} />
                    </Button>
                )}
            </div>
        </div>
    );
};

export default CBTModule;

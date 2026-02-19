"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Timer, ArrowRight, ArrowLeft, Send } from "lucide-react";
import { PauseIcon, PlayIcon } from "@hugeicons/core-free-icons";
import { HugeiconsIcon } from "@hugeicons/react";
import { Loading03Icon, AlertCircleIcon } from "@hugeicons/core-free-icons";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { 
  getQuestionsByCourse, 
  saveCBTAttempt, 
  saveCBTProgress,
  deleteCBTProgress,
  logUserActivity,
  Question 
} from "@/lib/api";
import { toast } from "sonner";

interface CBTModuleProps {
    courseId: string;
    resumeProgress?: any; // Previous progress to resume
    onComplete: (results: { 
        score: number; 
        totalQuestions: number;
        percentage: number;
        timeTaken: number;
    }) => void;
    onExit: () => void;
}

const CBTModule = ({ courseId, resumeProgress, onComplete, onExit }: CBTModuleProps) => {
    const { user, profile } = useAuth();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
    const [timeLeft, setTimeLeft] = useState(1800); // 30 minutes in seconds
    const [isFinished, setIsFinished] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [startTime, setStartTime] = useState(Date.now());
    const [courseName, setCourseName] = useState("");
    const [saveStatus, setSaveStatus] = useState<"saved" | "saving" | "error">("saved");
    const [progressId, setProgressId] = useState<string | null>(null);
    
    const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const visibilityRef = useRef<boolean>(true);

    // Load questions - either resume or start fresh
    useEffect(() => {
        const loadQuestions = async () => {
            if (!courseId) return;
            
            try {
                setIsLoading(true);
                
                if (resumeProgress) {
                    // Resume existing progress
                    setQuestions(resumeProgress.questions);
                    setSelectedAnswers(resumeProgress.questions.map((q: any) => q.selected_answer ?? -1));
                    setCurrentIdx(resumeProgress.current_question_index);
                    setTimeLeft(resumeProgress.time_remaining_seconds);
                    setProgressId(resumeProgress.id);
                    setCourseName(resumeProgress.course_name || "Course");
                    setStartTime(Date.now() - ((1800 - resumeProgress.time_remaining_seconds) * 1000));
                    toast.success("Resumed where you left off!");
                } else {
                    // Start fresh
                    const fetchedQuestions = await getQuestionsByCourse(courseId, 20);
                    setQuestions(fetchedQuestions);
                    setSelectedAnswers(new Array(fetchedQuestions.length).fill(-1));
                    setCurrentIdx(0);
                    setTimeLeft(1800);
                    setStartTime(Date.now());
                    
                    // Initialize progress in database
                    if (user) {
                        const initialProgress = await saveCBTProgress(
                            user.id,
                            courseId,
                            profile?.level || "100L",
                            fetchedQuestions.map(q => ({
                                question_id: q.id,
                                question_text: q.question_text,
                                options: q.options,
                                selected_answer: null,
                                correct_answer: q.correct_answer,
                                is_answered: false
                            })),
                            0,
                            1800
                        );
                        setProgressId(initialProgress.id);
                    }
                }
            } catch (error) {
                console.error("Error loading questions:", error);
                toast.error("Failed to load questions. Please try again.");
            } finally {
                setIsLoading(false);
            }
        };

        loadQuestions();
    }, [courseId, resumeProgress, user, profile?.level]);

    // Timer - only runs when not paused and not finished
    useEffect(() => {
        if (isLoading || isFinished || isPaused) return;
        
        if (timeLeft <= 0) {
            handleFinish();
            return;
        }
        
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                const newTime = prev - 1;
                // Auto-save every 30 seconds
                if (newTime % 30 === 0 && user && questions.length > 0) {
                    autoSaveProgress(newTime, currentIdx);
                }
                return newTime;
            });
        }, 1000);
        
        return () => clearInterval(timer);
    }, [timeLeft, isLoading, isFinished, isPaused, currentIdx, questions, user]);

    // Handle tab visibility change (auto-pause)
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (document.hidden && !isPaused && !isFinished) {
                setIsPaused(true);
                visibilityRef.current = false;
                toast.info("CBT paused. Click resume to continue.", { duration: 3000 });
                // Save progress when pausing
                autoSaveProgress(timeLeft, currentIdx);
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("beforeunload", handleBeforeUnload);
        
        return () => {
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, [isPaused, isFinished, timeLeft, currentIdx]);

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
        if (!isFinished && questions.length > 0) {
            autoSaveProgress(timeLeft, currentIdx);
            e.preventDefault();
            e.returnValue = "You have an unfinished CBT. Your progress has been saved.";
        }
    };

    const autoSaveProgress = useCallback(async (time: number, index: number) => {
        if (!user || !progressId || questions.length === 0) return;
        
        setSaveStatus("saving");
        
        try {
            await saveCBTProgress(
                user.id,
                courseId,
                profile?.level || "100L",
                questions.map((q, idx) => ({
                    question_id: q.id,
                    question_text: q.question_text,
                    options: q.options,
                    selected_answer: selectedAnswers[idx] !== -1 ? selectedAnswers[idx] : null,
                    correct_answer: q.correct_answer,
                    is_answered: selectedAnswers[idx] !== -1
                })),
                index,
                time
            );
            setSaveStatus("saved");
        } catch (error) {
            console.error("Auto-save failed:", error);
            setSaveStatus("error");
        }
    }, [user, progressId, courseId, profile?.level, questions, selectedAnswers]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    const currentQuestion = questions[currentIdx];
    const progress = questions.length > 0 ? ((currentIdx + 1) / questions.length) * 100 : 0;
    const answeredCount = selectedAnswers.filter(a => a !== -1).length;

    const handleSelect = async (idx: number) => {
        const newAnswers = [...selectedAnswers];
        newAnswers[currentIdx] = idx;
        setSelectedAnswers(newAnswers);
        
        // Auto-save after answering
        if (user) {
            if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
            saveTimeoutRef.current = setTimeout(() => {
                autoSaveProgress(timeLeft, currentIdx);
            }, 500);
        }
        
        // Auto-advance after 1.5 seconds
        setTimeout(() => {
            if (currentIdx < questions.length - 1) {
                setCurrentIdx(prev => prev + 1);
            }
        }, 1500);
    };

    const handleNext = () => {
        if (currentIdx < questions.length - 1) {
            setCurrentIdx(currentIdx + 1);
        }
    };

    const handlePrev = () => {
        if (currentIdx > 0) {
            setCurrentIdx(currentIdx - 1);
        }
    };

    const handlePauseToggle = () => {
        setIsPaused(!isPaused);
        if (!isPaused) {
            autoSaveProgress(timeLeft, currentIdx);
            toast.info("CBT paused. Your progress is saved.");
        } else {
            toast.success("CBT resumed!");
        }
    };

    const handleExit = async () => {
        const confirm = window.confirm(
            "Are you sure you want to exit? Your progress will be saved and you can resume later."
        );
        if (confirm) {
            await autoSaveProgress(timeLeft, currentIdx);
            onExit();
        }
    };

    const handleFinish = async () => {
        if (isFinished) return;
        
        // Check if all questions are answered
        const unansweredCount = selectedAnswers.filter(a => a === -1).length;
        if (unansweredCount > 0) {
            const confirm = window.confirm(
                `You have ${unansweredCount} unanswered question(s). Are you sure you want to submit?`
            );
            if (!confirm) return;
        }
        
        setIsFinished(true);
        const timeTaken = Math.floor((Date.now() - startTime) / 1000);
        
        // Calculate score
        let correctCount = 0;
        const questionsData = questions.map((q, idx) => {
            const isCorrect = selectedAnswers[idx] === q.correct_answer;
            if (isCorrect) correctCount++;
            return {
                question_id: q.id,
                selected_answer: selectedAnswers[idx],
                correct_answer: q.correct_answer,
                is_correct: isCorrect,
            };
        });

        const score = Math.round((correctCount / questions.length) * 100);

        // Save attempt to database
        if (user) {
            try {
                await saveCBTAttempt({
                    user_id: user.id,
                    level: profile?.level || "100L",
                    score: score,
                    total_questions: questions.length,
                    correct_answers: correctCount,
                    time_taken_seconds: timeTaken,
                    questions_data: questionsData,
                });

                // Delete progress since CBT is complete
                if (progressId) {
                    await deleteCBTProgress(progressId);
                }

                await logUserActivity(user.id, 'cbt_completed', {
                    level: profile?.level,
                    score,
                    total_questions: questions.length,
                });

                toast.success("Test completed successfully!");
            } catch (error) {
                console.error("Error saving CBT attempt:", error);
                toast.error("Failed to save results, but your score was recorded.");
            }
        }

        onComplete({ 
            score: correctCount, 
            totalQuestions: questions.length,
            percentage: score,
            timeTaken,
        });
    };

    if (isLoading) {
        return (
            <div className="mx-auto w-full max-w-4xl px-4 py-12 flex flex-col items-center justify-center min-h-[400px]">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                    <HugeiconsIcon icon={Loading03Icon} className="w-12 h-12 text-brand mb-4" />
                </motion.div>
                <p className="text-muted-foreground">Loading questions...</p>
            </div>
        );
    }

    if (questions.length === 0) {
        return (
            <div className="mx-auto w-full max-w-4xl px-4 py-12 text-center">
                <HugeiconsIcon icon={AlertCircleIcon} className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No questions available for this course yet.</p>
                <Button onClick={onExit} variant="outline">Go Back</Button>
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-4xl px-4 py-6 md:p-8 lg:p-12">
            {/* Header — Timer, Progress, Controls */}
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-3">
                    <div className="flex items-center justify-between md:justify-start gap-3 rounded-2xl bg-brand/10 px-5 py-3 border border-brand/20 backdrop-blur-sm">
                        <div className="flex items-center gap-2">
                            <Timer className="text-brand animate-pulse" size={20} />
                            <span className="font-mono text-xl font-bold text-brand">
                                {formatTime(timeLeft)}
                            </span>
                        </div>
                    </div>
                    
                    {/* Pause/Resume Button */}
                    <Button
                        variant="outline"
                        size="icon"
                        onClick={handlePauseToggle}
                        className="rounded-full"
                    >
                        {isPaused ? <HugeiconsIcon icon={PlayIcon} className="w-4 h-4" /> : <HugeiconsIcon icon={PauseIcon} className="w-4 h-4" />}
                    </Button>
                    
                    {/* Exit Button */}
                    <Button
                        variant="ghost"
                        onClick={handleExit}
                        className="text-muted-foreground"
                    >
                        Exit
                    </Button>
                </div>
                
                <div className="flex-1 max-w-md">
                    <div className="mb-2 flex justify-between text-xs font-medium uppercase tracking-wider">
                        <span className="text-muted-foreground">Progress ({answeredCount}/{questions.length} answered)</span>
                        <span className="text-brand">{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2 [&>div]:bg-brand" />
                </div>
                
                {/* Save Status */}
                <div className="text-xs text-muted-foreground">
                    {saveStatus === "saving" && "Saving..."}
                    {saveStatus === "saved" && "Progress saved"}
                    {saveStatus === "error" && "Save failed"}
                </div>
            </div>

            {/* Pause Overlay */}
            <AnimatePresence>
                {isPaused && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center"
                        onClick={() => setIsPaused(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-card p-8 rounded-2xl shadow-2xl text-center"
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="w-16 h-16 rounded-full bg-brand/10 flex items-center justify-center mx-auto mb-4">
                                <HugeiconsIcon icon={PauseIcon} className="w-8 h-8 text-brand" />
                            </div>
                            <h2 className="text-2xl font-bold mb-2">CBT Paused</h2>
                            <p className="text-muted-foreground mb-6">Your progress is saved. Click resume to continue.</p>
                            <Button onClick={() => setIsPaused(false)} className="w-full">
                                <HugeiconsIcon icon={PlayIcon} className="w-4 h-4 mr-2" />
                                Resume CBT
                            </Button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

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
                        {/* Category Badge */}
                        <div className="mb-4 flex items-center justify-between">
                            <span className="inline-block px-3 py-1 rounded-full bg-brand/10 text-brand text-xs font-semibold">
                                Question {currentIdx + 1} of {questions.length}
                            </span>
                            {selectedAnswers[currentIdx] !== -1 && (
                                <span className="text-xs text-green-600 font-medium">
                                    ✓ Answered
                                </span>
                            )}
                        </div>

                        {/* Scenario if exists */}
                        {currentQuestion.scenario && (
                            <div className="mb-6 rounded-xl bg-secondary/50 p-5 italic text-foreground/80 border-l-4 border-brand text-sm md:text-base leading-relaxed">
                                <p>{currentQuestion.scenario}</p>
                            </div>
                        )}

                        <div className="mb-8">
                            <h2 className="text-xl font-serif text-foreground leading-snug md:text-3xl font-bold">
                                {currentQuestion.question_text}
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

                {currentIdx === questions.length - 1 ? (
                    <Button
                        onClick={handleFinish}
                        disabled={isFinished}
                        className="rounded-full bg-brand w-full md:w-auto px-10 h-14 md:h-16 text-base md:text-lg font-bold hover:bg-brand-dim shadow-xl shadow-brand/30 transition-transform active:scale-95"
                    >
                        {isFinished ? (
                            <><motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} className="mr-2">
                                <HugeiconsIcon icon={Loading03Icon} className="w-5 h-5" />
                            </motion.div> Saving...</>
                        ) : (
                            <>Submit Exam <Send className="ml-2" size={20} /></>
                        )}
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

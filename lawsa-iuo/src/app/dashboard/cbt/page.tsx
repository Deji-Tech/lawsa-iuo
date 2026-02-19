"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CBTSelectionPage from "@/components/cbt/CBTSelectionPage";
import CBTModule from "@/components/cbt/CBTModule";
import ResultDashboard from "@/components/cbt/ResultDashboard";

export default function CBTPage() {
    const [view, setView] = useState<"selection" | "cbt" | "results">("selection");
    const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null);
    const [resumeProgress, setResumeProgress] = useState<any>(null);
    const [cbtResults, setCbtResults] = useState<{
        score: number;
        totalQuestions: number;
        percentage: number;
        timeTaken: number;
    } | null>(null);
    const router = useRouter();

    const handleStartCBT = (courseId: string, progress: any) => {
        setSelectedCourseId(courseId);
        setResumeProgress(progress);
        setView("cbt");
    };

    const handleComplete = (results: {
        score: number;
        totalQuestions: number;
        percentage: number;
        timeTaken: number;
    }) => {
        setCbtResults(results);
        setView("results");
    };

    const handleExit = () => {
        setView("selection");
        setSelectedCourseId(null);
        setResumeProgress(null);
    };

    const handleRestart = () => {
        setView("selection");
        setSelectedCourseId(null);
        setResumeProgress(null);
        setCbtResults(null);
    };

    return (
        <div className="max-w-5xl mx-auto">
            {view === "selection" && (
                <CBTSelectionPage onStartCBT={handleStartCBT} />
            )}
            
            {view === "cbt" && selectedCourseId && (
                <CBTModule
                    courseId={selectedCourseId}
                    resumeProgress={resumeProgress}
                    onComplete={handleComplete}
                    onExit={handleExit}
                />
            )}
            
            {view === "results" && cbtResults && (
                <ResultDashboard
                    score={cbtResults.score}
                    total={cbtResults.totalQuestions}
                    onRestart={handleRestart}
                    onGoHome={() => router.push("/dashboard")}
                />
            )}
        </div>
    );
}

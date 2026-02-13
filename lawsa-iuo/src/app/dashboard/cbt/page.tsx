"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import CBTModule from "@/components/cbt/CBTModule";
import ResultDashboard from "@/components/cbt/ResultDashboard";
import { mockQuestions } from "@/data/mockQuestions";

export default function CBTPage() {
    const [completeData, setCompleteData] = useState<{ score: number; answers: number[] } | null>(null);
    const router = useRouter();

    return (
        <div className="max-w-5xl mx-auto">
            {!completeData ? (
                <CBTModule onComplete={(data) => setCompleteData(data)} />
            ) : (
                <ResultDashboard
                    score={completeData.score}
                    total={mockQuestions.length}
                    onRestart={() => setCompleteData(null)}
                    onGoHome={() => router.push("/dashboard")}
                />
            )}
        </div>
    );
}

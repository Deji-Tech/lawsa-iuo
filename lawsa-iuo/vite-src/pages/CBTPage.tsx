import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import CBTModule from "@/components/cbt/CBTModule";
import ResultDashboard from "@/components/cbt/ResultDashboard";
import { mockQuestions } from "@/data/mockQuestions";

const CBTPage = () => {
    const [completeData, setCompleteData] = useState<{ score: number; answers: number[] } | null>(null);
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-background">
            <Navbar />
            <div className="pt-24 pb-12">
                {!completeData ? (
                    <CBTModule onComplete={(data) => setCompleteData(data)} />
                ) : (
                    <ResultDashboard
                        score={completeData.score}
                        total={mockQuestions.length}
                        onRestart={() => setCompleteData(null)}
                        onGoHome={() => navigate("/")}
                    />
                )}
            </div>
        </div>
    );
};

export default CBTPage;

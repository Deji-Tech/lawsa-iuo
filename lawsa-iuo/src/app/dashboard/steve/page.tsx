"use client";

import SteveChatInterface from "@/components/dashboard/SteveChatInterface";

export default function StevePage() {
    return (
        <div className="h-[calc(100vh-6rem)] flex flex-col">
            <div className="mb-4">
                <h1 className="text-2xl font-serif font-bold text-foreground">Professor Steve</h1>
                <p className="text-muted-foreground text-sm">Your personal AI legal assistant for NUC curriculum and Case Law.</p>
            </div>

            <div className="flex-1 overflow-hidden">
                <SteveChatInterface />
            </div>
        </div>
    );
}

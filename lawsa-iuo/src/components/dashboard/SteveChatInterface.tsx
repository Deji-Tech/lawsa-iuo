"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Sparkles, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

interface Message {
    id: string;
    role: "user" | "bot";
    text: string;
    timestamp: Date;
}

const suggestedPrompts = [
    "Explain the principle in Donoghue v Stevenson",
    "What are the elements of a valid contract?",
    "Summarize Section 33 of the 1999 Constitution",
    "Difference between Murder and Manslaughter"
];

export default function SteveChatInterface() {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: "welcome",
            role: "bot",
            text: "Hello, Learned Colleague! I am Professor Steve, your AI legal assistant. I'm here to help you navigate the complexities of Nigerian Law, from Constitutional Law to the Law of Evidence. What are we studying today?",
            timestamp: new Date()
        }
    ]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom of chat
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isTyping]);

    const handleSend = (text: string = inputValue) => {
        if (!text.trim()) return;

        const newUserMsg: Message = {
            id: Date.now().toString(),
            role: "user",
            text: text,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, newUserMsg]);
        setInputValue("");
        setIsTyping(true);

        // Simulate AI response delay
        setTimeout(() => {
            const botResponse: Message = {
                id: (Date.now() + 1).toString(),
                role: "bot",
                text: "I'm currently running in demo mode while my knowledge base of Nigerian Case Law is being indexed. In the full version, I will provide specific citations and summaries tailored to your 300L curriculum.",
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botResponse]);
            setIsTyping(false);
        }, 1500);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex flex-col h-full max-h-[calc(100vh-8rem)] w-full max-w-4xl mx-auto space-y-4">
            {/* Chat Area */}
            <Card className="flex-1 flex flex-col overflow-hidden border-border/50 bg-card/60 backdrop-blur-sm shadow-xl rounded-3xl">
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                    {messages.map((msg) => (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                            <div className={`flex items-start max-w-[85%] sm:max-w-[75%] gap-2 ${msg.role === "user" ? "flex-row-reverse" : "flex-row"}`}>
                                {/* Avatar */}
                                <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center shadow-sm ${msg.role === "user" ? "bg-brand text-white" : "bg-white text-brand border border-brand/20"}`}>
                                    {msg.role === "user" ? <User size={16} /> : <Bot size={18} />}
                                </div>

                                {/* Message Bubble */}
                                <div className={`flex flex-col ${msg.role === "user" ? "items-end" : "items-start"}`}>
                                    <div className={`px-5 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${msg.role === "user"
                                        ? "bg-brand text-white rounded-tr-sm"
                                        : "bg-white/80 dark:bg-slate-800 text-foreground border border-border/50 rounded-tl-sm"
                                        }`}>
                                        {msg.text}
                                    </div>
                                    <span className="text-[10px] text-muted-foreground mt-1 px-1">
                                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}

                    {/* Typing Indicator */}
                    <AnimatePresence>
                        {isTyping && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="flex justify-start w-full"
                            >
                                <div className="flex items-center gap-2">
                                    <div className="flex-shrink-0 h-8 w-8 rounded-full bg-white text-brand border border-brand/20 flex items-center justify-center">
                                        <Bot size={18} />
                                    </div>
                                    <div className="px-4 py-3 bg-white/80 dark:bg-slate-800 rounded-2xl rounded-tl-sm border border-border/50 shadow-sm flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 bg-brand/50 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                        <span className="w-1.5 h-1.5 bg-brand/50 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                        <span className="w-1.5 h-1.5 bg-brand/50 rounded-full animate-bounce"></span>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    <div ref={scrollRef} />
                </div>

                {/* Input Area */}
                <div className="p-4 border-t border-border/40 bg-background/40 backdrop-blur-md">
                    {/* Suggested Prompts (Only show if few messages) */}
                    {messages.length < 3 && (
                        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-hide">
                            {suggestedPrompts.map((prompt) => (
                                <button
                                    key={prompt}
                                    onClick={() => handleSend(prompt)}
                                    className="flex items-center whitespace-nowrap px-3 py-1.5 rounded-full bg-brand/5 border border-brand/10 text-xs text-brand hover:bg-brand/10 transition-colors"
                                >
                                    <Sparkles size={12} className="mr-1.5" />
                                    {prompt}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="relative flex items-center gap-2">
                        <Input
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask Professor Steve a legal question..."
                            className="bg-white/80 dark:bg-slate-900 border-border/60 shadow-inner h-12 pr-12 rounded-xl focus-visible:ring-brand"
                        />
                        <Button
                            onClick={() => handleSend()}
                            disabled={!inputValue.trim() || isTyping}
                            className="absolute right-1.5 h-9 w-9 p-0 rounded-lg bg-brand hover:bg-brand-dim text-white shadow-md transition-all active:scale-95 disabled:opacity-50"
                        >
                            <Send size={16} />
                        </Button>
                    </div>
                    <div className="text-center mt-2">
                        <p className="text-[10px] text-muted-foreground flex items-center justify-center gap-1">
                            <AlertCircle size={10} />
                            AI can make mistakes. Please verify important legal citations.
                        </p>
                    </div>
                </div>
            </Card>
        </div>
    );
}

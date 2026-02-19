"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  TelegramIcon, 
  ArtificialIntelligence01Icon,
  UserIcon,
  Alert01Icon,
  BookOpen01Icon,
  JusticeScale01Icon,
  JudgeIcon,
  Message01Icon
} from "@hugeicons/core-free-icons";

interface Message {
    id: string;
    role: "user" | "bot";
    text: string;
    timestamp: Date;
}

const suggestedPrompts = [
    { icon: BookOpen01Icon, text: "Explain the principle in Donoghue v Stevenson" },
    { icon: JusticeScale01Icon, text: "What are the elements of a valid contract?" },
    { icon: JudgeIcon, text: "Summarize Section 33 of the 1999 Constitution" },
    { icon: Message01Icon, text: "Difference between Murder and Manslaughter" }
];

export default function SteveChatInterface() {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState("");
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isTyping]);

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.style.height = "auto";
            inputRef.current.style.height = inputRef.current.scrollHeight + "px";
        }
    }, [inputValue]);

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
        <div className="flex flex-col h-[calc(100vh-4rem)] bg-background">
            <div className="flex-1 overflow-y-auto">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full px-4 pb-32">
                        <div className="text-center max-w-2xl">
                            <motion.div 
                                className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-brand to-brand-dim text-white mb-8 shadow-xl shadow-brand/30"
                                animate={{ 
                                    scale: [1, 1.05, 1],
                                    rotate: [0, 5, -5, 0]
                                }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            >
                                <HugeiconsIcon icon={ArtificialIntelligence01Icon} className="w-10 h-10" />
                            </motion.div>
                            
                            <motion.h1 
                                className="text-4xl font-display font-semibold text-foreground mb-4"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                Professor Steve
                            </motion.h1>
                            <motion.p 
                                className="text-lg text-muted-foreground mb-10"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                            >
                                Your AI legal assistant for Nigerian Law. Ask me anything about Constitutional Law, Criminal Law, Contract Law, and more.
                            </motion.p>
                            
                            <motion.div 
                                className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.4 }}
                            >
                                {suggestedPrompts.map((prompt, index) => (
                                    <motion.button
                                        key={index}
                                        onClick={() => handleSend(prompt.text)}
                                        className="flex items-center gap-3 p-4 rounded-xl border border-border/60 bg-card hover:bg-muted/50 hover:border-brand/30 transition-all text-left group"
                                        whileHover={{ scale: 1.02, y: -2 }}
                                        whileTap={{ scale: 0.98 }}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.5 + index * 0.1 }}
                                    >
                                        <span className="text-brand group-hover:scale-110 transition-transform">
                                            <HugeiconsIcon icon={prompt.icon} className="w-5 h-5" />
                                        </span>
                                        <span className="text-sm text-foreground font-medium">
                                            {prompt.text}
                                        </span>
                                    </motion.button>
                                ))}
                            </motion.div>
                        </div>
                    </div>
                ) : (
                    <div className="pb-32">
                        {messages.map((msg, index) => (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.05 }}
                                className={`py-6 ${msg.role === "user" ? "bg-background" : "bg-muted/30"}`}
                            >
                                <div className="max-w-3xl mx-auto px-4 sm:px-6">
                                    <div className="flex gap-4">
                                        <div className="flex-shrink-0">
                                            {msg.role === "user" ? (
                                                <div className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center">
                                                    <HugeiconsIcon icon={UserIcon} className="w-5 h-5 text-brand" />
                                                </div>
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center">
                                                    <HugeiconsIcon icon={ArtificialIntelligence01Icon} className="w-5 h-5 text-white" />
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-semibold text-sm text-foreground">
                                                    {msg.role === "user" ? "You" : "Professor Steve"}
                                                </span>
                                                <span className="text-xs text-muted-foreground">
                                                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                            <div className="text-base leading-relaxed text-foreground whitespace-pre-wrap">
                                                {msg.text}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                        <AnimatePresence>
                            {isTyping && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    className="py-6 bg-muted/30"
                                >
                                    <div className="max-w-3xl mx-auto px-4 sm:px-6">
                                        <div className="flex gap-4">
                                            <div className="flex-shrink-0">
                                                <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center">
                                                    <HugeiconsIcon icon={ArtificialIntelligence01Icon} className="w-5 h-5 text-white" />
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <motion.span 
                                                    className="w-2 h-2 bg-brand/40 rounded-full"
                                                    animate={{ y: [0, -6, 0] }}
                                                    transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                                                />
                                                <motion.span 
                                                    className="w-2 h-2 bg-brand/40 rounded-full"
                                                    animate={{ y: [0, -6, 0] }}
                                                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }}
                                                />
                                                <motion.span 
                                                    className="w-2 h-2 bg-brand/40 rounded-full"
                                                    animate={{ y: [0, -6, 0] }}
                                                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.3 }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                        <div ref={scrollRef} />
                    </div>
                )}
            </div>

            <div className="fixed bottom-0 left-0 right-0 md:left-[280px] bg-background border-t border-border/50">
                <div className="max-w-3xl mx-auto px-4 py-4">
                    <div className="relative">
                        <textarea
                            ref={inputRef}
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask Professor Steve a legal question..."
                            rows={1}
                            className="w-full px-4 py-3 pr-12 rounded-2xl border border-border/60 bg-muted/30 resize-none focus:outline-none focus:border-brand/50 focus:bg-background transition-all min-h-[52px] max-h-[200px] text-base"
                        />
                        <motion.button
                            onClick={() => handleSend()}
                            disabled={!inputValue.trim() || isTyping}
                            className="absolute right-2 bottom-2 p-2 rounded-xl bg-brand text-white hover:bg-brand-dim disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <HugeiconsIcon icon={TelegramIcon} className="w-5 h-5" />
                        </motion.button>
                    </div>
                    <p className="text-center mt-2 text-xs text-muted-foreground flex items-center justify-center gap-1">
                        <HugeiconsIcon icon={Alert01Icon} className="w-3 h-3" />
                        AI can make mistakes. Please verify important legal citations.
                    </p>
                </div>
            </div>
        </div>
    );
}

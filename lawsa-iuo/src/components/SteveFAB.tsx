"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X, MessageSquare, Send, Bot, Maximize2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

const SteveFAB = () => {
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();
    const [messages, setMessages] = useState<{ role: "user" | "bot"; text: string }[]>([
        { role: "bot", text: "Hello! I am Steve, your Nigerian Law Professor. How can I help you with the NUC curriculum today?" }
    ]);
    const [inputValue, setInputValue] = useState("");

    const handleOpen = () => {
        if (window.innerWidth < 768) {
            router.push("/dashboard/steve");
        } else {
            setIsOpen(!isOpen);
        }
    };

    const handleSend = () => {
        if (!inputValue.trim()) return;
        setMessages([...messages, { role: "user", text: inputValue }]);
        setInputValue("");

        // Simulate bot response
        setTimeout(() => {
            setMessages(prev => [...prev, {
                role: "bot",
                text: "I'm currently being calibrated with the latest LFN 2004 and NUC materials. I'll be able to give you specific case-law citations very soon!"
            }]);
        }, 1000);
    };

    return (
        <div className="fixed bottom-20 md:bottom-6 right-6 z-[60]">
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="mb-4 w-[350px] sm:w-[400px] hidden md:block"
                    >
                        <Card className="flex flex-col overflow-hidden border-brand/20 bg-background/95 backdrop-blur-xl shadow-2xl ring-1 ring-brand/10">
                            {/* Chat Header */}
                            <div className="bg-brand p-4 text-white flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/20">
                                        <Bot size={20} />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-sm">Professor Steve</h3>
                                        <p className="text-[10px] opacity-80 uppercase tracking-widest">Legal AI Expert</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Link href="/dashboard/steve">
                                        <button className="hover:bg-white/10 rounded-full p-1 transition-colors" title="Open Full Page">
                                            <Maximize2 size={16} />
                                        </button>
                                    </Link>
                                    <button onClick={() => setIsOpen(false)} className="hover:bg-white/10 rounded-full p-1 transition-colors">
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>

                            {/* Message List */}
                            <ScrollArea className="h-[400px] p-4">
                                <div className="space-y-4 flex flex-col">
                                    {messages.map((m, i) => (
                                        <div key={i} className={`max-w-[80%] rounded-2xl p-3 text-sm ${m.role === "user"
                                            ? "ml-auto bg-brand text-white rounded-br-none"
                                            : "mr-auto bg-secondary text-foreground rounded-bl-none border border-border/50"
                                            }`}>
                                            {m.text}
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>

                            {/* Chat Input */}
                            <div className="p-4 border-t border-border/50 bg-secondary/30 flex gap-2">
                                <Input
                                    placeholder="Ask about Case Law..."
                                    className="bg-background border-border/50 rounded-full"
                                    value={inputValue}
                                    onChange={(e) => setInputValue(e.target.value)}
                                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                />
                                <Button onClick={handleSend} className="rounded-full bg-brand h-10 w-10 p-0 hover:bg-brand-dim">
                                    <Send size={18} />
                                </Button>
                            </div>
                        </Card>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleOpen}
                className="flex h-14 w-14 md:h-16 md:w-16 items-center justify-center rounded-full bg-brand text-white shadow-2xl shadow-brand/40 ring-4 ring-white transition-all hover:bg-brand-dim"
            >
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
                            <X size={28} />
                        </motion.div>
                    ) : (
                        <motion.div key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} className="flex flex-col items-center">
                            <Sparkles size={24} />
                            <span className="text-[8px] font-bold uppercase mt-0.5">Steve</span>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>
        </div>
    );
};

export default SteveFAB;

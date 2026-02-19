"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import { 
  ArtificialIntelligence01Icon, 
  Cancel01Icon, 
  TelegramIcon,
  ArrowExpand01Icon 
} from "@hugeicons/core-free-icons";
import Link from "next/link";
import { useRouter } from "next/navigation";

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
                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                        className="mb-4 w-[380px] sm:w-[420px] hidden md:block"
                    >
                        <div className="flex flex-col overflow-hidden border border-border/50 bg-background shadow-2xl rounded-2xl">
                            {/* Chat Header */}
                            <div className="bg-background border-b border-border/50 p-4 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand">
                                        <HugeiconsIcon icon={ArtificialIntelligence01Icon} className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <h3 className="font-display font-semibold text-foreground">Professor Steve</h3>
                                        <p className="text-xs text-muted-foreground">Legal AI Expert</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Link href="/dashboard/steve">
                                        <motion.button 
                                            whileHover={{ scale: 1.1 }}
                                            whileTap={{ scale: 0.9 }}
                                            className="p-2 rounded-lg hover:bg-muted transition-colors" 
                                            title="Open Full Page"
                                        >
                                            <HugeiconsIcon icon={ArrowExpand01Icon} className="w-5 h-5 text-muted-foreground" />
                                        </motion.button>
                                    </Link>
                                    <motion.button 
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => setIsOpen(false)} 
                                        className="p-2 rounded-lg hover:bg-muted transition-colors"
                                    >
                                        <HugeiconsIcon icon={Cancel01Icon} className="w-5 h-5 text-muted-foreground" />
                                    </motion.button>
                                </div>
                            </div>

                            {/* Message List */}
                            <div className="h-[380px] overflow-y-auto p-4 bg-background">
                                <div className="space-y-4">
                                    {messages.map((m, i) => (
                                        <motion.div 
                                            key={i} 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                            className={`flex gap-3 ${m.role === "user" ? "flex-row-reverse" : ""}`}
                                        >
                                            <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                                                m.role === "user" ? "bg-brand/10" : "bg-brand"
                                            }`}>
                                                {m.role === "user" ? (
                                                    <span className="text-brand text-sm font-semibold">Y</span>
                                                ) : (
                                                    <HugeiconsIcon icon={ArtificialIntelligence01Icon} className="w-4 h-4 text-white" />
                                                )}
                                            </div>
                                            <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                                                m.role === "user" 
                                                    ? "bg-brand text-white rounded-br-md" 
                                                    : "bg-muted text-foreground rounded-bl-md"
                                            }`}>
                                                {m.text}
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </div>

                            {/* Chat Input */}
                            <div className="p-4 border-t border-border/50 bg-background">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        placeholder="Ask about Case Law..."
                                        className="flex-1 px-4 py-2.5 rounded-xl border border-border/50 bg-muted/30 focus:outline-none focus:border-brand/50 focus:bg-background transition-all text-sm"
                                        value={inputValue}
                                        onChange={(e) => setInputValue(e.target.value)}
                                        onKeyDown={(e) => e.key === "Enter" && handleSend()}
                                    />
                                    <motion.button 
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={handleSend}
                                        className="p-2.5 rounded-xl bg-brand text-white hover:bg-brand-dim transition-colors"
                                    >
                                        <HugeiconsIcon icon={TelegramIcon} className="w-5 h-5" />
                                    </motion.button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Floating Button */}
            <motion.button
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleOpen}
                className="flex h-14 w-14 items-center justify-center rounded-full bg-brand text-white shadow-lg shadow-brand/30 hover:shadow-brand/50 transition-all"
            >
                <AnimatePresence mode="wait">
                    {isOpen ? (
                        <motion.div 
                            key="close" 
                            initial={{ rotate: -90, opacity: 0 }} 
                            animate={{ rotate: 0, opacity: 1 }} 
                            exit={{ rotate: 90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <HugeiconsIcon icon={Cancel01Icon} className="w-6 h-6" />
                        </motion.div>
                    ) : (
                        <motion.div 
                            key="chat" 
                            initial={{ rotate: 90, opacity: 0 }} 
                            animate={{ rotate: 0, opacity: 1 }} 
                            exit={{ rotate: -90, opacity: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <HugeiconsIcon icon={ArtificialIntelligence01Icon} className="w-6 h-6" />
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.button>
        </div>
    );
};

export default SteveFAB;

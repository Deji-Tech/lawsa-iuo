"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Setting07Icon,
  CheckmarkCircle01Icon,
  CpuIcon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";
import { GROQ_MODELS, GroqModel } from "@/lib/groq";
import { Button } from "@/components/ui/button";

interface ModelSelectorProps {
  currentModel: GroqModel;
  onModelChange: (model: GroqModel) => void;
}

export default function ModelSelector({
  currentModel,
  onModelChange,
}: ModelSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"
      >
        <HugeiconsIcon icon={CpuIcon} className="w-4 h-4" />
        <span className="hidden sm:inline">{GROQ_MODELS[currentModel].name}</span>
        <span className="sm:hidden">AI Model</span>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 top-full mt-2 w-80 z-50 bg-card border border-border rounded-xl shadow-2xl overflow-hidden"
            >
              <div className="p-4 border-b border-border">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <HugeiconsIcon icon={Setting07Icon} className="w-5 h-5 text-brand" />
                    <h3 className="font-semibold">Select AI Model</h3>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-1 rounded-full hover:bg-muted transition-colors"
                  >
                    <HugeiconsIcon icon={Cancel01Icon} className="w-4 h-4" />
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Choose the AI model that powers Professor Steve
                </p>
              </div>

              <div className="p-2 max-h-80 overflow-y-auto">
                {Object.entries(GROQ_MODELS).map(([modelKey, modelInfo]) => (
                  <button
                    key={modelKey}
                    onClick={() => {
                      onModelChange(modelKey as GroqModel);
                      setIsOpen(false);
                    }}
                    className={`w-full p-3 rounded-lg text-left transition-all ${
                      currentModel === modelKey
                        ? "bg-brand/10 border border-brand/30"
                        : "hover:bg-muted border border-transparent"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`mt-0.5 ${
                          currentModel === modelKey ? "text-brand" : "text-muted-foreground"
                        }`}
                      >
                        {currentModel === modelKey ? (
                          <HugeiconsIcon icon={CheckmarkCircle01Icon} className="w-5 h-5" />
                        ) : (
                          <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-sm">{modelInfo.name}</span>
                          {modelInfo.recommended && (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 font-medium">
                              Recommended
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {modelInfo.description}
                        </p>
                        <p className="text-[10px] text-muted-foreground/70 mt-1">
                          Max tokens: {modelInfo.maxTokens.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>

              <div className="p-3 border-t border-border bg-muted/30">
                <p className="text-[10px] text-muted-foreground text-center">
                  Powered by Groq AI • 14,400 free requests/day
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

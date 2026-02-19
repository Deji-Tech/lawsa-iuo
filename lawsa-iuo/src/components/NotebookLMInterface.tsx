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
  Message01Icon,
  File01Icon,
  Delete02Icon,
  VolumeHighIcon,
  PauseIcon,
  StudyLampIcon,
  ClipboardIcon,
  AddCircleIcon,
  Menu01Icon,
  PanelRightIcon,
  ArrowLeft02Icon,
  AlertCircleIcon,
  Loading03Icon,
  FileUploadIcon,
  Clock01Icon,
  PlusSignIcon,
  Cancel01Icon,
} from "@hugeicons/core-free-icons";
import { Source, ChatMessage, Citation } from "@/lib/gemini";
import { groqService, GroqModel, GROQ_MODELS } from "@/lib/groq";
import { createClient } from "@/lib/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import ModelSelector from "@/components/ModelSelector";
import { extractDocumentText } from "@/lib/pdfExtractor";
import {
  getChatConversations,
  createChatConversation,
  getChatMessages,
  saveChatMessage,
  deleteChatConversation,
  ChatConversation,
} from "@/lib/api";

interface NotebookLMInterfaceProps {
  onClose?: () => void;
}

const suggestedPrompts = [
  { icon: BookOpen01Icon, text: "Explain the principle in Donoghue v Stevenson" },
  { icon: JusticeScale01Icon, text: "What are the elements of a valid contract?" },
  { icon: JudgeIcon, text: "Summarize Section 33 of the 1999 Constitution" },
  { icon: Message01Icon, text: "Difference between Murder and Manslaughter" },
];

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = [
  'application/pdf',
  'text/plain',
  'text/markdown',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];

export default function NotebookLMInterface({ onClose }: NotebookLMInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [sources, setSources] = useState<Source[]>([]);
  const [showSources, setShowSources] = useState(false);
  const [showMobileSources, setShowMobileSources] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [notes, setNotes] = useState<string>("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadStatus, setUploadStatus] = useState<string>("");
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [activeCitation, setActiveCitation] = useState<Citation | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speakingMessageId, setSpeakingMessageId] = useState<string | null>(null);
  const [currentModel, setCurrentModel] = useState<GroqModel>("openai/gpt-oss-120b");
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const supabase = createClient();
  const { user } = useAuth();

  useEffect(() => {
    groqService.setModel(currentModel);
  }, [currentModel]);

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

  useEffect(() => {
    if (user) {
      loadSources();
      loadConversations();
    }
  }, [user]);

  const loadConversations = async () => {
    if (!user) return;
    try {
      const data = await getChatConversations(user.id);
      setConversations(data);
    } catch (error) {
      console.error("Error loading conversations:", error);
    }
  };

  const startNewConversation = async () => {
    if (!user) return;
    try {
      const conversation = await createChatConversation(user.id, "New Chat");
      setConversations([conversation, ...conversations]);
      setCurrentConversationId(conversation.id);
      setMessages([]);
      setShowHistory(false);
    } catch (error) {
      console.error("Error creating conversation:", error);
    }
  };

  const loadConversation = async (conversationId: string) => {
    try {
      const messages = await getChatMessages(conversationId);
      const formattedMessages: ChatMessage[] = messages.map((m) => ({
        id: m.id,
        role: m.role,
        text: m.content,
        citations: m.citations || [],
        timestamp: new Date(m.created_at),
      }));
      setMessages(formattedMessages);
      setCurrentConversationId(conversationId);
      setShowHistory(false);
    } catch (error) {
      console.error("Error loading conversation:", error);
    }
  };

  const deleteConversation = async (conversationId: string) => {
    try {
      await deleteChatConversation(conversationId);
      setConversations(conversations.filter((c) => c.id !== conversationId));
      if (currentConversationId === conversationId) {
        setCurrentConversationId(null);
        setMessages([]);
      }
    } catch (error) {
      console.error("Error deleting conversation:", error);
    }
  };

  const loadSources = async () => {
    const { data, error } = await supabase
      .from("sources")
      .select("*")
      .eq("user_id", user?.id)
      .order("created_at", { ascending: false });

    if (!error && data) {
      setSources(data);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!user) {
      setUploadError("Please sign in to upload documents");
      return;
    }

    if (!ALLOWED_TYPES.includes(file.type) && !file.name.endsWith('.docx') && !file.name.endsWith('.doc')) {
      setUploadError("Invalid file type. Please upload PDF, TXT, or Word documents.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      setUploadError(`File too large. Maximum size is ${MAX_FILE_SIZE / 1024 / 1024}MB.`);
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setUploadStatus("Preparing upload...");
    setUploadError(null);

    try {
      setUploadProgress(20);
      setUploadStatus("Reading file content...");
      
      const extractedText = await extractDocumentText(file);
      
      setUploadProgress(50);
      setUploadStatus("Uploading to storage...");

      const fileExt = file.name.split(".").pop()?.toLowerCase() || 'pdf';
      const fileName = `${user.id}/${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("documents")
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) {
        console.error("Storage upload error:", uploadError);
      }

      setUploadProgress(80);
      setUploadStatus("Saving to database...");

      const { data: source, error: dbError } = await supabase
        .from("sources")
        .insert({
          user_id: user.id,
          title: file.name.replace(/\.[^/.]+$/, ""),
          content: extractedText.slice(0, 10000),
          type: file.type === "application/pdf" ? "pdf" : file.type.includes("word") ? "docx" : "text",
          file_path: uploadError ? null : fileName,
        })
        .select()
        .single();

      if (dbError) {
        console.error("Database error:", dbError);
        setUploadError("Failed to save document info. Please try again.");
        if (!uploadError) {
          await supabase.storage.from("documents").remove([fileName]);
        }
      } else if (source) {
        setUploadProgress(100);
        setUploadStatus("Complete!");
        setSources((prev) => [source, ...prev]);
        
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        setTimeout(() => {
          setIsUploading(false);
          setUploadProgress(0);
          setUploadStatus("");
        }, 1500);
        return;
      }
    } catch (error) {
      console.error("Upload error:", error);
      setUploadError("An unexpected error occurred. Please try again.");
    } finally {
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
        setUploadStatus("");
      }, 1500);
    }
  };

  const deleteSource = async (sourceId: string, filePath: string) => {
    try {
      const { error: dbError } = await supabase
        .from("sources")
        .delete()
        .eq("id", sourceId);

      if (dbError) {
        console.error("Delete error:", dbError);
        return;
      }

      await supabase.storage.from("documents").remove([filePath]);
      setSources((prev) => prev.filter((s) => s.id !== sourceId));
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const handleSend = async (text: string = inputValue) => {
    if (!text.trim() || sources.length === 0) return;

    // Create a new conversation if none exists
    let conversationId = currentConversationId;
    if (!conversationId && user) {
      try {
        const conversation = await createChatConversation(user.id, text.slice(0, 50) + "...");
        conversationId = conversation.id;
        setCurrentConversationId(conversation.id);
        setConversations([conversation, ...conversations]);
      } catch (error) {
        console.error("Error creating conversation:", error);
      }
    }

    const newUserMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      text: text,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newUserMsg]);
    setInputValue("");
    setIsTyping(true);

    // Save user message to database
    if (conversationId && user) {
      try {
        await saveChatMessage(conversationId, user.id, "user", text);
      } catch (error) {
        console.error("Error saving user message:", error);
      }
    }

    try {
      const { text: responseText, citations } = await groqService.generateResponse(
        text,
        sources,
        messages
      );

      const botResponse: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "model",
        text: responseText,
        citations: citations,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botResponse]);

      // Save bot response to database
      if (conversationId && user) {
        try {
          await saveChatMessage(conversationId, user.id, "model", responseText, citations);
        } catch (error) {
          console.error("Error saving bot message:", error);
        }
      }
    } catch (error) {
      console.error("Chat error:", error);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "model",
        text: "I apologize, but I'm having trouble processing your request. Please try again.",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const speakText = (text: string, messageId: string) => {
    if (isSpeaking && speakingMessageId === messageId) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      setSpeakingMessageId(null);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    
    utterance.onend = () => {
      setIsSpeaking(false);
      setSpeakingMessageId(null);
    };

    window.speechSynthesis.speak(utterance);
    setIsSpeaking(true);
    setSpeakingMessageId(messageId);
  };

  const generateStudyGuide = async () => {
    if (sources.length === 0) return;
    
    try {
      const guide = await groqService.generateStudyGuide(sources, "Nigerian Law");
      setNotes(guide);
      setShowNotes(true);
    } catch (error) {
      console.error("Study guide error:", error);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const highlightCitation = (citation: Citation) => {
    setActiveCitation(citation);
    const source = sources.find((s) => s.id === citation.sourceId);
    if (source) {
      setShowSources(true);
    }
  };

  return (
    <div className="flex h-screen md:h-[calc(100vh-4rem)] bg-background overflow-hidden">
      {/* File Input Hidden */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".pdf,.txt,.doc,.docx"
        className="hidden"
      />

      {/* Left Panel - Sources (Desktop) */}
      <AnimatePresence>
        {showSources && (
          <motion.div
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="hidden md:flex fixed inset-0 z-40 md:relative md:inset-auto w-full md:w-80 border-r border-border bg-card md:bg-card/30 overflow-hidden flex-col"
          >
            <div className="p-3 md:p-4 border-b border-border">
              <div className="flex items-center justify-between mb-3 md:mb-4">
                <h2 className="font-display font-bold text-base md:text-lg flex items-center gap-2">
                  <HugeiconsIcon icon={BookOpen01Icon} className="w-5 h-5 text-brand" />
                  Sources
                </h2>
                <button
                  onClick={() => {
                    setShowSources(false);
                    setShowMobileSources(false);
                  }}
                  className="p-2 rounded-lg hover:bg-muted"
                >
                  <HugeiconsIcon icon={ArrowLeft02Icon} className="w-5 h-5" />
                </button>
              </div>
              
              {/* Upload Progress */}
              <AnimatePresence>
                {isUploading && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mb-3 p-3 rounded-xl bg-brand/5 border border-brand/20"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <HugeiconsIcon icon={FileUploadIcon} className="w-4 h-4 text-brand" />
                      <span className="text-xs font-medium text-brand">{uploadStatus}</span>
                      <span className="text-xs text-brand/70 ml-auto">{uploadProgress}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${uploadProgress}%` }}
                        transition={{ duration: 0.3 }}
                        className="h-full bg-brand rounded-full"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Upload Error */}
              <AnimatePresence>
                {uploadError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-3 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-start gap-2"
                  >
                    <HugeiconsIcon icon={AlertCircleIcon} className="w-4 h-4 flex-shrink-0 mt-0.5" />
                    <span>{uploadError}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="flex-1 overflow-y-auto p-3 md:p-4 space-y-2 md:space-y-3">
              {sources.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <HugeiconsIcon icon={File01Icon} className="w-10 h-10 md:w-12 mx-auto mb-3 opacity-30" />
                  <p className="text-xs md:text-sm">No documents uploaded yet</p>
                  <p className="text-[10px] text-muted-foreground/70 mt-1">Click the + button to upload</p>
                </div>
              ) : (
                sources.map((source) => (
                  <motion.div
                    key={source.id}
                    layout
                    className={`p-2.5 md:p-3 rounded-xl border transition-all cursor-pointer ${
                      activeCitation?.sourceId === source.id
                        ? "border-brand bg-brand/10"
                        : "border-border bg-card hover:border-brand/30"
                    }`}
                    onClick={() => setActiveCitation(null)}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center flex-shrink-0">
                          <HugeiconsIcon icon={File01Icon} className="w-4 h-4 text-brand" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="font-medium text-sm truncate">{source.title}</h3>
                          <p className="text-[10px] text-muted-foreground uppercase">{source.type}</p>
                        </div>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteSource(source.id, source.file_path || "");
                        }}
                        className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive flex-shrink-0 transition-colors"
                      >
                        <HugeiconsIcon icon={Delete02Icon} className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                      {source.content.slice(0, 120)}...
                    </p>
                    {activeCitation?.sourceId === source.id && (
                      <div className="mt-2 p-2 bg-brand/5 rounded-lg text-xs">
                        <span className="font-semibold">Referenced:</span> {activeCitation.text}
                      </div>
                    )}
                  </motion.div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Sources Popup Modal */}
      <AnimatePresence>
        {showMobileSources && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
              onClick={() => setShowMobileSources(false)}
            />
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed inset-4 top-20 bottom-20 z-50 md:hidden bg-card rounded-2xl shadow-2xl border border-border overflow-hidden flex flex-col"
            >
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h2 className="font-display font-bold text-lg flex items-center gap-2">
                  <HugeiconsIcon icon={BookOpen01Icon} className="w-5 h-5 text-brand" />
                  Uploaded Documents
                </h2>
                <button
                  onClick={() => setShowMobileSources(false)}
                  className="p-2 rounded-lg hover:bg-muted"
                >
                  <HugeiconsIcon icon={Cancel01Icon} className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {sources.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <HugeiconsIcon icon={File01Icon} className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">No documents uploaded yet</p>
                    <p className="text-xs text-muted-foreground/70 mt-1">Click the + button to upload</p>
                  </div>
                ) : (
                  sources.map((source) => (
                    <motion.div
                      key={source.id}
                      layout
                      className={`p-3 rounded-xl border transition-all cursor-pointer ${
                        activeCitation?.sourceId === source.id
                          ? "border-brand bg-brand/10"
                          : "border-border bg-card hover:border-brand/30"
                      }`}
                      onClick={() => setActiveCitation(null)}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex items-center gap-2 flex-1 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-brand/10 flex items-center justify-center flex-shrink-0">
                            <HugeiconsIcon icon={File01Icon} className="w-4 h-4 text-brand" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="font-medium text-sm truncate">{source.title}</h3>
                            <p className="text-[10px] text-muted-foreground uppercase">{source.type}</p>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteSource(source.id, source.file_path || "");
                          }}
                          className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive flex-shrink-0 transition-colors"
                        >
                          <HugeiconsIcon icon={Delete02Icon} className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                        {source.content.slice(0, 120)}...
                      </p>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Center Panel - Chat */}
      <div className="flex-1 flex flex-col min-w-0 w-full pb-16 md:pb-0">
        {/* Header */}
        <div className="flex items-center justify-between px-3 md:px-6 py-3 md:py-4 border-b border-border">
          <div className="flex items-center gap-2 md:gap-4 min-w-0">
            {!showSources && (
              <button
                onClick={() => setShowSources(true)}
                className="hidden md:flex p-2 rounded-lg hover:bg-muted flex-shrink-0"
              >
                <HugeiconsIcon icon={Menu01Icon} className="w-5 h-5" />
              </button>
            )}
            <div className="flex items-center gap-2 md:gap-3 min-w-0">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-brand to-brand-dim flex items-center justify-center text-white flex-shrink-0">
                <HugeiconsIcon icon={ArtificialIntelligence01Icon} className="w-4 h-4 md:w-5 md:h-5" />
              </div>
              <div className="min-w-0">
                <h1 className="font-display font-bold text-base md:text-lg truncate">Professor Steve</h1>
                <p className="text-[10px] md:text-xs text-muted-foreground hidden sm:block">AI Legal Research Assistant</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
            {/* Mobile History Button */}
            <button
              onClick={() => setShowHistory(true)}
              className="md:hidden p-2 rounded-lg hover:bg-muted"
              title="Chat History"
            >
              <HugeiconsIcon icon={Clock01Icon} className="w-5 h-5" />
            </button>
            {/* Mobile Sources Button */}
            <button
              onClick={() => setShowMobileSources(true)}
              className="md:hidden p-2 rounded-lg hover:bg-muted"
              title="View Uploaded PDFs"
            >
              <HugeiconsIcon icon={BookOpen01Icon} className="w-5 h-5" />
            </button>
            {/* History Button (Desktop) */}
            <button
              onClick={() => setShowHistory(true)}
              className="hidden md:flex p-2 rounded-lg hover:bg-muted"
              title="Chat History"
            >
              <HugeiconsIcon icon={Clock01Icon} className="w-5 h-5" />
            </button>
            
            <ModelSelector 
              currentModel={currentModel}
              onModelChange={setCurrentModel}
            />
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={generateStudyGuide}
              disabled={sources.length === 0}
              className="flex items-center gap-1.5 md:gap-2 px-2.5 md:px-4 py-2 rounded-lg bg-brand/10 text-brand hover:bg-brand/20 transition-all disabled:opacity-50 text-xs md:text-sm whitespace-nowrap"
            >
              <HugeiconsIcon icon={StudyLampIcon} className="w-3.5 h-3.5 md:w-4 md:h-4" />
              <span className="hidden sm:inline">Study Guide</span>
              <span className="sm:hidden">Guide</span>
            </motion.button>
            <button
              onClick={() => setShowNotes(!showNotes)}
              className="p-2 rounded-lg hover:bg-muted"
            >
              <HugeiconsIcon icon={PanelRightIcon} className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full px-3 md:px-4 pb-32 md:pb-40">
              <div className="text-center max-w-2xl w-full">
                <motion.div
                  className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-2xl bg-gradient-to-br from-brand to-brand-dim text-white mb-6 md:mb-8 shadow-xl shadow-brand/30"
                  animate={{
                    scale: [1, 1.05, 1],
                    rotate: [0, 5, -5, 0],
                  }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                >
                  <HugeiconsIcon icon={ArtificialIntelligence01Icon} className="w-8 h-8 md:w-10 md:h-10" />
                </motion.div>

                <motion.h1
                  className="text-2xl md:text-4xl font-display font-semibold text-foreground mb-3 md:mb-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  Professor Steve
                </motion.h1>
                <motion.p
                  className="text-sm md:text-lg text-muted-foreground mb-6 md:mb-10 px-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  Upload Nigerian legal documents and ask me anything. I&apos;ll provide
                  answers with citations.
                </motion.p>

                {sources.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="p-3 md:p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 mx-2"
                  >
                    <p className="text-xs md:text-sm font-medium mb-1">📚 Get Started</p>
                    <p className="text-[10px] md:text-xs opacity-90">Tap the + button below to upload documents</p>
                  </motion.div>
                ) : (
                  <motion.div
                    className="grid grid-cols-1 gap-2 md:gap-3 max-w-xl mx-auto px-2"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    {suggestedPrompts.map((prompt, index) => (
                      <motion.button
                        key={index}
                        onClick={() => handleSend(prompt.text)}
                        className="flex items-center gap-2 md:gap-3 p-3 md:p-4 rounded-xl border border-border/60 bg-card hover:bg-muted/50 hover:border-brand/30 transition-all text-left group"
                        whileHover={{ scale: 1.02, y: -2 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                      >
                        <span className="text-brand group-hover:scale-110 transition-transform flex-shrink-0">
                          <HugeiconsIcon icon={prompt.icon} className="w-4 h-4 md:w-5 md:h-5" />
                        </span>
                        <span className="text-xs md:text-sm text-foreground font-medium line-clamp-2">
                          {prompt.text}
                        </span>
                      </motion.button>
                    ))}
                  </motion.div>
                )}
              </div>
            </div>
          ) : (
            <div className="pb-36 md:pb-40">
              {messages.map((msg, index) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className={`py-4 md:py-6 ${msg.role === "user" ? "bg-background" : "bg-muted/30"}`}
                >
                  <div className="max-w-3xl mx-auto px-3 md:px-6">
                    <div className="flex gap-2.5 md:gap-4">
                      <div className="flex-shrink-0">
                        {msg.role === "user" ? (
                          <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-brand/10 flex items-center justify-center">
                            <HugeiconsIcon icon={UserIcon} className="w-4 h-4 md:w-5 md:h-5 text-brand" />
                          </div>
                        ) : (
                          <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-brand flex items-center justify-center">
                            <HugeiconsIcon icon={ArtificialIntelligence01Icon} className="w-4 h-4 md:w-5 md:h-5 text-white" />
                          </div>
                        )}
                      </div>

                      <div className="flex-1 min-w-0 overflow-hidden">
                        <div className="flex items-center justify-between mb-1.5 md:mb-2 gap-2">
                          <div className="flex items-center gap-1.5 md:gap-2 min-w-0">
                            <span className="font-semibold text-xs md:text-sm text-foreground">
                              {msg.role === "user" ? "You" : "Professor Steve"}
                            </span>
                            <span className="text-[10px] md:text-xs text-muted-foreground">
                              {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                            </span>
                          </div>
                          {msg.role === "model" && (
                            <button
                              onClick={() => speakText(msg.text, msg.id)}
                              className={`p-1 md:p-1.5 rounded-lg transition-colors flex-shrink-0 ${
                                isSpeaking && speakingMessageId === msg.id
                                  ? "bg-brand text-white"
                                  : "hover:bg-muted"
                              }`}
                            >
                              <HugeiconsIcon
                                icon={isSpeaking && speakingMessageId === msg.id ? PauseIcon : VolumeHighIcon}
                                className="w-3.5 h-3.5 md:w-4 md:h-4"
                              />
                            </button>
                          )}
                        </div>

                        <div className="text-sm md:text-base leading-relaxed text-foreground whitespace-pre-wrap mb-2 md:mb-3 break-words">
                          {msg.text}
                        </div>

                        {msg.citations && msg.citations.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 md:gap-2 mt-2">
                            {msg.citations.map((citation, idx) => (
                              <button
                                key={idx}
                                onClick={() => highlightCitation(citation)}
                                className="inline-flex items-center gap-1 px-2 py-0.5 md:px-2 md:py-1 rounded-lg bg-brand/10 text-brand text-[10px] md:text-xs hover:bg-brand/20 transition-colors"
                              >
                                <HugeiconsIcon icon={BookOpen01Icon} className="w-2.5 h-2.5 md:w-3 md:h-3" />
                                <span className="truncate max-w-[100px] md:max-w-[150px]">{citation.sourceTitle}</span>
                              </button>
                            ))}
                          </div>
                        )}
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
                    className="py-4 md:py-6 bg-muted/30"
                  >
                    <div className="max-w-3xl mx-auto px-3 md:px-6">
                      <div className="flex gap-2.5 md:gap-4">
                        <div className="flex-shrink-0">
                          <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-brand flex items-center justify-center">
                            <HugeiconsIcon icon={ArtificialIntelligence01Icon} className="w-4 h-4 md:w-5 md:h-5 text-white" />
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <motion.span
                            className="w-1.5 h-1.5 md:w-2 md:h-2 bg-brand/40 rounded-full"
                            animate={{ y: [0, -6, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                          />
                          <motion.span
                            className="w-1.5 h-1.5 md:w-2 md:h-2 bg-brand/40 rounded-full"
                            animate={{ y: [0, -6, 0] }}
                            transition={{ duration: 0.6, repeat: Infinity, delay: 0.15 }}
                          />
                          <motion.span
                            className="w-1.5 h-1.5 md:w-2 md:h-2 bg-brand/40 rounded-full"
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

        {/* Input Area - ChatGPT Style */}
        <div className="border-t border-border/50 bg-background p-3 md:p-4">
          <div className="max-w-3xl mx-auto">
            <div className="relative flex items-end gap-2 bg-muted/30 rounded-2xl border border-border/60 p-2 md:p-3 focus-within:border-brand/50 focus-within:bg-background transition-all">
              {/* Plus Button for Upload */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="flex-shrink-0 p-2 rounded-xl text-brand hover:bg-brand/10 transition-colors disabled:opacity-50"
                title="Upload document"
              >
                {isUploading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <HugeiconsIcon icon={Loading03Icon} className="w-5 h-5 md:w-6 md:h-6" />
                  </motion.div>
                ) : (
                  <HugeiconsIcon icon={PlusSignIcon} className="w-5 h-5 md:w-6 md:h-6" />
                )}
              </motion.button>
              
              {/* Text Input */}
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={
                  sources.length === 0
                    ? "Upload documents first to start chatting..."
                    : "Ask Professor Steve a legal question..."
                }
                rows={1}
                disabled={sources.length === 0}
                className="flex-1 bg-transparent resize-none focus:outline-none min-h-[40px] max-h-[120px] md:max-h-[200px] text-sm md:text-base py-2.5 disabled:opacity-50"
              />
              
              {/* Send Button */}
              <motion.button
                onClick={() => handleSend()}
                disabled={!inputValue.trim() || isTyping || sources.length === 0}
                className="flex-shrink-0 p-2 rounded-xl bg-brand text-white hover:bg-brand-dim disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <HugeiconsIcon icon={TelegramIcon} className="w-5 h-5 md:w-6 md:h-6" />
              </motion.button>
            </div>
            <p className="text-center mt-2 text-[10px] md:text-xs text-muted-foreground flex items-center justify-center gap-1">
              <HugeiconsIcon icon={Alert01Icon} className="w-2.5 h-2.5 md:w-3 md:h-3" />
              AI can make mistakes. Please verify important legal citations.
            </p>
          </div>
        </div>
      </div>

      {/* Right Panel - Notes */}
      <AnimatePresence>
        {showNotes && (
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 z-40 md:relative md:inset-auto w-full md:w-80 border-l border-border bg-card md:bg-card/30 overflow-hidden flex flex-col"
          >
            <div className="p-3 md:p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <h2 className="font-display font-bold text-base md:text-lg flex items-center gap-2">
                  <HugeiconsIcon icon={ClipboardIcon} className="w-5 h-5 text-brand" />
                  Notes
                </h2>
                <button
                  onClick={() => setShowNotes(false)}
                  className="p-2 rounded-lg hover:bg-muted md:hidden"
                >
                  <HugeiconsIcon icon={ArrowLeft02Icon} className="w-5 h-5 rotate-180" />
                </button>
                <button
                  onClick={() => setShowNotes(false)}
                  className="p-1 rounded-lg hover:bg-muted hidden md:block"
                >
                  <HugeiconsIcon icon={Menu01Icon} className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 p-3 md:p-4">
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Generated study guides and notes will appear here..."
                className="w-full h-full p-3 md:p-4 rounded-xl border border-border bg-card resize-none focus:outline-none focus:border-brand/50 text-xs md:text-sm leading-relaxed"
              />
            </div>

            <div className="p-3 md:p-4 border-t border-border">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => {
                  navigator.clipboard.writeText(notes);
                }}
                disabled={!notes}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-brand text-white hover:bg-brand-dim transition-all disabled:opacity-50 text-xs md:text-sm"
              >
                <HugeiconsIcon icon={ClipboardIcon} className="w-3.5 h-3.5 md:w-4 md:h-4" />
                Copy to Clipboard
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* History Panel - Desktop Sidebar */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ x: "-100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "-100%", opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="hidden md:flex fixed inset-0 z-50 md:relative md:inset-auto w-full md:w-80 border-r border-border bg-card md:bg-card/30 overflow-hidden flex-col"
          >
            <div className="p-3 md:p-4 border-b border-border">
              <div className="flex items-center justify-between">
                <h2 className="font-display font-bold text-base md:text-lg flex items-center gap-2">
                  <HugeiconsIcon icon={Clock01Icon} className="w-5 h-5 text-brand" />
                  Chat History
                </h2>
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={startNewConversation}
                    className="p-2 rounded-lg bg-brand text-white hover:bg-brand-dim transition-colors"
                    title="New Chat"
                  >
                    <HugeiconsIcon icon={PlusSignIcon} className="w-4 h-4" />
                  </motion.button>
                  <button
                    onClick={() => setShowHistory(false)}
                    className="p-2 rounded-lg hover:bg-muted"
                  >
                    <HugeiconsIcon icon={Cancel01Icon} className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 md:p-4">
              {conversations.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <HugeiconsIcon icon={Clock01Icon} className="w-10 h-10 md:w-12 mx-auto mb-3 opacity-30" />
                  <p className="text-xs md:text-sm">No conversations yet</p>
                  <p className="text-[10px] text-muted-foreground/70 mt-1">Start a new chat to begin</p>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={startNewConversation}
                    className="mt-4 px-4 py-2 rounded-lg bg-brand text-white text-sm hover:bg-brand-dim transition-colors"
                  >
                    Start New Chat
                  </motion.button>
                </div>
              ) : (
                <div className="space-y-2">
                  {conversations.map((conversation) => (
                    <motion.div
                      key={conversation.id}
                      layout
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        currentConversationId === conversation.id
                          ? "border-brand bg-brand/10"
                          : "border-border bg-card hover:border-brand/30"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div 
                          className="flex-1 min-w-0"
                          onClick={() => loadConversation(conversation.id)}
                        >
                          <h3 className="font-medium text-sm truncate">{conversation.title}</h3>
                          <p className="text-[10px] text-muted-foreground">
                            {new Date(conversation.updated_at).toLocaleDateString()}
                          </p>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteConversation(conversation.id);
                          }}
                          className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive flex-shrink-0 transition-colors"
                        >
                          <HugeiconsIcon icon={Delete02Icon} className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile History Popup Modal */}
      <AnimatePresence>
        {showHistory && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
              onClick={() => setShowHistory(false)}
            />
            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="fixed inset-4 top-20 bottom-20 z-50 md:hidden bg-card rounded-2xl shadow-2xl border border-border overflow-hidden flex flex-col"
            >
              <div className="p-4 border-b border-border flex items-center justify-between">
                <h2 className="font-display font-bold text-lg flex items-center gap-2">
                  <HugeiconsIcon icon={Clock01Icon} className="w-5 h-5 text-brand" />
                  Chat History
                </h2>
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={startNewConversation}
                    className="p-2 rounded-lg bg-brand text-white hover:bg-brand-dim transition-colors"
                    title="New Chat"
                  >
                    <HugeiconsIcon icon={PlusSignIcon} className="w-4 h-4" />
                  </motion.button>
                  <button
                    onClick={() => setShowHistory(false)}
                    className="p-2 rounded-lg hover:bg-muted"
                  >
                    <HugeiconsIcon icon={Cancel01Icon} className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4">
                {conversations.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <HugeiconsIcon icon={Clock01Icon} className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">No conversations yet</p>
                    <p className="text-xs text-muted-foreground/70 mt-1">Start a new chat to begin</p>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={startNewConversation}
                      className="mt-4 px-4 py-2 rounded-lg bg-brand text-white text-sm hover:bg-brand-dim transition-colors"
                    >
                      Start New Chat
                    </motion.button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {conversations.map((conversation) => (
                      <motion.div
                        key={conversation.id}
                        layout
                        className={`p-3 rounded-xl border cursor-pointer transition-all ${
                          currentConversationId === conversation.id
                            ? "border-brand bg-brand/10"
                            : "border-border bg-card hover:border-brand/30"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div 
                            className="flex-1 min-w-0"
                            onClick={() => loadConversation(conversation.id)}
                          >
                            <h3 className="font-medium text-sm truncate">{conversation.title}</h3>
                            <p className="text-[10px] text-muted-foreground">
                              {new Date(conversation.updated_at).toLocaleDateString()}
                            </p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteConversation(conversation.id);
                            }}
                            className="p-1.5 rounded-lg hover:bg-destructive/10 text-destructive flex-shrink-0 transition-colors"
                          >
                            <HugeiconsIcon icon={Delete02Icon} className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

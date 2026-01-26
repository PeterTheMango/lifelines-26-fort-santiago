"use client";

import { Send, BrainCircuit, User, FileText, ArrowLeft } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import type { ChatMessage, Citation } from "@/types/architect";

interface InventoryItem {
    name: string;
    emoji: string;
    quantity: number;
}

interface ChatInterfaceProps {
    // Context integration props
    messages: ChatMessage[];
    onSendMessage: (content: string) => Promise<void>;
    isLoading?: boolean;
    projectName?: string;
    onBack?: () => void;
    // Mode: 'planning' for full width, 'review' for side-by-side
    mode?: 'planning' | 'review';
}

export function ChatInterface({
    messages,
    onSendMessage,
    isLoading = false,
    projectName,
    onBack,
    mode = 'planning',
}: ChatInterfaceProps) {
    const [input, setInput] = useState("");
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Mock inventory data - would come from actual inventory system
    const inventoryItems: InventoryItem[] = [
        { name: "Rubble", emoji: "🪨", quantity: 450 },
        { name: "Timber", emoji: "🪵", quantity: 12 },
        { name: "Tires", emoji: "🛞", quantity: 40 },
        { name: "Tarps", emoji: "🎪", quantity: 8 },
    ];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || isSending) return;

        const userMsg = input;
        setInput("");
        setIsSending(true);

        try {
            await onSendMessage(userMsg);
        } catch (error) {
            console.error('Failed to send message:', error);
        } finally {
            setIsSending(false);
        }
    };

    const isCompact = mode === 'review';

    return (
        <div className="flex flex-col h-full bg-surface border border-border-subtle rounded-[var(--radius-lg)] overflow-hidden shadow-lg">
            {/* Header */}
            <div className="bg-surface-elevated p-4 border-b border-border-subtle">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        {onBack && (
                            <button
                                onClick={onBack}
                                className="p-1.5 -ml-1.5 text-text-muted hover:text-text-primary hover:bg-surface rounded-md transition-colors"
                                aria-label="Back to projects"
                            >
                                <ArrowLeft className="h-4 w-4" strokeWidth={2} />
                            </button>
                        )}
                        <BrainCircuit className="h-5 w-5 text-primary" strokeWidth={1.5} />
                        <div className="flex flex-col">
                            <span className="font-semibold text-text-primary text-sm tracking-wide">
                                AI Architect
                            </span>
                            {projectName && (
                                <span className="text-xs text-text-muted truncate max-w-[150px]">
                                    {projectName}
                                </span>
                            )}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className={`h-2 w-2 rounded-full ${isSending || isLoading ? 'bg-warning animate-pulse-warning' : 'bg-success animate-pulse-active'}`} />
                        <span className="text-xs text-text-secondary font-mono uppercase tracking-wider">
                            {isSending || isLoading ? 'Processing' : 'Online'}
                        </span>
                    </div>
                </div>

                {/* Context Chips - Available Inventory (hide in compact/review mode) */}
                {!isCompact && (
                    <div className="flex flex-wrap gap-2">
                        {inventoryItems.map((item, idx) => (
                            <div
                                key={idx}
                                className="px-3 py-1 bg-surface-elevated border border-border text-text-secondary rounded-[var(--radius-full)] text-xs font-mono flex items-center gap-1.5 hover:border-primary/30 transition-colors duration-200"
                                style={{ animationDelay: `${idx * 50}ms` }}
                            >
                                <span>{item.emoji}</span>
                                <span>
                                    {item.name} ×{item.quantity}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Chat Messages Area with Blueprint Grid */}
            <div
                className="flex-1 overflow-y-auto p-4 space-y-4 relative"
                style={{
                    backgroundImage:
                        "linear-gradient(var(--color-surface-elevated) 1px, transparent 1px), linear-gradient(90deg, var(--color-surface-elevated) 1px, transparent 1px)",
                    backgroundSize: "20px 20px",
                    backgroundColor: "var(--color-surface)",
                }}
            >
                {messages.map((msg, idx) => (
                    <div
                        key={msg.id || idx}
                        className={`flex gap-3 animate-slide-up ${
                            msg.role === "user" ? "justify-end" : "justify-start"
                        }`}
                        style={{ animationDelay: `${Math.min(idx * 50, 200)}ms` }}
                    >
                        {msg.role === "ai" && (
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
                                <BrainCircuit className="h-4 w-4 text-primary" strokeWidth={2} />
                            </div>
                        )}

                        <div
                            className={`max-w-[85%] rounded-[var(--radius-lg)] p-4 text-sm ${
                                msg.role === "user"
                                    ? "bg-surface-elevated text-text-primary shadow-md"
                                    : "bg-surface-elevated/50 text-text-secondary border-l-[3px] border-primary pl-4"
                            }`}
                        >
                            <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>

                            {/* Ready to generate indicator */}
                            {msg.isReadyToGenerate && (
                                <div className="mt-3 pt-2 border-t border-primary/20">
                                    <span className="text-xs text-primary font-medium flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse-active" />
                                        Ready to generate blueprint
                                    </span>
                                </div>
                            )}

                            {/* Citations */}
                            {msg.citations && msg.citations.length > 0 && (
                                <div className="mt-4 pt-3 border-t border-border-subtle space-y-2">
                                    {msg.citations.map((citation: Citation, citIdx: number) => (
                                        <button
                                            key={citIdx}
                                            className="flex items-start gap-2 text-xs text-info hover:text-info/80 transition-colors group w-full text-left"
                                        >
                                            <FileText
                                                className="h-3.5 w-3.5 mt-0.5 shrink-0"
                                                strokeWidth={2}
                                            />
                                            <div>
                                                <div className="font-medium group-hover:underline">
                                                    {citation.title}
                                                </div>
                                                <div className="text-text-muted font-mono">
                                                    {citation.reference}
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>

                        {msg.role === "user" && (
                            <div className="h-8 w-8 rounded-full bg-surface-elevated flex items-center justify-center border border-border-subtle shrink-0">
                                <User className="h-4 w-4 text-text-secondary" strokeWidth={2} />
                            </div>
                        )}
                    </div>
                ))}

                {/* Typing indicator when sending/loading */}
                {(isSending || isLoading) && (
                    <div className="flex gap-3 justify-start animate-fade-in">
                        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 shrink-0">
                            <BrainCircuit className="h-4 w-4 text-primary" strokeWidth={2} />
                        </div>
                        <div className="bg-surface-elevated/50 border-l-[3px] border-primary pl-4 pr-4 py-3 rounded-[var(--radius-lg)]">
                            <div className="flex items-center gap-1">
                                <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '0ms' }} />
                                <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '150ms' }} />
                                <span className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" style={{ animationDelay: '300ms' }} />
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-border-subtle bg-surface-elevated">
                <div className="flex gap-2">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                        disabled={isSending || isLoading}
                        className="flex-1 bg-background border border-border rounded-[var(--radius-md)] px-3 py-2.5 text-text-primary text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary placeholder:text-text-muted font-sans transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        placeholder={isCompact ? "Ask about this plan..." : "Describe what you need to build..."}
                    />
                    <button
                        onClick={handleSend}
                        disabled={!input.trim() || isSending || isLoading}
                        className="bg-primary hover:bg-primary/90 disabled:bg-primary/30 disabled:cursor-not-allowed text-text-inverse px-4 py-2.5 rounded-[var(--radius-md)] transition-all duration-200 active:scale-95 shadow-lg shadow-primary/20 hover:shadow-primary/30 disabled:shadow-none"
                    >
                        <Send className="h-5 w-5" strokeWidth={2} />
                    </button>
                </div>
                <p className="text-xs text-text-muted mt-2 font-mono">
                    Press Enter to send • Shift+Enter for new line
                </p>
            </div>
        </div>
    );
}

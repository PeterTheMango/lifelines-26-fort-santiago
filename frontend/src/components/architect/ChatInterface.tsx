"use client";

import { Send, Bot, User } from "lucide-react";
import { useState, useRef, useEffect } from "react";

export function ChatInterface() {
    const [messages, setMessages] = useState([
        { role: "ai", content: "Architect Online. Ready to generate construction plans based on available inventory." }
    ]);
    const [input, setInput] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = () => {
        if (!input.trim()) return;
        const userMsg = input;
        setMessages(prev => [...prev, { role: "user", content: userMsg }]);
        setInput("");

        // Simulate response
        setTimeout(() => {
            setMessages(prev => [...prev, { role: "ai", content: `Analyzing request: "${userMsg}"... \n\nFound 450kg Concrete Rubble and 12 Timber Beams available.\n\nGenerating structural plan...` }]);
        }, 1500);
    };

    return (
        <div className="flex flex-col h-full bg-surface border border-white/5 rounded-lg overflow-hidden shadow-sm">
            <div className="bg-white/5 p-4 border-b border-white/5 flex items-center gap-2">
                <Bot className="h-5 w-5 text-primary" />
                <span className="font-bold text-white uppercase tracking-wider text-sm">Tactical Chat</span>
                <div className="ml-auto flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-success animate-pulse"></span>
                    <span className="text-xs text-gray-400 font-mono">ONLINE</span>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.role === 'ai' && (
                            <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center border border-white/10 shrink-0">
                                <Bot className="h-4 w-4 text-primary" />
                            </div>
                        )}
                        <div className={`max-w-[80%] rounded-lg p-3 text-sm whitespace-pre-wrap ${msg.role === 'user'
                                ? 'bg-primary text-white shadow-md shadow-primary/10'
                                : 'bg-white/5 text-gray-200 border border-white/5 font-mono'
                            }`}>
                            {msg.content}
                        </div>
                        {msg.role === 'user' && (
                            <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center border border-white/10 shrink-0">
                                <User className="h-4 w-4 text-gray-400" />
                            </div>
                        )}
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-white/10 bg-white/[0.02]">
                <div className="flex gap-2">
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        className="flex-1 bg-background border border-white/10 rounded-md px-3 py-2 text-white text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary placeholder:text-gray-600 font-mono"
                        placeholder="Type instructions..."
                    />
                    <button onClick={handleSend} className="bg-primary hover:bg-primary/90 text-white p-2 rounded-md transition-all active:scale-95 shadow-lg shadow-primary/20">
                        <Send className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}

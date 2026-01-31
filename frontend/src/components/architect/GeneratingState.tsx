"use client";

import { Compass } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface GeneratingStateProps {
    progress: number; // 0-100
    message?: string;
    onComplete?: () => void;
}

const getStatusMessage = (progress: number): string => {
    if (progress < 20) return "Analyzing requirements...";
    if (progress < 40) return "Calculating material needs...";
    if (progress < 60) return "Designing structure...";
    if (progress < 80) return "Generating construction steps...";
    return "Finalizing blueprint...";
};

export function GeneratingState({ progress, message, onComplete }: GeneratingStateProps) {
    const [statusMessage, setStatusMessage] = useState(message || "Initializing...");
    const [isVisible, setIsVisible] = useState(true);

    // Update status message when progress or message changes
    useEffect(() => {
        if (message) {
            setStatusMessage(message);
        } else {
            setStatusMessage(getStatusMessage(progress));
        }
    }, [progress, message]);

    // Call onComplete when progress reaches 100
    useEffect(() => {
        if (progress >= 100 && onComplete) {
            const timer = setTimeout(() => {
                setIsVisible(false);
                setTimeout(() => onComplete(), 200); // Wait for fade-out animation
            }, 500); // Brief pause at 100% to show completion
            return () => clearTimeout(timer);
        }
    }, [progress, onComplete]);

    if (!isVisible && progress >= 100) return null;

    return (
        <div
            className={cn(
                "fixed inset-0 z-50 flex items-center justify-center",
                "bg-background/95 backdrop-blur-md",
                "transition-opacity duration-200",
                isVisible ? "opacity-100" : "opacity-0"
            )}
            role="status"
            aria-live="polite"
            aria-label={`Blueprint generation progress: ${progress}%`}
        >
            {/* Blueprint grid background */}
            <div className="absolute inset-0 blueprint-grid opacity-40" aria-hidden="true" />

            {/* Animated blueprint corner decorations */}
            <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-primary/30 animate-fade-in" aria-hidden="true" />
            <div className="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 border-primary/30 animate-fade-in" aria-hidden="true" />
            <div className="absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 border-primary/30 animate-fade-in" aria-hidden="true" />
            <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-primary/30 animate-fade-in" aria-hidden="true" />

            {/* Main content */}
            <div className="relative z-10 flex flex-col items-center max-w-md mx-auto px-6">
                {/* Animated compass icon */}
                <div className="relative mb-8">
                    {/* Outer glow rings */}
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-32 h-32 rounded-full bg-primary/10 animate-pulse-slow" aria-hidden="true" />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-24 h-24 rounded-full bg-primary/20 animate-pulse-active" aria-hidden="true" />
                    </div>

                    {/* Compass icon with rotation */}
                    <div className="relative flex items-center justify-center w-20 h-20">
                        <Compass
                            className="w-16 h-16 text-primary animate-spin-slow"
                            strokeWidth={1.5}
                            aria-hidden="true"
                        />
                    </div>
                </div>

                {/* Title */}
                <h2 className="text-2xl font-semibold text-text-primary mb-3 text-center animate-fade-in">
                    Generating Your Blueprint
                </h2>

                {/* Status message with staggered fade-in */}
                <p
                    className="text-base text-text-secondary mb-8 text-center min-h-[24px] transition-opacity duration-300"
                    key={statusMessage}
                >
                    {statusMessage}
                </p>

                {/* Progress bar container */}
                <div className="w-full max-w-sm">
                    {/* Progress percentage */}
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-mono text-text-muted">Progress</span>
                        <span className="text-sm font-mono text-primary font-semibold">
                            {Math.round(progress)}%
                        </span>
                    </div>

                    {/* Progress bar track */}
                    <div className="relative h-2 bg-surface-elevated rounded-full overflow-hidden border border-border-subtle">
                        {/* Progress bar fill with shimmer effect */}
                        <div
                            className="absolute inset-y-0 left-0 bg-primary rounded-full transition-all duration-500 ease-out"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                            aria-hidden="true"
                        >
                            {/* Shimmer overlay */}
                            <div
                                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer"
                                style={{
                                    backgroundSize: '200% 100%',
                                }}
                            />
                        </div>

                        {/* Subtle inner glow */}
                        <div
                            className="absolute inset-y-0 left-0 bg-gradient-to-r from-primary/50 to-transparent blur-sm transition-all duration-500 ease-out"
                            style={{ width: `${Math.min(progress, 100)}%` }}
                            aria-hidden="true"
                        />
                    </div>

                    {/* Technical detail line (blueprint aesthetic) */}
                    <div className="mt-6 pt-4 border-t border-border-subtle/50">
                        <div className="flex items-center justify-between text-xs font-mono text-text-muted">
                            <span>Process ID: BP-{Date.now().toString().slice(-6)}</span>
                            <span className="flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse-active" />
                                Active
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Accessibility: Screen reader only text */}
            <div className="sr-only" aria-live="polite" aria-atomic="true">
                {statusMessage} {Math.round(progress)}% complete.
            </div>
        </div>
    );
}

// Custom CSS for slow spin animation (add to globals.css if not present)
// @keyframes spin-slow {
//   from { transform: rotate(0deg); }
//   to { transform: rotate(360deg); }
// }

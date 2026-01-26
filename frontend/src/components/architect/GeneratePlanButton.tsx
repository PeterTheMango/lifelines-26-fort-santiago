"use client";

import { Sparkles } from "lucide-react";
import { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface GeneratePlanButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    visible: boolean;
    onClick: () => void;
    isLoading?: boolean;
}

export function GeneratePlanButton({
    visible,
    onClick,
    isLoading = false,
    className,
    ...props
}: GeneratePlanButtonProps) {
    if (!visible) return null;

    return (
        <div className="fixed bottom-6 right-6 z-40 animate-slide-up">
            <button
                onClick={onClick}
                disabled={isLoading}
                className={cn(
                    // Base styles
                    "group relative inline-flex items-center justify-center gap-2",
                    "px-6 py-3 rounded-lg font-semibold text-base",
                    "transition-all duration-200 ease-out",
                    "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background",
                    "disabled:opacity-50 disabled:pointer-events-none",
                    // Primary button styles
                    "bg-primary text-text-inverse",
                    "hover:brightness-110 hover:scale-105 hover:shadow-lg hover:shadow-primary/30",
                    "active:brightness-90 active:scale-95",
                    // Pulse animation for attention
                    !isLoading && "animate-pulse-active",
                    // Glow effect
                    "shadow-md shadow-primary/20",
                    className
                )}
                {...props}
            >
                {isLoading ? (
                    <>
                        <svg
                            className="animate-spin h-5 w-5 text-current"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                        >
                            <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                            />
                            <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            />
                        </svg>
                        <span>Generating...</span>
                    </>
                ) : (
                    <>
                        <Sparkles className="h-5 w-5 group-hover:rotate-12 transition-transform" />
                        <span>Generate Blueprint</span>
                    </>
                )}
            </button>

            {/* Decorative glow ring */}
            {!isLoading && (
                <div
                    className="absolute inset-0 rounded-lg bg-primary/20 blur-xl animate-pulse-slow -z-10"
                    aria-hidden="true"
                />
            )}
        </div>
    );
}

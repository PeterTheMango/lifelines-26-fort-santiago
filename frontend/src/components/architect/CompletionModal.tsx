"use client";

import { CheckCircle, Share2, Download, Home } from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { Button } from "@/components/ui/Button";
import { cn } from "@/lib/utils";

interface CompletionModalProps {
    isOpen: boolean;
    onClose: () => void;
    summary: {
        projectName: string;
        totalSteps: number;
        completedSteps: number;
        materialsUsed: Array<{
            name: string;
            quantity: number;
            emoji?: string;
            unit?: string;
        }>;
        estimatedTime: string;
        completedAt: Date;
    };
    onShare?: () => void;
    onDownload?: () => void;
    onBackToDashboard: () => void;
}

export function CompletionModal({
    isOpen,
    onClose,
    summary,
    onShare,
    onDownload,
    onBackToDashboard,
}: CompletionModalProps) {
    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
        }).format(date);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="">
            <div className="relative">
                {/* Celebration confetti effect (CSS-only, subtle) */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
                    <div className="confetti-piece confetti-1" />
                    <div className="confetti-piece confetti-2" />
                    <div className="confetti-piece confetti-3" />
                    <div className="confetti-piece confetti-4" />
                    <div className="confetti-piece confetti-5" />
                    <div className="confetti-piece confetti-6" />
                </div>

                {/* Content */}
                <div className="text-center mb-6">
                    {/* Success icon with pulse */}
                    <div className="inline-flex items-center justify-center mb-4">
                        <div className="relative">
                            {/* Outer glow ring */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-20 h-20 rounded-full bg-success/20 animate-pulse-slow" />
                            </div>
                            {/* Icon */}
                            <CheckCircle
                                className="w-16 h-16 text-success relative z-10"
                                strokeWidth={2}
                            />
                        </div>
                    </div>

                    {/* Heading */}
                    <h2 className="text-2xl font-bold text-text-primary mb-2">
                        Congratulations!
                    </h2>

                    {/* Subtext */}
                    <p className="text-base text-text-secondary">
                        Your blueprint has been completed
                    </p>
                </div>

                {/* Summary card */}
                <div className="bg-surface border border-border-subtle rounded-lg p-5 mb-6">
                    {/* Project name */}
                    <div className="mb-4 pb-4 border-b border-border-subtle">
                        <h3 className="text-lg font-semibold text-text-primary mb-1">
                            {summary.projectName}
                        </h3>
                        <p className="text-sm text-text-muted font-mono">
                            Completed {formatDate(summary.completedAt)}
                        </p>
                    </div>

                    {/* Stats grid */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                        {/* Steps completed */}
                        <div>
                            <div className="text-xs text-text-muted uppercase tracking-wide mb-1">
                                Steps
                            </div>
                            <div className="text-xl font-semibold text-text-primary font-mono">
                                {summary.completedSteps}/{summary.totalSteps}
                            </div>
                            <div className="text-xs text-success mt-1">
                                {summary.completedSteps === summary.totalSteps ? 'Complete' : 'In Progress'}
                            </div>
                        </div>

                        {/* Estimated time */}
                        <div>
                            <div className="text-xs text-text-muted uppercase tracking-wide mb-1">
                                Est. Time
                            </div>
                            <div className="text-xl font-semibold text-text-primary">
                                {summary.estimatedTime}
                            </div>
                            <div className="text-xs text-text-muted mt-1">
                                Build duration
                            </div>
                        </div>
                    </div>

                    {/* Materials used */}
                    <div>
                        <div className="text-xs text-text-muted uppercase tracking-wide mb-2">
                            Materials Required
                        </div>
                        <div className="space-y-2">
                            {summary.materialsUsed.slice(0, 4).map((material, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between text-sm"
                                >
                                    <div className="flex items-center gap-2">
                                        {material.emoji && (
                                            <span className="text-base" aria-hidden="true">
                                                {material.emoji}
                                            </span>
                                        )}
                                        <span className="text-text-secondary">
                                            {material.name}
                                        </span>
                                    </div>
                                    <span className="font-mono text-text-primary font-medium">
                                        {material.quantity} {material.unit || 'units'}
                                    </span>
                                </div>
                            ))}
                            {summary.materialsUsed.length > 4 && (
                                <div className="text-xs text-text-muted pt-1">
                                    + {summary.materialsUsed.length - 4} more materials
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                    {/* Share button */}
                    {onShare && (
                        <Button
                            variant="secondary"
                            className="flex-1 gap-2"
                            onClick={onShare}
                        >
                            <Share2 className="w-4 h-4" />
                            Share Blueprint
                        </Button>
                    )}

                    {/* Download button */}
                    {onDownload && (
                        <Button
                            variant="secondary"
                            className="flex-1 gap-2"
                            onClick={onDownload}
                        >
                            <Download className="w-4 h-4" />
                            Download PDF
                        </Button>
                    )}
                </div>

                {/* Primary action - Back to Dashboard */}
                <Button
                    variant="primary"
                    className="w-full mt-3 gap-2"
                    onClick={onBackToDashboard}
                >
                    <Home className="w-4 h-4" />
                    Back to Dashboard
                </Button>
            </div>

            <style jsx>{`
                @media (prefers-reduced-motion: no-preference) {
                    .confetti-piece {
                        position: absolute;
                        width: 8px;
                        height: 8px;
                        border-radius: 2px;
                        opacity: 0;
                        animation: confetti-fall 3s ease-out forwards;
                    }

                    .confetti-1 {
                        background: var(--color-primary);
                        top: -10%;
                        left: 10%;
                        animation-delay: 0s;
                    }

                    .confetti-2 {
                        background: var(--color-success);
                        top: -10%;
                        left: 30%;
                        animation-delay: 0.2s;
                    }

                    .confetti-3 {
                        background: var(--color-warning);
                        top: -10%;
                        left: 50%;
                        animation-delay: 0.4s;
                    }

                    .confetti-4 {
                        background: var(--color-primary);
                        top: -10%;
                        right: 30%;
                        animation-delay: 0.1s;
                    }

                    .confetti-5 {
                        background: var(--color-success);
                        top: -10%;
                        right: 15%;
                        animation-delay: 0.3s;
                    }

                    .confetti-6 {
                        background: var(--color-info);
                        top: -10%;
                        left: 70%;
                        animation-delay: 0.5s;
                    }

                    @keyframes confetti-fall {
                        0% {
                            opacity: 0;
                            transform: translateY(0) rotate(0deg);
                        }
                        10% {
                            opacity: 1;
                        }
                        100% {
                            opacity: 0;
                            transform: translateY(300px) rotate(720deg);
                        }
                    }
                }

                @media (prefers-reduced-motion: reduce) {
                    .confetti-piece {
                        display: none;
                    }
                }
            `}</style>
        </Modal>
    );
}

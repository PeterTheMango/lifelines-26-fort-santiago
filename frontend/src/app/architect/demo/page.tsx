"use client";

import { useState, useEffect } from "react";
import { GeneratePlanButton } from "@/components/architect/GeneratePlanButton";
import { GeneratingState } from "@/components/architect/GeneratingState";
import { CompletionModal } from "@/components/architect/CompletionModal";
import { Button } from "@/components/ui/Button";
import { RotateCcw } from "lucide-react";

/**
 * Demo page for testing the Generation & Completion components
 *
 * This page demonstrates the complete flow:
 * 1. GeneratePlanButton appears and pulses for attention
 * 2. User clicks to start generation
 * 3. GeneratingState shows full-screen with progress
 * 4. CompletionModal celebrates successful completion
 *
 * Access at: /architect/demo
 */
export default function ArchitectDemoPage() {
    const [isReadyToGenerate, setIsReadyToGenerate] = useState(true);
    const [isGenerating, setIsGenerating] = useState(false);
    const [progress, setProgress] = useState(0);
    const [showCompletion, setShowCompletion] = useState(false);

    // Mock blueprint summary data
    const blueprintSummary = {
        projectName: "Emergency Shelter with Rainwater Collection",
        totalSteps: 5,
        completedSteps: 5,
        materialsUsed: [
            { name: "Used Tires", quantity: 40, emoji: "🛞", unit: "units" },
            { name: "Earth/Soil", quantity: 200, emoji: "🪨", unit: "kg" },
            { name: "Timber Beams", quantity: 12, emoji: "🪵", unit: "beams" },
            { name: "Corrugated Metal", quantity: 8, emoji: "🏗️", unit: "sheets" },
            { name: "PVC Pipe", quantity: 15, emoji: "⚙️", unit: "meters" },
            { name: "Plastic Tarps", quantity: 3, emoji: "🎪", unit: "units" },
        ],
        estimatedTime: "2-3 days",
        completedAt: new Date(),
    };

    // Simulate progress when generating
    useEffect(() => {
        if (isGenerating) {
            const interval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        return 100;
                    }
                    // Simulate realistic progress with variable speed
                    const increment = Math.random() * 8 + 2; // 2-10% jumps
                    return Math.min(prev + increment, 100);
                });
            }, 400); // Update every 400ms

            return () => clearInterval(interval);
        }
    }, [isGenerating]);

    const handleGenerateBlueprint = () => {
        setIsGenerating(true);
        setProgress(0);
    };

    const handleGenerationComplete = () => {
        setIsGenerating(false);
        setShowCompletion(true);
    };

    const handleReset = () => {
        setIsGenerating(false);
        setProgress(0);
        setShowCompletion(false);
        setIsReadyToGenerate(true);
    };

    const handleShare = () => {
        alert("Share functionality would be implemented here!\n\nCould integrate with:\n- Web Share API\n- Email\n- WhatsApp\n- SMS");
    };

    const handleDownload = () => {
        alert("Download PDF functionality would be implemented here!\n\nWould generate a PDF with:\n- Blueprint diagrams\n- Step-by-step instructions\n- Materials list\n- Safety guidelines");
    };

    const handleBackToDashboard = () => {
        alert("This would navigate back to the dashboard.\n\nIn production: router.push('/dashboard')");
        handleReset();
    };

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-text-primary mb-2">
                        AI Architect Components Demo
                    </h1>
                    <p className="text-text-secondary">
                        Interactive demonstration of the Generation & Completion flow
                    </p>
                </div>

                {/* Demo Controls */}
                <div className="bg-surface border border-border-subtle rounded-lg p-6 mb-6">
                    <h2 className="text-xl font-semibold text-text-primary mb-4">
                        Demo Controls
                    </h2>

                    <div className="space-y-4">
                        {/* Component Status */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-surface-elevated rounded-lg p-4">
                                <div className="text-sm text-text-muted mb-1">Generate Button</div>
                                <div className={`text-lg font-semibold ${isReadyToGenerate ? 'text-success' : 'text-text-muted'}`}>
                                    {isReadyToGenerate ? 'Visible' : 'Hidden'}
                                </div>
                            </div>

                            <div className="bg-surface-elevated rounded-lg p-4">
                                <div className="text-sm text-text-muted mb-1">Generating State</div>
                                <div className={`text-lg font-semibold ${isGenerating ? 'text-primary' : 'text-text-muted'}`}>
                                    {isGenerating ? `${Math.round(progress)}%` : 'Inactive'}
                                </div>
                            </div>

                            <div className="bg-surface-elevated rounded-lg p-4">
                                <div className="text-sm text-text-muted mb-1">Completion Modal</div>
                                <div className={`text-lg font-semibold ${showCompletion ? 'text-success' : 'text-text-muted'}`}>
                                    {showCompletion ? 'Open' : 'Closed'}
                                </div>
                            </div>
                        </div>

                        {/* Reset Button */}
                        <div className="pt-4 border-t border-border-subtle">
                            <Button
                                variant="secondary"
                                onClick={handleReset}
                                className="gap-2"
                            >
                                <RotateCcw className="w-4 h-4" />
                                Reset Demo
                            </Button>
                        </div>
                    </div>
                </div>

                {/* Instructions */}
                <div className="bg-surface-elevated border border-border rounded-lg p-6 mb-6">
                    <h2 className="text-xl font-semibold text-text-primary mb-4">
                        How to Test
                    </h2>

                    <ol className="list-decimal list-inside space-y-3 text-text-secondary">
                        <li>
                            <strong className="text-text-primary">GeneratePlanButton:</strong> Look for the floating button in the bottom-right corner.
                            Notice the pulse animation and glow effect.
                        </li>
                        <li>
                            <strong className="text-text-primary">Click to Generate:</strong> Click the "Generate Blueprint" button to start the process.
                        </li>
                        <li>
                            <strong className="text-text-primary">GeneratingState:</strong> Watch the full-screen overlay with:
                            <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                                <li>Blueprint grid background</li>
                                <li>Rotating compass icon</li>
                                <li>Animated progress bar with shimmer</li>
                                <li>Status messages that change as progress increases</li>
                            </ul>
                        </li>
                        <li>
                            <strong className="text-text-primary">CompletionModal:</strong> When progress reaches 100%, the celebration modal appears with:
                            <ul className="list-disc list-inside ml-6 mt-2 space-y-1">
                                <li>Success icon with pulse animation</li>
                                <li>Project summary and stats</li>
                                <li>Materials list with emojis</li>
                                <li>Action buttons (try clicking them!)</li>
                                <li>Subtle confetti animation (if motion is enabled)</li>
                            </ul>
                        </li>
                        <li>
                            <strong className="text-text-primary">Reset:</strong> Use the "Reset Demo" button above to start over.
                        </li>
                    </ol>
                </div>

                {/* Design Notes */}
                <div className="bg-surface border border-border-subtle rounded-lg p-6">
                    <h2 className="text-xl font-semibold text-text-primary mb-4">
                        Design System Notes
                    </h2>

                    <div className="space-y-3 text-sm text-text-secondary">
                        <div className="flex items-start gap-3">
                            <div className="w-4 h-4 rounded-full bg-primary mt-0.5 flex-shrink-0" />
                            <div>
                                <strong className="text-text-primary">Primary Teal (#2DD4BF):</strong> Used for buttons, progress bars, and active states
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="w-4 h-4 rounded-full bg-success mt-0.5 flex-shrink-0" />
                            <div>
                                <strong className="text-text-primary">Success Green (#4ADE80):</strong> Used for completion states and positive indicators
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <div className="w-4 h-4 rounded bg-surface-elevated border border-border-subtle mt-0.5 flex-shrink-0" />
                            <div>
                                <strong className="text-text-primary">Blueprint Grid:</strong> Technical aesthetic using subtle grid pattern on dark background
                            </div>
                        </div>

                        <div className="flex items-start gap-3">
                            <span className="text-lg mt-0.5 flex-shrink-0">✨</span>
                            <div>
                                <strong className="text-text-primary">Animations:</strong> All animations respect prefers-reduced-motion.
                                Pulse, shimmer, rotation, and fade effects create a professional, confidence-building experience.
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* The actual components being demoed */}
            <GeneratePlanButton
                visible={isReadyToGenerate && !isGenerating && !showCompletion}
                onClick={handleGenerateBlueprint}
                isLoading={isGenerating}
            />

            {isGenerating && (
                <GeneratingState
                    progress={progress}
                    onComplete={handleGenerationComplete}
                />
            )}

            <CompletionModal
                isOpen={showCompletion}
                onClose={() => setShowCompletion(false)}
                summary={blueprintSummary}
                onShare={handleShare}
                onDownload={handleDownload}
                onBackToDashboard={handleBackToDashboard}
            />
        </div>
    );
}

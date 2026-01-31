"use client";

import { FileText, Download, Share2, Maximize2, AlertCircle, ChevronLeft, ChevronRight, CheckCircle } from "lucide-react";
import type { Blueprint, Material, ConstructionStep } from "@/types/architect";

interface PlanViewerProps {
    plan: Blueprint | null;
    currentStepIndex: number;
    onNavigateToStep: (stepIndex: number) => void;
    onComplete?: () => void;
    isCompleted?: boolean;
}

export function PlanViewer({
    plan,
    currentStepIndex,
    onNavigateToStep,
    onComplete,
    isCompleted = false,
}: PlanViewerProps) {
    // If no plan, show placeholder
    if (!plan) {
        return (
            <div className="flex flex-col h-full bg-surface border border-border-subtle rounded-[var(--radius-lg)] overflow-hidden shadow-lg">
                <div className="bg-surface-elevated p-4 border-b border-border-subtle flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2">
                        <FileText className="h-5 w-5 text-text-muted" strokeWidth={1.5} />
                        <span className="font-semibold text-text-primary text-sm tracking-wide">
                            Blueprint Viewer
                        </span>
                    </div>
                </div>
                <div
                    className="flex-1 flex items-center justify-center p-8"
                    style={{
                        backgroundImage:
                            "linear-gradient(var(--color-surface-elevated) 1px, transparent 1px), linear-gradient(90deg, var(--color-surface-elevated) 1px, transparent 1px)",
                        backgroundSize: "20px 20px",
                        backgroundColor: "var(--color-surface)",
                    }}
                >
                    <div className="text-center max-w-md">
                        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-surface-elevated border border-border-subtle flex items-center justify-center">
                            <FileText className="h-8 w-8 text-text-muted" strokeWidth={1.5} />
                        </div>
                        <h3 className="text-lg font-semibold text-text-primary mb-2">No Blueprint Yet</h3>
                        <p className="text-sm text-text-secondary">
                            Chat with the AI Architect to describe your project. Once you have enough details, generate a blueprint to see it here.
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    const getMaterialPercentage = (material: Material): number => {
        return Math.min((material.available / material.required) * 100, 100);
    };

    const getMaterialStatus = (
        material: Material
    ): { color: string; status: string; barColor: string } => {
        const percentage = getMaterialPercentage(material);
        if (percentage >= 100)
            return { color: "text-success", status: "Available", barColor: "bg-success" };
        if (percentage >= 75)
            return { color: "text-warning", status: "Low Stock", barColor: "bg-warning" };
        return { color: "text-danger", status: "Insufficient", barColor: "bg-danger" };
    };

    const totalPages = plan.steps.length + 1; // Overview + each step
    const isOverviewPage = currentStepIndex === 0;
    const currentStep = isOverviewPage ? null : plan.steps[currentStepIndex - 1];
    const isLastStep = currentStepIndex === totalPages - 1;

    const handleNext = () => {
        if (currentStepIndex < totalPages - 1) {
            onNavigateToStep(currentStepIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentStepIndex > 0) {
            onNavigateToStep(currentStepIndex - 1);
        }
    };

    const handleComplete = () => {
        if (onComplete) {
            onComplete();
        }
    };

    return (
        <div className="flex flex-col h-full bg-surface border border-border-subtle rounded-[var(--radius-lg)] overflow-hidden shadow-lg">
            {/* Header */}
            <div className="bg-surface-elevated p-4 border-b border-border-subtle flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-text-muted" strokeWidth={1.5} />
                    <span className="font-semibold text-text-primary text-sm tracking-wide">
                        Blueprint Viewer
                    </span>
                    {isCompleted && (
                        <span className="ml-2 px-2 py-0.5 bg-success/20 text-success text-xs font-medium rounded-full flex items-center gap-1">
                            <CheckCircle className="h-3 w-3" />
                            Completed
                        </span>
                    )}
                </div>
                <div className="flex gap-3">
                    <button
                        className="text-text-muted hover:text-text-primary transition-colors p-1"
                        aria-label="Share plan"
                    >
                        <Share2 className="h-4 w-4" strokeWidth={2} />
                    </button>
                    <button
                        className="text-text-muted hover:text-text-primary transition-colors p-1"
                        aria-label="Download plan"
                    >
                        <Download className="h-4 w-4" strokeWidth={2} />
                    </button>
                    <button
                        className="text-text-muted hover:text-text-primary transition-colors p-1"
                        aria-label="Fullscreen"
                    >
                        <Maximize2 className="h-4 w-4" strokeWidth={2} />
                    </button>
                </div>
            </div>

            {/* Blueprint Content with Grid Background */}
            <div
                className="flex-1 p-6 md:p-8 overflow-y-auto relative flex flex-col"
                style={{
                    backgroundImage:
                        "linear-gradient(var(--color-surface-elevated) 1px, transparent 1px), linear-gradient(90deg, var(--color-surface-elevated) 1px, transparent 1px)",
                    backgroundSize: "20px 20px",
                    backgroundColor: "var(--color-surface)",
                }}
            >
                <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col relative z-10">
                    {/* Page Content */}
                    <div className="flex-1 space-y-6 mb-6">
                        {isOverviewPage ? (
                            /* OVERVIEW PAGE - Materials + Diagram */
                            <>
                                {/* Title Card */}
                                <div className="border-2 border-primary/30 p-6 rounded-[var(--radius-lg)] bg-surface-elevated/80 backdrop-blur-sm animate-slide-up">
                                    <div className="flex items-start justify-between mb-4">
                                        <h1 className="text-2xl font-bold text-text-primary font-mono tracking-tight">
                                            CONSTRUCTION PLAN: {plan.title.toUpperCase()}
                                        </h1>
                                    </div>

                                    {/* Description */}
                                    {plan.description && (
                                        <p className="text-text-secondary text-sm mb-4 leading-relaxed">
                                            {plan.description}
                                        </p>
                                    )}

                                    {/* Metadata Badges */}
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        <div className="px-3 py-1.5 bg-surface border border-border-subtle rounded-[var(--radius-full)] text-xs font-mono uppercase tracking-wider">
                                            <span className="text-text-muted">Est. Time: </span>
                                            <span className="text-text-secondary">{plan.metadata.estimatedTime}</span>
                                        </div>
                                        <div className="px-3 py-1.5 bg-surface border border-border-subtle rounded-[var(--radius-full)] text-xs font-mono uppercase tracking-wider">
                                            <span className="text-text-muted">Difficulty: </span>
                                            <span className={
                                                plan.metadata.difficulty === 'Easy' ? 'text-success' :
                                                    plan.metadata.difficulty === 'Moderate' ? 'text-warning' :
                                                        plan.metadata.difficulty === 'Challenging' ? 'text-danger' :
                                                            'text-danger'
                                            }>{plan.metadata.difficulty}</span>
                                        </div>
                                        <div className="px-3 py-1.5 bg-surface border border-border-subtle rounded-[var(--radius-full)] text-xs font-mono uppercase tracking-wider">
                                            <span className="text-text-muted">Team Size: </span>
                                            <span className="text-text-secondary">{plan.metadata.teamSize}</span>
                                        </div>
                                    </div>

                                    {/* Materials Required Section */}
                                    <div>
                                        <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wide mb-3 flex items-center gap-2">
                                            <span className="w-1 h-4 bg-primary" />
                                            Materials Required
                                        </h3>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {plan.materials.map((material, idx) => {
                                                const status = getMaterialStatus(material);
                                                const percentage = getMaterialPercentage(material);

                                                return (
                                                    <div
                                                        key={idx}
                                                        className="bg-surface/50 border border-border-subtle rounded-[var(--radius-md)] p-3 hover:border-border transition-colors animate-slide-up"
                                                        style={{ animationDelay: `${idx * 50}ms` }}
                                                    >
                                                        <div className="flex items-center justify-between mb-2">
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-lg">{material.emoji}</span>
                                                                <span className="font-mono text-sm text-text-primary">
                                                                    {material.name} ×{material.required} {material.unit}
                                                                </span>
                                                            </div>
                                                            <span
                                                                className={`text-xs font-mono uppercase tracking-wider ${status.color}`}
                                                            >
                                                                {status.status}
                                                            </span>
                                                        </div>

                                                        {/* Progress Bar */}
                                                        <div className="flex items-center gap-2">
                                                            <div className="flex-1 h-2 bg-surface rounded-full overflow-hidden border border-border-subtle">
                                                                <div
                                                                    className={`h-full ${status.barColor} transition-all duration-500 ease-out`}
                                                                    style={{ width: `${percentage}%` }}
                                                                />
                                                            </div>
                                                            <span className="text-xs font-mono text-text-muted w-12 text-right">
                                                                {percentage.toFixed(0)}%
                                                            </span>
                                                        </div>

                                                        {/* Stock Info */}
                                                        <div className="text-xs text-text-muted font-mono mt-1">
                                                            Available: {material.available} {material.unit}
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>

                                        {/* Warning for insufficient materials */}
                                        {plan.materials.some((m) => getMaterialPercentage(m) < 100) && (
                                            <div className="flex items-start gap-2 p-3 bg-warning/10 border border-warning/30 rounded-[var(--radius-md)] mt-4">
                                                <AlertCircle
                                                    className="h-4 w-4 text-warning shrink-0 mt-0.5"
                                                    strokeWidth={2}
                                                />
                                                <div className="text-xs text-warning leading-relaxed">
                                                    <strong>Insufficient materials detected.</strong> Please
                                                    resupply before starting construction or adjust the plan.
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Blueprint Diagram */}
                                <div className="border border-border-subtle p-6 rounded-[var(--radius-lg)] bg-surface-elevated/50 backdrop-blur-sm animate-slide-up" style={{ animationDelay: '100ms' }}>
                                    <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wide mb-4 flex items-center gap-2">
                                        <span className="w-1 h-4 bg-primary" />
                                        Structural Diagram
                                    </h3>

                                    <div className="aspect-video bg-background rounded-[var(--radius-md)] border border-border-subtle flex items-center justify-center relative overflow-hidden shadow-inner">
                                        {plan.imageUrl ? (
                                            <img
                                                src={plan.imageUrl}
                                                alt="Strategic Structural Overview"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            /* Generic Project Visualization Placeholder */
                                            <div className="relative w-full h-full flex flex-col justify-center items-center p-8 text-center">
                                                {/* Dynamic content if image available, or generic illustration if not */}
                                                <div className="w-24 h-24 mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <span className="text-4xl">🏗️</span>
                                                </div>
                                                <h4 className="text-primary font-mono font-bold mb-2">STRUCTURAL OVERVIEW</h4>
                                                <p className="text-text-muted text-sm max-w-sm">
                                                    Detailed structural diagrams will be generated based on specific material requirements:
                                                    <span className="text-text-secondary ml-1 font-medium">
                                                        {plan.materials.slice(0, 2).map(m => m.name).join(' + ')} construction
                                                    </span>
                                                </p>
                                            </div>
                                        )}

                                        {/* Figure label */}
                                        <div className="absolute bottom-2 right-2 text-xs text-primary/70 font-mono bg-background/80 px-2 py-0.5 rounded">
                                            FIG 1.1: CONCEPTUAL ELEVATION
                                        </div>
                                    </div>
                                </div>

                                {/* Steps Overview */}
                                <div className="border border-border-subtle p-6 rounded-[var(--radius-lg)] bg-surface-elevated/50 backdrop-blur-sm animate-slide-up" style={{ animationDelay: '150ms' }}>
                                    <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wide mb-4 flex items-center gap-2">
                                        <span className="w-1 h-4 bg-primary" />
                                        Construction Steps ({plan.steps.length} total)
                                    </h3>
                                    <div className="space-y-2">
                                        {plan.steps.map((step, idx) => (
                                            <button
                                                key={step.id}
                                                onClick={() => onNavigateToStep(idx + 1)}
                                                className="w-full flex items-center gap-3 p-3 bg-surface/50 border border-border-subtle rounded-[var(--radius-md)] hover:border-primary/30 hover:bg-surface transition-all text-left group"
                                            >
                                                <div className="w-8 h-8 rounded-md bg-primary/20 border border-primary/30 flex items-center justify-center shrink-0">
                                                    <span className="text-primary font-bold font-mono text-sm">
                                                        {step.stepNumber}
                                                    </span>
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="font-medium text-text-primary text-sm group-hover:text-primary transition-colors">
                                                        {step.title}
                                                    </div>
                                                    {step.estimatedTime && (
                                                        <div className="text-xs text-text-muted font-mono">
                                                            Est. {step.estimatedTime}
                                                        </div>
                                                    )}
                                                </div>
                                                <ChevronRight className="h-4 w-4 text-text-muted group-hover:text-primary transition-colors" />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </>
                        ) : (
                            /* STEP PAGE - Individual Step */
                            currentStep && (
                                <div className="border-2 border-primary/30 rounded-[var(--radius-lg)] bg-surface-elevated/80 backdrop-blur-sm overflow-hidden h-full flex flex-col animate-slide-up">
                                    {/* Step Header */}
                                    <div className="p-6 border-b border-border-subtle">
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="w-12 h-12 rounded-[var(--radius-md)] bg-primary/20 border-2 border-primary/30 flex items-center justify-center">
                                                <span className="text-primary font-bold font-mono text-xl">
                                                    {currentStep.stepNumber}
                                                </span>
                                            </div>
                                            <div>
                                                <h2 className="text-2xl font-bold text-text-primary font-mono">
                                                    {currentStep.title}
                                                </h2>
                                                {currentStep.estimatedTime && (
                                                    <p className="text-sm text-text-muted font-mono">
                                                        Estimated time: {currentStep.estimatedTime}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Step Content - Two Column Layout */}
                                    <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-0">
                                        {/* Left Column - Description & Materials */}
                                        <div className="p-6 flex flex-col justify-between border-r border-border-subtle">
                                            <div className="space-y-6">
                                                {/* Description */}
                                                <div>
                                                    <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wide mb-3 flex items-center gap-2">
                                                        <span className="w-1 h-4 bg-primary" />
                                                        Instructions
                                                    </h3>
                                                    <p className="text-base text-text-secondary leading-relaxed">
                                                        {currentStep.description}
                                                    </p>
                                                </div>

                                                {/* Tips */}
                                                {currentStep.tips && currentStep.tips.length > 0 && (
                                                    <div>
                                                        <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wide mb-3 flex items-center gap-2">
                                                            <span className="w-1 h-4 bg-info" />
                                                            Pro Tips
                                                        </h3>
                                                        <ul className="space-y-2">
                                                            {currentStep.tips.map((tip, tipIdx) => (
                                                                <li key={tipIdx} className="flex items-start gap-2 text-sm text-text-secondary">
                                                                    <span className="text-info mt-1">•</span>
                                                                    {tip}
                                                                </li>
                                                            ))}
                                                        </ul>
                                                    </div>
                                                )}

                                                {/* Required Materials */}
                                                {currentStep.materials && currentStep.materials.length > 0 && (
                                                    <div>
                                                        <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wide mb-3 flex items-center gap-2">
                                                            <span className="w-1 h-4 bg-primary" />
                                                            Required Materials
                                                        </h3>
                                                        <div className="flex flex-wrap gap-2">
                                                            {currentStep.materials.map((mat, matIdx) => (
                                                                <span
                                                                    key={matIdx}
                                                                    className="px-3 py-2 bg-primary/10 text-primary rounded-[var(--radius-md)] text-sm font-mono border border-primary/20"
                                                                >
                                                                    {mat.emoji} {mat.name} ×{mat.required}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {/* Right Column - Image */}
                                        <div className="relative bg-background flex items-center justify-center p-6">
                                            {currentStep.imageUrl ? (
                                                <img
                                                    src={currentStep.imageUrl}
                                                    alt={`${currentStep.title} visual guide`}
                                                    className="w-full h-full object-cover rounded-[var(--radius-lg)] border border-border-subtle shadow-lg"
                                                />
                                            ) : (
                                                <div className="text-text-muted text-center">
                                                    <FileText className="h-16 w-16 mx-auto mb-3 opacity-30" />
                                                    <p className="text-sm">Visual guide placeholder</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        )}
                    </div>

                    {/* Pagination Controls */}
                    <div className="flex items-center justify-between gap-4 pt-4 border-t border-border-subtle">
                        <button
                            onClick={handlePrevious}
                            disabled={currentStepIndex === 0}
                            className="flex items-center gap-2 px-4 py-2.5 bg-surface-elevated border border-border rounded-[var(--radius-md)] text-text-secondary hover:text-text-primary hover:border-border-subtle disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
                        >
                            <ChevronLeft className="h-4 w-4" strokeWidth={2} />
                            <span className="text-sm font-medium">Previous</span>
                        </button>

                        {/* Page Indicator */}
                        <div className="flex items-center gap-2">
                            {Array.from({ length: totalPages }).map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => onNavigateToStep(idx)}
                                    className={`w-2 h-2 rounded-full transition-all duration-200 ${currentStepIndex === idx
                                        ? "bg-primary w-8"
                                        : "bg-border hover:bg-border-subtle"
                                        }`}
                                    aria-label={`Go to ${idx === 0 ? "overview" : `step ${idx}`}`}
                                />
                            ))}
                        </div>

                        {isLastStep && !isCompleted ? (
                            <button
                                onClick={handleComplete}
                                className="flex items-center gap-2 px-4 py-2.5 bg-success hover:bg-success/90 text-text-inverse rounded-[var(--radius-md)] transition-all duration-200 active:scale-95 shadow-lg shadow-success/20"
                            >
                                <CheckCircle className="h-4 w-4" strokeWidth={2} />
                                <span className="text-sm font-medium">Complete Project</span>
                            </button>
                        ) : (
                            <button
                                onClick={handleNext}
                                disabled={currentStepIndex === totalPages - 1}
                                className="flex items-center gap-2 px-4 py-2.5 bg-primary hover:bg-primary/90 disabled:bg-primary/30 text-text-inverse rounded-[var(--radius-md)] disabled:cursor-not-allowed transition-all duration-200 active:scale-95 shadow-lg shadow-primary/20 disabled:shadow-none"
                            >
                                <span className="text-sm font-medium">Next Step</span>
                                <ChevronRight className="h-4 w-4" strokeWidth={2} />
                            </button>
                        )}
                    </div>

                    {/* Footer Note */}
                    <div className="border-t border-dashed border-border-subtle pt-4 mt-4">
                        <p className="text-xs text-text-muted font-mono text-center">
                            Generated by AI Architect • {plan.sourceReferences[0]?.title || 'Based on humanitarian standards'} •{" "}
                            {new Date(plan.generatedAt).toLocaleDateString()} •{" "}
                            <span className="text-text-secondary">
                                Page {currentStepIndex + 1} of {totalPages}
                            </span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

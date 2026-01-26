"use client";

import { Clock, Trash2, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { Project } from "@/types/architect";

export type { Project };

interface ProjectCardProps {
    project: Project;
    onSelect: (projectId: string) => void;
    onDelete: (projectId: string) => void;
    animationDelay?: number;
}

const statusConfig = {
    draft: {
        label: "Draft",
        color: "text-text-muted",
        bgColor: "bg-text-muted/10",
        borderColor: "border-text-muted/20",
        animation: "",
    },
    planning: {
        label: "Planning",
        color: "text-info",
        bgColor: "bg-info/10",
        borderColor: "border-info/20",
        animation: "",
    },
    generating: {
        label: "Generating",
        color: "text-warning",
        bgColor: "bg-warning/10",
        borderColor: "border-warning/20",
        animation: "animate-pulse-warning",
    },
    in_progress: {
        label: "In progress",
        color: "text-primary",
        bgColor: "bg-primary/10",
        borderColor: "border-primary/20",
        animation: "",
    },
    completed: {
        label: "Completed",
        color: "text-success",
        bgColor: "bg-success/10",
        borderColor: "border-success/20",
        animation: "",
    },
};

function getRelativeTime(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    if (diffDays < 30) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;

    const diffMonths = Math.floor(diffDays / 30);
    return `${diffMonths} month${diffMonths > 1 ? "s" : ""} ago`;
}

export function ProjectCard({ project, onSelect, onDelete, animationDelay = 0 }: ProjectCardProps) {
    const config = statusConfig[project.status];
    const actionText = project.status === "in_progress" || project.status === "generating"
        ? "Continue"
        : "View";

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm(`Delete "${project.name}"? This action cannot be undone.`)) {
            onDelete(project.id);
        }
    };

    return (
        <div
            className={cn(
                "group relative bg-surface border border-border-subtle rounded-lg p-4",
                "hover:border-border hover:-translate-y-0.5",
                "transition-all duration-200 cursor-pointer",
                "animate-slide-up flex flex-col min-h-[160px]"
            )}
            style={{ animationDelay: `${animationDelay}ms` }}
            onClick={() => onSelect(project.id)}
        >
            {/* Header with Status Badge */}
            <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="text-base font-semibold text-text-primary flex-1 line-clamp-1">
                    {project.name}
                </h3>
                <div
                    className={cn(
                        "px-2 py-1 rounded-full border text-xs font-mono uppercase tracking-wider shrink-0",
                        config.color,
                        config.bgColor,
                        config.borderColor,
                        config.animation
                    )}
                >
                    {config.label}
                </div>
            </div>

            {/* Description */}
            <p className="text-sm text-text-secondary line-clamp-2 mb-auto">
                {project.description}
            </p>

            {/* Footer with Date and Action */}
            <div className="flex items-center justify-between gap-3 mt-4 pt-3 border-t border-border-subtle">
                <div className="flex items-center gap-1.5 text-xs text-text-muted">
                    <Clock className="h-3.5 w-3.5" strokeWidth={2} />
                    <span>Updated {getRelativeTime(project.updatedAt)}</span>
                </div>

                <div className="flex items-center gap-2">
                    {/* Delete Button - appears on hover */}
                    <button
                        onClick={handleDelete}
                        className={cn(
                            "p-1.5 rounded-md text-text-muted hover:text-danger hover:bg-danger/10",
                            "transition-all duration-200 opacity-0 group-hover:opacity-100",
                            "focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-danger/50"
                        )}
                        aria-label="Delete project"
                    >
                        <Trash2 className="h-4 w-4" strokeWidth={2} />
                    </button>

                    {/* Action Button */}
                    <div className="flex items-center gap-1 text-xs font-medium text-primary group-hover:text-primary/80 transition-colors">
                        <span>{actionText}</span>
                        <ArrowRight className="h-3.5 w-3.5" strokeWidth={2} />
                    </div>
                </div>
            </div>
        </div>
    );
}

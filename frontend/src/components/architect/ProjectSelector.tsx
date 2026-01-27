"use client";

import { Plus, BrainCircuit } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ProjectCard, Project } from "./ProjectCard";
import { cn } from "@/lib/utils";

interface ProjectSelectorProps {
    projects: Project[];
    onSelectProject: (projectId: string) => void;
    onDeleteProject: (projectId: string) => void;
    onCreateProject: () => void;
    isLoading?: boolean;
}

function sortProjects(projects: Project[]): Project[] {
    return [...projects].sort((a, b) => {
        // In-progress projects first
        if (a.status === "in_progress" && b.status !== "in_progress") return -1;
        if (a.status !== "in_progress" && b.status === "in_progress") return 1;

        // Then by updated date (most recent first)
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
}

export function ProjectSelector({
    projects,
    onSelectProject,
    onDeleteProject,
    onCreateProject,
    isLoading = false,
}: ProjectSelectorProps) {
    const sortedProjects = sortProjects(projects);
    const hasProjects = projects.length > 0;

    return (
        <div className="w-full h-full flex flex-col blueprint-grid">
            {/* Header */}
            <div className="p-6 pb-4">
                <h1 className="text-2xl font-bold text-text-primary mb-1">Your Projects</h1>
                <p className="text-sm text-text-secondary">
                    {hasProjects
                        ? `${projects.length} project${projects.length === 1 ? "" : "s"}`
                        : "Get started by creating your first project"}
                </p>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto px-6 pb-6">
                {hasProjects ? (
                    // Projects Grid
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {/* Create New Project Card */}
                        <button
                            onClick={onCreateProject}
                            className={cn(
                                "group relative bg-surface border-2 border-dashed border-border rounded-lg p-6",
                                "hover:border-primary hover:bg-surface-elevated/30",
                                "transition-all duration-200 cursor-pointer",
                                "animate-slide-up flex flex-col items-center justify-center min-h-[160px] gap-3",
                                "focus:outline-none focus:ring-2 focus:ring-primary/50"
                            )}
                            aria-label="Create new project"
                        >
                            <div className="h-12 w-12 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-200">
                                <Plus
                                    className="h-6 w-6 text-primary"
                                    strokeWidth={2}
                                    aria-hidden="true"
                                />
                            </div>
                            <div className="text-center">
                                <div className="text-base font-semibold text-text-primary mb-1">
                                    Create New Project
                                </div>
                                <div className="text-sm text-text-secondary">
                                    Start building with AI
                                </div>
                            </div>
                        </button>

                        {/* Existing Projects */}
                        {sortedProjects.map((project, index) => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                                onSelect={onSelectProject}
                                onDelete={onDeleteProject}
                                animationDelay={(index + 1) * 50}
                            />
                        ))}
                    </div>
                ) : (
                    // Empty State
                    <div className="flex flex-col items-center justify-center py-12 px-4 text-center animate-fade-in">
                        <div className="h-16 w-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                            <BrainCircuit
                                className="h-8 w-8 text-primary"
                                strokeWidth={1.5}
                                aria-hidden="true"
                            />
                        </div>
                        <h2 className="text-xl font-semibold text-text-primary mb-2">
                            No projects yet
                        </h2>
                        <p className="text-sm text-text-secondary mb-6 max-w-md">
                            Create your first construction plan with AI assistance. Describe what you
                            need to build and get instant recommendations based on available materials.
                        </p>
                        <Button
                            variant="primary"
                            size="lg"
                            onClick={onCreateProject}
                            className="min-w-[200px]"
                        >
                            <Plus className="h-5 w-5 mr-2" strokeWidth={2} />
                            Create Your First Project
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// Context Provider
import { ArchitectProvider } from "@/context/ArchitectContext";
import { useArchitect } from "@/hooks/useArchitect";

// Components
import { ChatInterface } from "@/components/architect/ChatInterface";
import { PlanViewer } from "@/components/architect/PlanViewer";
import { ProjectSelector } from "@/components/architect/ProjectSelector";
import { CreateProjectModal } from "@/components/architect/CreateProjectModal";
import { GeneratePlanButton } from "@/components/architect/GeneratePlanButton";
import { GeneratingState } from "@/components/architect/GeneratingState";
import { CompletionModal } from "@/components/architect/CompletionModal";

// Inner component that uses the context
function ArchitectContent() {
    const router = useRouter();
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    const {
        // State
        projects,
        currentProject,
        uiState,
        isLoading,
        error,

        // Project Actions
        createProject,
        selectProject,
        deleteProject,

        // Chat Actions
        sendMessage,

        // Plan Actions
        generatePlan,
        navigateToStep,
        completePlan,

        // UI Actions
        resetToProjectSelection,
        closeCompletionModal,
        inventory, // Destructure inventory
    } = useArchitect();

    const {
        flowState,
        currentStepIndex,
        isGenerateButtonVisible,
        generationProgress,
        showCompletionModal,
    } = uiState;

    // Handle project creation
    const handleCreateProject = async (name: string, description: string) => {
        const project = await createProject(name, description);
        setIsCreateModalOpen(false);
        await selectProject(project.id);
    };

    // Handle project selection
    const handleSelectProject = async (projectId: string) => {
        await selectProject(projectId);
    };

    // Handle back to project selection
    const handleBackToProjects = () => {
        resetToProjectSelection();
    };

    // Handle generate plan
    const handleGeneratePlan = async () => {
        await generatePlan();
    };

    // Handle complete plan
    const handleCompletePlan = async () => {
        await completePlan();
    };

    // Handle back to dashboard
    const handleBackToDashboard = () => {
        closeCompletionModal();
        resetToProjectSelection();
        router.push('/');
    };

    // Build completion summary for modal
    const getCompletionSummary = () => {
        if (!currentProject?.plan) {
            return {
                projectName: currentProject?.name || 'Unknown Project',
                totalSteps: 0,
                completedSteps: 0,
                materialsUsed: [],
                estimatedTime: 'N/A',
                completedAt: new Date(),
            };
        }

        return {
            projectName: currentProject.name,
            totalSteps: currentProject.plan.steps.length,
            completedSteps: currentProject.plan.steps.length,
            materialsUsed: currentProject.plan.materials.map(m => ({
                name: m.name,
                quantity: m.required,
                emoji: m.emoji,
                unit: m.unit,
            })),
            estimatedTime: currentProject.plan.metadata.estimatedTime,
            completedAt: currentProject.completedAt ? new Date(currentProject.completedAt) : new Date(),
        };
    };

    // Render based on flow state
    const renderContent = () => {
        switch (flowState) {
            case 'PROJECT_SELECTION':
                return (
                    <div className="h-[calc(100vh-6rem)] md:h-[calc(100vh-8rem)] max-w-[1200px] mx-auto">
                        <ProjectSelector
                            projects={projects}
                            onSelectProject={handleSelectProject}
                            onCreateProject={() => setIsCreateModalOpen(true)}
                            onDeleteProject={deleteProject}
                            isLoading={isLoading}
                        />
                    </div>
                );

            case 'CHAT_PLANNING':
                return (
                    <div className="h-[calc(100vh-6rem)] md:h-[calc(100vh-8rem)] flex flex-col lg:flex-row gap-4 md:gap-6 max-w-[1600px] mx-auto">
                        {/* Chat Interface - Full width in planning mode */}
                        <div className="flex-1 h-full min-h-[400px] flex flex-col">
                            <ChatInterface
                                messages={currentProject?.messages || []}
                                onSendMessage={sendMessage}
                                isLoading={isLoading}
                                projectName={currentProject?.name}
                                onBack={handleBackToProjects}
                                mode="planning"
                                inventory={inventory} // Pass inventory
                            />
                        </div>

                        {/* Plan Viewer - Shows empty state */}
                        <div className="flex-1 h-full min-h-[400px] flex flex-col">
                            <PlanViewer
                                plan={null}
                                currentStepIndex={0}
                                onNavigateToStep={() => { }}
                            />
                        </div>

                        {/* Generate Plan Button */}
                        <GeneratePlanButton
                            visible={isGenerateButtonVisible}
                            onClick={handleGeneratePlan}
                            isLoading={false}
                        />
                    </div>
                );

            case 'GENERATING':
                return (
                    <GeneratingState
                        progress={generationProgress}
                        message={uiState.generationStatusMessage}
                    />
                );

            case 'PLAN_REVIEW':
            case 'COMPLETED':
                return (
                    <div className="h-[calc(100vh-6rem)] md:h-[calc(100vh-8rem)] flex flex-col lg:flex-row gap-4 md:gap-6 max-w-[1600px] mx-auto">
                        {/* Chat Interface - Narrower in review mode */}
                        <div className="flex-1 lg:flex-none lg:w-[400px] xl:w-[450px] h-full min-h-[400px] flex flex-col">
                            <ChatInterface
                                messages={currentProject?.messages || []}
                                onSendMessage={sendMessage}
                                isLoading={isLoading}
                                projectName={currentProject?.name}
                                onBack={handleBackToProjects}
                                mode="review"
                                inventory={inventory} // Pass inventory
                            />
                        </div>

                        {/* Plan Viewer - Shows the generated plan */}
                        <div className="flex-1 h-full min-h-[400px] flex flex-col">
                            <PlanViewer
                                plan={currentProject?.plan || null}
                                currentStepIndex={currentStepIndex}
                                onNavigateToStep={navigateToStep}
                                onComplete={handleCompletePlan}
                                isCompleted={currentProject?.status === 'completed'}
                            />
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <>
            {renderContent()}

            {/* Create Project Modal */}
            <CreateProjectModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
                onCreateProject={handleCreateProject}
            />

            {/* Completion Modal */}
            <CompletionModal
                isOpen={showCompletionModal}
                onClose={closeCompletionModal}
                summary={getCompletionSummary()}
                onShare={() => {
                    // TODO: Implement share functionality
                    console.log('Share blueprint');
                }}
                onDownload={() => {
                    // TODO: Implement download functionality
                    console.log('Download PDF');
                }}
                onBackToDashboard={handleBackToDashboard}
            />

            {/* Error Display */}
            {error && (
                <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 p-4 bg-danger/10 border border-danger/30 rounded-lg text-danger text-sm animate-slide-up z-50">
                    <strong>Error:</strong> {error}
                </div>
            )}
        </>
    );
}

// Main page component wrapped with provider
export default function ArchitectPage() {
    return (
        <ArchitectProvider>
            <ArchitectContent />
        </ArchitectProvider>
    );
}

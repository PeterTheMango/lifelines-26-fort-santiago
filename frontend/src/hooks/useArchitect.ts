'use client';

/**
 * useArchitect Hook
 * Custom hook for accessing Architect context
 * CrisisBuild - Crisis Management System
 */

import { useContext } from 'react';
import { ArchitectContext } from '@/context/ArchitectContext';
import type { ArchitectContextValue } from '@/types/architect';

/**
 * Hook to access the Architect context
 * @throws Error if used outside of ArchitectProvider
 */
export function useArchitect(): ArchitectContextValue {
  const context = useContext(ArchitectContext);

  if (!context) {
    throw new Error('useArchitect must be used within an ArchitectProvider');
  }

  return context;
}

/**
 * Hook to check if architect context is available
 * Useful for conditional rendering or fallback logic
 */
export function useArchitectAvailable(): boolean {
  const context = useContext(ArchitectContext);
  return context !== null;
}

// ============================================================================
// Convenience Hooks
// ============================================================================

/**
 * Hook to get only project-related state and actions
 */
export function useProjects() {
  const {
    projects,
    loadProjects,
    createProject,
    selectProject,
    updateProject,
    deleteProject,
  } = useArchitect();

  return {
    projects,
    loadProjects,
    createProject,
    selectProject,
    updateProject,
    deleteProject,
  };
}

/**
 * Hook to get only chat-related state and actions
 */
export function useChat() {
  const {
    currentProject,
    sendMessage,
    setReadyToGenerate,
    isLoading,
    error,
    inventory,
  } = useArchitect();

  return {
    currentProject,
    messages: currentProject?.messages || [],
    sendMessage,
    setReadyToGenerate,
    isLoading,
    error,
    inventory,
  };
}

/**
 * Hook to get only plan-related state and actions
 */
export function usePlan() {
  const {
    currentProject,
    uiState,
    generatePlan,
    navigateToStep,
    completePlan,
    isLoading,
    error,
  } = useArchitect();

  return {
    plan: currentProject?.plan,
    currentStepIndex: uiState.currentStepIndex,
    generationProgress: uiState.generationProgress,
    generatePlan,
    navigateToStep,
    completePlan,
    isLoading,
    error,
  };
}

/**
 * Hook to get only UI state and actions
 */
export function useArchitectUI() {
  const {
    uiState,
    setFlowState,
    resetToProjectSelection,
    openCompletionModal,
    closeCompletionModal,
  } = useArchitect();

  return {
    uiState,
    setFlowState,
    resetToProjectSelection,
    openCompletionModal,
    closeCompletionModal,
  };
}

/**
 * Hook to get current flow state helpers
 */
export function useFlowState() {
  const { uiState } = useArchitect();

  return {
    flowState: uiState.flowState,
    isProjectSelection: uiState.flowState === 'PROJECT_SELECTION',
    isChatPlanning: uiState.flowState === 'CHAT_PLANNING',
    isGenerating: uiState.flowState === 'GENERATING',
    isPlanReview: uiState.flowState === 'PLAN_REVIEW',
    isCompleted: uiState.flowState === 'COMPLETED',
  };
}

/**
 * Hook to get generation state
 */
export function useGenerationState() {
  const { uiState } = useArchitect();

  return {
    isGenerating: uiState.flowState === 'GENERATING',
    progress: uiState.generationProgress,
    isGenerateButtonVisible: uiState.isGenerateButtonVisible,
  };
}

/**
 * Hook to get completion state
 */
export function useCompletionState() {
  const { uiState, openCompletionModal, closeCompletionModal } = useArchitect();

  return {
    isCompleted: uiState.flowState === 'COMPLETED',
    showCompletionModal: uiState.showCompletionModal,
    openCompletionModal,
    closeCompletionModal,
  };
}

/**
 * Hook to get current project details
 */
export function useCurrentProject() {
  const { currentProject, uiState } = useArchitect();

  return {
    project: currentProject,
    projectId: uiState.currentProjectId,
    hasProject: currentProject !== null,
    status: currentProject?.status,
    hasPlan: currentProject?.plan !== undefined,
    isCompleted: currentProject?.status === 'completed',
  };
}

/**
 * Hook to get loading and error state
 */
export function useArchitectStatus() {
  const { isLoading, error } = useArchitect();

  return {
    isLoading,
    error,
    hasError: error !== null,
  };
}

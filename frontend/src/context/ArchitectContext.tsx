'use client';

/**
 * Architect Context
 * Global state management for the AI Architect module
 * CrisisBuild - Crisis Management System
 */

import React, { createContext, useState, useCallback, useEffect } from 'react';
import type {
  Project,
  ChatMessage,
  ArchitectContextValue,
  ArchitectUIState,
  ArchitectFlowState,
} from '@/types/architect';

import * as storage from '@/services/projectStorage';
import { generateAIResponse, getInitialGreeting, canGenerateBlueprint } from '@/services/mockAI';
import { generateBlueprint } from '@/services/planGenerator';

// ============================================================================
// Context Creation
// ============================================================================

export const ArchitectContext = createContext<ArchitectContextValue | null>(null);

// ============================================================================
// Initial State
// ============================================================================

const INITIAL_UI_STATE: ArchitectUIState = {
  flowState: 'PROJECT_SELECTION',
  currentProjectId: null,
  currentStepIndex: 0,
  isGenerateButtonVisible: false,
  generationProgress: 0,
  showCompletionModal: false,
};

// ============================================================================
// Provider Component
// ============================================================================

interface ArchitectProviderProps {
  children: React.ReactNode;
}

export function ArchitectProvider({ children }: ArchitectProviderProps) {
  // State
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [uiState, setUiState] = useState<ArchitectUIState>(INITIAL_UI_STATE);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // ============================================================================
  // Project Actions
  // ============================================================================

  /**
   * Load all projects from storage
   */
  const loadProjects = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const loadedProjects = await storage.getAllProjects();
      setProjects(loadedProjects);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load projects';
      setError(message);
      console.error('Load projects error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Create a new project
   */
  const createProject = useCallback(
    async (name: string, description: string): Promise<Project> => {
      setIsLoading(true);
      setError(null);

      try {
        const newProject: Project = {
          id: `project-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name,
          description,
          status: 'draft',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          messages: [getInitialGreeting()],
        };

        const created = await storage.createProject(newProject);
        setProjects(prev => [...prev, created]);

        return created;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to create project';
        setError(message);
        console.error('Create project error:', err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  /**
   * Select and load a project
   */
  const selectProject = useCallback(async (projectId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const project = await storage.getProjectById(projectId);

      if (!project) {
        throw new Error('Project not found');
      }

      setCurrentProject(project);

      // Determine flow state based on project status
      let flowState: ArchitectFlowState = 'CHAT_PLANNING';

      if (project.status === 'completed') {
        flowState = 'COMPLETED';
      } else if (project.plan) {
        flowState = 'PLAN_REVIEW';
      }

      setUiState(prev => ({
        ...prev,
        flowState,
        currentProjectId: projectId,
        currentStepIndex: 0,
        isGenerateButtonVisible: canGenerateBlueprint(project),
      }));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to select project';
      setError(message);
      console.error('Select project error:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * Update a project
   */
  const updateProject = useCallback(
    async (projectId: string, updates: Partial<Project>) => {
      setIsLoading(true);
      setError(null);

      try {
        const updated = await storage.updateProject(projectId, updates);

        // Update projects list
        setProjects(prev => prev.map(p => (p.id === projectId ? updated : p)));

        // Update current project if it's the one being updated
        if (currentProject?.id === projectId) {
          setCurrentProject(updated);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to update project';
        setError(message);
        console.error('Update project error:', err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [currentProject]
  );

  /**
   * Delete a project
   */
  const deleteProject = useCallback(
    async (projectId: string) => {
      setIsLoading(true);
      setError(null);

      try {
        await storage.deleteProject(projectId);

        // Remove from projects list
        setProjects(prev => prev.filter(p => p.id !== projectId));

        // Clear current project if it was deleted
        if (currentProject?.id === projectId) {
          setCurrentProject(null);
          setUiState(INITIAL_UI_STATE);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to delete project';
        setError(message);
        console.error('Delete project error:', err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [currentProject]
  );

  // ============================================================================
  // Chat Actions
  // ============================================================================

  /**
   * Send a user message and get AI response
   */
  const sendMessage = useCallback(
    async (content: string) => {
      if (!currentProject) {
        throw new Error('No project selected');
      }

      setIsLoading(true);
      setError(null);

      try {
        // Create user message
        const userMessage: ChatMessage = {
          id: `msg-${Date.now()}-user`,
          role: 'user',
          content,
          timestamp: new Date().toISOString(),
        };

        // Add user message to project
        let updated = await storage.addMessageToProject(currentProject.id, userMessage);

        // Generate AI response
        const aiResponse = await generateAIResponse(content, updated);

        // Add AI message to project
        updated = await storage.addMessageToProject(currentProject.id, aiResponse.message);

        // Update state
        setCurrentProject(updated);
        setProjects(prev => prev.map(p => (p.id === updated.id ? updated : p)));

        // Update generate button visibility
        setUiState(prev => ({
          ...prev,
          isGenerateButtonVisible: aiResponse.shouldShowGenerateButton || false,
        }));
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to send message';
        setError(message);
        console.error('Send message error:', err);
        throw err;
      } finally {
        setIsLoading(false);
      }
    },
    [currentProject]
  );

  /**
   * Manually set ready to generate state
   */
  const setReadyToGenerate = useCallback(() => {
    setUiState(prev => ({
      ...prev,
      isGenerateButtonVisible: true,
    }));
  }, []);

  // ============================================================================
  // Plan Actions
  // ============================================================================

  /**
   * Generate a blueprint for the current project
   */
  const generatePlan = useCallback(async () => {
    if (!currentProject) {
      throw new Error('No project selected');
    }

    setError(null);

    // Set generating state
    setUiState(prev => ({
      ...prev,
      flowState: 'GENERATING',
      generationProgress: 0,
    }));

    try {
      // Update project status to generating
      await storage.updateProject(currentProject.id, { status: 'generating' });

      // Generate blueprint with progress updates
      const result = await generateBlueprint(currentProject, (progress: number) => {
        setUiState(prev => ({
          ...prev,
          generationProgress: progress,
        }));
      });

      // Save blueprint to project
      const updated = await storage.setProjectBlueprint(
        currentProject.id,
        result.blueprint
      );

      // Update state
      setCurrentProject(updated);
      setProjects(prev => prev.map(p => (p.id === updated.id ? updated : p)));

      // Move to plan review state
      setUiState(prev => ({
        ...prev,
        flowState: 'PLAN_REVIEW',
        currentStepIndex: 0,
        generationProgress: 100,
      }));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to generate blueprint';
      setError(message);
      console.error('Generate plan error:', err);

      // Revert to chat state on error
      setUiState(prev => ({
        ...prev,
        flowState: 'CHAT_PLANNING',
        generationProgress: 0,
      }));

      throw err;
    }
  }, [currentProject]);

  /**
   * Navigate to a specific construction step
   */
  const navigateToStep = useCallback((stepIndex: number) => {
    setUiState(prev => ({
      ...prev,
      currentStepIndex: stepIndex,
    }));
  }, []);

  /**
   * Mark the current plan as completed
   */
  const completePlan = useCallback(async () => {
    if (!currentProject) {
      throw new Error('No project selected');
    }

    setIsLoading(true);
    setError(null);

    try {
      const updated = await storage.completeProject(currentProject.id);

      // Update state
      setCurrentProject(updated);
      setProjects(prev => prev.map(p => (p.id === updated.id ? updated : p)));

      // Show completion modal
      setUiState(prev => ({
        ...prev,
        flowState: 'COMPLETED',
        showCompletionModal: true,
      }));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to complete project';
      setError(message);
      console.error('Complete plan error:', err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, [currentProject]);

  // ============================================================================
  // UI Actions
  // ============================================================================

  /**
   * Set the flow state
   */
  const setFlowState = useCallback((flowState: ArchitectFlowState) => {
    setUiState(prev => ({
      ...prev,
      flowState,
    }));
  }, []);

  /**
   * Reset to project selection view
   */
  const resetToProjectSelection = useCallback(() => {
    setCurrentProject(null);
    setUiState(INITIAL_UI_STATE);
  }, []);

  /**
   * Open completion modal
   */
  const openCompletionModal = useCallback(() => {
    setUiState(prev => ({
      ...prev,
      showCompletionModal: true,
    }));
  }, []);

  /**
   * Close completion modal
   */
  const closeCompletionModal = useCallback(() => {
    setUiState(prev => ({
      ...prev,
      showCompletionModal: false,
    }));
  }, []);

  // ============================================================================
  // Effects
  // ============================================================================

  // Load projects on mount
  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  // ============================================================================
  // Context Value
  // ============================================================================

  const contextValue: ArchitectContextValue = {
    // State
    projects,
    currentProject,
    uiState,
    isLoading,
    error,

    // Project Actions
    loadProjects,
    createProject,
    selectProject,
    updateProject,
    deleteProject,

    // Chat Actions
    sendMessage,
    setReadyToGenerate,

    // Plan Actions
    generatePlan,
    navigateToStep,
    completePlan,

    // UI Actions
    setFlowState,
    resetToProjectSelection,
    openCompletionModal,
    closeCompletionModal,
  };

  return (
    <ArchitectContext.Provider value={contextValue}>
      {children}
    </ArchitectContext.Provider>
  );
}

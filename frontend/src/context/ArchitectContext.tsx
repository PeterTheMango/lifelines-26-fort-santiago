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
  InventoryItem,
} from '@/types/architect';

import * as storage from '@/services/projectStorage';
import { generateAIResponse, getInitialGreeting, canGenerateBlueprint } from '@/services/mockAI';
import { generateBlueprint } from '@/services/planGenerator';

// Helper for emojis
function getEmojiForMaterial(name: string): string {
  const n = name.toLowerCase();
  if (n.includes('rubble') || n.includes('concrete') || n.includes('stone')) return '🪨';
  if (n.includes('wood') || n.includes('timber') || n.includes('lumber')) return '🪵';
  if (n.includes('tire')) return '🛞';
  if (n.includes('metal') || n.includes('steel') || n.includes('iron')) return '🏗️';
  if (n.includes('fabric') || n.includes('tarp') || n.includes('cloth')) return '🎪';
  if (n.includes('plastic') || n.includes('bottle')) return '🍾';
  if (n.includes('water')) return '💧';
  return '📦';
}

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
  generationStatusMessage: '',
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
  const [inventory, setInventory] = useState<InventoryItem[]>([]);

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
   * Load inventory from backend service
   */
  const loadInventory = useCallback(async () => {
    try {
      // Direct call to inventory service through proxy or direct fetch
      // Assuming a proxy setup or direct call if allowed (CORS)
      // For now, we'll try to fetch from the inventory service directly or mock if fails
      // In a real setup, this might go through the Architect backend -> Inventory Service

      // Using Architect backend as proxy since it's already integrated? 
      // Current Architect backend 'fetch_inventory' is internal.
      // Let's try fetching directly from localhost:8000 for now, or mock if it fails 
      // (similar to how we did with Architect backend)

      const response = await fetch('http://localhost:8000/items');
      if (!response.ok) throw new Error('Failed to fetch inventory');

      const data = await response.json();

      // Map backend data to frontend InventoryItem
      const mappedInventory: InventoryItem[] = data.map((item: any) => ({
        id: item.item_id,
        name: item.name,
        category: item.category,
        quantity: item.quantity,
        unit: item.unit,
        emoji: getEmojiForMaterial(item.name) // Helper to assign emojis
      }));

      setInventory(mappedInventory);
    } catch (err) {
      console.warn('Failed to load real inventory, using fallback:', err);
      // Fallback mock data if service is unavailable
      setInventory([
        { id: '1', name: "Concrete Rubble", category: "Raw", quantity: 500, unit: "kg", emoji: "🪨" },
        { id: '2', name: "Timber Beams", category: "Construction", quantity: 25, unit: "pcs", emoji: "🪵" },
        { id: '3', name: "Used Tires", category: "Raw", quantity: 60, unit: "pcs", emoji: "🛞" },
        { id: '4', name: "Corrugated Metal", category: "Construction", quantity: 15, unit: "sheets", emoji: "🏗️" },
      ]);
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
  /**
   * Send a user message and get AI response (Streamed)
   */
  const sendMessage = useCallback(
    async (content: string) => {
      if (!currentProject) {
        throw new Error('No project selected');
      }

      setIsLoading(true);
      setError(null);

      try {
        // 1. Create and add USER message
        const userMessage: ChatMessage = {
          id: `msg-${Date.now()}-user`,
          role: 'user',
          content,
          timestamp: new Date().toISOString(),
        };

        const projectWithUserMsg = await storage.addMessageToProject(currentProject.id, userMessage);

        // Update UI immediately
        setCurrentProject(projectWithUserMsg);
        setProjects(prev => prev.map(p => (p.id === projectWithUserMsg.id ? projectWithUserMsg : p)));

        // 2. Create placeholder AI message
        const aiMessageId = `msg-${Date.now()}-ai`;
        const initialAiMessage: ChatMessage = {
          id: aiMessageId,
          role: 'ai',
          content: '', // Start empty
          timestamp: new Date().toISOString(),
          isReadyToGenerate: false
        };

        // Add placeholder AI message to storage/state
        // We need it in the list so the UI renders the bubble
        let projectWithAiMsg = await storage.addMessageToProject(projectWithUserMsg.id, initialAiMessage);
        setCurrentProject(projectWithAiMsg);
        setProjects(prev => prev.map(p => (p.id === projectWithAiMsg.id ? projectWithAiMsg : p)));

        // 3. Start Streaming
        // We need to import streamAIResponse. 
        // Note: Dynamic import or ensure it is imported at top of file.
        // Assuming it is exported from @/services/mockAI
        const { streamAIResponse } = await import('@/services/mockAI');

        let accumulatedContent = '';
        let isReady = false;

        for await (const chunk of streamAIResponse(content, projectWithUserMsg)) {
          accumulatedContent += chunk;

          // Check for [[READY]] token
          if (accumulatedContent.includes('[[READY]]')) {
            isReady = true;
            // Remove the token for display
            accumulatedContent = accumulatedContent.replace('[[READY]]', '').trim();
          }

          // Update the message content in real-time
          // We modify the last message of the project
          // Optimization: Local state update for speed, then persist at end?
          // For now, let's update state directly. Storage updates might be too slow for every token.

          setCurrentProject(prev => {
            if (!prev) return null;
            const newMessages = [...prev.messages];
            const lastMsgIndex = newMessages.findIndex(m => m.id === aiMessageId);
            if (lastMsgIndex !== -1) {
              newMessages[lastMsgIndex] = {
                ...newMessages[lastMsgIndex],
                content: accumulatedContent,
                isReadyToGenerate: isReady
              };
            }
            return { ...prev, messages: newMessages };
          });
        }

        // 4. Final Finalize
        // Save the full message to storage
        const finalAiMessage: ChatMessage = {
          id: aiMessageId,
          role: 'ai',
          content: accumulatedContent,
          timestamp: new Date().toISOString(),
          isReadyToGenerate: isReady
        };

        // We technically already added it, but with empty content. 
        // storage.addMessageToProject appends. We probably need an updateMessage method or just re-save the project.
        // Since storage is likely simple JSON, let's just update the project.

        // Ensure "isGenerateButtonVisible" is updated
        setUiState(prev => ({
          ...prev,
          isGenerateButtonVisible: isReady
        }));

        // Persist final state
        // We can just fetch the latest currentProject from state (which has the content) or reconstruct it.
        // Ideally we update storage.
        // Assuming storage has an updateProject method that takes full project or partial.

        // Let's reload or re-save to ensure persistence
        // A simple way is to force an update of the messages list
        const messagesToSave = projectWithAiMsg.messages.map(m =>
          m.id === aiMessageId ? finalAiMessage : m
        );

        await storage.updateProject(currentProject.id, { messages: messagesToSave });

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
      const result = await generateBlueprint(currentProject, inventory, (progress: number, message: string) => {
        setUiState(prev => ({
          ...prev,
          generationProgress: progress,
          generationStatusMessage: message,
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
    loadInventory();
  }, [loadProjects, loadInventory]);

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
    inventory,

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

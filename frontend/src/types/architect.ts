/**
 * Type definitions for the AI Architect module
 * CrisisBuild - Crisis Management System
 */

// ============================================================================
// Project Types
// ============================================================================

export type ProjectStatus =
  | 'draft'           // Initial state, gathering requirements
  | 'planning'        // AI conversation in progress
  | 'generating'      // Blueprint is being generated
  | 'in_progress'     // Blueprint created, construction ongoing
  | 'completed';      // Project finished

export interface Project {
  id: string;
  name: string;
  description: string;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  messages: ChatMessage[];
  plan?: Blueprint;
}

// ============================================================================
// Chat Types
// ============================================================================

export interface Citation {
  title: string;
  reference: string;
  url?: string;
}

export type MessageRole = 'ai' | 'user' | 'system';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: string;
  citations?: Citation[];
  isReadyToGenerate?: boolean; // Flag indicating AI detected readiness
}

// ============================================================================
// Blueprint Types
// ============================================================================

export interface Material {
  name: string;
  emoji: string;
  required: number;
  available: number;
  unit: string;
}

export interface ConstructionStep {
  id: string;
  stepNumber: number;
  title: string;
  description: string;
  materials?: Material[];
  imageUrl?: string;
  estimatedTime?: string;
  tips?: string[];
}

export interface PlanMetadata {
  estimatedTime: string;
  difficulty: 'Easy' | 'Moderate' | 'Challenging' | 'Expert';
  teamSize: string;
  safetyLevel?: 'Low' | 'Medium' | 'High' | 'Critical';
}

export interface Blueprint {
  id: string;
  title: string;
  description: string;
  metadata: PlanMetadata;
  materials: Material[];
  steps: ConstructionStep[];
  sourceReferences: Citation[];
  generatedAt: string;
}

// ============================================================================
// UI State Types
// ============================================================================

export type ArchitectFlowState =
  | 'PROJECT_SELECTION'   // Viewing/selecting projects
  | 'CHAT_PLANNING'       // Active conversation with AI
  | 'GENERATING'          // Generating blueprint (loading state)
  | 'PLAN_REVIEW'         // Reviewing generated blueprint
  | 'COMPLETED';          // Project marked as complete

export interface ArchitectUIState {
  flowState: ArchitectFlowState;
  currentProjectId: string | null;
  currentStepIndex: number;
  isGenerateButtonVisible: boolean;
  generationProgress: number; // 0-100
  showCompletionModal: boolean;
}

// ============================================================================
// Context Types
// ============================================================================

export interface ArchitectContextValue {
  // State
  projects: Project[];
  currentProject: Project | null;
  uiState: ArchitectUIState;
  isLoading: boolean;
  error: string | null;

  // Project Actions
  loadProjects: () => Promise<void>;
  createProject: (name: string, description: string) => Promise<Project>;
  selectProject: (projectId: string) => Promise<void>;
  updateProject: (projectId: string, updates: Partial<Project>) => Promise<void>;
  deleteProject: (projectId: string) => Promise<void>;

  // Chat Actions
  sendMessage: (content: string) => Promise<void>;
  setReadyToGenerate: () => void;

  // Plan Actions
  generatePlan: () => Promise<void>;
  navigateToStep: (stepIndex: number) => void;
  completePlan: () => Promise<void>;

  // UI Actions
  setFlowState: (state: ArchitectFlowState) => void;
  resetToProjectSelection: () => void;
  openCompletionModal: () => void;
  closeCompletionModal: () => void;
}

// ============================================================================
// Storage Types
// ============================================================================

export interface StorageSchema {
  version: number;
  projects: Project[];
  lastUpdated: string;
}

// ============================================================================
// Service Response Types
// ============================================================================

export interface AIResponse {
  message: ChatMessage;
  shouldShowGenerateButton?: boolean;
}

export interface GenerationResult {
  blueprint: Blueprint;
  processingTime: number;
}

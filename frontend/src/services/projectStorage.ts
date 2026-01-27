/**
 * Project Storage Service
 * Handles localStorage CRUD operations with API-ready interface
 * CrisisBuild - Crisis Management System
 */

import type { Project, StorageSchema } from '@/types/architect';

const STORAGE_KEY = 'crisisbuild-architect-projects';
const STORAGE_VERSION = 1;

// ============================================================================
// Storage Utilities
// ============================================================================

/**
 * Get all data from localStorage
 */
function getStorageData(): StorageSchema {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
      return {
        version: STORAGE_VERSION,
        projects: [],
        lastUpdated: new Date().toISOString(),
      };
    }

    const parsed = JSON.parse(data) as StorageSchema;

    // Handle version migrations if needed
    if (parsed.version !== STORAGE_VERSION) {
      console.warn('Storage version mismatch, resetting data');
      return {
        version: STORAGE_VERSION,
        projects: [],
        lastUpdated: new Date().toISOString(),
      };
    }

    return parsed;
  } catch (error) {
    console.error('Failed to read from localStorage:', error);
    return {
      version: STORAGE_VERSION,
      projects: [],
      lastUpdated: new Date().toISOString(),
    };
  }
}

/**
 * Save data to localStorage
 */
function setStorageData(data: StorageSchema): void {
  try {
    data.lastUpdated = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to write to localStorage:', error);
    throw new Error('Storage operation failed');
  }
}

/**
 * Simulate network delay for API-ready interface
 */
function delay(ms: number = 50): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ============================================================================
// CRUD Operations
// ============================================================================

/**
 * Get all projects
 */
export async function getAllProjects(): Promise<Project[]> {
  await delay();
  const data = getStorageData();
  return data.projects;
}

/**
 * Get a single project by ID
 */
export async function getProjectById(projectId: string): Promise<Project | null> {
  await delay();
  const data = getStorageData();
  const project = data.projects.find(p => p.id === projectId);
  return project || null;
}

/**
 * Create a new project
 */
export async function createProject(project: Project): Promise<Project> {
  await delay();

  const data = getStorageData();

  // Check for duplicate ID
  if (data.projects.some(p => p.id === project.id)) {
    throw new Error(`Project with ID ${project.id} already exists`);
  }

  data.projects.push(project);
  setStorageData(data);

  return project;
}

/**
 * Update an existing project
 */
export async function updateProject(
  projectId: string,
  updates: Partial<Project>
): Promise<Project> {
  await delay();

  const data = getStorageData();
  const projectIndex = data.projects.findIndex(p => p.id === projectId);

  if (projectIndex === -1) {
    throw new Error(`Project with ID ${projectId} not found`);
  }

  // Merge updates with existing project
  const updatedProject: Project = {
    ...data.projects[projectIndex],
    ...updates,
    id: projectId, // Ensure ID cannot be changed
    updatedAt: new Date().toISOString(),
  };

  data.projects[projectIndex] = updatedProject;
  setStorageData(data);

  return updatedProject;
}

/**
 * Delete a project
 */
export async function deleteProject(projectId: string): Promise<void> {
  await delay();

  const data = getStorageData();
  const projectIndex = data.projects.findIndex(p => p.id === projectId);

  if (projectIndex === -1) {
    throw new Error(`Project with ID ${projectId} not found`);
  }

  data.projects.splice(projectIndex, 1);
  setStorageData(data);
}

/**
 * Add a message to a project
 */
export async function addMessageToProject(
  projectId: string,
  message: import('@/types/architect').ChatMessage
): Promise<Project> {
  await delay();

  const data = getStorageData();
  const projectIndex = data.projects.findIndex(p => p.id === projectId);

  if (projectIndex === -1) {
    throw new Error(`Project with ID ${projectId} not found`);
  }

  const project = data.projects[projectIndex];
  project.messages.push(message);
  project.updatedAt = new Date().toISOString();

  // Auto-update status if still in draft
  if (project.status === 'draft' && project.messages.length > 0) {
    project.status = 'planning';
  }

  setStorageData(data);

  return project;
}

/**
 * Set the blueprint for a project
 */
export async function setProjectBlueprint(
  projectId: string,
  blueprint: import('@/types/architect').Blueprint
): Promise<Project> {
  await delay();

  const data = getStorageData();
  const projectIndex = data.projects.findIndex(p => p.id === projectId);

  if (projectIndex === -1) {
    throw new Error(`Project with ID ${projectId} not found`);
  }

  const project = data.projects[projectIndex];
  project.plan = blueprint;
  project.status = 'in_progress';
  project.updatedAt = new Date().toISOString();

  setStorageData(data);

  return project;
}

/**
 * Mark a project as completed
 */
export async function completeProject(projectId: string): Promise<Project> {
  await delay();

  const data = getStorageData();
  const projectIndex = data.projects.findIndex(p => p.id === projectId);

  if (projectIndex === -1) {
    throw new Error(`Project with ID ${projectId} not found`);
  }

  const project = data.projects[projectIndex];
  project.status = 'completed';
  project.completedAt = new Date().toISOString();
  project.updatedAt = new Date().toISOString();

  setStorageData(data);

  return project;
}

/**
 * Clear all projects (for testing/debugging)
 */
export async function clearAllProjects(): Promise<void> {
  await delay();

  const data: StorageSchema = {
    version: STORAGE_VERSION,
    projects: [],
    lastUpdated: new Date().toISOString(),
  };

  setStorageData(data);
}

/**
 * Export projects as JSON (for backup)
 */
export async function exportProjects(): Promise<string> {
  await delay();
  const data = getStorageData();
  return JSON.stringify(data, null, 2);
}

/**
 * Import projects from JSON (for restore)
 */
export async function importProjects(jsonData: string): Promise<Project[]> {
  await delay();

  try {
    const imported = JSON.parse(jsonData) as StorageSchema;

    if (!imported.projects || !Array.isArray(imported.projects)) {
      throw new Error('Invalid import data format');
    }

    setStorageData(imported);
    return imported.projects;
  } catch (error) {
    throw new Error('Failed to import projects: ' + (error as Error).message);
  }
}

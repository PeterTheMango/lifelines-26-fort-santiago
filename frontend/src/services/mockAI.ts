/**
 * AI Service
 * Connects to AI Architect Backend
 * CrisisBuild - Crisis Management System
 */

import type { ChatMessage, AIResponse, Project } from '@/types/architect';

const API_BASE_URL = 'http://localhost:8001';

// ============================================================================
// Main AI Response Function
// ============================================================================

/**
 * Generate AI response based on user message and project context
 */
export async function generateAIResponse(
  userMessage: string,
  project: Project
): Promise<AIResponse> {
  try {
    // Map frontend Project to backend DetailedProject schema
    const backendProject = {
      project_id: project.id,
      proj_title: project.name,
      proj_desc: project.description,
      status: project.status === 'draft' ? 'Planning' :
        project.status === 'generating' ? 'In_Progress' :
          project.status === 'completed' ? 'Completed' : 'Planning',
      messages: project.messages,
      steps: [], // Default empty for chat
      materials: [], // Default empty
      created_at: project.createdAt,
      updated_at: project.updatedAt
    };

    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: userMessage,
        project: backendProject,
      }),
    });

    if (!response.ok) {
      throw new Error(`Backend error: ${response.statusText}`);
    }

    const data = await response.json();

    return {
      message: data.message,
      shouldShowGenerateButton: data.shouldShowGenerateButton,
    };
  } catch (error) {
    console.error('AI Service Error:', error);
    // Fallback error message
    return {
      message: {
        id: `err-${Date.now()}`,
        role: 'ai',
        content: "I'm having trouble connecting to my brain right now. Please ensure the backend service is running.",
        timestamp: new Date().toISOString()
      },
      shouldShowGenerateButton: false
    };
  }
}

/**
 * Stream AI response based on user message and project context
 */
export async function* streamAIResponse(
  userMessage: string,
  project: Project
): AsyncGenerator<string, void, unknown> {
  try {
    const backendProject = {
      project_id: project.id,
      proj_title: project.name,
      proj_desc: project.description,
      status: project.status,
      messages: project.messages,
      steps: [], // Default empty for chat
      materials: [], // Default empty
      created_at: project.createdAt,
      updated_at: project.updatedAt
    };

    const response = await fetch(`${API_BASE_URL}/chat/stream`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: userMessage,
        project: backendProject,
      }),
    });

    if (!response.ok) {
      throw new Error(`Backend error: ${response.statusText}`);
    }

    if (!response.body) throw new Error('No response body');

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      const chunk = decoder.decode(value, { stream: true });
      yield chunk;
    }
  } catch (error) {
    console.error('AI Stream Error:', error);
    yield "I'm having trouble connecting to my brain right now.";
  }
}

/**
 * Get initial greeting for a new project
 */
export function getInitialGreeting(): ChatMessage {
  return {
    id: `msg-${Date.now()}`,
    role: 'ai',
    content: "Hello! I'm your AI Architect. I can help you design emergency structures. Tell me, what do you need to build today?",
    timestamp: new Date().toISOString(),
    isReadyToGenerate: false,
  };
}

/**
 * Validate if project has enough context to generate blueprint
 * (Kept for compatibility, though backend logic supersedes this)
 */
export function canGenerateBlueprint(project: Project): boolean {
  // Simple check if we have messages
  return project.messages.length > 2;
}

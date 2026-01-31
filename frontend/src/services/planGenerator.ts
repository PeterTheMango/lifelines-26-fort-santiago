/**
 * Plan Generator Service
 * Connects to AI Architect Backend for real generation
 * CrisisBuild - Crisis Management System
 */

import type {
  Blueprint,
  Project,
  GenerationResult,
  InventoryItem
} from '@/types/architect';

const API_BASE_URL = 'http://localhost:8001';

export async function generateBlueprint(
  project: Project,
  inventory: InventoryItem[],
  onProgress?: (progress: number, message: string) => void
): Promise<GenerationResult> {
  const startTime = Date.now();

  try {
    // Map frontend Project to backend DetailedProject schema
    const backendProject = {
      project_id: project.id,
      proj_title: project.name,
      proj_desc: project.description,
      status: 'In_Progress',
      messages: project.messages,
      steps: [],
      materials: [],
      created_at: project.createdAt,
      updated_at: project.updatedAt
    };

    // 1. Start Generation
    const response = await fetch(`${API_BASE_URL}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        project: backendProject,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to start generation');
    }

    // Helper to find available amount
    const getAvailableAmount = (matName: string): number => {
      if (!matName) return 0;
      const item = inventory.find(i =>
        i.name.toLowerCase().includes(matName.toLowerCase()) ||
        matName.toLowerCase().includes(i.name.toLowerCase())
      );
      return item ? item.quantity : 0;
    };

    // 2. Poll for Status
    let isComplete = false;
    let blueprint: Blueprint | null = null;

    while (!isComplete) {
      // Wait 1 second between polls
      await new Promise(resolve => setTimeout(resolve, 1000));

      const statusResponse = await fetch(`${API_BASE_URL}/generate/${project.id}`);
      if (!statusResponse.ok) {
        continue; // Retry polling
      }

      const status = await statusResponse.json();

      if (status.status === 'error') {
        throw new Error('Generation failed on backend');
      }

      // Update progress
      if (onProgress) {
        onProgress(status.progress, status.currentStep || status.status);
      }

      if (status.status === 'complete') {
        isComplete = true;
        const backendData = status.blueprint;

        // Map backend DetailedProject to frontend Blueprint
        blueprint = {
          id: backendData.project_id || `bp-${Date.now()}`,
          title: backendData.proj_title || 'Project Plan',
          description: backendData.proj_desc || '',
          metadata: {
            estimatedTime: '4-6 hours', // Default/Mock for now as backend schema doesn't have metadata block
            difficulty: 'Moderate',
            teamSize: '2-3 people',
            safetyLevel: 'Medium'
          },
          imageUrl: backendData.final_img,
          // Map global materials
          materials: (backendData.materials || []).map((m: any) => ({
            name: m.material,
            emoji: '📦', // Default emoji
            required: 1,
            available: getAvailableAmount(m.material),
            unit: 'unit'
          })),
          // Map steps
          steps: (backendData.steps || []).map((s: any) => ({
            id: `step-${s.step_num}`,
            stepNumber: s.step_num,
            title: s.step_title,
            description: s.step_desc,
            imageUrl: s.step_img,
            // Map step materials
            materials: (s.mat_reqs || []).map((mr: any) => ({
              name: mr.mat_id,
              emoji: '🔧',
              required: mr.req_amt,
              available: getAvailableAmount(mr.mat_id),
              unit: mr.unit
            })),
            tips: s.tips || []
          })),
          sourceReferences: [],
          generatedAt: backendData.created_at || new Date().toISOString()
        };
      }
    }

    if (!blueprint) {
      throw new Error('No blueprint returned');
    }

    const processingTime = Date.now() - startTime;

    return {
      blueprint,
      processingTime,
    };

  } catch (error) {
    console.error('Generation Error:', error);
    throw error;
  }
}

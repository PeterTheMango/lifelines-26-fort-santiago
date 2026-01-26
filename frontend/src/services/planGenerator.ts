/**
 * Plan Generator Service
 * Mock blueprint generation with realistic delay and data
 * CrisisBuild - Crisis Management System
 */

import type {
  Blueprint,
  Material,
  ConstructionStep,
  Citation,
  PlanMetadata,
  Project,
  GenerationResult,
} from '@/types/architect';

// ============================================================================
// Constants
// ============================================================================

const GENERATION_DELAY_MS = 5000; // 5 seconds
const PROGRESS_UPDATE_INTERVAL = 100; // Update progress every 100ms

// ============================================================================
// Sample Data Templates
// ============================================================================

const SAMPLE_MATERIALS: Material[] = [
  { name: 'Wooden Planks', emoji: '🪵', required: 24, available: 18, unit: 'pieces' },
  { name: 'Metal Sheets', emoji: '🔩', required: 8, available: 12, unit: 'sheets' },
  { name: 'Rope', emoji: '🪢', required: 50, available: 45, unit: 'meters' },
  { name: 'Tarpaulin', emoji: '🏕️', required: 2, available: 2, unit: 'pieces' },
  { name: 'Nails & Screws', emoji: '🔨', required: 200, available: 250, unit: 'pieces' },
  { name: 'Concrete Blocks', emoji: '🧱', required: 16, available: 10, unit: 'blocks' },
  { name: 'Insulation Material', emoji: '🧵', required: 10, available: 8, unit: 'sq meters' },
  { name: 'Wire Mesh', emoji: '🕸️', required: 5, available: 5, unit: 'sq meters' },
];

const SAMPLE_STEPS: ConstructionStep[] = [
  {
    id: 'step-1',
    stepNumber: 1,
    title: 'Site Preparation and Foundation',
    description:
      'Clear and level the construction area. Mark the perimeter using stakes and rope. Ensure the ground is stable and free from debris. If needed, compact the soil or create a gravel base for better drainage and stability.',
    materials: [
      { name: 'Rope', emoji: '🪢', required: 20, available: 45, unit: 'meters' },
      { name: 'Concrete Blocks', emoji: '🧱', required: 16, available: 10, unit: 'blocks' },
    ],
    estimatedTime: '2-3 hours',
    tips: [
      'Check for underground utilities before digging',
      'Ensure proper drainage away from the structure',
      'Use a level to verify the foundation is even',
    ],
  },
  {
    id: 'step-2',
    stepNumber: 2,
    title: 'Frame Construction',
    description:
      'Build the primary frame structure using wooden planks. Start with corner posts, ensuring they are plumb and securely anchored. Add horizontal beams and cross-bracing for stability. Use appropriate fasteners at all connection points.',
    materials: [
      { name: 'Wooden Planks', emoji: '🪵', required: 16, available: 18, unit: 'pieces' },
      { name: 'Nails & Screws', emoji: '🔨', required: 100, available: 250, unit: 'pieces' },
    ],
    estimatedTime: '4-5 hours',
    tips: [
      'Pre-drill holes to prevent wood splitting',
      'Double-check all measurements before cutting',
      'Ensure frame is square by measuring diagonals',
    ],
  },
  {
    id: 'step-3',
    stepNumber: 3,
    title: 'Wall Assembly',
    description:
      'Attach wall panels or sheeting to the frame. Start from one corner and work systematically. Ensure proper overlap and secure fastening. Leave openings for doors and windows as planned. Add additional bracing where needed.',
    materials: [
      { name: 'Metal Sheets', emoji: '🔩', required: 8, available: 12, unit: 'sheets' },
      { name: 'Nails & Screws', emoji: '🔨', required: 80, available: 250, unit: 'pieces' },
      { name: 'Wire Mesh', emoji: '🕸️', required: 5, available: 5, unit: 'sq meters' },
    ],
    estimatedTime: '3-4 hours',
    tips: [
      'Work with a partner for handling large panels',
      'Install bottom panels first, then work upward',
      'Seal all gaps to prevent water infiltration',
    ],
  },
  {
    id: 'step-4',
    stepNumber: 4,
    title: 'Roof Installation',
    description:
      'Construct the roof frame and attach roofing materials. Ensure adequate slope for water runoff. Secure tarpaulin or metal sheets firmly, starting from the bottom and working upward with proper overlap to prevent leaks.',
    materials: [
      { name: 'Wooden Planks', emoji: '🪵', required: 8, available: 18, unit: 'pieces' },
      { name: 'Tarpaulin', emoji: '🏕️', required: 2, available: 2, unit: 'pieces' },
      { name: 'Rope', emoji: '🪢', required: 30, available: 45, unit: 'meters' },
    ],
    estimatedTime: '3-4 hours',
    tips: [
      'Ensure minimum 15-degree slope for drainage',
      'Secure all edges to prevent wind damage',
      'Check weather forecast before starting',
    ],
  },
  {
    id: 'step-5',
    stepNumber: 5,
    title: 'Insulation and Weatherproofing',
    description:
      'Add insulation material to walls and roof for temperature regulation. Seal all joints and gaps with appropriate materials. Install door and window frames with proper sealing. Test for drafts and water resistance.',
    materials: [
      { name: 'Insulation Material', emoji: '🧵', required: 10, available: 8, unit: 'sq meters' },
      { name: 'Tarpaulin', emoji: '🏕️', required: 1, available: 2, unit: 'pieces' },
    ],
    estimatedTime: '2-3 hours',
    tips: [
      'Wear protective gear when handling insulation',
      'Ensure ventilation to prevent moisture buildup',
      'Double-seal critical areas prone to leaks',
    ],
  },
  {
    id: 'step-6',
    stepNumber: 6,
    title: 'Final Inspection and Safety Check',
    description:
      'Conduct a thorough inspection of the entire structure. Check all fasteners, joints, and connections. Verify structural stability by applying gentle pressure at key points. Test doors and windows. Document any issues and make necessary adjustments.',
    estimatedTime: '1-2 hours',
    tips: [
      'Create a checklist for systematic inspection',
      'Test structure in various weather conditions if possible',
      'Keep maintenance tools and spare materials on hand',
      'Document the build with photos for future reference',
    ],
  },
];

const SAMPLE_REFERENCES: Citation[] = [
  {
    title: 'Emergency Shelter Construction Guidelines',
    reference: 'UN Habitat Emergency Shelter Manual 2023',
    url: 'https://unhabitat.org/shelter-guidelines',
  },
  {
    title: 'Rapid Response Building Techniques',
    reference: 'IFRC Disaster Response Field Handbook',
    url: 'https://ifrc.org/disaster-response',
  },
  {
    title: 'Sustainable Emergency Architecture',
    reference: 'Global Shelter Cluster Technical Standards',
    url: 'https://sheltercluster.org/technical-standards',
  },
];

// ============================================================================
// Content Analysis
// ============================================================================

/**
 * Extract key project details from conversation
 */
function analyzeProjectRequirements(project: Project): {
  keywords: string[];
  estimatedComplexity: PlanMetadata['difficulty'];
  suggestedTeamSize: string;
  estimatedTime: string;
} {
  // Combine all user messages
  const userMessages = project.messages
    .filter(m => m.role === 'user')
    .map(m => m.content.toLowerCase())
    .join(' ');

  // Extract keywords
  const keywords = userMessages.split(/\s+/).filter(word => word.length > 4);

  // Determine complexity based on message content
  let estimatedComplexity: PlanMetadata['difficulty'] = 'Moderate';
  if (userMessages.includes('simple') || userMessages.includes('basic')) {
    estimatedComplexity = 'Easy';
  } else if (
    userMessages.includes('complex') ||
    userMessages.includes('advanced') ||
    userMessages.includes('large')
  ) {
    estimatedComplexity = 'Challenging';
  }

  // Estimate team size
  let suggestedTeamSize = '3-4 people';
  if (userMessages.includes('small') || userMessages.includes('solo')) {
    suggestedTeamSize = '2-3 people';
  } else if (userMessages.includes('large') || userMessages.includes('team')) {
    suggestedTeamSize = '5-8 people';
  }

  // Estimate time based on complexity
  const estimatedTime =
    estimatedComplexity === 'Easy'
      ? '8-12 hours'
      : estimatedComplexity === 'Moderate'
        ? '12-16 hours'
        : '16-24 hours';

  return {
    keywords,
    estimatedComplexity,
    suggestedTeamSize,
    estimatedTime,
  };
}

/**
 * Generate a customized blueprint title
 */
function generateBlueprintTitle(project: Project): string {
  const userMessages = project.messages
    .filter(m => m.role === 'user')
    .map(m => m.content)
    .join(' ');

  // Try to extract shelter/structure type
  const shelterTypes = [
    'shelter',
    'tent',
    'building',
    'structure',
    'house',
    'cabin',
    'facility',
    'warehouse',
  ];

  for (const type of shelterTypes) {
    if (userMessages.toLowerCase().includes(type)) {
      return `Emergency ${type.charAt(0).toUpperCase() + type.slice(1)} Construction Plan`;
    }
  }

  return project.name || 'Emergency Structure Construction Plan';
}

/**
 * Generate a customized description
 */
function generateBlueprintDescription(project: Project): string {
  const analysis = analyzeProjectRequirements(project);

  return `A comprehensive ${analysis.estimatedComplexity.toLowerCase()} construction blueprint designed for rapid deployment in crisis situations. This plan includes detailed step-by-step instructions, material specifications, safety guidelines, and practical tips for successful implementation.`;
}

// ============================================================================
// Blueprint Generation
// ============================================================================

/**
 * Generate a complete blueprint from project context
 */
export async function generateBlueprint(
  project: Project,
  onProgress?: (progress: number) => void
): Promise<GenerationResult> {
  const startTime = Date.now();

  // Simulate progressive generation with progress updates
  let progress = 0;
  const progressInterval = setInterval(() => {
    progress += (100 / (GENERATION_DELAY_MS / PROGRESS_UPDATE_INTERVAL));
    if (progress > 95) progress = 95; // Cap at 95% until complete

    if (onProgress) {
      onProgress(Math.min(progress, 100));
    }
  }, PROGRESS_UPDATE_INTERVAL);

  // Wait for the generation delay
  await new Promise(resolve => setTimeout(resolve, GENERATION_DELAY_MS));

  clearInterval(progressInterval);

  // Signal completion
  if (onProgress) {
    onProgress(100);
  }

  // Analyze project requirements
  const analysis = analyzeProjectRequirements(project);

  // Generate blueprint
  const blueprint: Blueprint = {
    id: `blueprint-${Date.now()}`,
    title: generateBlueprintTitle(project),
    description: generateBlueprintDescription(project),
    metadata: {
      estimatedTime: analysis.estimatedTime,
      difficulty: analysis.estimatedComplexity,
      teamSize: analysis.suggestedTeamSize,
      safetyLevel: 'Medium',
    },
    materials: SAMPLE_MATERIALS,
    steps: SAMPLE_STEPS,
    sourceReferences: SAMPLE_REFERENCES,
    generatedAt: new Date().toISOString(),
  };

  const processingTime = Date.now() - startTime;

  return {
    blueprint,
    processingTime,
  };
}

/**
 * Validate blueprint completeness
 */
export function validateBlueprint(blueprint: Blueprint): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!blueprint.title || blueprint.title.trim().length === 0) {
    errors.push('Blueprint title is required');
  }

  if (!blueprint.description || blueprint.description.trim().length === 0) {
    errors.push('Blueprint description is required');
  }

  if (!blueprint.materials || blueprint.materials.length === 0) {
    errors.push('Blueprint must include materials');
  }

  if (!blueprint.steps || blueprint.steps.length === 0) {
    errors.push('Blueprint must include construction steps');
  }

  if (blueprint.steps) {
    blueprint.steps.forEach((step, index) => {
      if (!step.title) {
        errors.push(`Step ${index + 1} is missing a title`);
      }
      if (!step.description) {
        errors.push(`Step ${index + 1} is missing a description`);
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Calculate material shortage
 */
export function calculateMaterialShortage(materials: Material[]): Material[] {
  return materials.filter(m => m.available < m.required);
}

/**
 * Calculate total estimated time
 */
export function calculateTotalTime(steps: ConstructionStep[]): string {
  // This is a simplified calculation
  // In a real app, you'd parse the time strings and sum them
  const stepCount = steps.length;
  const avgHours = stepCount * 3; // Rough estimate

  return `${avgHours}-${avgHours + stepCount} hours`;
}

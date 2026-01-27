/**
 * Mock AI Service
 * Simulates AI conversation logic for the Architect module
 * CrisisBuild - Crisis Management System
 */

import type { ChatMessage, AIResponse, Project } from '@/types/architect';

// ============================================================================
// Constants
// ============================================================================

const READINESS_KEYWORDS = [
  'ready',
  'generate',
  'build',
  'start',
  'enough',
  'proceed',
  'continue',
  'create',
  'make',
  'go ahead',
  'let\'s go',
];

const MIN_MESSAGES_FOR_SUGGESTION = 3;

// ============================================================================
// Message Templates
// ============================================================================

const GREETING_MESSAGES = [
  "Hello! I'm your AI Architect assistant. I'll help you create a detailed construction blueprint for your crisis response project. What would you like to build today?",
  "Welcome! I'm here to help you plan your construction project. Tell me about what you need to build, and I'll guide you through creating a detailed blueprint.",
  "Hi there! Let's work together to create a comprehensive building plan. What kind of structure or shelter are you planning to construct?",
];

const CLARIFICATION_QUESTIONS = [
  [
    "That sounds like a great project! To create the best blueprint, I'd like to know more:",
    "- What's the primary purpose of this structure?",
    "- Approximately how many people will it need to accommodate?",
    "- What materials do you have available, or should I suggest common emergency materials?",
  ].join('\n'),
  [
    "Interesting! Let me gather some more details:",
    "- What are the environmental conditions? (weather, terrain, etc.)",
    "- Do you have any specific size requirements or constraints?",
    "- Are there any safety considerations I should keep in mind?",
  ].join('\n'),
  [
    "Great! A few more questions to help me create the perfect plan:",
    "- What's your team's skill level? (beginner, intermediate, advanced)",
    "- How much time do you have for construction?",
    "- Are there any specific features you need? (ventilation, insulation, etc.)",
  ].join('\n'),
  [
    "Thanks for that information! Just a couple more things:",
    "- What's the expected lifespan of this structure? (temporary, semi-permanent, permanent)",
    "- Do you need the plan to include any utilities? (water, electricity, etc.)",
    "- Are there any local regulations or standards I should consider?",
  ].join('\n'),
];

const ENCOURAGEMENT_MESSAGES = [
  "I'm getting a good picture of your project! Feel free to share any other important details, or let me know when you're ready to generate the blueprint.",
  "Excellent information! Is there anything else you'd like to add to ensure the blueprint meets all your needs?",
  "Perfect! I have a solid understanding now. Share any final requirements, or we can proceed to generate your detailed construction plan.",
  "Great details! Once you're satisfied with the information provided, I can create a comprehensive blueprint for you.",
];

const READY_CONFIRMATION_MESSAGES = [
  "Perfect! I have all the information I need. I'll now generate a detailed construction blueprint based on our conversation. This will include step-by-step instructions, material lists, safety guidelines, and visual references.",
  "Excellent! Let me create a comprehensive building plan for you. I'll include detailed steps, required materials, time estimates, and important safety tips.",
  "Great! I'm ready to generate your blueprint. It will contain everything you need: construction phases, material specifications, team requirements, and practical guidance.",
];

const NEED_MORE_INFO_MESSAGES = [
  "I'd love to help you create a blueprint, but I need a bit more information about your project first. Could you tell me more about what you're planning to build?",
  "To generate an accurate blueprint, I'll need more details about your construction project. What specific structure or shelter are you looking to create?",
  "Let's gather some more information before generating the blueprint. Can you describe your project in more detail?",
];

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Generate a unique message ID
 */
function generateMessageId(): string {
  return `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Check if message contains readiness keywords
 */
function containsReadinessKeyword(content: string): boolean {
  const lowerContent = content.toLowerCase();
  return READINESS_KEYWORDS.some(keyword => {
    // Use word boundaries for better matching
    const regex = new RegExp(`\\b${keyword}\\b`, 'i');
    return regex.test(lowerContent);
  });
}

/**
 * Count substantive user messages
 */
function countSubstantiveMessages(messages: ChatMessage[]): number {
  return messages.filter(msg => {
    if (msg.role !== 'user') return false;
    // Filter out very short messages (likely not substantive)
    return msg.content.trim().length > 20;
  }).length;
}

/**
 * Get a random item from an array
 */
function randomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Analyze conversation context
 */
function analyzeConversation(project: Project): {
  substantiveMessageCount: number;
  hasEnoughContext: boolean;
  isFirstMessage: boolean;
  lastAIQuestion: number;
} {
  const substantiveMessageCount = countSubstantiveMessages(project.messages);
  const isFirstMessage = project.messages.filter(m => m.role === 'user').length === 0;

  // Find the last AI question
  const aiMessages = project.messages.filter(m => m.role === 'ai');
  const lastAIQuestion = aiMessages.length;

  const hasEnoughContext = substantiveMessageCount >= MIN_MESSAGES_FOR_SUGGESTION;

  return {
    substantiveMessageCount,
    hasEnoughContext,
    isFirstMessage,
    lastAIQuestion,
  };
}

// ============================================================================
// AI Response Generation
// ============================================================================

/**
 * Generate greeting message for new projects
 */
function generateGreeting(): string {
  return randomItem(GREETING_MESSAGES);
}

/**
 * Generate clarification question
 */
function generateClarificationQuestion(context: ReturnType<typeof analyzeConversation>): string {
  const questionIndex = Math.min(
    context.lastAIQuestion,
    CLARIFICATION_QUESTIONS.length - 1
  );
  return CLARIFICATION_QUESTIONS[questionIndex];
}

/**
 * Generate encouragement message
 */
function generateEncouragement(): string {
  return randomItem(ENCOURAGEMENT_MESSAGES);
}

/**
 * Generate ready confirmation message
 */
function generateReadyConfirmation(): string {
  return randomItem(READY_CONFIRMATION_MESSAGES);
}

/**
 * Generate need more info message
 */
function generateNeedMoreInfo(): string {
  return randomItem(NEED_MORE_INFO_MESSAGES);
}

/**
 * Create a chat message object
 */
function createMessage(
  content: string,
  isReadyToGenerate: boolean = false
): ChatMessage {
  return {
    id: generateMessageId(),
    role: 'ai',
    content,
    timestamp: new Date().toISOString(),
    isReadyToGenerate,
  };
}

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
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 300 + Math.random() * 700));

  const context = analyzeConversation(project);

  // Handle greeting for first message
  if (context.isFirstMessage) {
    return {
      message: createMessage(generateGreeting()),
      shouldShowGenerateButton: false,
    };
  }

  // Check if user explicitly wants to generate
  const userWantsToGenerate = containsReadinessKeyword(userMessage);

  if (userWantsToGenerate) {
    if (context.hasEnoughContext) {
      // User is ready and we have enough context
      return {
        message: createMessage(generateReadyConfirmation(), true),
        shouldShowGenerateButton: true,
      };
    } else {
      // User wants to generate but we need more info
      return {
        message: createMessage(generateNeedMoreInfo()),
        shouldShowGenerateButton: false,
      };
    }
  }

  // Generate contextual response based on conversation progress
  if (context.substantiveMessageCount < 2) {
    // Early in conversation - ask clarification questions
    return {
      message: createMessage(generateClarificationQuestion(context)),
      shouldShowGenerateButton: false,
    };
  } else if (context.substantiveMessageCount === 2) {
    // Mid conversation - ask more questions but show progress
    return {
      message: createMessage(generateClarificationQuestion(context)),
      shouldShowGenerateButton: false,
    };
  } else {
    // Later in conversation - suggest we're ready
    const encouragement = generateEncouragement();
    return {
      message: createMessage(encouragement, true),
      shouldShowGenerateButton: true,
    };
  }
}

/**
 * Get initial greeting for a new project
 */
export function getInitialGreeting(): ChatMessage {
  return createMessage(generateGreeting());
}

/**
 * Create a system message
 */
export function createSystemMessage(content: string): ChatMessage {
  return {
    id: generateMessageId(),
    role: 'system',
    content,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Validate if project has enough context to generate blueprint
 */
export function canGenerateBlueprint(project: Project): boolean {
  const context = analyzeConversation(project);
  return context.hasEnoughContext;
}

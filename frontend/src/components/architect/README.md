# AI Architect Components

This directory contains all components for the AI Architect module, including project selection, blueprint generation, and completion flows.

## Project Selection Components (NEW)

### 1. ProjectCard
**File:** `ProjectCard.tsx` (153 lines)

Individual project display card with status badges, hover effects, and actions.

**Props:**
```typescript
interface Project {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'planning' | 'generating' | 'in_progress' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

interface ProjectCardProps {
  project: Project;
  onSelect: (projectId: string) => void;
  onDelete: (projectId: string) => void;
  animationDelay?: number;
}
```

**Features:**
- 5 status states with semantic colors and animations
- Relative time display ("2 hours ago")
- Hover effects (border transition + subtle lift)
- Delete confirmation dialog
- Action button ("Continue" or "View" based on status)
- Staggered animations for grid entry

**Example:**
```tsx
import { ProjectCard } from '@/components/architect/ProjectCard';

<ProjectCard
  project={project}
  onSelect={(id) => router.push(`/architect/${id}`)}
  onDelete={(id) => deleteProject(id)}
  animationDelay={100}
/>
```

---

### 2. ProjectSelector
**File:** `ProjectSelector.tsx` (123 lines)

Grid layout orchestrator with responsive design and empty state.

**Props:**
```typescript
interface ProjectSelectorProps {
  projects: Project[];
  onSelectProject: (projectId: string) => void;
  onDeleteProject: (projectId: string) => void;
  onCreateProject: () => void;
}
```

**Features:**
- Responsive grid: 1 column (mobile) → 2 columns (tablet) → 3 columns (desktop)
- Auto-sorting: in_progress projects first, then by updatedAt
- "Create New Project" card with dashed border
- Empty state with friendly messaging and CTA
- Blueprint grid background
- Staggered card animations

**Example:**
```tsx
import { ProjectSelector } from '@/components/architect/ProjectSelector';

<ProjectSelector
  projects={projects}
  onSelectProject={(id) => router.push(`/architect/${id}`)}
  onDeleteProject={(id) => deleteProject(id)}
  onCreateProject={() => setModalOpen(true)}
/>
```

---

### 3. CreateProjectModal
**File:** `CreateProjectModal.tsx` (196 lines)

Form modal for creating new projects with validation.

**Props:**
```typescript
interface CreateProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject: (name: string, description: string) => Promise<void>;
}
```

**Features:**
- Real-time validation with error messages
- Character limits: Name (100 chars), Description (500 chars)
- Live character counters
- Loading states with spinner
- Form auto-reset on success
- Keyboard support (Enter to submit, Esc to close)

**Example:**
```tsx
import { CreateProjectModal } from '@/components/architect/CreateProjectModal';

<CreateProjectModal
  isOpen={isModalOpen}
  onClose={() => setModalOpen(false)}
  onCreateProject={async (name, desc) => {
    await createProject(name, desc);
  }}
/>
```

---

## Blueprint Generation Components

### 4. GeneratePlanButton
A floating CTA button that appears when the AI is ready to generate a blueprint.

**Props:**
- `visible: boolean` - Controls visibility with slide-in animation
- `onClick: () => void` - Handler for button click
- `isLoading?: boolean` - Shows loading state during generation

**Example:**
```tsx
import { GeneratePlanButton } from '@/components/architect/GeneratePlanButton';

<GeneratePlanButton
  visible={isReadyToGenerate}
  onClick={handleGenerateBlueprint}
  isLoading={isGenerating}
/>
```

---

### 5. GeneratingState
A full-screen overlay shown during blueprint generation with animated progress.

**Props:**
- `progress: number` - Current progress (0-100)
- `onComplete?: () => void` - Called when progress reaches 100%

**Features:**
- Blueprint grid background pattern
- Rotating compass icon
- Animated progress bar with shimmer effect
- Dynamic status messages based on progress:
  - 0-20%: "Analyzing requirements..."
  - 20-40%: "Calculating material needs..."
  - 40-60%: "Designing structure..."
  - 60-80%: "Generating construction steps..."
  - 80-100%: "Finalizing blueprint..."

**Example:**
```tsx
import { GeneratingState } from '@/components/architect/GeneratingState';

<GeneratingState
  progress={generationProgress}
  onComplete={() => {
    setShowCompletionModal(true);
  }}
/>
```

---

### 6. CompletionModal
A celebratory modal shown when blueprint generation is complete.

**Props:**
- `isOpen: boolean` - Controls modal visibility
- `onClose: () => void` - Handler for closing the modal
- `summary: object` - Blueprint summary data:
  - `projectName: string`
  - `totalSteps: number`
  - `completedSteps: number`
  - `materialsUsed: Array<{ name, quantity, emoji?, unit? }>`
  - `estimatedTime: string`
  - `completedAt: Date`
- `onShare?: () => void` - Optional handler for sharing
- `onDownload?: () => void` - Optional handler for PDF download
- `onBackToDashboard: () => void` - Handler for returning to dashboard

**Features:**
- Success icon with pulse animation
- Project summary card with stats
- Materials list with emojis
- Action buttons (Share, Download, Back to Dashboard)
- Subtle CSS-only confetti animation (respects `prefers-reduced-motion`)

**Example:**
```tsx
import { CompletionModal } from '@/components/architect/CompletionModal';

<CompletionModal
  isOpen={showCompletion}
  onClose={() => setShowCompletion(false)}
  summary={{
    projectName: "Emergency Shelter",
    totalSteps: 4,
    completedSteps: 4,
    materialsUsed: [
      { name: "Tires", quantity: 40, emoji: "🛞", unit: "units" },
      { name: "Earth", quantity: 200, emoji: "🪨", unit: "kg" },
      { name: "Timber", quantity: 12, emoji: "🪵", unit: "beams" },
    ],
    estimatedTime: "2-3 days",
    completedAt: new Date(),
  }}
  onShare={handleShare}
  onDownload={handleDownload}
  onBackToDashboard={() => router.push('/dashboard')}
/>
```

---

---

## Additional Documentation

- **USAGE_EXAMPLE.md** - Detailed integration examples for project selection components
- **COMPONENT_REFERENCE.md** - Visual specifications and ASCII diagrams
- **index.ts** - Barrel exports for easy importing

---

## Complete Usage Example (Blueprint Generation)

Here's how the blueprint generation components work together in a typical flow:

```tsx
'use client';

import { useState, useEffect } from 'react';
import { GeneratePlanButton } from '@/components/architect/GeneratePlanButton';
import { GeneratingState } from '@/components/architect/GeneratingState';
import { CompletionModal } from '@/components/architect/CompletionModal';

export function ArchitectPage() {
  const [isReadyToGenerate, setIsReadyToGenerate] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);
  const [blueprintSummary, setBlueprintSummary] = useState(null);

  // Simulate AI detecting readiness
  useEffect(() => {
    // Your logic to determine if enough context is gathered
    const hasEnoughContext = checkIfReadyToGenerate();
    setIsReadyToGenerate(hasEnoughContext);
  }, [/* dependencies */]);

  const handleGenerateBlueprint = async () => {
    setIsGenerating(true);
    setProgress(0);

    try {
      // Start the generation process
      const response = await fetch('/api/architect/generate', {
        method: 'POST',
        body: JSON.stringify({ /* your data */ }),
      });

      // Simulate progress updates (or use real progress from API)
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(progressInterval);
            return 100;
          }
          return prev + 5;
        });
      }, 200);

      const result = await response.json();
      setBlueprintSummary(result.summary);
    } catch (error) {
      console.error('Generation failed:', error);
      setIsGenerating(false);
    }
  };

  const handleGenerationComplete = () => {
    setIsGenerating(false);
    setShowCompletion(true);
  };

  return (
    <div className="relative">
      {/* Your chat interface */}
      <div className="chat-container">
        {/* Chat messages, etc. */}
      </div>

      {/* Generate button appears when ready */}
      <GeneratePlanButton
        visible={isReadyToGenerate && !isGenerating}
        onClick={handleGenerateBlueprint}
        isLoading={isGenerating}
      />

      {/* Full-screen generating state */}
      {isGenerating && (
        <GeneratingState
          progress={progress}
          onComplete={handleGenerationComplete}
        />
      )}

      {/* Completion modal */}
      {blueprintSummary && (
        <CompletionModal
          isOpen={showCompletion}
          onClose={() => setShowCompletion(false)}
          summary={blueprintSummary}
          onShare={async () => {
            // Share logic
            console.log('Sharing blueprint...');
          }}
          onDownload={async () => {
            // Download logic
            console.log('Downloading PDF...');
          }}
          onBackToDashboard={() => {
            router.push('/dashboard');
          }}
        />
      )}
    </div>
  );
}
```

---

## Design System Compliance

All components follow the CrisisBuild design system:

- **Colors:** Dark forest palette with teal primary (#2DD4BF), success green (#4ADE80)
- **Typography:** Nunito Sans for text, Source Code Pro for technical data
- **Animations:** Respects `prefers-reduced-motion` media query
- **Accessibility:** Proper ARIA labels, keyboard navigation, screen reader support
- **Blueprint Aesthetic:** Engineering-focused with warm humanitarian touch

---

## Animations Used

- `animate-pulse-active` - Attention-grabbing pulse on button
- `animate-slide-up` - Slide-in effect for button appearance
- `animate-spin-slow` - Slow rotation for compass icon
- `animate-pulse-slow` - Gentle pulse for glow effects
- `animate-shimmer` - Shimmer effect on progress bar
- `animate-fade-in` - Fade-in for content
- `.blueprint-grid` - Background grid pattern

All animations are defined in `/src/app/globals.css`.

---

## Accessibility Features

- **Keyboard Navigation:** All interactive elements are keyboard accessible
- **Screen Readers:** Proper ARIA labels and live regions for status updates
- **Reduced Motion:** Respects user preferences, disables decorative animations
- **Focus Management:** Clear focus indicators on all interactive elements
- **Color Contrast:** WCAG AA+ compliant color combinations

---

## Testing Recommendations

1. **Visual Testing:**
   - Test at different screen sizes (mobile, tablet, desktop)
   - Verify animations in both normal and reduced-motion modes
   - Check blueprint grid rendering

2. **Interaction Testing:**
   - Click/tap GeneratePlanButton
   - Monitor progress updates in GeneratingState
   - Test all action buttons in CompletionModal

3. **Accessibility Testing:**
   - Test with keyboard only (Tab, Enter, Escape)
   - Use screen reader (VoiceOver, NVDA, JAWS)
   - Enable high contrast mode

4. **Edge Cases:**
   - Progress jumping to 100% immediately
   - Very long project names or material lists
   - Slow network conditions
   - Button visibility toggling rapidly

---

## Performance Considerations

- **GeneratingState** uses portal rendering for full-screen overlay
- Progress updates should be throttled to avoid excessive re-renders
- Confetti animation is CSS-only, no JavaScript performance impact
- All icons are from lucide-react (tree-shakeable)

---

## Future Enhancements

Potential improvements:
- [ ] Real-time WebSocket progress updates from backend
- [ ] Downloadable blueprint as PDF (server-side rendering)
- [ ] Social sharing with preview images
- [ ] Blueprint revision history
- [ ] Customizable material emoji mappings
- [ ] Multi-language support for status messages
- [ ] Sound effects for completion (with user preference)

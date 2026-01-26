# Project Selection Components - Usage Guide

## Overview

This guide demonstrates how to use the three project selection components:
- `ProjectCard` - Individual project display card
- `ProjectSelector` - Grid layout with projects and empty state
- `CreateProjectModal` - Modal form for creating new projects

## Component Hierarchy

```
ProjectSelector (orchestrator)
├── CreateProjectModal (opened via button)
└── ProjectCard (multiple instances, one per project)
```

## Type Definitions

```typescript
interface Project {
  id: string;
  name: string;
  description: string;
  status: 'draft' | 'planning' | 'generating' | 'in_progress' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}
```

## Basic Usage Example

```typescript
"use client";

import { useState } from "react";
import { ProjectSelector } from "@/components/architect/ProjectSelector";
import { CreateProjectModal } from "@/components/architect/CreateProjectModal";
import { Project } from "@/components/architect/ProjectCard";

export default function ArchitectPage() {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      name: "Emergency Shelter for Family of 4",
      description: "Design a temporary shelter using available materials including tarps, timber, and rubble. Must be weatherproof and provide adequate space.",
      status: "in_progress",
      createdAt: new Date("2026-01-20"),
      updatedAt: new Date("2026-01-26"),
    },
    {
      id: "2",
      name: "Water Storage System",
      description: "Create a rainwater collection and storage system using recycled containers and basic filtration.",
      status: "completed",
      createdAt: new Date("2026-01-15"),
      updatedAt: new Date("2026-01-22"),
    },
    {
      id: "3",
      name: "Community Kitchen Structure",
      description: "Build a covered cooking area for community use with proper ventilation and fire safety.",
      status: "planning",
      createdAt: new Date("2026-01-25"),
      updatedAt: new Date("2026-01-25"),
    },
  ]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleSelectProject = (projectId: string) => {
    console.log("Selected project:", projectId);
    // Navigate to project detail view or open chat interface
    // router.push(`/architect/project/${projectId}`);
  };

  const handleDeleteProject = (projectId: string) => {
    setProjects((prev) => prev.filter((p) => p.id !== projectId));
    console.log("Deleted project:", projectId);
  };

  const handleCreateProject = async (name: string, description: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const newProject: Project = {
      id: Date.now().toString(),
      name,
      description,
      status: "draft",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    setProjects((prev) => [...prev, newProject]);
    console.log("Created project:", newProject);
  };

  return (
    <div className="h-screen flex flex-col">
      <ProjectSelector
        projects={projects}
        onSelectProject={handleSelectProject}
        onDeleteProject={handleDeleteProject}
        onCreateProject={() => setIsCreateModalOpen(true)}
      />

      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateProject={handleCreateProject}
      />
    </div>
  );
}
```

## Integration with Context (Future)

When integrating with ArchitectContext, the implementation would look like:

```typescript
"use client";

import { useArchitect } from "@/context/ArchitectContext";
import { ProjectSelector } from "@/components/architect/ProjectSelector";
import { CreateProjectModal } from "@/components/architect/CreateProjectModal";
import { useState } from "react";

export default function ArchitectPage() {
  const {
    projects,
    selectProject,
    createProject,
    deleteProject,
  } = useArchitect();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const handleCreateProject = async (name: string, description: string) => {
    await createProject(name, description);
    setIsCreateModalOpen(false);
  };

  return (
    <div className="h-screen flex flex-col">
      <ProjectSelector
        projects={projects}
        onSelectProject={selectProject}
        onDeleteProject={deleteProject}
        onCreateProject={() => setIsCreateModalOpen(true)}
      />

      <CreateProjectModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateProject={handleCreateProject}
      />
    </div>
  );
}
```

## Component Props Reference

### ProjectCard

```typescript
interface ProjectCardProps {
  project: Project;                      // Project data
  onSelect: (projectId: string) => void; // Called when card is clicked
  onDelete: (projectId: string) => void; // Called when delete button is clicked
  animationDelay?: number;               // Optional delay for staggered animations (ms)
}
```

### ProjectSelector

```typescript
interface ProjectSelectorProps {
  projects: Project[];                      // Array of projects to display
  onSelectProject: (projectId: string) => void; // Called when a project card is clicked
  onDeleteProject: (projectId: string) => void; // Called when delete button is clicked
  onCreateProject: () => void;              // Called when create button is clicked
}
```

### CreateProjectModal

```typescript
interface CreateProjectModalProps {
  isOpen: boolean;                                          // Controls modal visibility
  onClose: () => void;                                      // Called when modal should close
  onCreateProject: (name: string, description: string) => Promise<void>; // Async project creation
}
```

## Features

### ProjectCard Features
- **Status Badges**: 5 status states with semantic colors
  - Draft: muted gray
  - Planning: info blue
  - Generating: warning yellow with pulse animation
  - In Progress: primary teal
  - Completed: success green
- **Relative Time**: "2 hours ago", "3 days ago", etc.
- **Delete Confirmation**: Native confirm dialog before deletion
- **Hover Effects**: Border color change and subtle lift
- **Action Text**: "Continue" for active projects, "View" for completed

### ProjectSelector Features
- **Auto-sorting**: In-progress projects appear first
- **Responsive Grid**: 1/2/3 columns based on screen size
- **Empty State**: Friendly message when no projects exist
- **Create Card**: Always visible with dashed border
- **Blueprint Background**: Subtle grid pattern matching AI aesthetic
- **Staggered Animations**: Cards animate in with delays

### CreateProjectModal Features
- **Form Validation**: Real-time validation with error messages
- **Character Limits**: Name (100 chars), Description (500 chars)
- **Character Counters**: Live count display
- **Loading State**: Disable inputs and show spinner during creation
- **Keyboard Support**: Enter to submit, Esc to close
- **Auto-reset**: Form clears after successful creation

## Styling

All components follow the CrisisBuild design system v2:
- **Colors**: Forest/growth palette with teal primary (#2DD4BF)
- **Typography**: Nunito Sans font family
- **Spacing**: 4px increments
- **Border Radius**: 8-12px rounded corners
- **Touch Targets**: 48px minimum (44px inputs)
- **Animations**: Respects prefers-reduced-motion

## Accessibility

- **Keyboard Navigation**: Full keyboard support
- **ARIA Labels**: Proper labels on icon-only buttons
- **Focus Indicators**: Visible focus rings on all interactive elements
- **Error Messages**: Linked to inputs via aria-describedby
- **Screen Reader**: Status announcements and semantic HTML

## Browser Compatibility

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Next.js 14+ with React 18+
- Requires Tailwind CSS with custom config
- Uses Lucide React icons

## Customization

### Changing Animation Delays

```typescript
// In ProjectSelector, adjust the multiplier for faster/slower stagger
animationDelay={(index + 1) * 100} // 100ms instead of 50ms
```

### Custom Status Colors

Edit the `statusConfig` object in `ProjectCard.tsx`:

```typescript
const statusConfig = {
  draft: {
    label: "Draft",
    color: "text-your-custom-color",
    bgColor: "bg-your-custom-color/10",
    borderColor: "border-your-custom-color/20",
    animation: "",
  },
  // ... other statuses
};
```

### Character Limits

Edit constants in `CreateProjectModal.tsx`:

```typescript
const MAX_NAME_LENGTH = 150; // Increase from 100
const MAX_DESCRIPTION_LENGTH = 1000; // Increase from 500
```

## Testing

### Unit Test Example (Jest/React Testing Library)

```typescript
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { ProjectSelector } from "./ProjectSelector";
import { Project } from "./ProjectCard";

const mockProjects: Project[] = [
  {
    id: "1",
    name: "Test Project",
    description: "Test description",
    status: "in_progress",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

test("displays projects and create button", () => {
  const handleSelect = jest.fn();
  const handleDelete = jest.fn();
  const handleCreate = jest.fn();

  render(
    <ProjectSelector
      projects={mockProjects}
      onSelectProject={handleSelect}
      onDeleteProject={handleDelete}
      onCreateProject={handleCreate}
    />
  );

  expect(screen.getByText("Test Project")).toBeInTheDocument();
  expect(screen.getByText("Create New Project")).toBeInTheDocument();
});

test("calls onSelectProject when card is clicked", () => {
  const handleSelect = jest.fn();

  render(
    <ProjectSelector
      projects={mockProjects}
      onSelectProject={handleSelect}
      onDeleteProject={jest.fn()}
      onCreateProject={jest.fn()}
    />
  );

  fireEvent.click(screen.getByText("Test Project"));
  expect(handleSelect).toHaveBeenCalledWith("1");
});
```

## Known Limitations

1. **Date Handling**: Uses JavaScript Date objects. For better timezone handling, consider using date-fns or dayjs.
2. **Confirmation Dialog**: Uses native `window.confirm()`. For better UX, implement a custom confirmation modal.
3. **Error Handling**: Basic error display. Consider toast notifications for better UX.
4. **Optimistic Updates**: Components don't implement optimistic updates. Add loading states during async operations if needed.

## Future Enhancements

- [ ] Drag-and-drop reordering
- [ ] Bulk operations (select multiple, delete multiple)
- [ ] Project search/filter
- [ ] Project tags/categories
- [ ] Export project data
- [ ] Share project functionality
- [ ] Project templates
- [ ] Undo delete with toast
- [ ] Project duplication

## Support

For issues or questions, refer to:
- Design system: `/frontend/ui-design-system-v2.md`
- Component source: `/frontend/src/components/architect/`
- Example usage: This file

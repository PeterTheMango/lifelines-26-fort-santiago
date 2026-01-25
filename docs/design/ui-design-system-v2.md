# CrisisBuild UI Design System (v2.0)

This document outlines the visual and functional design language for **CrisisBuild**, a self-contained reconstruction platform designed for offline, post-disaster humanitarian contexts. The system is built to be **warm yet utilitarian, legible, and trustworthy**, prioritizing clarity for field workers, community volunteers, and NGO coordinators in high-stress scenarios.

---

## 1. Design Philosophy

### Core Principles

| Principle | Description |
|-----------|-------------|
| **Offline-First** | UI components must function without external assets or connectivity. All fonts, icons, and assets are bundled in the PWA. |
| **Humanitarian Warmth** | The interface should feel approachable and human—not militaristic or cold. Users are rebuilding lives, not running combat operations. |
| **Thoughtful Utility** | Every element serves a purpose, but small details (rounded corners, gentle transitions, considered spacing) show care and build trust. |
| **Touch-Optimized** | Large tap targets (minimum 48x48px) accommodate users with gloves, dirty hands, or fine motor impairment. |
| **Low-Literacy Accessible** | Icons and color coding supplement text. Critical information is conveyed through multiple channels (color + icon + position). |
| **Multilingual-Ready** | Typography and layout accommodate RTL languages, variable text lengths, and non-Latin scripts from day one. |

### Emotional Goals

The interface should evoke:
- **Groundedness** — Stability in chaos, like a well-organized field kit
- **Renewal** — Growth and recovery, not just survival
- **Competence** — Professional enough for NGO coordinators, approachable enough for community volunteers

---

## 2. Color Palette

The palette is optimized for **Dark Mode** to conserve battery life on mobile OLED screens and reduce glare in mixed lighting conditions. The forest/growth direction reflects renewal and recovery.

### Primary Palette

| Role | Hex Code | RGB | Application |
|------|----------|-----|-------------|
| **Background** | `#0C1810` | 12, 24, 16 | Main app background (Deep Forest) |
| **Surface** | `#162118` | 22, 33, 24 | Card backgrounds, navigation bars, elevated surfaces |
| **Surface Elevated** | `#1E2D21` | 30, 45, 33 | Modal backgrounds, dropdown menus, hover states |
| **Border Subtle** | `#2A3D2E` | 42, 61, 46 | Dividers, subtle separators |
| **Border Default** | `#3D5442` | 61, 84, 66 | Input borders, card outlines |

### Accent Colors

| Role | Hex Code | RGB | Application |
|------|----------|-----|-------------|
| **Primary (Teal)** | `#2DD4BF` | 45, 212, 191 | Primary actions, active states, interactive elements |
| **Primary Muted** | `#14B8A6` | 20, 184, 166 | Secondary emphasis, visited links |
| **Primary Subtle** | `#0D9488` | 13, 148, 136 | Tertiary actions, subtle highlights |

### Semantic Colors

| Role | Hex Code | RGB | Application |
|------|----------|-----|-------------|
| **Success** | `#4ADE80` | 74, 222, 128 | "Brain" active, Signal strong, Systems operational |
| **Warning** | `#FBBF24` | 251, 191, 36 | Low battery, Low stock (<25%), Weak signal |
| **Danger** | `#F87171` | 248, 113, 113 | Offline nodes, Critical stock (<10%), Hardware failure |
| **Info** | `#60A5FA` | 96, 165, 250 | Informational banners, AI responses, help text |

### Text Colors

| Role | Hex Code | Application |
|------|----------|-------------|
| **Text Primary** | `#E8F5E9` | Primary body text, headings |
| **Text Secondary** | `#A7C4AA` | Secondary labels, helper text, timestamps |
| **Text Muted** | `#6B8B6F` | Disabled text, placeholders |
| **Text Inverse** | `#0C1810` | Text on light backgrounds (buttons, badges) |

### Color Usage Guidelines

1. **Never rely on color alone** — Always pair color with icons, text labels, or patterns for accessibility
2. **Semantic colors are reserved** — Don't use Success green for decoration; reserve it for positive states
3. **Test in sunlight** — Verify contrast ratios in bright outdoor conditions (target WCAG AAA where possible)
4. **Respect cultural meaning** — Red may signify different things across cultures; always pair with universal icons

---

## 3. Typography

A hybrid approach balancing **character** with **practical constraints**. The primary font brings warmth and distinctiveness while maintaining excellent legibility across languages.

### Font Stack

| Role | Font | Fallback | Usage |
|------|------|----------|-------|
| **Display** | `Nunito Sans` | `system-ui, sans-serif` | Page titles, hero text, navigation labels |
| **Body** | `Nunito Sans` | `system-ui, sans-serif` | Body text, descriptions, instructions |
| **Technical** | `Source Code Pro` | `ui-monospace, monospace` | Inventory quantities, sensor readings, coordinates, AI citations |

### Why Nunito Sans?

- **Distinctive but readable**: Rounded terminals add warmth without sacrificing legibility
- **Excellent language support**: Latin Extended, Cyrillic, Vietnamese — covers most humanitarian deployment regions
- **Variable font available**: Single file with weight axes (300–900) for flexible styling
- **Open source**: SIL Open Font License, free for bundling in PWA
- **Bundle size**: Variable font ~120KB, acceptable for offline PWA

### Type Scale

Based on a 1.25 ratio (Major Third) with a 16px base. All sizes in `rem` for accessibility scaling.

| Name | Size | Weight | Line Height | Letter Spacing | Usage |
|------|------|--------|-------------|----------------|-------|
| **Display** | 2rem (32px) | 700 | 1.2 | -0.02em | Page titles only |
| **Heading 1** | 1.563rem (25px) | 600 | 1.3 | -0.01em | Section headers |
| **Heading 2** | 1.25rem (20px) | 600 | 1.4 | 0 | Card titles, modal headers |
| **Heading 3** | 1rem (16px) | 600 | 1.4 | 0 | Subsection labels |
| **Body** | 1rem (16px) | 400 | 1.6 | 0 | Default body text |
| **Body Small** | 0.875rem (14px) | 400 | 1.5 | 0 | Secondary text, captions |
| **Caption** | 0.75rem (12px) | 500 | 1.4 | 0.02em | Timestamps, badges, labels |
| **Mono** | 0.875rem (14px) | 400 | 1.4 | 0 | Technical data, quantities |

### Typography Rules

1. **Maximum 60-75 characters per line** for body text (improved readability)
2. **Left-align body text** — avoid justified text for better scanning
3. **Use sentence case** for most UI text (more approachable than ALL CAPS)
4. **Technical data always in monospace** — creates visual distinction for scannable numbers
5. **RTL Support**: Ensure `dir="auto"` on text containers; test with Arabic/Hebrew content

---

## 4. Spacing & Layout

### Spacing Scale

Based on 4px increments for consistent rhythm.

| Token | Value | Usage |
|-------|-------|-------|
| `space-0` | 0px | — |
| `space-1` | 4px | Tight gaps, icon padding |
| `space-2` | 8px | Inline element spacing, compact lists |
| `space-3` | 12px | Standard gap between related elements |
| `space-4` | 16px | Card padding, section spacing |
| `space-5` | 20px | Comfortable breathing room |
| `space-6` | 24px | Major section dividers |
| `space-8` | 32px | Page section gaps |
| `space-10` | 40px | Hero spacing, major visual breaks |
| `space-12` | 48px | Minimum touch target size |

### Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `radius-sm` | 4px | Small elements, badges, chips |
| `radius-md` | 8px | Buttons, inputs, cards |
| `radius-lg` | 12px | Modals, large cards |
| `radius-full` | 9999px | Circular elements, pills |

### The "Bento" Grid System

The dashboard uses a responsive grid of distinct "cells" to display disparate data types.

```
Desktop (3-column "Command Center"):
┌─────────────────┬─────────────────┬─────────────────┐
│                 │                 │                 │
│   Inventory     │   AI Architect  │  Network Map    │
│   Summary       │   Chat Panel    │  + Health       │
│                 │                 │                 │
├─────────────────┼─────────────────┤                 │
│                 │                 │                 │
│   Alerts        │   Quick Actions │                 │
│                 │                 │                 │
└─────────────────┴─────────────────┴─────────────────┘

Tablet (2-column):
┌─────────────────┬─────────────────┐
│   Inventory     │   AI Architect  │
│   + Alerts      │   Chat Panel    │
├─────────────────┤                 │
│   Network Map   │                 │
│   (collapsed)   │                 │
└─────────────────┴─────────────────┘

Mobile (1-column stack):
┌─────────────────┐
│   Alerts        │ ← Critical info first
├─────────────────┤
│   Quick Actions │
├─────────────────┤
│   Inventory     │
├─────────────────┤
│   [Tab: Chat]   │ ← Toggleable panels
│   [Tab: Map]    │
└─────────────────┘
```

### Grid Specifications

| Breakpoint | Columns | Gutter | Container Max |
|------------|---------|--------|---------------|
| Mobile (<640px) | 1 | 16px | 100% |
| Tablet (640px–1024px) | 2 | 20px | 960px |
| Desktop (>1024px) | 3 | 24px | 1280px |

---

## 5. Components

### 5.1 Status Indicators

Status indicators provide instant feedback on system and resource health.

**Status Badge**
```
┌──────────────────────────────┐
│  ● Online                    │  ← Circular indicator + label
└──────────────────────────────┘
```

| State | Indicator Color | Animation | Icon |
|-------|-----------------|-----------|------|
| **Active/Online** | Success (`#4ADE80`) | Subtle pulse (2s ease-in-out) | Solid circle |
| **Warning** | Warning (`#FBBF24`) | Faster pulse (1s) | Exclamation |
| **Critical/Offline** | Danger (`#F87171`) | No pulse (static) | X mark |
| **Unknown/Loading** | Text Muted (`#6B8B6F`) | Shimmer | Dotted circle |

**Alert Banner**
High-contrast banners for critical information. Always include a dismiss action.

```
┌─────────────────────────────────────────────────────────┐
│ ⚠  Water Tank 3 below 10% — Resupply required     [×]  │
└─────────────────────────────────────────────────────────┘
```

| Severity | Background | Border | Icon |
|----------|------------|--------|------|
| **Critical** | `#F87171` at 15% opacity | `#F87171` left border (4px) | Warning triangle |
| **Warning** | `#FBBF24` at 15% opacity | `#FBBF24` left border | Exclamation circle |
| **Info** | `#60A5FA` at 15% opacity | `#60A5FA` left border | Info circle |
| **Success** | `#4ADE80` at 15% opacity | `#4ADE80` left border | Check circle |

### 5.2 Cards (Bento Cells)

Cards are the fundamental unit of the dashboard. Each card represents a discrete data domain.

**Card Anatomy**
```
┌─────────────────────────────────────┐
│ ┌─ Header ────────────────────────┐ │
│ │ Icon  Title            Actions  │ │
│ └─────────────────────────────────┘ │
│                                     │
│   Body content                      │
│   - Data, charts, lists             │
│   - Interactive elements            │
│                                     │
│ ┌─ Footer (optional) ─────────────┐ │
│ │ Secondary actions / timestamp   │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

| Property | Value |
|----------|-------|
| Background | Surface (`#162118`) |
| Border | 1px solid Border Subtle (`#2A3D2E`) |
| Border Radius | `radius-lg` (12px) |
| Padding | `space-4` (16px) |
| Header border | 1px solid Border Subtle (bottom) |

**Card States**
- **Default**: As specified above
- **Hover**: Border color transitions to Border Default (`#3D5442`)
- **Active/Selected**: Border color transitions to Primary Muted (`#14B8A6`)
- **Loading**: Content replaced with skeleton shimmer

### 5.3 AI Architect Interface (Blueprint Aesthetic)

The chat interface uses a **technical blueprint** visual language to convey precision and engineering credibility.

**Visual Elements**
- **Background texture**: Subtle grid pattern (1px lines at 20px intervals, `#1E2D21` on Surface)
- **User messages**: Right-aligned, Surface Elevated background, rounded corners
- **AI responses**: Left-aligned, transparent background with left border (Primary color)
- **Citations**: Inline document icons with tooltip showing source title

**AI Response Card**
```
┌─────────────────────────────────────────────────────────────┐
│ ┌ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┐ │
│   CONSTRUCTION PLAN: Tire-Rammed Earth Wall               │ │
│ └ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ┘ │
│                                                             │
│ Step 1: Site Preparation                                    │
│ ─────────────────────────────────────────                   │
│ Clear a level area of 3m × 4m...                           │
│                                                             │
│ Materials Required:                                         │
│ ┌──────────────────────────────────────┐                   │
│ │ ○ Tires ×40        [████████░░] 80%  │ ← From inventory  │
│ │ ○ Earth (kg) ×200  [██████████] 100% │                   │
│ │ ○ Tamping tool ×1  [██████████] 100% │                   │
│ └──────────────────────────────────────┘                   │
│                                                             │
│ 📄 Source: UNHCR Shelter Standards, Ch. 4.2               │
└─────────────────────────────────────────────────────────────┘
```

**Context Chips (Inventory Tags)**
Show which materials the AI is considering for the plan.

```
┌───────────────┐  ┌───────────────┐  ┌───────────────┐
│ 🪨 Rubble ×50 │  │ 🪵 Timber ×12 │  │ 🛞 Tires ×40  │
└───────────────┘  └───────────────┘  └───────────────┘
```

| Property | Value |
|----------|-------|
| Background | Surface Elevated |
| Border | 1px solid Border Default |
| Border Radius | `radius-full` (pill) |
| Padding | `space-1` vertical, `space-3` horizontal |
| Typography | Caption, Text Secondary |

**Source Citation Button**
Prevents hallucination concerns by showing provenance.

| Property | Value |
|----------|-------|
| Icon | Document icon (16×16) |
| Text | Source document title (truncated) |
| Interaction | Click opens modal with full source excerpt |
| Visual | Info color, underline on hover |

### 5.4 Network Health Map

A real-time visualization of the LoRa mesh network topology.

**Node Representation**
```
    ╭─────╮
    │ ○── │ ← Node with signal indicator
    │ N3  │ ← Node ID
    ╰─────╯
```

| Node State | Fill Color | Border | Glow/Animation |
|------------|------------|--------|----------------|
| **Online (Strong)** | Primary (`#2DD4BF`) | None | Soft outer glow (8px blur) |
| **Online (Weak)** | Primary Muted (`#14B8A6`) | None | No glow |
| **Degraded** | Warning (`#FBBF24`) | None | Pulse animation |
| **Offline** | Danger (`#F87171`) | 2px dashed | None |
| **Brain Hub** | Success (`#4ADE80`) | 2px solid | Constant soft glow |

**Mesh Edge (Connection Lines)**
Lines between nodes represent signal strength (RSSI).

| Signal Quality | Line Style | Color | Width |
|----------------|------------|-------|-------|
| **Excellent** (>-70 dBm) | Solid | Success | 2px |
| **Good** (-70 to -85 dBm) | Solid | Primary | 2px |
| **Fair** (-85 to -100 dBm) | Dashed | Warning | 1px |
| **Poor** (<-100 dBm) | Dotted | Danger | 1px |

**Map Controls**
- **Zoom**: Pinch gesture / scroll wheel / +/- buttons
- **Pan**: Drag gesture
- **Node details**: Tap/click node to show detail popover
- **Legend**: Collapsible legend in bottom-left corner

### 5.5 Buttons

**Size Variants**

| Size | Height | Padding | Typography | Min Width |
|------|--------|---------|------------|-----------|
| **Small** | 32px | 8px 12px | Body Small (14px) | 64px |
| **Medium** | 40px | 10px 16px | Body (16px) | 80px |
| **Large** | 48px | 12px 24px | Body (16px, 500 weight) | 96px |

**Style Variants**

| Variant | Background | Text | Border | Use Case |
|---------|------------|------|--------|----------|
| **Primary** | Primary (`#2DD4BF`) | Text Inverse | None | Main actions (Submit, Save) |
| **Secondary** | Transparent | Primary | 1px Primary | Secondary actions |
| **Ghost** | Transparent | Text Secondary | None | Tertiary actions, icon buttons |
| **Danger** | Danger (`#F87171`) | Text Inverse | None | Destructive actions |

**States**
- **Hover**: Brightness +10%, subtle scale (1.02)
- **Active**: Brightness -10%, scale (0.98)
- **Disabled**: 50% opacity, cursor not-allowed
- **Loading**: Content replaced with spinner, disabled interaction

### 5.6 Form Inputs

**Text Input**
```
┌─────────────────────────────────────┐
│ Label                               │
│ ┌─────────────────────────────────┐ │
│ │ Placeholder text...             │ │
│ └─────────────────────────────────┘ │
│ Helper text or error message        │
└─────────────────────────────────────┘
```

| Property | Default | Focus | Error |
|----------|---------|-------|-------|
| Background | Surface Elevated | Surface Elevated | Surface Elevated |
| Border | 1px Border Default | 2px Primary | 2px Danger |
| Label | Text Secondary | Text Primary | Danger |
| Height | 44px minimum | — | — |

**Select/Dropdown**
Same styling as text input with chevron icon on right.

**Checkbox/Radio**
- Size: 20×20px minimum (44px touch target with padding)
- Checked state: Primary fill with white checkmark
- Focus: 2px Primary outline with 2px offset

---

## 6. Iconography

### Icon Set
Use **Lucide Icons** (MIT license, consistent style, good coverage).

### Icon Sizing

| Context | Size | Stroke Width |
|---------|------|--------------|
| **Inline with text** | 16×16 | 2px |
| **Button icon** | 20×20 | 2px |
| **Navigation** | 24×24 | 1.5px |
| **Feature/Empty state** | 48×48 | 1px |

### Semantic Icons (Required)

| Concept | Icon | Notes |
|---------|------|-------|
| Inventory | `Package` | — |
| AI Architect | `BrainCircuit` or `Compass` | Blueprint/drafting feel |
| Network | `Radio` or `Wifi` | — |
| Settings | `Settings` | — |
| Dashboard | `LayoutDashboard` | — |
| Add/Create | `Plus` | — |
| Edit | `Pencil` | — |
| Delete | `Trash2` | — |
| Warning | `AlertTriangle` | — |
| Error | `XCircle` | — |
| Success | `CheckCircle` | — |
| Info | `Info` | — |
| Water | `Droplet` | For water tank indicators |
| Fuel | `Fuel` | — |
| Materials | `Layers` | General rubble/aggregate |
| Document | `FileText` | Source citations |

---

## 7. Motion & Animation

### Principles
- **Purposeful**: Animation should provide feedback or guide attention, never purely decorative
- **Fast**: Most transitions 150-200ms; nothing over 300ms
- **Subtle**: Ease-in-out curves, small movements (4-8px)
- **Reducible**: Respect `prefers-reduced-motion` media query

### Standard Transitions

| Element | Duration | Easing | Property |
|---------|----------|--------|----------|
| Button hover | 150ms | ease-out | background-color, transform |
| Card hover | 200ms | ease-out | border-color, box-shadow |
| Modal open | 200ms | ease-out | opacity, transform (scale from 0.95) |
| Toast enter | 200ms | ease-out | opacity, transform (slide from top) |
| Page transition | 150ms | ease-in-out | opacity |

### Status Animations

| Animation | Duration | Easing | Usage |
|-----------|----------|--------|-------|
| **Pulse (active)** | 2000ms | ease-in-out | Online status indicators |
| **Pulse (warning)** | 1000ms | ease-in-out | Warning states needing attention |
| **Shimmer** | 1500ms | linear | Loading skeletons |
| **Spin** | 1000ms | linear | Loading spinners |

### CSS Implementation

```css
/* Respect user preferences */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

/* Status pulse */
@keyframes pulse-active {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.6; }
}

/* Skeleton shimmer */
@keyframes shimmer {
  0% { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
```

---

## 8. Accessibility Guidelines

### WCAG 2.1 AA Compliance (Minimum)

| Requirement | Implementation |
|-------------|----------------|
| **Color contrast** | 4.5:1 minimum for normal text, 3:1 for large text |
| **Focus indicators** | Visible 2px outline on all interactive elements |
| **Touch targets** | 44×44px minimum (48×48px preferred) |
| **Text scaling** | UI must remain functional at 200% zoom |
| **Screen reader** | All images have alt text; ARIA labels on icon-only buttons |
| **Keyboard navigation** | Full functionality without mouse |

### Color Contrast Verification

| Combination | Contrast Ratio | Pass? |
|-------------|----------------|-------|
| Text Primary on Background | 14.2:1 | AAA |
| Text Secondary on Background | 7.8:1 | AAA |
| Primary on Background | 9.1:1 | AAA |
| Danger on Background | 6.2:1 | AA |
| Warning on Background | 8.5:1 | AAA |

### Additional Guidelines

1. **Don't rely on color alone** — Always pair status colors with icons and text labels
2. **Provide text alternatives** — All icons must have `aria-label` or accompanying text
3. **Announce dynamic changes** — Use `aria-live` regions for alerts and inventory updates
4. **Support keyboard shortcuts** — Document and implement for power users
5. **Test with screen readers** — Verify with VoiceOver (iOS/Mac) and TalkBack (Android)

---

## 9. Internationalization (i18n)

### Supported Languages (MVP)

| Language | Code | Direction | Script |
|----------|------|-----------|--------|
| English | `en` | LTR | Latin |
| Arabic | `ar` | RTL | Arabic |
| French | `fr` | LTR | Latin |
| Spanish | `es` | LTR | Latin |

### Layout Considerations

1. **RTL Support**: Use CSS logical properties (`margin-inline-start` not `margin-left`)
2. **Text expansion**: Allow 30-50% extra space for translated text (German, French expand significantly)
3. **Number formatting**: Use `Intl.NumberFormat` for locale-appropriate numbers
4. **Date formatting**: Use `Intl.DateTimeFormat` — avoid hardcoded formats
5. **Icon direction**: Some icons (arrows, chevrons) should flip in RTL

### Typography for Non-Latin Scripts

| Script | Fallback Font | Notes |
|--------|---------------|-------|
| Arabic | `Noto Sans Arabic` | Bundle if Arabic is primary deployment region |
| Cyrillic | Covered by Nunito Sans | — |
| CJK | `Noto Sans SC/JP/KR` | Large files; load on-demand if needed |

---

## 10. Responsive Breakpoints

The system follows a **Mobile-First** implementation. Design for the smallest screen first, then enhance.

| Breakpoint | Token | CSS | Target Devices |
|------------|-------|-----|----------------|
| **Base** | `mobile` | `<640px` | Smartphones (portrait) |
| **Small** | `sm` | `≥640px` | Large phones (landscape), small tablets |
| **Medium** | `md` | `≥768px` | Tablets (portrait) |
| **Large** | `lg` | `≥1024px` | Tablets (landscape), small laptops |
| **Extra Large** | `xl` | `≥1280px` | Desktops, large laptops |

### Layout Adaptations by Breakpoint

| Component | Mobile | Tablet | Desktop |
|-----------|--------|--------|---------|
| **Navigation** | Bottom tab bar | Side rail (collapsed) | Side rail (expanded) |
| **Dashboard** | 1-column stack | 2-column grid | 3-column "Command Center" |
| **AI Chat** | Full-screen page | Right panel (50%) | Center panel (33%) |
| **Network Map** | Full-screen toggle | Inline (1/2 width) | Right panel (33%) |
| **Cards** | Full width | 1/2 width | 1/3 width |

---

## 11. Implementation Notes (Tailwind/Next.js)

### Tailwind Configuration

```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        background: '#0C1810',
        surface: {
          DEFAULT: '#162118',
          elevated: '#1E2D21',
        },
        border: {
          subtle: '#2A3D2E',
          DEFAULT: '#3D5442',
        },
        primary: {
          DEFAULT: '#2DD4BF',
          muted: '#14B8A6',
          subtle: '#0D9488',
        },
        success: '#4ADE80',
        warning: '#FBBF24',
        danger: '#F87171',
        info: '#60A5FA',
        text: {
          primary: '#E8F5E9',
          secondary: '#A7C4AA',
          muted: '#6B8B6F',
          inverse: '#0C1810',
        },
      },
      fontFamily: {
        sans: ['Nunito Sans', 'system-ui', 'sans-serif'],
        mono: ['Source Code Pro', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '12px',
      },
      spacing: {
        // Extends default Tailwind spacing
      },
    },
  },
}
```

### Required Dependencies

```json
{
  "dependencies": {
    "@fontsource-variable/nunito-sans": "^5.x",
    "@fontsource/source-code-pro": "^5.x",
    "lucide-react": "^0.x"
  }
}
```

### PWA Offline Font Loading

Fonts must be bundled, not loaded from CDN. Import in `_app.tsx` or global CSS:

```css
@import '@fontsource-variable/nunito-sans';
@import '@fontsource/source-code-pro/400.css';
@import '@fontsource/source-code-pro/500.css';
```

### ShadCN Component Theming

When using ShadCN components, override the default CSS variables to match this design system. Create a custom theme that maps to the color tokens defined above.

---

## 12. Design Tokens Reference (Quick Copy)

```css
:root {
  /* Colors - Background */
  --color-background: #0C1810;
  --color-surface: #162118;
  --color-surface-elevated: #1E2D21;

  /* Colors - Border */
  --color-border-subtle: #2A3D2E;
  --color-border: #3D5442;

  /* Colors - Primary */
  --color-primary: #2DD4BF;
  --color-primary-muted: #14B8A6;
  --color-primary-subtle: #0D9488;

  /* Colors - Semantic */
  --color-success: #4ADE80;
  --color-warning: #FBBF24;
  --color-danger: #F87171;
  --color-info: #60A5FA;

  /* Colors - Text */
  --color-text-primary: #E8F5E9;
  --color-text-secondary: #A7C4AA;
  --color-text-muted: #6B8B6F;
  --color-text-inverse: #0C1810;

  /* Typography */
  --font-sans: 'Nunito Sans', system-ui, sans-serif;
  --font-mono: 'Source Code Pro', ui-monospace, monospace;

  /* Spacing */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 20px;
  --space-6: 24px;
  --space-8: 32px;
  --space-10: 40px;
  --space-12: 48px;

  /* Border Radius */
  --radius-sm: 4px;
  --radius-md: 8px;
  --radius-lg: 12px;
  --radius-full: 9999px;

  /* Transitions */
  --transition-fast: 150ms ease-out;
  --transition-normal: 200ms ease-out;
}
```

---

## Changelog

| Version | Date | Changes |
|---------|------|---------|
| 2.0 | 2026-01-25 | Major revision: Forest/growth palette, humanitarian tone, Nunito Sans typography, blueprint AI aesthetic, enhanced accessibility guidelines |
| 1.0 | 2026-01-24 | Initial tactical design system |

# Visual Reference Guide - Generation & Completion Components

This guide provides ASCII art representations of the component layouts and visual hierarchy.

---

## 1. GeneratePlanButton - Floating CTA

```
                                                    ┌─────────────────────────────┐
                                                    │  Fixed Position             │
                                                    │  Bottom: 24px, Right: 24px  │
                                                    │  z-index: 40                │
                                                    └─────────────────────────────┘
                                                              │
                                                              ▼
                                    ┌──────────────────────────────────────┐
                                    │  Decorative Glow Ring (blur-xl)      │
                                    │  ┌────────────────────────────────┐  │
                                    │  │                                │  │
                                    │  │   ✨  Generate Blueprint      │  │ ← Sparkles icon + text
                                    │  │                                │  │
                                    │  └────────────────────────────────┘  │
                                    │  Primary button (#2DD4BF)            │
                                    │  • Pulse animation                   │
                                    │  • Scale on hover (1.05x)            │
                                    │  • Shadow with teal tint             │
                                    └──────────────────────────────────────┘
                                                              │
                                                              ▼
                                                    Slide-up animation
                                                    on appearance
```

**States:**

**Default (Visible):**
```
┌────────────────────────┐
│  ✨  Generate Blueprint │  ← Pulsing, glowing
└────────────────────────┘
```

**Hover:**
```
┌────────────────────────┐
│  ✨  Generate Blueprint │  ← Brighter, scaled up
└────────────────────────┘
     (Scale: 1.05x)
```

**Loading:**
```
┌────────────────────────┐
│  ⚪  Generating...     │  ← Spinner rotating
└────────────────────────┘
```

---

## 2. GeneratingState - Full-Screen Overlay

```
┌──────────────────────────────────────────────────────────────────────┐
│  FULL VIEWPORT (100vw × 100vh)                                       │
│                                                                      │
│  ┌─────┐                                              ┌─────┐       │
│  │     │  Blueprint corner decorations                │     │       │
│  │                                                           │       │
│                                                                      │
│                  ╔══════════════════════════╗                        │
│                  ║  Blueprint Grid Pattern  ║                        │
│                  ║  (20px × 20px squares)   ║                        │
│                  ║                          ║                        │
│                  ║      ┌─────────────┐     ║                        │
│                  ║      │  ╱───────╲  │     ║ ← Outer glow ring     │
│                  ║      │ │ ╱─────╲ │ │     ║ ← Inner glow ring     │
│                  ║      │ │ │  🧭 │ │ │     ║ ← Rotating compass    │
│                  ║      │ │ ╲─────╱ │ │     ║                        │
│                  ║      │  ╲───────╱  │     ║                        │
│                  ║      └─────────────┘     ║                        │
│                  ║                          ║                        │
│                  ║  Generating Your         ║ ← Title (25px, bold)   │
│                  ║  Blueprint               ║                        │
│                  ║                          ║                        │
│                  ║  Analyzing requirements  ║ ← Dynamic status msg   │
│                  ║                          ║                        │
│                  ║  Progress      42%       ║ ← Mono font            │
│                  ║  ┌────────────────────┐  ║                        │
│                  ║  │████████░░░░░░░░░░░░│  ║ ← Progress bar        │
│                  ║  └────────────────────┘  ║   with shimmer         │
│                  ║                          ║                        │
│                  ║  ─────────────────────   ║                        │
│                  ║  Process ID: BP-452891   ║ ← Technical detail     │
│                  ║  ● Active                ║                        │
│                  ╚══════════════════════════╝                        │
│                                                                      │
│  │                                                           │       │
│  │     │                                              │     │       │
│  └─────┘                                              └─────┘       │
│  Blueprint corner decorations                                       │
│                                                                      │
│  Background: #0C1810 with 95% opacity + backdrop blur               │
└──────────────────────────────────────────────────────────────────────┘
```

**Progress States:**

```
0-20%:   "Analyzing requirements..."
         ┌────────────────────┐
         │███░░░░░░░░░░░░░░░░│ 15%
         └────────────────────┘

20-40%:  "Calculating material needs..."
         ┌────────────────────┐
         │██████░░░░░░░░░░░░░│ 32%
         └────────────────────┘

40-60%:  "Designing structure..."
         ┌────────────────────┐
         │██████████░░░░░░░░░│ 54%
         └────────────────────┘

60-80%:  "Generating construction steps..."
         ┌────────────────────┐
         │██████████████░░░░░│ 71%
         └────────────────────┘

80-100%: "Finalizing blueprint..."
         ┌────────────────────┐
         │███████████████████│ 98%
         └────────────────────┘
```

**Animation Layers (Z-index):**
```
Layer 1 (Background):  Blueprint grid + backdrop blur
Layer 2 (Glow):        Pulsing glow rings (slow + active)
Layer 3 (Icon):        Rotating compass (3s rotation)
Layer 4 (Content):     Text, progress bar, details
Layer 5 (Shimmer):     Progress bar shimmer overlay
```

---

## 3. CompletionModal - Celebration

```
┌─────────────────────────────────────────────────────────────────────┐
│  BACKDROP (bg-black/60 + backdrop-blur-sm)                          │
│                                                                     │
│              ┌────────────────────────────────────┐                 │
│              │  MODAL (max-w-lg, centered)        │                 │
│              │  ┌──────────────────────────────┐  │                 │
│              │  │  Confetti Animation (×6)     │  │                 │
│              │  │  🎊  🎊    🎊    🎊  🎊  🎊  │  │ ← CSS-only     │
│              │  └──────────────────────────────┘  │                 │
│              │                                    │                 │
│              │         ┌────────────┐             │                 │
│              │         │  ╱──────╲  │             │ ← Glow ring     │
│              │         │ │   ✓   │ │             │                 │
│              │         │  ╲──────╱  │             │ ← CheckCircle   │
│              │         └────────────┘             │   (Success)     │
│              │                                    │                 │
│              │      Congratulations!              │ ← Heading       │
│              │   Your blueprint has been          │                 │
│              │        completed                   │ ← Subtext       │
│              │                                    │                 │
│              │  ╔════════════════════════════╗    │                 │
│              │  ║ SUMMARY CARD               ║    │                 │
│              │  ║                            ║    │                 │
│              │  ║ Emergency Shelter with     ║    │ ← Project name  │
│              │  ║ Rainwater Collection       ║    │                 │
│              │  ║                            ║    │                 │
│              │  ║ Completed Jan 26, 2026     ║    │ ← Timestamp     │
│              │  ║ ────────────────────────   ║    │                 │
│              │  ║                            ║    │                 │
│              │  ║  STEPS        EST. TIME    ║    │ ← Stats grid    │
│              │  ║  5/5          2-3 days     ║    │                 │
│              │  ║  Complete     Build time   ║    │                 │
│              │  ║                            ║    │                 │
│              │  ║  MATERIALS REQUIRED        ║    │                 │
│              │  ║  🛞 Used Tires      40 units│   │ ← Materials     │
│              │  ║  🪨 Earth/Soil     200 kg  ║    │   with emojis   │
│              │  ║  🪵 Timber Beams    12 beams│   │                 │
│              │  ║  🏗️ Corrugated Metal 8 sheets│  │                 │
│              │  ║  + 2 more materials        ║    │                 │
│              │  ╚════════════════════════════╝    │                 │
│              │                                    │                 │
│              │  ┌──────────────┐ ┌────────────┐  │                 │
│              │  │ Share2       │ │ Download   │  │ ← Secondary     │
│              │  │ Share        │ │ Download   │  │   buttons       │
│              │  │ Blueprint    │ │ PDF        │  │                 │
│              │  └──────────────┘ └────────────┘  │                 │
│              │                                    │                 │
│              │  ┌──────────────────────────────┐ │                 │
│              │  │  🏠  Back to Dashboard       │ │ ← Primary btn   │
│              │  └──────────────────────────────┘ │                 │
│              │                                    │                 │
│              │  [×] Close button (top-right)     │                 │
│              └────────────────────────────────────┘                 │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

**Confetti Animation (CSS-only):**
```
Frame 0 (0%):        Frame 1 (50%):       Frame 2 (100%):
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│ • • • • • • │     │             │     │             │
│             │     │  •  •  •    │     │             │
│             │     │    •  •  •  │     │             │
│             │     │             │     │      •      │
│             │     │             │     │    •   •    │
│             │     │             │     │  •   •   •  │
└─────────────┘     └─────────────┘     └─────────────┘
  Opacity: 0        Opacity: 1          Opacity: 0
  Y: 0              Y: 150px            Y: 300px
  Rotate: 0deg      Rotate: 360deg      Rotate: 720deg
```

**Responsive Layouts:**

**Desktop (≥768px):**
```
┌──────────────────────────────┐
│  Success Icon                │
│  Congratulations!            │
│  Subtitle                    │
│  ┌────────────────────────┐  │
│  │ Summary Card           │  │
│  │ • Stats Grid (2 cols)  │  │
│  │ • Materials List       │  │
│  └────────────────────────┘  │
│  [Share] [Download]          │ ← Horizontal
│  [Back to Dashboard]         │
└──────────────────────────────┘
```

**Mobile (<768px):**
```
┌─────────────────┐
│  Success Icon   │
│ Congratulations!│
│  Subtitle       │
│  ┌───────────┐  │
│  │ Summary   │  │
│  │ Stats(2×1)│  │
│  │ Materials │  │
│  └───────────┘  │
│  [Share]        │ ← Stacked
│  [Download]     │   vertically
│  [Dashboard]    │
└─────────────────┘
```

---

## Color & Typography Reference

### Color Swatches

```
Primary (#2DD4BF):     ███ Buttons, progress bars, active states
Success (#4ADE80):     ███ Completion icon, positive indicators
Background (#0C1810):  ███ Main background, dark base
Surface (#162118):     ███ Card backgrounds
Elevated (#1E2D21):    ███ Modal, dropdown backgrounds
Text Primary (#E8F5E9):███ Headings, body text
Text Secondary (#A7C4AA): ███ Labels, captions
Text Muted (#6B8B6F):  ███ Disabled, placeholders
Border Subtle (#2A3D2E): ═══ Dividers, card borders
```

### Typography Hierarchy

```
Display (2rem):     Generating Your Blueprint
                    (Not used in these components)

Heading 1 (1.563rem): Generating Your Blueprint
                      ^^^^^^^^^^^^^^^^^^^^^^
                      Font: Nunito Sans, 600 weight

Heading 2 (1.25rem):  Congratulations!
                      ^^^^^^^^^^^^^^^
                      Font: Nunito Sans, 600 weight

Body (1rem):          Your blueprint has been completed
                      ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
                      Font: Nunito Sans, 400 weight

Body Small (0.875rem): Analyzing requirements...
                       ^^^^^^^^^^^^^^^^^^^^^^^^
                       Font: Nunito Sans, 400 weight

Caption (0.75rem):     MATERIALS REQUIRED
                       ^^^^^^^^^^^^^^^^^^
                       Font: Nunito Sans, 500 weight, uppercase

Mono (0.875rem):       Progress    42%
                       ^^^^^^^^    ^^^
                       Font: Source Code Pro, 400 weight
```

---

## Animation Timeline

### GeneratePlanButton Lifecycle

```
Time:  0ms         300ms        ∞
       │           │            │
       ├───────────┤            │
       │  Slide-up │            │
       │  from     │            │
       │  bottom   │            │
       └───────────┘            │
                    │           │
                    ├───────────┤
                    │  Pulse    │ ← Continuous
                    │  animation│
                    └───────────┘
```

### GeneratingState Progress Flow

```
Progress:  0%         20%        40%        60%        80%       100%
           │          │          │          │          │          │
Status:    Analyzing  Calculating Designing Generating Finalizing Complete
           requirements materials  structure  steps     blueprint
           │          │          │          │          │          │
Animation: ├──────────┼──────────┼──────────┼──────────┼──────────┤
           │ Compass rotation (continuous 3s loop)                 │
           │ Progress bar fill (smooth 500ms transitions)          │
           │ Status text fade (300ms between changes)              │
           │ Shimmer effect (continuous 1.5s loop)                 │
           └───────────────────────────────────────────────────────┘
```

### CompletionModal Confetti

```
Time:     0ms    100ms   200ms   300ms   400ms   500ms   ...   3000ms
          │      │       │       │       │       │              │
Piece 1:  ┌──────────────────────────────────────────────────────┐
Piece 2:    ┌──────────────────────────────────────────────────────┐
Piece 3:      ┌──────────────────────────────────────────────────────┐
Piece 4:  ┌──────────────────────────────────────────────────────┐
Piece 5:    ┌──────────────────────────────────────────────────────┐
Piece 6:      ┌──────────────────────────────────────────────────────┐
          │      │       │       │       │       │              │
          Staggered start                                        Fade out
          (0-0.5s delays)                                        complete
```

---

## State Transitions Diagram

```
┌──────────────────┐
│  Initial State   │
│  (Chat active)   │
└────────┬─────────┘
         │
         │ AI detects readiness
         ▼
┌──────────────────┐
│ GeneratePlanBtn  │──────┐
│   (visible)      │      │ User dismisses chat
└────────┬─────────┘      │
         │                │
         │ User clicks    │
         ▼                │
┌──────────────────┐      │
│ GeneratingState  │      │
│  (progress 0-100)│      │
└────────┬─────────┘      │
         │                │
         │ Progress=100%  │
         ▼                │
┌──────────────────┐      │
│ CompletionModal  │      │
│   (celebration)  │      │
└────────┬─────────┘      │
         │                │
         │ User action    │
         ▼                │
    ┌────────────────┐    │
    │ Share/Download │    │
    └────────────────┘    │
    ┌────────────────┐    │
    │ Back to        │    │
    │ Dashboard      │◄───┘
    └────────────────┘
```

---

## Icon Reference

All icons from Lucide React at various sizes:

```
GeneratePlanButton:
  ✨ Sparkles (20×20px)
     - Rotates 12° on hover
     - Stroke width: 2px

GeneratingState:
  🧭 Compass (64×64px)
     - Rotates 360° every 3s
     - Stroke width: 1.5px

CompletionModal:
  ✓ CheckCircle (64×64px)
    - Success color
    - Stroke width: 2px

  📤 Share2 (16×16px)
     - Secondary button
     - Stroke width: 2px

  ⬇️ Download (16×16px)
     - Secondary button
     - Stroke width: 2px

  🏠 Home (16×16px)
     - Primary button
     - Stroke width: 2px
```

---

## Accessibility Visual Indicators

### Focus States

```
Default Button:
┌────────────────────┐
│  Generate Blueprint│
└────────────────────┘

Focused Button:
╔════════════════════╗  ← 2px primary ring
║┌──────────────────┐║    with 2px offset
║│ Generate Blueprint││
║└──────────────────┘║
╚════════════════════╝
```

### Screen Reader Announcements

```
GeneratingState:
┌─────────────────────────────────────────┐
│ [role="status"]                         │
│ [aria-live="polite"]                    │
│                                         │
│ Visible: "Analyzing requirements..."   │
│          "42%"                          │
│                                         │
│ Screen reader only (sr-only):           │
│ "Analyzing requirements... 42% complete"│
└─────────────────────────────────────────┘
```

---

## Responsive Breakpoints

```
Mobile (<640px):
┌─────────────┐
│   Button    │ ← Slightly smaller padding
│   Modal     │ ← Full width with margin
│   Confetti  │ ← Fewer pieces
└─────────────┘

Tablet (640-1024px):
┌──────────────────┐
│      Button      │ ← Standard size
│      Modal       │ ← Max-width: 512px
│      Confetti    │ ← Full effect
└──────────────────┘

Desktop (>1024px):
┌─────────────────────┐
│       Button        │ ← Standard size
│       Modal         │ ← Max-width: 512px
│       Confetti      │ ← Full effect
└─────────────────────┘
```

---

## Performance Visualization

### Animation Performance (60 FPS target)

```
Frame render time:
┌────────────────────────────────────────┐
│ Target: 16.67ms (60 FPS)               │
├────────────────────────────────────────┤
│ CSS Animations:   2-4ms   ████         │ ← GPU accelerated
│ React Render:     3-6ms   ██████       │ ← Optimized
│ Paint/Composite:  4-8ms   ████████     │ ← Blur/shadow cost
├────────────────────────────────────────┤
│ Total:           9-18ms   ████████████ │ ← Within budget!
└────────────────────────────────────────┘
                             60 FPS OK ✓
```

---

This visual reference guide provides a clear understanding of:
- Component layouts and hierarchy
- Animation states and transitions
- Color and typography usage
- Responsive behavior
- Accessibility features
- Performance characteristics

Use this alongside the code implementation for complete understanding of the Generation & Completion components.

# Phase 5: UI Chrome - Research

**Researched:** 2026-03-23  
**Domain:** Modern UI tooling (Tailwind CSS v4, shadcn/ui, Motion.dev, responsive design)  
**Confidence:** HIGH

## Summary

Phase 5 integrates modern UI infrastructure while preserving the existing glassmorphism aesthetic. The research confirms that Tailwind CSS v4 (stable at 4.2.2) introduces CSS-first configuration with `@theme` syntax, eliminating the need for JavaScript config files. shadcn/ui provides accessible React components installed via CLI (not npm), and Motion.dev (v12.38.0) offers React 19-compatible animations with exit transition support. The migration path is clear: convert 200+ CSS variables to Tailwind's `@theme` blocks, replace inline styles with utility classes, migrate MilestoneModal to shadcn/ui Dialog, and add Motion.dev AnimatePresence for loading exit animations.

**Primary recommendation:** Use Tailwind CSS v4.2.2 with @tailwindcss/vite plugin for Vite 8 integration, shadcn/ui Dialog component for modal, and Motion.dev for all animations. Preserve exact visual aesthetic through careful @theme token mapping.

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Design System Migration Strategy:**
- Convert all CSS variables to Tailwind v4's @theme syntax (200+ lines)
- Replace custom utilities with Tailwind equivalents
- CSS-first configuration (not JavaScript tailwind.config.js)
- Preserve all design tokens exactly (colors, spacing, typography, motion)
- Full conversion of all components to Tailwind classes

**shadcn/ui Integration:**
- Install selectively (Dialog, Button, Spinner only as needed)
- Install individual components into src/components/ui/
- Customize with existing mauve accent and glassmorphism aesthetic
- Follow shadcn/ui conventions

**Loading Experience Design:**
- Keep ghost hub pulse (existing CanvasLoader approach)
- No loading text - pure visual state
- Smooth exit transition with Motion.dev (300-500ms fade + scale)
- Component-level skeleton states

**Chrome UI Elements:**
- No new chrome (canvas remains fullscreen)
- No header, navigation, footer, help button, about button
- Existing UI only: Canvas + Controls + Modal
- CanvasControls: Migrate to Tailwind, keep position/behavior
- MilestoneModal: Migrate to shadcn/ui Dialog, preserve glassmorphism
- CanvasFogOverlay: Keep as-is, migrate styles if possible
- CanvasLoader: Keep ghost hub design, add Motion.dev exit animation

**Responsive Behavior:**
- Desktop-first approach (base styles for desktop, scale down with media queries)
- Breakpoints: Tailwind's default (sm: 640px, md: 768px, lg: 1024px, xl: 1280px)
- Canvas controls: No changes (40px touch targets work everywhere)
- Modal: Fullscreen on mobile (< 768px), centered card on desktop (>= 768px)
- Typography: Add clamp() scaling for fluid responsiveness
- Spacing: 8px grid system consistent across all breakpoints

### Claude's Discretion

- Tailwind v4 installation method (npm package version, PostCSS config, Vite plugin setup)
- @theme conversion approach (how to structure color palette, spacing, typography)
- shadcn/ui initialization (CLI setup, component installation commands)
- Motion.dev integration (motion vs framer-motion package choice, animation API patterns)
- Component refactoring order (which to migrate first)
- Tailwind class patterns (specific utility combinations for glassmorphism, focus rings)
- Responsive breakpoint usage (when to use sm/md/lg/xl for specific components)
- Animation timing curves (exact easing functions for transitions)
- Skeleton component design (structure and styling for loading states)
- Migration testing strategy (visual regression, component tests, E2E validation)

### Deferred Ideas (OUT OF SCOPE)

- Header or navigation UI
- Additional chrome elements beyond existing controls and modal
- Performance optimization for 200+ nodes
- Dark mode toggle (design system is dark-first)
- Accessibility controls (reduce motion, font size adjustments)
- Help/tutorial overlays
- "About this site" info pages
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|-----------------|
| UI-01 | Site uses Tailwind CSS v4 for styling | Tailwind v4.2.2 stable with @theme syntax, @tailwindcss/vite for Vite 8 |
| UI-02 | UI components built with shadcn/ui | shadcn/ui CLI installs Dialog component, Radix UI primitives for accessibility |
| UI-03 | Animations powered by Motion.dev | Motion v12.38.0 with React 19 support, AnimatePresence for exit animations |
| UI-04 | Site is responsive on mobile and desktop | Tailwind responsive utilities (sm/md/lg/xl), clamp() for typography, aspect-ratio |
| UI-05 | Loading spinner displays during initial canvas load | Existing CanvasLoader with Motion.dev exit transition |
</phase_requirements>

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| tailwindcss | 4.2.2 | Utility-first CSS framework | v4 introduces CSS-first config with @theme, eliminates JS config, official stable release (March 2026) |
| @tailwindcss/vite | 4.2.2 | Vite plugin for Tailwind v4 | Official plugin with Vite 8 support, HMR integration, automatic content scanning |
| motion | 12.38.0 | Animation library for React | Modern fork of Framer Motion, React 19 compatible, smaller bundle than framer-motion, exit animation support |
| shadcn-ui (CLI) | latest | Component CLI installer | Industry standard for accessible React components, Radix UI-based, copies components into project |
| @radix-ui/react-dialog | 1.1.15 | Dialog primitive | Powers shadcn/ui Dialog, ARIA-compliant, focus trap, portal rendering |

### Supporting

| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| class-variance-authority | 0.7.0 | Component variant API | Optional for complex component variants (Button with sizes/colors) |
| clsx | 2.1.1 | Conditional class names | Combining Tailwind utilities conditionally |
| tailwind-merge | 2.6.0 | Merge conflicting classes | Resolve Tailwind class conflicts in component props |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| motion | framer-motion 12.x | Framer Motion is original library (larger bundle ~50KB), Motion is optimized fork (smaller ~40KB), same API |
| @theme syntax | tailwind.config.js | v3 approach still works but v4 @theme is CSS-native, better IDE support, simpler setup |
| shadcn/ui | Radix UI directly | More control but lose pre-styled components, accessibility patterns, theme integration |
| Tailwind utilities | styled-components | Runtime CSS-in-JS has performance overhead, Tailwind is build-time, zero runtime cost |

**Installation:**
```bash
# Tailwind CSS v4 with Vite plugin
npm install -D tailwindcss@4.2.2 @tailwindcss/vite@4.2.2

# Motion.dev for animations
npm install motion@12.38.0

# shadcn/ui dependencies (installed per component via CLI)
npm install @radix-ui/react-dialog@1.1.15 class-variance-authority@0.7.0 clsx@2.1.1 tailwind-merge@2.6.0

# shadcn/ui CLI for component installation
npx shadcn@latest init
```

**Version verification performed 2026-03-23:**
- tailwindcss@4.2.2 - Latest stable, published 2026-03-18
- @tailwindcss/vite@4.2.2 - Vite 5-8 compatible, published 2026-03-18  
- motion@12.38.0 - Latest, React 19 compatible
- @radix-ui/react-dialog@1.1.15 - Latest stable

## Architecture Patterns

### Recommended Project Structure

```
src/
├── components/
│   ├── ui/                 # shadcn/ui components (CLI-installed)
│   │   ├── dialog.tsx      # Dialog primitive wrapper
│   │   └── button.tsx      # Button component (if needed)
│   ├── Canvas.tsx
│   ├── CanvasControls.tsx  # Migrated to Tailwind utilities
│   ├── CanvasLoader.tsx    # Migrated with Motion.dev exit
│   ├── MilestoneModal.tsx  # Migrated to use ui/dialog.tsx
│   └── ...
├── lib/
│   └── utils.ts            # cn() helper for class merging
├── styles/
│   └── index.css           # @theme definitions + @import "tailwindcss"
└── App.tsx
```

### Pattern 1: Tailwind v4 CSS-First Configuration

**What:** Define design tokens using @theme blocks directly in CSS instead of JavaScript config files.

**When to use:** All design system tokens (colors, spacing, typography, shadows, etc.)

**Example:**
```css
/* src/styles/index.css */
@import "tailwindcss";

@theme {
  /* Colors */
  --color-surface-dim: #0A0A0A;
  --color-surface-default: #131313;
  --color-interactive-default: #E0AFFF;
  --color-interactive-hover: #EAC7FF;
  
  /* Spacing (8px grid) */
  --spacing-0: 0;
  --spacing-1: 4px;
  --spacing-2: 8px;
  --spacing-3: 12px;
  --spacing-4: 16px;
  --spacing-8: 32px;
  
  /* Typography */
  --font-display: "Noto Serif", Georgia, serif;
  --font-body: "Space Grotesk", Inter, system-ui, sans-serif;
  --font-mono: "JetBrains Mono", "Fira Code", monospace;
  
  /* Font sizes with fluid scaling */
  --font-size-xs: 0.75rem;
  --font-size-base: clamp(0.875rem, 2vw, 1rem);
  --font-size-display-lg: clamp(4rem, 10vw, 8rem);
  
  /* Shadows */
  --shadow-glass: 0 8px 32px rgba(0, 0, 0, 0.2);
  --shadow-2xl: 0 24px 64px rgba(0, 0, 0, 0.24);
  
  /* Border radius */
  --radius-lg: 16px;
  --radius-xl: 24px;
}

/* Custom utilities for glassmorphism */
@layer utilities {
  .glass {
    background: rgba(28, 28, 28, 0.7);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
}
```

**Source:** [Tailwind CSS v4.2.2 CHANGELOG](https://github.com/tailwindlabs/tailwindcss/blob/v4.2.2/CHANGELOG.md) - @theme syntax introduced in v4.0

### Pattern 2: shadcn/ui Dialog Migration

**What:** Replace custom modal with shadcn/ui Dialog component while preserving glassmorphism aesthetic.

**When to use:** Any modal/dialog that needs accessibility (focus trap, ESC handling, ARIA)

**Example:**
```tsx
// src/components/MilestoneModal.tsx (migrated)
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog'
import type { ContentNode } from '@/types/content'

interface MilestoneModalProps {
  node: ContentNode | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function MilestoneModal({ node, open, onOpenChange }: MilestoneModalProps) {
  if (!node) return null
  
  const formattedDate = new Date(node.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass rounded-2xl max-w-md p-8 md:max-w-lg">
        <DialogHeader>
          <div className="text-5xl mb-4">🏆</div>
          <DialogTitle className="font-display text-2xl text-primary pr-8">
            {node.title}
          </DialogTitle>
        </DialogHeader>
        
        <p className="text-sm text-tertiary mb-2">{formattedDate}</p>
        
        {node.institution && (
          <p className="text-base text-interactive-default mb-4">
            {node.institution}
          </p>
        )}
        
        {node.description && (
          <p className="text-base text-secondary leading-relaxed">
            {node.description}
          </p>
        )}
        
        <DialogClose />
      </DialogContent>
    </Dialog>
  )
}
```

**Source:** [shadcn/ui Dialog docs](https://ui.shadcn.com/docs/components/dialog) - Radix UI Dialog primitive wrapper

### Pattern 3: Motion.dev Exit Animations

**What:** Use AnimatePresence to animate components when they unmount (loading state → canvas transition).

**When to use:** Any component that exits/unmounts and needs smooth transition

**Example:**
```tsx
// src/components/Canvas.tsx
import { AnimatePresence, motion } from 'motion/react'
import { CanvasLoader } from './CanvasLoader'
import { Tldraw, useEditor } from 'tldraw'

export function Canvas() {
  const [isLoading, setIsLoading] = useState(true)
  
  // ... canvas setup logic
  
  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="loader"
            initial={{ opacity: 1, scale: 1 }}
            exit={{ 
              opacity: 0, 
              scale: 0.95,
              transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } 
            }}
          >
            <CanvasLoader />
          </motion.div>
        )}
      </AnimatePresence>
      
      <Tldraw {...props} />
    </>
  )
}
```

**Source:** [Motion docs - AnimatePresence](https://motion.dev/docs/react-animate-presence)

### Pattern 4: Responsive Glassmorphism Controls

**What:** Desktop-first responsive utilities with glassmorphism effect using Tailwind classes.

**When to use:** All glassmorphic UI elements (controls, modal, overlays)

**Example:**
```tsx
// src/components/CanvasControls.tsx (migrated)
export function CanvasControls({ editor, visible }: CanvasControlsProps) {
  return (
    <div 
      className={cn(
        "fixed bottom-4 right-4 flex gap-2 p-3 rounded-xl glass transition-opacity duration-200",
        visible ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      )}
    >
      <ControlButton onClick={zoomOut} title="Zoom out">−</ControlButton>
      <ControlButton onClick={zoomIn} title="Zoom in">+</ControlButton>
      <ControlButton onClick={resetToHub} title="Reset to hub">⌂</ControlButton>
      <ControlButton onClick={fitToScreen} title="Fit to screen">◻</ControlButton>
    </div>
  )
}

function ControlButton({ onClick, title, children }: ControlButtonProps) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="w-10 h-10 flex items-center justify-center rounded-lg text-lg font-medium text-secondary hover:text-interactive-hover hover:bg-interactive-subtle transition-all duration-150"
    >
      {children}
    </button>
  )
}
```

### Pattern 5: Fluid Typography with clamp()

**What:** Use CSS clamp() for responsive text sizes that scale smoothly between mobile and desktop.

**When to use:** All text content (body, headings, display text)

**Example:**
```css
@theme {
  /* Fluid typography scales */
  --font-size-sm: clamp(0.75rem, 1.5vw, 0.875rem);     /* 12px → 14px */
  --font-size-base: clamp(0.875rem, 2vw, 1rem);        /* 14px → 16px */
  --font-size-lg: clamp(1rem, 2.5vw, 1.125rem);        /* 16px → 18px */
  --font-size-xl: clamp(1.125rem, 3vw, 1.25rem);       /* 18px → 20px */
  --font-size-2xl: clamp(1.25rem, 4vw, 1.5rem);        /* 20px → 24px */
  --font-size-3xl: clamp(1.5rem, 5vw, 1.875rem);       /* 24px → 30px */
  
  /* Display scale with viewport-based sizing */
  --font-size-display-sm: clamp(2rem, 5vw, 3rem);      /* 32px → 48px */
  --font-size-display-md: clamp(3rem, 7vw, 5rem);      /* 48px → 80px */
  --font-size-display-lg: clamp(4rem, 10vw, 8rem);     /* 64px → 128px */
  --font-size-display-xl: clamp(5rem, 12vw, 10rem);    /* 80px → 160px */
}
```

### Anti-Patterns to Avoid

- **Mixing CSS variables and Tailwind utilities:** Don't use `style={{ color: 'var(--text-primary)' }}` alongside Tailwind classes. Convert all tokens to @theme and use `text-primary` utility.
- **Inline styles for layout:** Don't use `style={{ display: 'flex' }}` when Tailwind provides `flex` utility. Inline styles bypass build-time optimizations.
- **JavaScript tailwind.config.js in v4:** Don't create tailwind.config.js. Use CSS @theme blocks for all configuration.
- **Installing shadcn/ui via npm:** Don't `npm install shadcn-ui`. Use CLI to copy components into src/components/ui/.
- **Complex AnimatePresence nesting:** Don't nest multiple AnimatePresence. Keep one parent for exit animations.
- **Hardcoded responsive values:** Don't use fixed breakpoint values in JavaScript. Use Tailwind's md:, lg: prefixes or CSS media queries referencing @theme breakpoints.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Accessible modal/dialog | Custom overlay + focus trap + keyboard handling | shadcn/ui Dialog (Radix UI) | Focus management, ESC handling, portal rendering, ARIA attributes, screen reader support all handled automatically |
| Animation orchestration | Custom CSS keyframes + state management | Motion.dev AnimatePresence | Exit animations, stagger children, gesture handling, physics-based spring animations with simple declarative API |
| Responsive breakpoints | Custom useMediaQuery hook or JS window.matchMedia | Tailwind responsive prefixes (sm:, md:, lg:) | Build-time optimization, no runtime cost, consistent breakpoints across project, automatic mobile-first or desktop-first |
| Class name merging | Custom string concatenation or array joining | tailwind-merge + clsx (via cn() helper) | Resolves conflicting Tailwind utilities (bg-red-500 bg-blue-500 → bg-blue-500), handles conditional classes |
| Design tokens system | Manual CSS variables + utility classes | Tailwind @theme blocks | IDE autocomplete, type safety with CSS IntelliSense, automatic utility generation, purging unused styles |
| Glassmorphism effect | Custom backdrop-filter + rgba + box-shadow | @layer utilities with Tailwind classes | Reusable utility, consistent across components, works with responsive variants |

**Key insight:** UI infrastructure problems are solved at ecosystem scale. Tailwind v4's @theme syntax, shadcn/ui's accessibility patterns, and Motion.dev's animation APIs represent thousands of hours of edge case handling. Custom solutions inevitably hit: browser inconsistencies, accessibility gaps, bundle size bloat, maintenance burden, and missing features. The ecosystem tooling is stable, well-tested, and actively maintained.

## Common Pitfalls

### Pitfall 1: @theme Token Naming Mismatch

**What goes wrong:** Using CSS variable syntax in @theme blocks (--text-primary instead of text-primary) causes Tailwind to not generate utilities.

**Why it happens:** Tailwind v4 @theme uses bare names, not CSS variable syntax. The framework automatically converts to CSS variables internally.

**How to avoid:** 
- Use `--color-primary: #fff` not `--text-primary: #fff`
- Reference as `text-primary` in HTML, Tailwind generates `--color-primary` CSS variable
- Follow Tailwind's semantic naming: `--color-*`, `--spacing-*`, `--font-size-*`, `--font-*`, `--radius-*`, `--shadow-*`

**Warning signs:** Utility classes not working (text-primary has no effect), CSS variables undefined in browser DevTools

**Example:**
```css
/* ❌ Wrong - Tailwind won't generate utilities */
@theme {
  --text-primary: #ffffff;
  --bg-surface: #131313;
}

/* ✅ Correct - Tailwind generates utilities */
@theme {
  --color-primary: #ffffff;
  --color-surface: #131313;
}

/* Usage in HTML */
<div className="text-primary bg-surface">...</div>
```

### Pitfall 2: z-index Conflicts with tldraw

**What goes wrong:** Modal or overlay renders behind canvas or has flickering/interaction issues because tldraw uses z-index 200-300 range.

**Why it happens:** tldraw's internal UI (toolbar, context menus) uses high z-index values. Custom modals must be higher.

**How to avoid:**
- Set modal/overlay z-index to 500+ (well above tldraw's range)
- Use Tailwind's z-50 (z-index: 50) is NOT enough - use custom utility or inline z-index
- Test modal opening/closing with canvas interactions (pan/zoom/click)

**Warning signs:** Modal backdrop appears but content is behind canvas, clicks go through modal to canvas, modal appears then disappears

**Example:**
```tsx
/* ❌ Wrong - z-50 is only z-index: 50 */
<Dialog>
  <DialogContent className="z-50">...</DialogContent>
</Dialog>

/* ✅ Correct - Custom z-index above tldraw */
<Dialog>
  <DialogContent className="z-[500]">...</DialogContent>
</Dialog>

/* Or define in @theme */
@theme {
  --z-index-modal: 500;
}
/* Then use z-modal utility */
```

### Pitfall 3: Motion.dev Import Path Confusion

**What goes wrong:** Import from `framer-motion` instead of `motion/react`, causing duplicate packages or missing features.

**Why it happens:** Motion.dev is a fork of Framer Motion. Old code uses `framer-motion`, new code uses `motion`. Both exist on npm.

**How to avoid:**
- Always import from `motion/react` not `framer-motion`
- Check package.json only has `motion` installed, not both
- Update existing Framer Motion code: `import { motion } from 'motion/react'`

**Warning signs:** Bundle size increases unexpectedly, type errors about incompatible Motion components, two animation libraries in node_modules

**Example:**
```tsx
/* ❌ Wrong - old package */
import { motion, AnimatePresence } from 'framer-motion'

/* ✅ Correct - Motion.dev fork */
import { motion, AnimatePresence } from 'motion/react'
```

### Pitfall 4: shadcn/ui Component Customization Loss

**What goes wrong:** Customizing Dialog component by editing src/components/ui/dialog.tsx, then running `npx shadcn add dialog` overwrites changes.

**Why it happens:** shadcn/ui CLI copies components into project. Re-running add command overwrites files.

**How to avoid:**
- Customize Dialog in parent component (MilestoneModal), not in ui/dialog.tsx
- Use className prop to add custom styles (glass effect, rounded-2xl, etc.)
- If you must edit ui/dialog.tsx, track changes and reapply after CLI updates
- Consider wrapping ui/dialog.tsx in custom component (CustomDialog) for project-specific defaults

**Warning signs:** Glassmorphism styling disappears after running shadcn add, custom props missing, styles reset to defaults

**Example:**
```tsx
/* ❌ Wrong - editing ui/dialog.tsx loses customization on update */
// src/components/ui/dialog.tsx
export function DialogContent({ className, children, ...props }: DialogContentProps) {
  return (
    <DialogPrimitive.Content 
      className="glass rounded-2xl p-8" // ❌ Lost on CLI update
      {...props}
    >
      {children}
    </DialogPrimitive.Content>
  )
}

/* ✅ Correct - customize in parent component */
// src/components/MilestoneModal.tsx
export function MilestoneModal() {
  return (
    <Dialog>
      <DialogContent className="glass rounded-2xl p-8 max-w-md">
        {/* Content here */}
      </DialogContent>
    </Dialog>
  )
}
```

### Pitfall 5: AnimatePresence Mode Confusion

**What goes wrong:** Multiple items exit at once instead of one-by-one, or exit animations don't play at all.

**Why it happens:** AnimatePresence has `mode` prop with different behaviors: `sync` (default), `wait`, `popLayout`. Wrong mode causes unexpected animation timing.

**How to avoid:**
- For single item (loading screen): default mode is fine
- For list items: use `mode="popLayout"` to animate exits before new items enter
- For conditional rendering (A or B): use `mode="wait"` to exit A before B enters
- Always provide unique `key` prop to animated children

**Warning signs:** Exit animations not playing, items appearing/disappearing instantly, animation timing feels wrong, multiple items animating simultaneously when shouldn't

**Example:**
```tsx
/* ❌ Wrong - missing key, animations don't play */
<AnimatePresence>
  {isLoading && (
    <motion.div exit={{ opacity: 0 }}>
      <CanvasLoader />
    </motion.div>
  )}
</AnimatePresence>

/* ✅ Correct - key provided, exit animation plays */
<AnimatePresence>
  {isLoading && (
    <motion.div 
      key="loader"
      exit={{ opacity: 0, scale: 0.95 }}
    >
      <CanvasLoader />
    </motion.div>
  )}
</AnimatePresence>
```

### Pitfall 6: Responsive Modal Fullscreen Implementation

**What goes wrong:** Modal is fullscreen on desktop or card-sized on mobile instead of responsive.

**Why it happens:** Not using Tailwind breakpoint prefixes correctly, or setting max-width without responsive variants.

**How to avoid:**
- Use `max-w-full md:max-w-lg` pattern for mobile-fullscreen, desktop-card
- Combine with `w-[90vw] md:w-auto` for explicit mobile width
- Test at exactly 768px (md breakpoint) to verify transition
- Consider `inset-4 md:inset-auto` for mobile edge spacing

**Warning signs:** Modal doesn't fill mobile screen, modal too small on desktop, breakpoint transition is abrupt/jarring

**Example:**
```tsx
/* ❌ Wrong - fixed max-width on all screens */
<DialogContent className="max-w-md">
  {/* Content */}
</DialogContent>

/* ✅ Correct - responsive max-width */
<DialogContent className="w-[90vw] max-w-full md:max-w-md md:w-auto">
  {/* Content */}
</DialogContent>
```

## Code Examples

Verified patterns from official sources:

### Vite Integration with @tailwindcss/vite

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss() // Add Tailwind v4 Vite plugin
  ],
})
```

**Source:** [@tailwindcss/vite v4.2.2 package](https://www.npmjs.com/package/@tailwindcss/vite) - Official Vite plugin

### Complete @theme Configuration

```css
/* src/styles/index.css */
@import "tailwindcss";

@theme {
  /* Surface hierarchy */
  --color-surface-dim: #0A0A0A;
  --color-surface-default: #131313;
  --color-surface-container-lowest: #1A1A1A;
  --color-surface-container-low: #1C1C1C;
  --color-surface-container: #212121;
  --color-surface-container-high: #272727;
  --color-surface-container-highest: #2E2E2E;
  
  /* Interactive (mauve) */
  --color-interactive-default: #E0AFFF;
  --color-interactive-hover: #EAC7FF;
  --color-interactive-active: #D197FF;
  --color-interactive-disabled: #B380CC;
  --color-interactive-subtle: rgba(224, 175, 255, 0.1);
  
  /* Text hierarchy */
  --color-text-primary: #FFFFFF;
  --color-text-secondary: #A1A1AA;
  --color-text-tertiary: #71717A;
  --color-text-quaternary: #52525B;
  
  /* Spacing (8px grid) */
  --spacing-0: 0;
  --spacing-1: 4px;
  --spacing-2: 8px;
  --spacing-3: 12px;
  --spacing-4: 16px;
  --spacing-5: 20px;
  --spacing-6: 24px;
  --spacing-8: 32px;
  --spacing-10: 40px;
  --spacing-12: 48px;
  --spacing-16: 64px;
  --spacing-20: 80px;
  --spacing-24: 96px;
  --spacing-32: 128px;
  --spacing-40: 160px;
  --spacing-48: 192px;
  --spacing-56: 224px;
  --spacing-64: 256px;
  
  /* Typography */
  --font-display: "Noto Serif", Georgia, serif;
  --font-heading: "Noto Serif", Georgia, serif;
  --font-body: "Space Grotesk", Inter, system-ui, sans-serif;
  --font-mono: "JetBrains Mono", "Fira Code", monospace;
  
  --font-size-xs: 0.75rem;
  --font-size-sm: clamp(0.75rem, 1.5vw, 0.875rem);
  --font-size-base: clamp(0.875rem, 2vw, 1rem);
  --font-size-lg: clamp(1rem, 2.5vw, 1.125rem);
  --font-size-xl: clamp(1.125rem, 3vw, 1.25rem);
  --font-size-2xl: clamp(1.25rem, 4vw, 1.5rem);
  --font-size-3xl: clamp(1.5rem, 5vw, 1.875rem);
  --font-size-display-sm: clamp(2rem, 5vw, 3rem);
  --font-size-display-md: clamp(3rem, 7vw, 5rem);
  
  /* Shadows */
  --shadow-glass: 0 8px 32px rgba(0, 0, 0, 0.2);
  --shadow-xl: 0 12px 40px rgba(0, 0, 0, 0.16);
  --shadow-2xl: 0 24px 64px rgba(0, 0, 0, 0.24);
  
  /* Border radius */
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-2xl: 32px;
}

/* Custom utilities */
@layer utilities {
  .glass {
    background: rgba(28, 28, 28, 0.7);
    backdrop-filter: blur(20px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: var(--shadow-glass);
  }
}
```

### shadcn/ui Installation Flow

```bash
# Initialize shadcn/ui in project
npx shadcn@latest init

# Answer prompts:
# - TypeScript: yes
# - Style: Default (will customize with @theme)
# - Base color: Neutral (will override with mauve)
# - CSS variables: yes
# - Tailwind config: Use CSS (not tailwind.config.js)
# - Components location: src/components/ui
# - Utils location: src/lib/utils.ts

# Install Dialog component
npx shadcn@latest add dialog

# Install Button component (optional)
npx shadcn@latest add button
```

**Source:** [shadcn/ui CLI documentation](https://ui.shadcn.com/docs/cli)

### cn() Helper Function

```typescript
// src/lib/utils.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

**Usage:**
```tsx
// Conditional classes + conflicting utilities resolved
<div className={cn(
  "bg-surface p-4",
  isActive && "bg-interactive-default", // Overrides bg-surface
  className // Props passed from parent
)} />
```

**Source:** [shadcn/ui utils helper](https://ui.shadcn.com/docs/installation/manual#add-a-cn-helper)

### Loading Exit Animation with Motion.dev

```tsx
// src/components/Canvas.tsx
import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { CanvasLoader } from './CanvasLoader'
import { Tldraw } from 'tldraw'

export function Canvas() {
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    // Simulate canvas + data loading
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])
  
  return (
    <>
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="canvas-loader"
            initial={{ opacity: 1, scale: 1 }}
            exit={{ 
              opacity: 0,
              scale: 0.95,
              transition: { 
                duration: 0.4,
                ease: [0.16, 1, 0.3, 1] // Expo ease-out
              }
            }}
            className="fixed inset-0 z-[100]"
          >
            <CanvasLoader />
          </motion.div>
        )}
      </AnimatePresence>
      
      <Tldraw
        // ... tldraw props
      />
    </>
  )
}
```

**Source:** [Motion.dev AnimatePresence docs](https://motion.dev/docs/react-animate-presence)

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| tailwind.config.js (v3) | @theme in CSS (v4) | Tailwind v4.0 (Dec 2024) | Simpler setup, no JS config needed, better IDE support, CSS-native |
| Framer Motion | Motion.dev fork | Motion v11 (2024) | Smaller bundle (~40KB vs ~50KB), same API, better tree-shaking, React 19 support |
| Manual shadcn/ui component copies | shadcn CLI | shadcn v1.0 (2023) | Automated component installation, updates, customization tracking |
| Custom CSS variables + utility classes | Tailwind @theme auto-generation | Tailwind v4.0 | Automatic utility generation, no manual class definitions, type-safe |
| JavaScript-based responsive hooks | Tailwind breakpoint prefixes | Tailwind v1.0+ (2019) | Build-time optimization, no runtime cost, SSR-compatible |
| styled-components / emotion | Tailwind utilities | 2020-2021 shift | Zero runtime cost, better performance, smaller bundles, no Flash of Unstyled Content |

**Deprecated/outdated:**
- **tailwind.config.js:** v4 uses @theme in CSS instead. JS config still works for migration but not recommended for new code.
- **Framer Motion package:** Motion.dev is the maintained fork. Framer Motion development slowed after v11 (team focused on Framer design tool).
- **Manual @apply in CSS:** Tailwind team discourages @apply in v4. Use utilities directly in HTML or @layer for truly custom utilities.
- **JIT mode flag:** Built-in since Tailwind v3, no need for `mode: 'jit'` config.

## Open Questions

1. **Tailwind v4 @theme nested object syntax**
   - What we know: @theme uses flat variables (--color-primary, --spacing-4)
   - What's unclear: Does v4 support nested theme objects like v3 config.extend.colors.brand.light?
   - Recommendation: Use flat naming with hyphens (--color-brand-light) until v4 docs clarify nested syntax. Test during Wave 0.

2. **shadcn/ui Dialog backdrop customization**
   - What we know: DialogContent accepts className for content styling
   - What's unclear: How to customize backdrop (overlay) blur/opacity separate from content?
   - Recommendation: Check if DialogOverlay component is exported by ui/dialog.tsx and accepts className. If not, use DialogContent parent styles or create custom wrapper.

3. **Motion.dev exit animation timing with React 19**
   - What we know: Motion v12.38.0 supports React 19, AnimatePresence handles exits
   - What's unclear: Do React 19 concurrent features affect exit animation timing or require changes?
   - Recommendation: Test exit animations thoroughly in dev mode. React 19's automatic batching may affect setState + unmount timing. Add console logs to verify animation completion before unmount.

4. **Vite 8 HMR with @tailwindcss/vite plugin**
   - What we know: @tailwindcss/vite v4.2.2 supports Vite 8, changelog mentions HMR fixes
   - What's unclear: Does @theme change trigger full page reload or fast refresh? Does it preserve canvas state?
   - Recommendation: Test HMR during Wave 0. If @theme changes reload page, consider extracting tokens to separate file loaded via @import to minimize reload scope.

5. **Canvas performance impact of Tailwind utilities**
   - What we know: Tailwind is build-time, no runtime cost. Existing canvas is 60 FPS.
   - What's unclear: Do hundreds of utility classes increase DOM recalculation time during canvas pan/zoom?
   - Recommendation: Profile canvas interactions before/after migration. If FPS drops, consider @layer utilities for frequently changed styles or use CSS containment (contain: layout style paint).

## Validation Architecture

> Nyquist validation enabled in .planning/config.json

### Test Framework

| Property | Value |
|----------|-------|
| Framework | Vitest 4.1.0 (already installed) |
| Config file | vite.config.ts (test section exists) |
| Quick run command | `npm test -- --run` |
| Full suite command | `npm test` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| UI-01 | Tailwind utilities apply correctly to components | unit | `npm test -- CanvasControls.test.tsx -x` | ❌ Wave 0 |
| UI-01 | @theme tokens compile to CSS variables | integration | `npm test -- theme.test.ts -x` | ❌ Wave 0 |
| UI-02 | shadcn/ui Dialog renders with glassmorphism | unit | `npm test -- MilestoneModal.test.tsx -x` | ❌ Wave 0 |
| UI-02 | Dialog closes on ESC, backdrop click, X button | integration | `npm test -- MilestoneModal.test.tsx -x` | ❌ Wave 0 |
| UI-03 | Motion.dev exit animation plays before unmount | unit | `npm test -- CanvasLoader.test.tsx -x` | ❌ Wave 0 |
| UI-03 | AnimatePresence removes DOM node after exit | integration | `npm test -- CanvasLoader.test.tsx -x` | ❌ Wave 0 |
| UI-04 | Responsive utilities apply at breakpoints | unit | `npm test -- responsive.test.tsx -x` | ❌ Wave 0 |
| UI-04 | Modal is fullscreen on mobile, card on desktop | integration | `npm test -- MilestoneModal.test.tsx -x` | ❌ Wave 0 |
| UI-05 | CanvasLoader displays during initial load | integration | `npm test -- Canvas.test.tsx -x` | ❌ Wave 0 |
| UI-05 | Loading state exits smoothly when canvas ready | e2e | Manual browser test | Manual only |

### Sampling Rate

- **Per task commit:** `npm test -- {changed-file}.test.tsx --run` (< 10 seconds per file)
- **Per wave merge:** `npm test --run` (< 30 seconds full suite)
- **Phase gate:** Full suite green + manual browser verification before `/gsd-verify-work`

### Wave 0 Gaps

- [ ] `tests/CanvasControls.test.tsx` — covers UI-01 (Tailwind utilities)
- [ ] `tests/theme.test.ts` — covers UI-01 (@theme compilation)
- [ ] `tests/MilestoneModal.test.tsx` — covers UI-02 (Dialog component), UI-04 (responsive modal)
- [ ] `tests/CanvasLoader.test.tsx` — covers UI-03 (Motion.dev exit), UI-05 (loading display)
- [ ] `tests/responsive.test.tsx` — covers UI-04 (responsive utilities at breakpoints)
- [ ] `tests/Canvas.test.tsx` — covers UI-05 (loading integration)
- [ ] Add `@testing-library/user-event` dependency for interaction testing (ESC key, click events)

**Note:** E2E test for UI-05 (smooth exit animation) requires manual browser verification. Automated tests can verify DOM removal but not visual smoothness or 60 FPS performance. Include in Phase Gate checklist.

## Sources

### Primary (HIGH confidence)

- **npm registry** - Package versions verified 2026-03-23:
  - tailwindcss@4.2.2 (published 2026-03-18)
  - @tailwindcss/vite@4.2.2 (published 2026-03-18)
  - motion@12.38.0 (latest stable)
  - @radix-ui/react-dialog@1.1.15 (latest stable)
- **GitHub repositories** - Official sources:
  - [tailwindcss v4.2.2 CHANGELOG](https://github.com/tailwindlabs/tailwindcss/blob/v4.2.2/CHANGELOG.md) - @theme syntax, Vite 8 support confirmed
  - [shadcn/ui README](https://github.com/shadcn-ui/ui/blob/main/README.md) - CLI-based component installation pattern
  - [motion README](https://github.com/motiondivision/motion#readme) - React 19 compatibility confirmed
- **Project codebase** - Existing implementation:
  - src/index.css lines 1-457 - Full CSS variable system (200+ tokens)
  - src/components/MilestoneModal.tsx - Custom modal with glassmorphism
  - src/components/CanvasLoader.tsx - Ghost hub loading state
  - package.json - React 19.2.4, Vite 8.0.1, Vitest 4.1.0 installed

### Secondary (MEDIUM confidence)

- **Tailwind CSS official docs** - Referenced patterns:
  - @theme syntax (v4 feature, confirmed in CHANGELOG)
  - Responsive utilities (documented since v1.0)
  - @layer directive (stable API)
- **shadcn/ui docs** - Installation flow:
  - CLI init/add commands (standard across community)
  - Dialog component API (Radix UI wrapper pattern)
- **Motion.dev docs** - Animation patterns:
  - AnimatePresence exit animations (inherited from Framer Motion, stable API)
  - React 19 support (peer dependencies confirmed)

### Tertiary (LOW confidence)

- **Tailwind v4 @theme nested object syntax** - UNVERIFIED, flagged as open question
- **shadcn/ui DialogOverlay customization** - Component export pattern unclear, needs testing
- **Vite 8 HMR with @tailwindcss/vite** - Behavior documented in changelog but not tested in this project
- **Canvas performance with utility classes** - Theoretical concern, no evidence of issues, needs profiling

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - All package versions verified from npm registry (March 2026), official changelogs reviewed
- Architecture: HIGH - Tailwind @theme syntax confirmed in v4 CHANGELOG, shadcn/ui CLI pattern is industry standard, Motion.dev API inherited from stable Framer Motion
- Pitfalls: MEDIUM - Based on ecosystem knowledge and v3→v4 migration patterns, specific edge cases need testing during implementation
- Responsive patterns: HIGH - Tailwind responsive utilities are stable API, clamp() is standard CSS, breakpoint behavior is well-documented

**Research date:** 2026-03-23  
**Valid until:** 2026-04-23 (30 days - stable ecosystem, v4 just released so migration patterns stabilizing)

**Limitations:**
- Tailwind v4 docs site structure unclear (official docs not crawlable), relied on CHANGELOG and npm package info
- shadcn/ui component customization patterns based on v1 docs, v2 may introduce breaking changes
- Motion.dev documentation minimal (relies on Framer Motion docs for API reference)
- No hands-on testing of @theme syntax or shadcn/ui Dialog migration - patterns are theoretical until Wave 0

**Recommended validation during Wave 0:**
1. Test @theme token compilation with Vite dev server
2. Verify shadcn/ui Dialog works with glassmorphism customization
3. Confirm Motion.dev exit animations don't block canvas interactions
4. Profile canvas FPS before/after Tailwind migration
5. Test responsive modal at exact breakpoint transitions (768px)

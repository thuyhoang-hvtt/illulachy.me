# Phase 5: UI Chrome - Context

**Gathered:** 2026-03-23  
**Status:** Ready for research and planning

<domain>
## Phase Boundary

Site is visually polished with loading states and responsive layout using modern UI tooling. The phase adds professional UI infrastructure (Tailwind v4, shadcn/ui, Motion.dev) while maintaining the existing glassmorphism aesthetic and smooth 60 FPS canvas performance.

**What this phase delivers:** Tailwind CSS v4 integration with @theme configuration, shadcn/ui component system, Motion.dev animations, responsive layout that adapts across mobile/tablet/desktop, and polished loading/transition states.

**What this phase does NOT include:**
- Header or navigation UI (canvas remains fullscreen)
- Additional chrome elements beyond existing controls and modal
- Performance optimization for 200+ nodes (defer to later if needed)
- Dark mode toggle (design system is dark-first)
- Accessibility controls (reduce motion, font size adjustments)
- Help/tutorial overlays
- "About this site" info pages

</domain>

<decisions>
## Implementation Decisions

### Design System Migration Strategy

**Tailwind v4 integration approach:**
- **Convert to @theme syntax** - Migrate existing CSS variables to Tailwind v4's native @theme format
- **Replace custom utilities** - Remove all handwritten utility classes (.flex, .rounded-lg, .animate-pulse) and use Tailwind equivalents
- **CSS-first configuration** - Use Tailwind v4's CSS-based config (not JavaScript tailwind.config.js)
- **Preserve design tokens** - Maintain the existing color palette, spacing scale, typography system, motion values

**Migration scope:**
- **Full conversion** - All 200+ lines of CSS variables become @theme definitions
- **Token preservation** - Colors (mauve accent, surface hierarchy), spacing (8px grid), typography (Noto Serif, Space Grotesk), motion (easing, duration)
- **Utility replacement** - CanvasLoader, MilestoneModal, and all components switch to Tailwind classes

**shadcn/ui integration:**
- **Install selectively** - Add components only as needed (Dialog for modal, Button if needed, Spinner if needed)
- **Don't import full library** - Install individual components into src/components/ui/
- **Customize with existing design** - Configure shadcn/ui to use the mauve accent and glassmorphism aesthetic
- **Follow shadcn/ui conventions** - Use their component structure and patterns

### Loading Experience Design

**Initial canvas loading:**
- **Keep ghost hub pulse** - Existing CanvasLoader approach is on-brand and minimal
- **No loading text** - Pure visual state, no "Loading..." messages
- **Smooth exit transition** - Fade out with slight scale/zoom effect (300-500ms) when canvas is ready
- **Motion.dev powered** - Use Motion.dev's exit animations for smooth transition

**Progressive UI loading:**
- **Skeleton states** - Individual UI elements (controls, modal) have their own skeleton/loading states
- **Not progressive reveal** - Don't show canvas shell → fade in controls separately
- **Component-level skeletons** - Each component handles its own loading state internally

**Transition choreography:**
- **Loading → Canvas** - Ghost hub fades out with scale effect as canvas fades in
- **Duration:** 300-500ms total transition
- **Easing:** Smooth cubic-bezier (ease-out or expo)
- **No overlap:** Loading state fully exits before canvas is interactive

### Chrome UI Elements

**No new chrome:**
- **Canvas remains fullscreen** - No header, navigation, or footer UI
- **No additional controls** - No help button, about button, settings drawer
- **Minimal approach** - UI is just: Canvas + Controls + Modal

**Existing UI refinement:**

**CanvasControls (pan/zoom buttons):**
- **Keep current design** - Bottom-right floating glassmorphism works well
- **No changes to position or behavior** - Controls stay as-is
- **Migrate to Tailwind** - Rewrite styles using Tailwind utilities
- **Maintain accessibility** - Touch target sizes (40px minimum), hover states, focus rings

**MilestoneModal:**
- **Migrate to shadcn/ui Dialog** - Replace custom modal with shadcn/ui Dialog component
- **Preserve glassmorphism** - Customize Dialog to match existing aesthetic (backdrop blur, glass surfaces)
- **Keep current content** - Date, title, body content layout remains the same
- **Improve animations** - Use Motion.dev for enter/exit transitions

**CanvasFogOverlay:**
- **Keep as-is** - Radial gradient boundary fog doesn't need changes
- **Migrate styles to Tailwind** - If possible, otherwise keep inline styles

**CanvasLoader:**
- **Keep ghost hub design** - Pulsing 16:9 shape is effective
- **Add exit animation** - Motion.dev fade + scale out when canvas ready
- **Migrate to Tailwind** - Rewrite utility classes to Tailwind

### Responsive Behavior

**Overall strategy:**
- **Desktop-first approach** - Base styles target desktop, scale down for mobile with media queries
- **Breakpoints:** Use Tailwind's default breakpoints (sm: 640px, md: 768px, lg: 1024px, xl: 1280px)
- **No intrinsic/fluid approach** - Use explicit breakpoint-based responsive classes

**Canvas controls responsive:**
- **No changes needed** - Current 40px controls work on mobile and desktop
- **Touch targets met** - 40px exceeds 44px minimum for mobile touch
- **Position stays fixed** - Bottom-right on all screen sizes
- **Controls always visible** - No hiding or bottom sheet behavior

**Modal responsive:**
- **Fullscreen on mobile** - Modal takes full viewport on screens < 768px (below md breakpoint)
- **Centered card on desktop** - Modal is centered overlay card on screens >= 768px
- **Breakpoint:** md (768px) is the transition point
- **Implement with Tailwind** - Use md:max-w-lg and conditional full-width classes

**Typography responsive:**
- **Add clamp() scaling** - Body text, headings, and other tokens scale fluidly between mobile and desktop
- **Current display text already uses clamp()** - Extend this pattern to all text sizes
- **Formula:** clamp([mobile-size], [viewport-based], [desktop-size])
- **Example:** --text-base: clamp(0.875rem, 2vw, 1rem) for 14px mobile → 16px desktop

**Spacing responsive:**
- **No responsive spacing adjustments** - 8px grid system is consistent across breakpoints
- **Component-level spacing** - Individual components may adjust padding/margins at breakpoints
- **No global spacing scale changes** - --spacing-4 stays 16px everywhere

### Claude's Discretion

The following areas are open to technical decisions during research and planning:

- **Tailwind v4 installation method** - npm package version, PostCSS config, Vite plugin setup
- **@theme conversion approach** - How to structure color palette, spacing, typography in @theme blocks
- **shadcn/ui initialization** - CLI setup, component installation commands, customization approach
- **Motion.dev integration** - Package choice (motion, framer-motion), animation API patterns
- **Component refactoring order** - Which components to migrate first (loader → modal → controls)
- **Tailwind class patterns** - Specific utility combinations for glassmorphism, focus rings, hover states
- **Responsive breakpoint usage** - When to use sm/md/lg/xl classes for specific components
- **Animation timing curves** - Exact easing functions for loading exit, modal enter/exit
- **Skeleton component design** - Structure and styling for control/modal skeleton states
- **Migration testing strategy** - Visual regression tests, component-level tests, E2E validation

</decisions>

<specifics>
## Specific Ideas

**Visual continuity:**
- Tailwind migration must preserve the existing aesthetic exactly
- Mauve accent (#E0AFFF), glassmorphism, dark surfaces, editorial typography
- Users should not notice any visual changes - this is infrastructure, not redesign

**Motion polish:**
- Loading exit animation creates "breathing" moment before canvas is interactive
- Slight scale + fade feels premium and signals completion
- Motion.dev provides better animation control than CSS keyframes

**Responsive philosophy:**
- Desktop experience is primary (portfolio site optimized for large screens)
- Mobile is functional but not the hero experience
- Touch gestures from Phase 1 ensure mobile canvas works well

**shadcn/ui benefits:**
- Accessible components out of the box (focus management, ARIA, keyboard nav)
- Dialog component handles portal rendering, focus trap, ESC handling
- Maintains design system consistency through Tailwind config

**From prior phases:**
- Phase 1 established 60 FPS performance (must not degrade)
- Phase 3 created MilestoneModal with custom glassmorphism (now migrating to shadcn/ui)
- Phase 4 doesn't depend on this phase (can plan/execute in parallel if needed)

</specifics>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase Requirements
- `.planning/ROADMAP.md` §Phase 5 — Success criteria (UI-01 through UI-05)
- `.planning/REQUIREMENTS.md` §UI & Polish — Detailed requirement definitions

### Existing Code
- `src/index.css` lines 1-457 — Full CSS token system (200+ variables to convert)
- `src/components/CanvasLoader.tsx` — Loading state component (migrate to Tailwind + Motion.dev)
- `src/components/MilestoneModal.tsx` — Modal component (migrate to shadcn/ui Dialog)
- `src/components/CanvasControls.tsx` — Control buttons (migrate to Tailwind)
- `src/components/CanvasFogOverlay.tsx` — Radial gradient overlay (migrate if possible)
- `src/App.tsx` — Root component (minimal changes expected)

### Design System
- `src/index.css` §Design Tokens — Color palette, spacing scale, typography, motion
- `.planning/phases/01-canvas-foundation/01-CONTEXT.md` — Glassmorphism aesthetic established
- `.planning/STATE.md` §Accumulated Context — Prior design decisions

### Prior Phase Context
- `.planning/phases/01-canvas-foundation/01-CONTEXT.md` — Canvas performance (60 FPS requirement)
- `.planning/phases/03-custom-shapes-hub/03-CONTEXT.md` — Glassmorphism styling patterns

### External Documentation
- Tailwind CSS v4 docs — @theme syntax, CSS-first configuration
- shadcn/ui docs — Installation, component customization, theming
- Motion.dev docs — React animation API, exit animations, transition orchestration

</canonical_refs>

<code_context>
## Existing Code Insights

### Current Styling Approach
- **CSS variables only** - No Tailwind, no component library, pure CSS custom properties
- **Extensive token system** - 200+ variables covering colors, spacing, typography, motion, shadows
- **Utility classes** - Minimal handwritten utilities (.flex, .rounded-lg, .animate-pulse)
- **Inline styles** - Components use style prop with CSS variables (e.g., `style={{ background: 'var(--glass-bg)' }}`)

### Design Token Inventory

**Colors:**
- Surface hierarchy: 7 tonal layers (--surface-dim to --surface-container-highest)
- Interactive: Mauve palette (--interactive-default: #E0AFFF, hover, active, disabled)
- Text hierarchy: 5 levels (primary, secondary, tertiary, quaternary, inverse)
- Semantic colors: Success, warning, error, info with background variants
- Borders: Ghost borders (0.06-0.2 opacity)
- Glassmorphism: --glass-bg, --glass-border, --glass-blur, --glass-shadow

**Typography:**
- Font families: Noto Serif (headings), Space Grotesk (body), JetBrains Mono (code)
- Font sizes: 15 scales (--text-xs to --display-xl with clamp)
- Font weights: 6 weights (light, regular, medium, semibold, bold, black)
- Line heights: 6 options (none, tight, snug, normal, relaxed, loose)
- Letter spacing: 6 tracking values (tighter to widest)

**Spacing:**
- 8px grid system: --spacing-0 to --spacing-64 (0 to 256px in powers of 2)
- Semantic spacing: --space-breath, --space-section, --space-editorial, --space-hero
- Component spacing: --space-inline, --space-stack, --space-card-padding

**Motion:**
- Easing: 6 curves (linear, in, out, in-out, spring, expo)
- Duration: 7 speeds (instant, fast, normal, moderate, slow, slower, slowest)
- Component motion: Hover, focus, canvas pan/zoom, modal enter/exit

**Other tokens:**
- Shadows: 7 elevation levels (xs, sm, md, lg, xl, 2xl, tinted)
- Border radius: 9 scales (none, sm, default, md, lg, xl, 2xl, 3xl, full)
- Z-index: 9 layer scale (base, timeline, dropdown, sticky, fixed, overlay, modal, toast, tooltip)
- Breakpoints: 7 viewport widths (xs to 3xl)

### Reusable Patterns

**Glassmorphism style:**
```css
background: var(--glass-bg);
backdrop-filter: blur(var(--glass-blur));
border: 1px solid var(--glass-border);
box-shadow: var(--glass-shadow);
```
Used in: CanvasControls, MilestoneModal, custom shapes

**Pulse animation:**
```css
@keyframes pulse {
  0%, 100% { opacity: 0.4; }
  50% { opacity: 0.6; }
}
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}
```
Used in: CanvasLoader ghost hub

**Modal animations:**
```css
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
```
Used in: MilestoneModal backdrop + content

### Integration Points

**CanvasLoader → Canvas transition:**
- `Canvas.tsx` shows CanvasLoader while `isLoading` is true
- When canvas + data ready, `isLoading` becomes false
- Need to add exit animation before loader unmounts
- Motion.dev AnimatePresence can handle exit animations

**MilestoneModal usage:**
- Custom shape click dispatches CustomEvent
- Canvas listens and sets modal state
- Modal uses createPortal to render outside React tree
- shadcn/ui Dialog will handle this more elegantly

**Component dependency tree:**
```
App.tsx
└── Canvas.tsx
    ├── CanvasLoader (conditional)
    ├── CanvasFogOverlay
    ├── CanvasControls
    ├── TimelineOverlay
    └── MilestoneModal (conditional via portal)
```

### Established Patterns

**CSS variable usage:**
- All components use `style={{ property: 'var(--token-name)' }}` pattern
- No hardcoded colors/spacing - always reference tokens
- Tailwind migration must preserve this token-driven approach

**Responsive utilities:**
- No responsive classes yet - everything is fixed or fluid (viewport units, %)
- Desktop-first migration means adding md:, lg: prefixes to scale down

**Component structure:**
- Functional components with TypeScript
- Hooks for side effects (useEffect, useCallback, useMemo)
- No CSS modules or styled-components - inline styles only

### Constraints

**Performance budget:**
- 60 FPS canvas from Phase 1 must not regress
- Tailwind bundle size should not significantly increase page load
- Motion.dev animations should not block canvas interactions

**Visual continuity:**
- Every component must look identical after migration
- Glassmorphism aesthetic is non-negotiable
- Mauve accent, dark surfaces, editorial typography must be preserved

**No breaking changes:**
- Canvas functionality (pan, zoom, touch) must work exactly as before
- Modal behavior (open, close, keyboard, backdrop) stays the same
- Controls (click handlers, hover states) remain functional

**tldraw compatibility:**
- tldraw uses z-index 200-300 range - modals must be above (z-500)
- Canvas must remain fullscreen - no layout shifts
- No CSS that interferes with tldraw's internal styling

</code_context>

<deferred>
## Deferred Ideas

None — discussion stayed within phase scope.

User focused on tooling integration and responsive behavior without suggesting new features or capabilities for future phases.

</deferred>

---

*Phase: 05-ui-chrome*  
*Context gathered: 2026-03-23*

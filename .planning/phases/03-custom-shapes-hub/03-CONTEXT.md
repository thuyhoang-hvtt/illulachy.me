# Phase 3 Context: Custom Shapes & Hub

**Phase Goal:** Portfolio hub and timeline nodes render as custom tldraw shapes with click handlers  
**Depends on:** Phase 2 (needs content data to render)  
**Context Gathered:** 2026-03-23

---

## Implementation Decisions

### 1. Visual Representation

**Node Formats by Type:**
- **YouTube & Project (visual types):** Thumbnail-based representation
  - Display actual thumbnail images when available
  - Fallback to styled placeholder if no thumbnail
  - Image fills node area with title overlay
- **Blog & Milestone (text types):** Card-based representation
  - Styled card with prominent title
  - Metadata display (date, institution/tech)
  - Text-focused layout with iconography

**Node Sizing Strategy:**
- **Timeline nodes:** Uniform size of **280x200px** (all types)
  - Rationale: Consistent sizing simplifies Phase 4 collision detection
  - Maintains visual rhythm across timeline
  - Small enough to show many nodes, large enough to be readable
- **Portfolio hub:** **640x360px** (16:9 aspect ratio)
  - Significantly larger than timeline nodes (visual hierarchy)
  - Phase 1 established this size for initial zoom calculation
  - Central focal point of the canvas

**Type Differentiation:**
- **Visual metaphors** for quick recognition:
  - **YouTube:** Video player frame aesthetic (play button icon, video scrubber bar)
  - **Blog:** Document/article icon (lines of text, page corner fold)
  - **Project:** Code/terminal window aesthetic (code brackets, window chrome)
  - **Milestone:** Achievement badge or trophy icon (star, ribbon, certificate)
- **Not using:** Color coding or simple badges
- **Rationale:** Metaphors are more intuitive and memorable than abstract colors

**Visual Style:**
- **Design system:** Use `.stitch/` tokens (glassmorphism, tonal layers, mauve accents)
  - **Note:** .stitch/ directory doesn't exist yet - create during Phase 3 or extract from Phase 1 controls
  - Glassmorphism: rgba backgrounds with backdrop-blur
  - Mauve accent: `#E0AFFF` (from Phase 1 canvas controls)
  - Tonal layering: Multiple surface levels for depth
- **Consistency:** Match canvas controls aesthetic from Phase 1
- **Properties:**
  - Semi-transparent backgrounds (glassmorphism effect)
  - Subtle shadows for depth
  - Mauve accents for interactive elements
  - Smooth rounded corners
  - High contrast text for readability

**Thumbnail Handling:**
- YouTube thumbnails: Use `thumbnail` field from timeline.json
- Project thumbnails: Use `thumbnail` field if provided, else placeholder
- Fallback strategy: Generate colored gradient placeholder with type icon
- Image loading: Show skeleton/placeholder while loading, fade in when ready

---

### 2. Interaction Patterns

**Click Behavior (YouTube/Blog/Project):**
- **Single click opens URL in new tab** (`window.open(url, '_blank')`)
- **No confirmation/preview step** - immediate navigation
- **Rationale:** Direct interaction feels responsive, matches user expectations
- **Note:** Phase 1 canvas pan uses drag gesture, so accidental clicks are unlikely

**Milestone Details Display:**
- **Modal overlay** when clicking milestone nodes
  - Modal appears centered on screen (not canvas space - screen space)
  - Glassmorphism styling consistent with node design
  - Content: title, date, institution, description
  - Close button (X) in top-right corner
  - Click outside modal to dismiss (backdrop click)
  - ESC key also dismisses modal
- **Rationale:** Modal keeps focus on current content without navigation
- **Implementation:** React portal for modal (renders outside canvas DOM tree)

**Hover States:**
- **Glassmorphism glow** with mauve accent
  - Mauve border intensifies (#E0AFFF at higher opacity)
  - Subtle scale transform (1.02x) for lift effect
  - Shadow increases (larger blur radius)
  - Cursor changes to pointer
  - Smooth transition (200-300ms ease-out)
- **Applied to:** All timeline nodes and hub (even though hub isn't clickable, hover indicates interactivity)
- **Performance:** Use CSS transforms for hardware acceleration

**Shape Dragging:**
- **Prevent default tldraw drag** - shapes are static/non-movable
  - Set `isLocked: true` or `canMove: false` in tldraw shape config
  - Users cannot reposition nodes
- **Rationale:** Phase 4 layout algorithm determines positions chronologically
- **User experience:** Shapes feel like fixed UI elements, not draggable objects

**Click Handlers:**
- Attach onClick to tldraw shape components
- Prevent event bubbling to canvas (don't trigger pan on click)
- Different handlers per type: URL open vs modal show

---

### 3. About Me Content

**Content Source:**
- **File:** `content/about.md` (markdown file in content directory)
- **Structure:** YAML-only frontmatter (no markdown body)
- **Rationale:** Keeps all content in markdown files for consistency

**Frontmatter Schema:**
```yaml
---
name: Your Name
title: Software Engineer & Creator
bio: Brief bio (1-2 sentences)
avatar: /images/avatar.jpg  # Optional profile image
email: you@example.com
social:
  github: username
  twitter: username
  linkedin: username
  youtube: channelname
---
```

**Fields:**
- **Required:** `name`, `title`, `bio`
- **Optional:** `avatar`, `email`, `social` (object with platform keys)
- **Validation:** Fail build if required fields missing (like timeline content)

**Processing Pipeline:**
- **Build-time:** Extend Phase 2 generator script to process about.md
  - Parse frontmatter with gray-matter
  - Validate required fields with zod
  - Output `public/about.json`
- **Runtime:** Fetch `/about.json` like `/timeline.json`
  - Load on app initialization (parallel with timeline fetch)
  - Show loading state while fetching
  - Error handling if fetch fails (show fallback "About Me" text)

**Hub Node Interactivity:**
- **Static - not clickable**
- Displays about me information (name, title, bio)
- Shows avatar if provided
- Social links displayed but not yet interactive (Phase 5 might add link handling)
- Rationale: Hub is informational anchor, not navigation point

**Hub Content Display:**
- **Layout within 640x360 node:**
  - Avatar: Top-left or centered (circular, ~80-100px)
  - Name: Large heading (Noto Serif display font)
  - Title: Subheading (Space Grotesk body font)
  - Bio: Body text (2-3 lines max, truncate with ellipsis if needed)
  - Social icons: Row at bottom (small icons, not clickable yet)
- **Styling:** Glassmorphism with premium editorial feel (Phase 1 design system)

---

### 4. Node Positioning

**Positioning Strategy (Phase 3 Temporary Layout):**
- **Purpose:** Place nodes visibly for testing interactions
- **Phase 4 will replace this** with proper chronological layout + collision detection

**Vertical Positioning (Y-axis) - Type-Based:**
- **Above timeline (positive Y):**
  - **YouTube:** y = +100, +200, +300, +400... (staggered upward)
  - **Blog:** y = +100, +200, +300, +400... (staggered upward, interleaved with YouTube)
  - **Pattern:** Both types share the above space, incrementing by 100px per node in timeline.json order
- **Below timeline (negative Y):**
  - **Milestone:** y = -100, -200, -300, -400... (staggered downward)
  - **Project:** y = -100, -200, -300, -400... (staggered downward, interleaved with Milestones)
  - **Pattern:** Both types share the below space, incrementing by -100px per node in timeline.json order
- **Hub:** y = 0 (centered on horizontal timeline axis)

**Example with mixed timeline.json:**
```
Order in timeline.json: [Milestone1, YouTube1, Blog1, Project1, YouTube2, Blog2, Milestone2]

Counters: above_counter = 0, below_counter = 0

Positions:
- Milestone1: below_counter++; x=-400,  y=-100 (first below, below_counter=1)
- YouTube1:   above_counter++; x=-800,  y=+100 (first above, above_counter=1)
- Blog1:      above_counter++; x=-1200, y=+200 (second above, above_counter=2)
- Project1:   below_counter++; x=-1600, y=-200 (second below, below_counter=2)
- YouTube2:   above_counter++; x=-2000, y=+300 (third above, above_counter=3)
- Blog2:      above_counter++; x=-2400, y=+400 (fourth above, above_counter=4)
- Milestone2: below_counter++; x=-2800, y=-300 (third below, below_counter=3)
- Hub:        x=0, y=0 (center)
```

**Algorithm:**
```typescript
let aboveCounter = 0
let belowCounter = 0

nodes.forEach((node, index) => {
  const x = -400 * (index + 1)  // All nodes go left
  
  let y
  if (node.type === 'youtube' || node.type === 'blog') {
    aboveCounter++
    y = 100 * aboveCounter  // Positive Y (above)
  } else if (node.type === 'milestone' || node.type === 'project') {
    belowCounter++
    y = -100 * belowCounter  // Negative Y (below)
  }
  
  return { x, y }
})
```

**Horizontal Positioning (X-axis):**
- **Direction:** Left from hub (negative X values)
- **Spacing:** Fixed **400px between nodes**
  - First node: x = -400
  - Second node: x = -800
  - Third node: x = -1200
  - etc.
- **Hub:** x = 0 (center of canvas)
- **Rationale:** Simple, predictable spacing; easy to scan timeline

**Sorting:**
- **No additional sorting** - use timeline.json order as-is
- **Rationale:** Phase 2 already sorts chronologically (oldest to newest)
- **Order preserved:** Nodes appear left-to-right in same order as timeline.json

**Collision Avoidance:**
- Type-based vertical separation (above/below) prevents overlap
- 400px horizontal spacing is wider than 280px node width (120px gap)
- 100px vertical stagger ensures nodes don't touch vertically
- Phase 4 will refine this with collision detection algorithm

---

## Code Context

### Existing Assets (Reusable from Phase 1 & 2)

**TypeScript Types (Ready to Use):**
- **Location:** `src/types/content.ts`
- **Interfaces:**
  ```typescript
  export type ContentType = string  // Free-form for extensibility
  export interface ContentNode {
    id: string
    type: ContentType
    title: string
    date: string  // ISO 8601
    url?: string
    thumbnail?: string
    description?: string
    institution?: string  // Milestone-specific
    tech?: string         // Project-specific
  }
  export interface TimelineData {
    nodes: ContentNode[]
    lastUpdated: string
  }
  ```
- **Usage:** Import for shape props and rendering logic

**Canvas Foundation (Phase 1):**
- **Canvas component:** `src/components/Canvas.tsx`
  - tldraw editor instance ready
  - Accepts `timeline?: TimelineData` prop (currently unused)
  - Phase 3 will populate this prop and render shapes
- **Design tokens:** Glassmorphism variables used in `CanvasControls.tsx`
  - Extract and formalize into .stitch/ design system
  - Reuse for node styling consistency

**Content Pipeline (Phase 2):**
- **Timeline data:** `public/timeline.json` (11 published entries)
- **Sample content:** `content/YYYY/*.md` files with all 4 types
- **Generator script:** `scripts/generate-timeline.ts`
  - Extend to process `content/about.md` → `public/about.json`
- **Types:** `ContentNode`, `TimelineData` (ready for rendering)

**Canvas Controls Styling Example:**
```tsx
// From src/components/CanvasControls.tsx (Phase 1)
// Glassmorphism style reference:
style={{
  background: 'rgba(28, 28, 28, 0.7)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255, 255, 255, 0.1)',
  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
  borderRadius: '12px'
}}

// Hover state (mauve accent):
'&:hover': {
  borderColor: '#E0AFFF',  // Mauve accent
  boxShadow: '0 8px 32px rgba(224, 175, 255, 0.3)'
}
```

### Integration Points

**Phase 3 Scope Boundaries:**
- ✅ Custom tldraw shape definitions (TimelineNodeShape, HubShape)
- ✅ Shape rendering components (YouTube, Blog, Project, Milestone, Hub)
- ✅ Click handlers (URL open, modal show)
- ✅ Hover states (glassmorphism glow)
- ✅ Temporary positioning logic (type-based vertical, fixed horizontal)
- ✅ Modal component for milestone details
- ✅ Extend generator to process about.md → about.json
- ✅ Fetch and render timeline + about data in Canvas component
- ❌ Chronological layout algorithm (Phase 4: Timeline Layout)
- ❌ Collision detection (Phase 4)
- ❌ Responsive mobile optimizations (Phase 5: UI Chrome)
- ❌ Keyboard navigation between nodes (Phase 6: Game Mode)

**Downstream Phase Dependencies:**
- **Phase 4** will replace temporary positioning with chronological layout
- **Phase 5** might add animations, loading states, responsive adjustments
- **Phase 6** will add arrow key navigation between nodes (needs node registry)

**Canvas Component Updates:**
- Fetch `/timeline.json` and `/about.json` on mount
- Pass data to shape rendering logic
- Create tldraw shapes for each ContentNode + hub
- Apply temporary positioning algorithm
- Attach click/hover handlers to shapes

**Generator Script Updates:**
- Add `processAboutFile()` function (similar to content processing)
- Validate about.md frontmatter with zod
- Output `public/about.json` alongside timeline.json
- Vite plugin watches `content/about.md` for changes (regenerate on edit)

---

## Requirements Coverage

Phase 3 delivers these requirements from REQUIREMENTS.md:

- **HUB-01**: Central portfolio node (16:9) displays in center of canvas ✓
- **HUB-02**: Portfolio node shows "about me" content ✓
- **HUB-03**: Portfolio node visually distinct from timeline nodes ✓ (640x360 vs 280x200, different content)
- **INT-01**: User can click YouTube node → opens video in YouTube ✓
- **INT-02**: User can click blog node → opens letters.illulachy.me ✓
- **INT-03**: User can click project node → opens external project URL ✓
- **INT-04**: User can click milestone node → details display (modal) ✓
- **INT-05**: Nodes have hover states (glow, cursor pointer) ✓

**Success Criteria (from ROADMAP.md):**
1. ✓ Central portfolio node (16:9) displays in center showing "about me" content
2. ✓ Portfolio hub is visually distinct from timeline nodes (size + content)
3. ✓ Click YouTube node → opens video in YouTube (new tab)
4. ✓ Click blog/note node → opens letters.illulachy.me (new tab)
5. ✓ Click project node → opens external project URL (new tab)
6. ✓ Click milestone node → details display (modal overlay)
7. ✓ All nodes show hover states (mauve glow, cursor pointer)

---

## tldraw Custom Shape Strategy

**Shape Definition Approach:**
- Create custom shape types extending tldraw's `BaseBoxShapeUtil`
- Define shape data structure (content node data)
- Implement component() for rendering React component
- Implement indicator() for selection/hover indicators
- Override onPointerDown for click handling
- Set isAspectRatioLocked, canResize, canMove properties

**Shape Types to Create:**
1. **TimelineNodeShape** - Generic base for YouTube/Blog/Project/Milestone
   - Or separate shape types per content type? (Separate is cleaner)
2. **HubShape** - Portfolio hub node (distinct from timeline nodes)

**Rendering Strategy:**
- tldraw shapes render React components
- Pass ContentNode data as shape props
- Apply styling with design system tokens
- Handle click events in shape component
- Manage modal state in parent Canvas component

**Performance Considerations:**
- 11 shapes (11 content nodes) + 1 hub = 12 total shapes
- tldraw handles this scale easily (can handle hundreds)
- Use React.memo for shape components (prevent unnecessary re-renders)
- Lazy-load thumbnail images with placeholder skeletons

---

## Open Questions for Research Phase

**Technical Investigations Needed:**

1. **tldraw Custom Shapes API:**
   - How to create custom shape types in tldraw 4.5?
   - How to prevent default drag behavior (shapes static)?
   - How to attach click handlers without interfering with canvas pan?
   - How to render React components inside shapes?
   - How to style shapes with custom CSS?

2. **Modal Implementation:**
   - Best practice for modal over tldraw canvas?
   - Use React portal to render outside canvas DOM?
   - How to handle modal z-index above canvas?
   - Keyboard accessibility (ESC to close, focus management)?

3. **Design System Tokens:**
   - Extract glassmorphism variables from Phase 1 controls
   - Create .stitch/ directory structure (TOKENS.md, DESIGN.md)
   - Define token naming convention (--glass-bg, --glass-blur, etc.)
   - How to share tokens between Canvas controls and shapes?

4. **Thumbnail Loading:**
   - Image preloading strategy (all at once or lazy)?
   - Placeholder/skeleton during load?
   - Error handling for broken image URLs?
   - Fallback image generation (gradient + icon)?

5. **About.md Processing:**
   - Extend existing generator script or separate processor?
   - Zod schema for about.md frontmatter validation?
   - Should about.json be gitignored or committed? (timeline.json is committed per Phase 2)

**Research Should Produce:**
- tldraw custom shape examples (code snippets)
- Modal component implementation pattern
- Design token structure (TOKENS.md content)
- Image loading strategy with React hooks
- Generator script extension approach

---

## Deferred Decisions (Out of Scope for Phase 3)

- **Chronological layout algorithm:** Phase 4 replaces temporary positioning
- **Collision detection:** Phase 4 handles overlaps intelligently
- **Node animations:** Phase 5 (UI Chrome) might add entrance/hover animations
- **Responsive node sizing:** Phase 5 adjusts sizes for mobile if needed
- **Social link interactivity on hub:** Phase 5 might make social icons clickable
- **Keyboard focus states:** Phase 5 accessibility improvements
- **Arrow key navigation:** Phase 6 (Game Mode) adds spaceship navigation
- **Node search/filter:** v2 feature (out of v1 scope)
- **Custom thumbnails for blogs/milestones:** v2 (Phase 3 uses icons/gradients)

---

## Success Indicators

**User can:**
- ✅ See portfolio hub at canvas center with about me content
- ✅ See timeline nodes extending left with correct types visible
- ✅ Distinguish content types at a glance (visual metaphors)
- ✅ Hover over any node and see mauve glow feedback
- ✅ Click YouTube/blog/project nodes → new tab opens with URL
- ✅ Click milestone node → modal appears with details
- ✅ Close milestone modal with X button, backdrop click, or ESC
- ✅ Recognize hub is different from timeline nodes (size, content, position)

**Developer can:**
- ✅ Run `npm run dev` and see 12 shapes rendering (11 nodes + 1 hub)
- ✅ Add new content entry → see new node appear on timeline
- ✅ Edit about.md → see hub content update
- ✅ Click shapes and verify correct URLs open / modal shows
- ✅ Inspect shape components and see design system tokens applied
- ✅ Build static site (`npm run build`) with shapes rendering

**Technical validation:**
- All 8 requirements (HUB-01, HUB-02, HUB-03, INT-01 through INT-05) implemented
- All 7 success criteria testable and passing
- Shapes render without performance issues (60 FPS maintained)
- Click handlers work reliably (no interference with canvas pan)
- Modal displays milestone details correctly

---

**Context complete. Ready for research and planning phases.**

# Phase 1: Canvas Foundation - Implementation Plan

**Created:** 2026-03-22  
**Status:** Ready for execution

---

## Phase Goal

User can pan and zoom an infinite canvas smoothly at 60 FPS

---

## Success Criteria

1. User can drag the canvas with mouse and it pans smoothly
2. User can zoom the canvas using scroll wheel without frame drops
3. User can pan and zoom using touch gestures on mobile (drag, pinch-to-zoom)
4. User can navigate using arrow keys to move viewport
5. Canvas maintains 60 FPS during all interactions (measured with Chrome DevTools)
6. Canvas displays loading spinner (skeleton) while initializing before first paint

---

## Implementation Strategy

This phase establishes the core infinite canvas experience using **tldraw 4.5.3**, the industry-standard infinite canvas SDK for React. The key insight from research: tldraw provides battle-tested pan/zoom/touch support out-of-the-box — we don't hand-roll camera math, gesture detection, or performance optimization. Instead, we focus on configuration (disable default UI/tools), camera state persistence via localStorage, and custom loading/control UI with glassmorphism styling.

The implementation follows a layered approach: Wave 0 validates research assumptions and sets up the build environment (Vite 8 + React 19 + TypeScript 5.9). Wave 1 builds the core canvas wrapper with tldraw integration, camera persistence, and keyboard navigation. Wave 2 adds the glassmorphism control toolbar with contextual visibility and fog overlay for boundary feedback. Wave 3 performs integration testing, performance validation, and requirement verification.

Design tokens from `.stich/TOKENS.md` drive all visual styling — the glassmorphism toolbar uses `--glass-*` tokens, button interactions use `--interactive-*` tokens, and the fog overlay uses `--canvas-fog`. All motion uses `--duration-*` and `--ease-*` tokens for consistent, premium feel.

---

## Waves

### Wave 0: Setup & Validation
**Purpose:** Initialize Vite + React 19 + TypeScript project, install tldraw 4.5.3, verify API surface matches research assumptions, create test infrastructure

**Tasks:**

#### Task 0.1: Initialize Vite Project
- **ID:** `01-00-01`
- **Description:** Create new Vite project with React 19 + TypeScript template, configure path aliases, add design tokens CSS
- **Files to create:**
  - `package.json` (via `npm create vite@latest`)
  - `vite.config.ts` (add `@/` path alias)
  - `tsconfig.json` (add `@/*` path mapping)
  - `src/index.css` (import design tokens from `.stich/TOKENS.md`)
  - `src/main.tsx` (entry point)
  - `src/App.tsx` (root component)
  - `index.html` (add Google Fonts: Noto Serif, Space Grotesk)
- **Actions:**
  1. Run `npm create vite@latest . -- --template react-ts`
  2. Update `vite.config.ts` to add `@/` path alias pointing to `./src`
  3. Update `tsconfig.json` with `paths: { "@/*": ["./src/*"] }`
  4. Create `src/index.css` with all CSS custom properties from `.stich/TOKENS.md` (copy the entire `:root {}` block)
  5. Update `index.html` to import Google Fonts (Noto Serif: 400,600,700 + Space Grotesk: 300-700)
  6. Verify dev server runs with `npm run dev`
- **Acceptance criteria:**
  - `npm run dev` starts dev server at `http://localhost:5173`
  - `npm run build` produces static output in `dist/`
  - Path alias `@/` resolves correctly (test by importing a file)
  - CSS custom properties (design tokens) are available in browser DevTools
- **Requirements:** TECH-01, TECH-04
- **Verification:** `npm run dev && npm run build` — both succeed without errors

#### Task 0.2: Install tldraw and Verify API Surface
- **ID:** `01-00-02`
- **Description:** Install tldraw 4.5.3, verify `hideUi`, `onMount`, Editor API methods match research expectations
- **Files to modify:**
  - `package.json` (add tldraw dependency)
- **Files to create:**
  - `src/components/CanvasTest.tsx` (minimal tldraw wrapper for API verification)
- **Actions:**
  1. Run `npm install tldraw@4.5.3`
  2. Create minimal `CanvasTest.tsx` that renders `<Tldraw hideUi onMount={...} />`
  3. In `onMount` callback, log `editor.getCamera()` and `editor.setCamera({ x: 0, y: 0, z: 1 })`
  4. Verify camera methods exist and work (no TypeScript errors, console shows camera values)
  5. Test scroll-to-zoom and drag-to-pan work out-of-the-box
  6. Inspect `node_modules/tldraw/dist/index.d.ts` for actual API — document any differences from research
- **Acceptance criteria:**
  - tldraw renders full-screen canvas
  - `hideUi` prop removes default toolbar
  - `onMount` provides Editor instance
  - `editor.getCamera()` returns `{ x, y, z }` object
  - `editor.setCamera()` changes camera position
  - Drag-to-pan and scroll-to-zoom work without additional config
- **Requirements:** TECH-02
- **Verification:** Visual inspection + console logs showing camera values change during pan/zoom

#### Task 0.3: Install Test Framework and Tailwind CSS
- **ID:** `01-00-03`
- **Description:** Install Vitest, React Testing Library, and Tailwind CSS v4 for styling
- **Files to modify:**
  - `package.json` (add dev dependencies)
  - `vite.config.ts` (add Vitest config)
- **Files to create:**
  - `vitest.config.ts` (test configuration)
  - `src/setupTests.ts` (test setup with jest-dom matchers)
  - `src/types/camera.ts` (CameraState interface)
  - `tests/lib/cameraUtils.test.ts` (test scaffold for zoom calculation)
- **Actions:**
  1. Run `npm install -D vitest @vitest/ui jsdom @testing-library/react @testing-library/jest-dom`
  2. Run `npm install -D tailwindcss@4.2.2`
  3. Create `vitest.config.ts` with jsdom environment and React Testing Library setup
  4. Create `src/setupTests.ts` importing `@testing-library/jest-dom`
  5. Create `src/types/camera.ts` with `CameraState` interface (x, y, z, version)
  6. Create initial test file for `cameraUtils.test.ts` with placeholder tests
  7. Add `"test": "vitest"` script to package.json
- **Acceptance criteria:**
  - `npm test` runs Vitest in watch mode
  - `npm test -- --run` runs tests once and exits
  - TypeScript types compile without errors
  - Tailwind utility classes work (test with a `bg-red-500` class)
- **Requirements:** TECH-05
- **Verification:** `npm test -- --run` passes (even with placeholder tests)

---

### Wave 1: Core Canvas Implementation
**Purpose:** Build the main canvas component with tldraw integration, camera state persistence, skeleton loading, and arrow key navigation

**Tasks:**

#### Task 1.1: Create Canvas Component with Loading State
- **ID:** `01-01-01`
- **Description:** Create main Canvas component that renders tldraw with skeleton loader, handles isReady state, fade transition
- **Files to create:**
  - `src/components/Canvas.tsx` (main tldraw wrapper)
  - `src/components/CanvasLoader.tsx` (skeleton loading state)
- **Files to delete:**
  - `src/components/CanvasTest.tsx` (Wave 0 test file)
- **Actions:**
  1. Create `CanvasLoader.tsx`:
     - Fixed positioning, full screen, `--canvas-bg` background
     - Ghost hub shape centered (use `min(640px, 40vw)` width, `min(360px, 22.5vh)` height)
     - Use `--surface-container-low` for ghost shape background
     - Add `animate-pulse` Tailwind class for subtle animation
     - Add dim overlay (`bg-black/20`) to prevent interaction
  2. Create `Canvas.tsx`:
     - State: `isReady` (boolean, default false)
     - Render `<CanvasLoader />` when `!isReady`
     - Render `<Tldraw />` with `hideUi: true` config
     - In `onMount`, use `requestAnimationFrame + setTimeout(300ms)` to set `isReady = true`
     - Apply opacity transition (300ms) for fade-in effect
     - Import `tldraw/tldraw.css` at component top
  3. Update `App.tsx` to render `<Canvas />`
- **Acceptance criteria:**
  - Skeleton loader shows centered ghost hub shape on page load
  - After tldraw mounts, skeleton fades out (300ms transition)
  - Canvas fades in smoothly (no jarring flash)
  - No user interaction possible during skeleton phase (overlay blocks clicks)
- **Requirements:** CANVAS-06
- **Verification:** Visual inspection — skeleton shows for ~300ms minimum, then smooth fade to canvas

#### Task 1.2: Implement Camera State Persistence
- **ID:** `01-01-02`
- **Description:** Create localStorage utilities for camera state, integrate with Canvas component for save/restore
- **Files to create:**
  - `src/lib/localStorageUtils.ts` (save/load camera state)
  - `src/lib/cameraUtils.ts` (zoom calculation, viewport helpers)
- **Files to modify:**
  - `src/components/Canvas.tsx` (integrate persistence)
- **Actions:**
  1. Create `localStorageUtils.ts`:
     - Define `CameraState` interface: `{ x: number, y: number, z: number, version: number }`
     - `CAMERA_STORAGE_KEY = 'illulachy-camera-state'`
     - `CAMERA_SCHEMA_VERSION = 1`
     - `saveCameraState(state)`: Wrap in try-catch, stringify to localStorage
     - `loadCameraState()`: Parse from localStorage, validate version, return null on error
     - `clearCameraState()`: Remove from localStorage
  2. Create `cameraUtils.ts`:
     - `HUB_WIDTH = 640`, `HUB_HEIGHT = 360`, `TARGET_FILL = 0.4`
     - `ZOOM_MIN = 0.1`, `ZOOM_MAX = 4.0`
     - `calculateInitialZoom(viewportWidth, viewportHeight)`: 
       - `zoomByWidth = (viewportWidth * 0.4) / 640`
       - `zoomByHeight = (viewportHeight * 0.4) / 360`
       - Return `Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, Math.min(zoomByWidth, zoomByHeight)))`
  3. Update `Canvas.tsx`:
     - Store `editorRef = useRef<Editor | null>(null)`
     - In `onMount`: Store editor in ref, then restore saved camera OR calculate initial zoom
     - Add `useEffect` with debounced camera change listener (500ms debounce)
     - Subscribe to camera changes via `editor.store.listen()` or equivalent
- **Acceptance criteria:**
  - First visit: Camera starts at hub (0, 0) with auto-calculated zoom
  - Pan/zoom, refresh page: Camera restores to last position
  - Clear localStorage, refresh: Camera resets to default
  - No localStorage errors in console (quota, parse errors handled)
- **Requirements:** None directly (supports CONTEXT.md "Position Memory" decision)
- **Verification:** Manual test — pan, zoom, refresh page, verify position restored

#### Task 1.3: Add Arrow Key Navigation
- **ID:** `01-01-03`
- **Description:** Add keyboard event handler for arrow key panning
- **Files to modify:**
  - `src/components/Canvas.tsx` (add keyboard handler)
- **Actions:**
  1. Add `useEffect` with `keydown` event listener
  2. Handle ArrowUp, ArrowDown, ArrowLeft, ArrowRight keys
  3. Define `PAN_AMOUNT = 100` (pixels per key press)
  4. On arrow key: Get current camera, apply delta, call `setCamera`
  5. Call `e.preventDefault()` to prevent page scroll
  6. Only process when `isReady` is true and editor exists
- **Acceptance criteria:**
  - Arrow keys move viewport in expected direction
  - Arrow Up moves viewport up (decreases y)
  - Arrow Down moves viewport down (increases y)
  - Arrow Left moves viewport left (decreases x)
  - Arrow Right moves viewport right (increases x)
  - Camera position is saved after arrow key navigation
- **Requirements:** CANVAS-04
- **Verification:** Manual test — use arrow keys, verify viewport moves smoothly

#### Task 1.4: Add Double-Click Reset to Hub
- **ID:** `01-01-04`
- **Description:** Implement double-click on canvas background to reset camera to hub
- **Files to modify:**
  - `src/components/Canvas.tsx` (add double-click handler)
- **Actions:**
  1. Add `onDoubleClick` handler to canvas container div
  2. On double-click: Call `editor.setCamera({ x: 0, y: 0, z: 1.0 }, { animation: { duration: 300 } })`
  3. Use smooth animation (300ms) for pleasant reset experience
  4. Note: This may need adjustment based on tldraw's event handling — if tldraw intercepts double-click, may need to use tldraw's event system instead
- **Acceptance criteria:**
  - Double-click anywhere on canvas resets to hub position
  - Reset uses smooth 300ms animation
  - Works on both mouse and touch (double-tap)
- **Requirements:** None directly (supports CONTEXT.md "Reset Shortcuts" decision)
- **Verification:** Manual test — pan away from center, double-click, verify smooth return to hub

---

### Wave 2: Controls & Visual Polish
**Purpose:** Add glassmorphism control toolbar with contextual visibility, fog overlay for boundaries

**Tasks:**

#### Task 2.1: Create Glassmorphism Controls Toolbar
- **ID:** `01-02-01`
- **Description:** Build control toolbar with zoom in/out, reset to hub, fit to screen buttons using design tokens
- **Files to create:**
  - `src/components/CanvasControls.tsx` (toolbar component)
- **Files to modify:**
  - `src/components/Canvas.tsx` (render CanvasControls)
  - `package.json` (add lucide-react for icons)
- **Actions:**
  1. Run `npm install lucide-react` for icon library
  2. Create `CanvasControls.tsx`:
     - Props: `editor: Editor | null`
     - Fixed position: `bottom-4 right-4` (use `--toolbar-offset` = 16px)
     - Glassmorphism styling:
       - `background: var(--glass-bg)` (rgba(28, 28, 28, 0.7))
       - `backdrop-filter: blur(var(--glass-blur))` (20px)
       - `border: 1px solid var(--glass-border)` (rgba(255, 255, 255, 0.1))
       - `box-shadow: var(--glass-shadow)`
       - `border-radius: var(--radius-xl)` (12px)
       - `padding: var(--spacing-3)` (12px)
     - Buttons: 40px (desktop), 48px (mobile for touch targets)
     - Icons from lucide-react: `ZoomIn`, `ZoomOut`, `Home`, `Maximize2`
     - Button colors: `--interactive-default` → `--interactive-hover` on hover
     - Button hover bg: `--interactive-bg-subtle`
  3. Implement button actions:
     - `zoomIn`: `editor.setCamera({ z: Math.min(current * 1.2, 4.0) })`
     - `zoomOut`: `editor.setCamera({ z: Math.max(current / 1.2, 0.1) })`
     - `resetToHub`: `editor.setCamera({ x: 0, y: 0, z: 1.0 }, { animation: { duration: 300 } })`
     - `fitToScreen`: Calculate zoom from viewport, apply with animation
  4. Add `aria-label` to all buttons for accessibility
  5. Render in `Canvas.tsx` when `isReady` is true
- **Acceptance criteria:**
  - Toolbar appears in bottom-right corner
  - Glassmorphism effect visible (blur, translucency)
  - All 4 buttons work correctly
  - Zoom respects 10%-400% limits
  - Reset and fit-to-screen use smooth animation
  - Touch targets are 48px on mobile (responsive)
- **Requirements:** None directly (supports CONTEXT.md "Control Actions" decision)
- **Verification:** Visual inspection + manual testing of all button actions

#### Task 2.2: Implement Contextual Visibility
- **ID:** `01-02-02`
- **Description:** Controls fade in on hover/interaction, fade out after 3 seconds of inactivity
- **Files to create:**
  - `src/hooks/useControlsVisibility.ts` (visibility logic hook)
- **Files to modify:**
  - `src/components/CanvasControls.tsx` (use visibility hook)
- **Actions:**
  1. Create `useControlsVisibility.ts`:
     - State: `isVisible` (boolean)
     - State: `timeoutRef` (NodeJS.Timeout)
     - On mousemove/touchstart: Set `isVisible = true`, clear timeout, set new 3s timeout
     - After 3s: Set `isVisible = false`
     - Return `isVisible`
  2. Update `CanvasControls.tsx`:
     - Use `useControlsVisibility()` hook
     - Apply opacity transition: `transition-opacity duration-300`
     - `opacity: isVisible ? 1 : 0`
     - Keep controls in DOM but invisible (don't unmount — causes layout shift)
     - On mobile: Increase timeout to 5s (touch interactions less predictable)
  3. Use media query or `window.matchMedia('(hover: none)')` to detect touch devices
- **Acceptance criteria:**
  - Controls hidden by default on page load
  - Controls appear on mouse move
  - Controls fade out after 3s of no movement
  - Controls stay visible while hovering over them
  - On mobile/touch devices, timeout is 5s instead of 3s
- **Requirements:** None directly (supports CONTEXT.md "Visibility Behavior" decision)
- **Verification:** Manual test — move mouse, wait 3s, verify fade out; hover over controls, verify they stay visible

#### Task 2.3: Add Fog Overlay for Boundaries
- **ID:** `01-02-03`
- **Description:** Create edge fog overlay using radial gradient to indicate canvas boundaries
- **Files to create:**
  - `src/components/CanvasFogOverlay.tsx` (fog gradient component)
- **Files to modify:**
  - `src/components/Canvas.tsx` (render fog overlay)
- **Actions:**
  1. Create `CanvasFogOverlay.tsx`:
     - Fixed positioning, full screen (`inset-0`)
     - `pointer-events: none` (don't interfere with canvas interactions)
     - `z-index: var(--z-base)` or slightly above canvas but below controls
     - Radial gradient:
       ```css
       background: radial-gradient(
         ellipse at center,
         transparent 40%,
         var(--canvas-fog) 100%
       );
       ```
     - `--canvas-fog` = `rgba(19, 19, 19, 0.6)`
  2. Render in `Canvas.tsx` after tldraw, before controls
  3. Only render when `isReady` is true (no fog during skeleton)
- **Acceptance criteria:**
  - Subtle vignette effect visible at canvas edges
  - Center of canvas is clear (transparent to 40%)
  - Fog doesn't interfere with pan/zoom interactions
  - Fog is below control toolbar in z-index
- **Requirements:** None directly (supports CONTEXT.md "Beyond-Content Visuals" decision)
- **Verification:** Visual inspection — edges should darken subtly, center remains clear

---

### Wave 3: Integration & Verification
**Purpose:** Comprehensive testing, performance validation, requirement sign-off

**Tasks:**

#### Task 3.1: Write Integration Tests
- **ID:** `01-03-01`
- **Description:** Create test suite covering all canvas interactions and state management
- **Files to create:**
  - `tests/components/Canvas.test.tsx` (integration tests)
  - `tests/components/CanvasLoader.test.tsx` (loader unit tests)
  - `tests/lib/localStorageUtils.test.ts` (persistence tests)
  - `tests/lib/cameraUtils.test.ts` (zoom calculation tests)
- **Actions:**
  1. `CanvasLoader.test.tsx`:
     - Test renders centered skeleton
     - Test has pulse animation class
     - Test has interaction-blocking overlay
  2. `localStorageUtils.test.ts`:
     - Test `saveCameraState` writes to localStorage
     - Test `loadCameraState` returns saved state
     - Test `loadCameraState` returns null for invalid data
     - Test version mismatch clears cache
     - Test handles localStorage errors gracefully
  3. `cameraUtils.test.ts`:
     - Test `calculateInitialZoom` with standard viewport (1920x1080)
     - Test with portrait viewport (375x812)
     - Test with ultra-wide viewport (3440x1440)
     - Test zoom is clamped to 0.1-4.0 range
  4. `Canvas.test.tsx`:
     - Mock tldraw (or use shallow render)
     - Test loader shows initially
     - Test canvas renders after mount
     - Note: Full tldraw integration tests may need Playwright due to canvas rendering
- **Acceptance criteria:**
  - All unit tests pass
  - Coverage > 80% for utility functions
  - No flaky tests
- **Requirements:** TECH-05 (TypeScript types tested)
- **Verification:** `npm test -- --run --coverage` shows passing tests with coverage

#### Task 3.2: Performance Validation (60 FPS)
- **ID:** `01-03-02`
- **Description:** Validate 60 FPS during pan/zoom using Chrome DevTools Performance panel
- **Files to create:**
  - `docs/PERFORMANCE.md` (performance validation results)
- **Actions:**
  1. Open site in Chrome, open DevTools > Performance panel
  2. Click "Record" button
  3. Perform 10 seconds of continuous pan/zoom:
     - Drag canvas left/right/up/down
     - Scroll to zoom in and out
     - Use arrow keys to pan
  4. Stop recording, analyze results:
     - Check FPS graph (should stay at 60, occasional dips to 55 acceptable)
     - Check for "Long Tasks" (red triangles in timeline)
     - Check frame time (should be ≤16.67ms average)
  5. Document results in `docs/PERFORMANCE.md`:
     - Test date, browser version, device specs
     - Average FPS, minimum FPS during test
     - Any long tasks identified
     - Screenshot of Performance timeline
  6. Repeat on mobile device (Chrome Remote Debugging) if possible
- **Acceptance criteria:**
  - Desktop: 60 FPS sustained (95th percentile ≥55 FPS)
  - No "Long Tasks" during pan/zoom
  - Frame time ≤16.67ms average
  - Mobile: 55+ FPS acceptable (less powerful hardware)
- **Requirements:** CANVAS-05
- **Verification:** Performance documentation with screenshots showing 60 FPS

#### Task 3.3: Touch Gesture Smoke Test
- **ID:** `01-03-03`
- **Description:** Verify touch gestures work using Chrome DevTools Device Mode
- **Files to modify:**
  - `docs/PERFORMANCE.md` (add touch testing section)
- **Actions:**
  1. Open Chrome DevTools > Toggle Device Mode (Ctrl+Shift+M)
  2. Select iPhone 12 Pro or Pixel 5 device
  3. Enable "Add touch" in device toolbar
  4. Test touch interactions:
     - Single finger drag: Should pan canvas
     - Pinch gesture (use Shift+drag): Should zoom
     - Double-tap: Should zoom in (if tldraw supports) or no-op
  5. Verify zoom stays within 10%-400% limits
  6. Document results in `docs/PERFORMANCE.md` touch section
  7. Note: This is simulation only — real device testing recommended pre-launch
- **Acceptance criteria:**
  - Drag-to-pan works in device mode
  - Pinch-to-zoom works in device mode
  - Zoom limits enforced on touch
  - Controls visible and tappable (48px touch targets)
- **Requirements:** CANVAS-03
- **Verification:** Manual testing in Device Mode, documented in PERFORMANCE.md

#### Task 3.4: Requirement Validation Checklist
- **ID:** `01-03-04`
- **Description:** Final verification that all 10 phase requirements are met
- **Files to create:**
  - `docs/REQUIREMENTS-VALIDATION.md` (requirement sign-off checklist)
- **Actions:**
  1. Create checklist document with all requirements
  2. For each requirement, document:
     - How it was implemented (which component/file)
     - How it was tested (test file or manual verification)
     - Pass/fail status
     - Any notes or limitations
  3. Requirements to validate:
     - CANVAS-01: Pan by dragging (tldraw built-in)
     - CANVAS-02: Zoom with scroll wheel (tldraw built-in)
     - CANVAS-03: Touch gestures (tldraw built-in + Device Mode test)
     - CANVAS-04: Arrow key navigation (Canvas.tsx keyboard handler)
     - CANVAS-05: 60 FPS performance (PERFORMANCE.md documentation)
     - CANVAS-06: Loading state (CanvasLoader.tsx + skeleton)
     - TECH-01: Vite + React 19 + TypeScript (package.json versions)
     - TECH-02: tldraw 4.5 (package.json version)
     - TECH-04: Static SPA (vite build output)
     - TECH-05: TypeScript types (camera.ts, test coverage)
  4. Sign off on each requirement
- **Acceptance criteria:**
  - All 10 requirements have Pass status
  - Each requirement has documented implementation and test approach
  - Any limitations or known issues documented
- **Requirements:** All Phase 1 requirements
- **Verification:** REQUIREMENTS-VALIDATION.md exists with all items checked off

---

## Requirement Coverage

| Requirement ID | Description | Task(s) | Wave |
|----------------|-------------|---------|------|
| CANVAS-01 | Pan canvas by dragging with mouse | 0.2 (tldraw built-in) | 0 |
| CANVAS-02 | Zoom canvas using scroll wheel | 0.2 (tldraw built-in) | 0 |
| CANVAS-03 | Pan/zoom with touch gestures | 0.2 (tldraw built-in), 3.3 (validation) | 0, 3 |
| CANVAS-04 | Navigate using arrow keys | 1.3 | 1 |
| CANVAS-05 | Maintain 60 FPS performance | 3.2 (validation) | 3 |
| CANVAS-06 | Display loading state | 1.1 | 1 |
| TECH-01 | Vite + React 19 + TypeScript | 0.1 | 0 |
| TECH-02 | tldraw 4.5 canvas | 0.2 | 0 |
| TECH-04 | Static SPA deployment | 0.1 | 0 |
| TECH-05 | TypeScript types for content structures | 0.3 (CameraState) | 0 |

**Note:** TECH-03 (gray-matter + remark) is NOT in Phase 1 scope — it's for Phase 2 Content Pipeline.

---

## Risk Mitigation

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| tldraw 4.5 API differs from research | Medium | High | Wave 0 Task 0.2 validates API surface before main implementation |
| Camera state race condition | Medium | Medium | Use `onMount` callback, wait for editor before setting camera |
| LocalStorage quota exceeded | Low | Low | Only store camera state (~100 bytes), add try-catch |
| 60 FPS not achieved | Low | High | tldraw optimized for 60 FPS; if issues, profile and optimize React renders |
| Touch gestures don't work | Low | Medium | tldraw documented as touch-friendly; Device Mode testing in Wave 3 |
| Skeleton loading flicker | Medium | Low | Enforce 300ms minimum display time before fade transition |
| Glassmorphism not rendering | Low | Low | CSS custom properties well-defined; fallback to solid background if needed |

---

## Definition of Done

Phase 1 is complete when ALL of the following are true:

- [ ] `npm run dev` starts development server successfully
- [ ] `npm run build` produces static output in `dist/`
- [ ] `npm test -- --run` passes all tests
- [ ] Canvas renders with tldraw (no default UI visible)
- [ ] Drag-to-pan works smoothly
- [ ] Scroll-to-zoom works (respects 10%-400% limits)
- [ ] Arrow keys move viewport
- [ ] Double-click resets to hub
- [ ] Skeleton loader shows on initial load
- [ ] Skeleton fades out when canvas is ready (300ms transition)
- [ ] Glassmorphism controls toolbar visible in bottom-right
- [ ] Controls fade in on mouse move, fade out after 3s
- [ ] Fog overlay creates subtle vignette effect
- [ ] Camera position persists in localStorage
- [ ] Returning visitor resumes at last position
- [ ] 60 FPS confirmed via Chrome DevTools Performance panel
- [ ] Touch gestures work in Chrome Device Mode
- [ ] REQUIREMENTS-VALIDATION.md signed off with all 10 requirements passing
- [ ] All code committed to git with meaningful commit messages

---

## Estimated Effort

| Wave | Tasks | Estimated Time | Cumulative |
|------|-------|----------------|------------|
| Wave 0 | 3 tasks | 1-2 hours | 1-2 hours |
| Wave 1 | 4 tasks | 2-3 hours | 3-5 hours |
| Wave 2 | 3 tasks | 1-2 hours | 4-7 hours |
| Wave 3 | 4 tasks | 1-2 hours | 5-9 hours |

**Total estimated time:** 5-9 hours of Claude execution time

---

## Next Phase Dependencies

Phase 1 produces artifacts that Phase 2+ depends on:

- **Phase 2 (Content Pipeline):**
  - Uses `src/types/camera.ts` pattern for content type definitions
  - Extends project structure established in Wave 0
  
- **Phase 3 (Custom Shapes & Hub):**
  - Extends `Canvas.tsx` with custom tldraw shapes
  - Uses Editor API patterns established in Wave 1
  - Builds on glassmorphism styling from Wave 2

- **Phase 4 (Timeline Layout):**
  - Updates `cameraBounds` config based on timeline extent
  - May adjust fog overlay gradient based on content boundaries

---

*Plan created: 2026-03-22*  
*Ready for execution via `/gsd-execute-phase 01`*

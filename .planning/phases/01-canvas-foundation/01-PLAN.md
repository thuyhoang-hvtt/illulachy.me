---
phase: 1
name: Canvas Foundation
goal: User can pan and zoom an infinite canvas smoothly at 60 FPS
created: 2026-03-22
status: ready
waves: 4
tasks: 14
requirements:
  - TECH-01
  - TECH-02
  - TECH-04
  - TECH-05
  - CANVAS-01
  - CANVAS-02
  - CANVAS-03
  - CANVAS-04
  - CANVAS-05
  - CANVAS-06
files_modified:
  - package.json
  - vite.config.ts
  - tsconfig.json
  - index.html
  - src/index.css
  - src/main.tsx
  - src/App.tsx
  - src/components/Canvas.tsx
  - src/components/CanvasControls.tsx
  - src/components/CanvasLoader.tsx
  - src/components/CanvasFogOverlay.tsx
  - src/hooks/useCameraState.ts
  - src/hooks/useControlsVisibility.ts
  - src/hooks/useInitialZoom.ts
  - src/lib/cameraUtils.ts
  - src/lib/localStorageUtils.ts
  - src/lib/editorConfig.ts
  - src/types/camera.ts
  - src/types/content.ts
autonomous: true
must_haves:
  truths:
    - "User can drag canvas and it pans smoothly"
    - "User can scroll to zoom without frame drops"
    - "User can pan/zoom using touch gestures on mobile"
    - "User can use arrow keys to move viewport"
    - "Canvas maintains 60 FPS during interactions"
    - "Loading skeleton appears before canvas is ready"
    - "Camera position persists across sessions"
    - "Controls fade in on interaction, fade out after 3s"
  artifacts:
    - path: "src/components/Canvas.tsx"
      provides: "Main tldraw wrapper with camera persistence"
      min_lines: 50
    - path: "src/components/CanvasControls.tsx"
      provides: "Glassmorphism zoom/reset toolbar"
      min_lines: 40
    - path: "src/hooks/useCameraState.ts"
      provides: "localStorage camera persistence"
      exports: ["useCameraState"]
    - path: "src/lib/cameraUtils.ts"
      provides: "Zoom calculation, camera math"
      exports: ["calculateInitialZoom", "getViewportDimensions"]
  key_links:
    - from: "src/components/Canvas.tsx"
      to: "tldraw Editor API"
      via: "onMount callback"
      pattern: "onMount.*editor"
    - from: "src/hooks/useCameraState.ts"
      to: "localStorage"
      via: "JSON serialize/deserialize"
      pattern: "localStorage\\.(get|set)Item"
    - from: "src/components/CanvasControls.tsx"
      to: "src/hooks/useControlsVisibility.ts"
      via: "visibility state hook"
      pattern: "useControlsVisibility"
---

# Phase 1: Canvas Foundation

## Overview

**Objective:** Implement infinite canvas with smooth pan/zoom navigation at 60 FPS using tldraw 4.5.

**Outputs:**
- Working Vite + React 19 + TypeScript project
- tldraw canvas with disabled shape tools (read-only)
- Custom glassmorphism controls (zoom in/out, reset, fit)
- Camera state persistence via localStorage
- Skeleton loading state
- Arrow key navigation
- Fog overlay at canvas boundaries

**Context Files:**
- `.planning/phases/01-canvas-foundation/01-CONTEXT.md` — Implementation decisions
- `.planning/phases/01-canvas-foundation/01-RESEARCH.md` — Technical research
- `.stich/TOKENS.md` — Design tokens (glassmorphism, colors, spacing)
- `.stich/DESIGN.md` — Design system strategy

---

## Wave 0: Setup & Validation

<task id="01-00-01" wave="0">
<summary>Initialize Vite + React 19 + TypeScript project</summary>

<context>
Create new Vite project with React 19 template. Configure path aliases for clean imports.
Import design tokens from `.stich/TOKENS.md`. Add Google Fonts.
</context>

<requirements>TECH-01, TECH-04</requirements>

<actions>
1. Run `npm create vite@latest . -- --template react-ts`
2. Update `vite.config.ts`:
   ```typescript
   import { defineConfig } from 'vite'
   import react from '@vitejs/plugin-react'
   import path from 'path'
   
   export default defineConfig({
     plugins: [react()],
     resolve: {
       alias: {
         '@': path.resolve(__dirname, './src')
       }
     }
   })
   ```
3. Update `tsconfig.json` paths:
   ```json
   {
     "compilerOptions": {
       "baseUrl": ".",
       "paths": {
         "@/*": ["./src/*"]
       }
     }
   }
   ```
4. Create `src/index.css` — copy ALL CSS custom properties from `.stich/TOKENS.md`:
   - Canvas colors (--canvas-bg, --canvas-grid, --canvas-fog)
   - Surface hierarchy (--surface-*)
   - Interactive colors (--interactive-*)
   - Glassmorphism (--glass-bg, --glass-blur, --glass-border, --glass-shadow)
   - Typography (--font-display, --font-body, --text-*)
   - Spacing (--spacing-*)
   - Animation (--ease-*, --duration-*, --motion-*)
5. Update `index.html`:
   ```html
   <link rel="preconnect" href="https://fonts.googleapis.com">
   <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
   <link href="https://fonts.googleapis.com/css2?family=Noto+Serif:wght@400;600;700&family=Space+Grotesk:wght@300;400;500;600;700&display=swap" rel="stylesheet">
   ```
6. Run `npm run dev` to verify dev server starts
7. Run `npm run build` to verify production build works
</actions>

<verify>
<automated>npm run build && npm run dev -- --port 5173 &amp;&amp; sleep 3 &amp;&amp; curl -s http://localhost:5173 | grep -q "root"</automated>
<manual>
1. Open http://localhost:5173
2. DevTools → Sources → verify @/ alias resolves (import '@/...' works)
3. DevTools → Elements → verify CSS custom properties exist in :root
4. DevTools → Network → verify fonts loaded (Noto Serif, Space Grotesk)
</manual>
<acceptance>
- Dev server starts without errors on port 5173
- Production build completes successfully
- Path alias @/ resolves correctly
- All design tokens from TOKENS.md available as CSS custom properties
- Google Fonts loaded
</acceptance>
</verify>

<deliverables>
- package.json (with dependencies)
- vite.config.ts (path alias configured)
- tsconfig.json (paths configured)
- src/index.css (design tokens imported)
- index.html (fonts loaded)
</deliverables>
</task>

<task id="01-00-02" wave="0" depends_on="01-00-01">
<summary>Install tldraw 4.5.3 and verify API surface</summary>

<context>
Install tldraw, create minimal test component to verify Editor API methods match research expectations.
Confirm hideUi removes default toolbar, getCamera/setCamera work as documented.
</context>

<requirements>TECH-02</requirements>

<actions>
1. Run `npm install tldraw@4.5.3`
2. Create `src/components/CanvasTest.tsx`:
   ```typescript
   import { Tldraw } from 'tldraw'
   import 'tldraw/tldraw.css'
   
   export function CanvasTest() {
     return (
       <div style={{ position: 'fixed', inset: 0 }}>
         <Tldraw
           hideUi
           onMount={(editor) => {
             console.log('Editor mounted:', editor)
             console.log('Camera:', editor.getCamera())
             editor.setCamera({ x: 0, y: 0, z: 1 })
             console.log('Camera after setCamera:', editor.getCamera())
           }}
         />
       </div>
     )
   }
   ```
3. Update `src/App.tsx` to render `<CanvasTest />`
4. Test in browser:
   - Verify default tldraw UI is hidden (no shape tools visible)
   - Verify console logs show camera {x, y, z}
   - Verify scroll-to-zoom works
   - Verify drag-to-pan works
5. Document any API differences from RESEARCH.md in console/comments
</actions>

<verify>
<automated>npm run type-check</automated>
<manual>
1. Run dev server: `npm run dev`
2. Open browser console
3. Verify "Editor mounted" log appears with Editor object
4. Verify "Camera:" log shows {x: number, y: number, z: number}
5. Scroll wheel → canvas zooms (no frame drops)
6. Click-drag → canvas pans (smooth movement)
7. No tldraw toolbar/shape tools visible (hideUi working)
</manual>
<acceptance>
- tldraw renders without TypeScript errors
- hideUi prop removes default toolbar
- editor.getCamera() returns {x, y, z} object
- editor.setCamera() updates viewport position
- Scroll-to-zoom works natively
- Drag-to-pan works natively
</acceptance>
</verify>

<deliverables>
- package.json (tldraw@4.5.3 added)
- src/components/CanvasTest.tsx
- Console verification notes
</deliverables>
</task>

<task id="01-00-03" wave="0" depends_on="01-00-01">
<summary>Create TypeScript types for camera and content structures</summary>

<context>
Define TypeScript interfaces for camera state (used in localStorage persistence)
and content node types (used in later phases). This establishes type contracts early.
</context>

<requirements>TECH-05</requirements>

<actions>
1. Create `src/types/camera.ts`:
   ```typescript
   export interface CameraState {
     x: number
     y: number
     z: number  // zoom level (0.1 = 10%, 4.0 = 400%)
     version: number  // schema version for migration
   }
   
   export interface ViewportDimensions {
     width: number
     height: number
   }
   
   export const CAMERA_SCHEMA_VERSION = 1
   export const ZOOM_MIN = 0.1  // 10%
   export const ZOOM_MAX = 4.0  // 400%
   export const HUB_WIDTH = 640
   export const HUB_HEIGHT = 360
   export const HUB_VIEWPORT_FILL = 0.4  // 40% of viewport
   ```
2. Create `src/types/content.ts`:
   ```typescript
   // Phase 2+ content types (defined now for forward compatibility)
   export type ContentType = 'youtube' | 'blog' | 'project' | 'milestone'
   
   export interface ContentNode {
     id: string
     type: ContentType
     title: string
     date: string  // ISO 8601
     url?: string
     thumbnail?: string
     description?: string
   }
   
   export interface TimelineData {
     nodes: ContentNode[]
     lastUpdated: string
   }
   ```
3. Create `src/types/index.ts` to re-export all types:
   ```typescript
   export * from './camera'
   export * from './content'
   ```
4. Verify types compile: `npm run type-check`
</actions>

<verify>
<automated>npm run type-check</automated>
<manual>
1. Import types in CanvasTest.tsx: `import { CameraState, ZOOM_MIN } from '@/types'`
2. Verify autocomplete works for CameraState properties
3. Verify constants (ZOOM_MIN, ZOOM_MAX, HUB_WIDTH) are accessible
</manual>
<acceptance>
- All type files compile without errors
- Types can be imported via @/types barrel export
- Constants are properly typed and exported
- CameraState interface matches localStorage schema in RESEARCH.md
</acceptance>
</verify>

<deliverables>
- src/types/camera.ts
- src/types/content.ts
- src/types/index.ts
</deliverables>
</task>

---

## Wave 1: Core Canvas Implementation

<task id="01-01-01" wave="1" depends_on="01-00-02,01-00-03">
<summary>Create Canvas component with skeleton loading state</summary>

<context>
Build main Canvas component with loading skeleton. Skeleton shows ghost hub shape (640x360)
centered in viewport. Canvas fades in (200-300ms) when tldraw is ready.
Interactions disabled during loading (dim overlay).
</context>

<requirements>CANVAS-06</requirements>

<actions>
1. Create `src/components/CanvasLoader.tsx`:
   ```typescript
   export function CanvasLoader() {
     return (
       <div 
         className="fixed inset-0 flex items-center justify-center"
         style={{ background: 'var(--canvas-bg)' }}
       >
         {/* Ghost hub shape - 16:9 aspect ratio */}
         <div 
           className="relative animate-pulse"
           style={{
             width: 'min(640px, 80vw)',
             aspectRatio: '16 / 9',
           }}
         >
           <div 
             className="w-full h-full rounded-lg"
             style={{
               background: 'var(--surface-container-low)',
               border: '1px solid var(--border-ghost)',
               opacity: 0.4,
             }}
           />
         </div>
         {/* Overlay prevents interaction */}
         <div className="absolute inset-0 pointer-events-auto" />
       </div>
     )
   }
   ```
2. Create `src/components/Canvas.tsx`:
   ```typescript
   import { useState, useRef } from 'react'
   import { Tldraw, Editor } from 'tldraw'
   import 'tldraw/tldraw.css'
   import { CanvasLoader } from './CanvasLoader'
   
   export function Canvas() {
     const [isReady, setIsReady] = useState(false)
     const editorRef = useRef<Editor | null>(null)
     
     const handleMount = (editor: Editor) => {
       editorRef.current = editor
       // Small delay ensures first paint complete
       requestAnimationFrame(() => {
         requestAnimationFrame(() => {
           setIsReady(true)
         })
       })
     }
     
     return (
       <>
         {!isReady && <CanvasLoader />}
         <div 
           className="fixed inset-0"
           style={{
             opacity: isReady ? 1 : 0,
             transition: 'opacity 250ms var(--ease-out)',
           }}
         >
           <Tldraw hideUi onMount={handleMount} />
         </div>
       </>
     )
   }
   ```
3. Update `src/App.tsx` to render `<Canvas />` instead of CanvasTest
4. Test loading state appears briefly before canvas
</actions>

<verify>
<automated>npm run type-check &amp;&amp; npm run build</automated>
<manual>
1. Hard refresh page (Cmd+Shift+R)
2. Skeleton loader visible briefly (ghost hub shape, pulsing)
3. Canvas fades in smoothly (no flash)
4. After fade, canvas is fully interactive
5. Network throttling to Slow 3G → skeleton visible longer
</manual>
<acceptance>
- Skeleton loader displays centered ghost hub shape
- Skeleton has pulse animation (subtle)
- Canvas fades in over ~250ms when ready
- No interaction possible during loading (overlay blocks)
- Transition feels smooth, not jarring
</acceptance>
</verify>

<deliverables>
- src/components/CanvasLoader.tsx
- src/components/Canvas.tsx (initial version)
</deliverables>
</task>

<task id="01-01-02" wave="1" depends_on="01-00-03">
<summary>Implement camera state persistence with localStorage</summary>

<context>
Create hook and utility functions to save/restore camera position across sessions.
Debounce saves (500ms) to avoid excessive writes. Include schema versioning for future migration.
</context>

<requirements>TECH-05</requirements>

<actions>
1. Create `src/lib/localStorageUtils.ts`:
   ```typescript
   import { CameraState, CAMERA_SCHEMA_VERSION } from '@/types'
   
   const STORAGE_KEY = 'illulachy-camera-state'
   
   export function saveCameraState(state: Omit<CameraState, 'version'>): void {
     const data: CameraState = { ...state, version: CAMERA_SCHEMA_VERSION }
     try {
       localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
     } catch (e) {
       console.warn('Failed to save camera state:', e)
     }
   }
   
   export function loadCameraState(): CameraState | null {
     try {
       const stored = localStorage.getItem(STORAGE_KEY)
       if (!stored) return null
       
       const data = JSON.parse(stored) as CameraState
       if (data.version !== CAMERA_SCHEMA_VERSION) {
         console.warn('Camera state schema mismatch, clearing')
         clearCameraState()
         return null
       }
       return data
     } catch (e) {
       console.warn('Failed to load camera state:', e)
       return null
     }
   }
   
   export function clearCameraState(): void {
     localStorage.removeItem(STORAGE_KEY)
   }
   ```
2. Create `src/hooks/useCameraState.ts`:
   ```typescript
   import { useEffect, useRef, useCallback } from 'react'
   import { Editor } from 'tldraw'
   import { saveCameraState, loadCameraState } from '@/lib/localStorageUtils'
   import { calculateInitialZoom } from '@/lib/cameraUtils'
   
   export function useCameraState(editor: Editor | null) {
     const saveTimeoutRef = useRef<NodeJS.Timeout>()
     
     // Restore camera on mount
     useEffect(() => {
       if (!editor) return
       
       const saved = loadCameraState()
       if (saved) {
         editor.setCamera({ x: saved.x, y: saved.y, z: saved.z })
       } else {
         // First-time: calculate initial zoom
         const bounds = editor.getViewportScreenBounds()
         const zoom = calculateInitialZoom({ 
           width: bounds.width, 
           height: bounds.height 
         })
         editor.setCamera({ x: 0, y: 0, z: zoom })
       }
     }, [editor])
     
     // Save camera on change (debounced)
     useEffect(() => {
       if (!editor) return
       
       const handleChange = () => {
         clearTimeout(saveTimeoutRef.current)
         saveTimeoutRef.current = setTimeout(() => {
           const camera = editor.getCamera()
           saveCameraState({ x: camera.x, y: camera.y, z: camera.z })
         }, 500)
       }
       
       editor.on('change', handleChange)
       return () => {
         editor.off('change', handleChange)
         clearTimeout(saveTimeoutRef.current)
       }
     }, [editor])
   }
   ```
3. Wire into Canvas.tsx (will be done in integration task)
</actions>

<verify>
<automated>npm run type-check</automated>
<manual>
1. Pan/zoom canvas, wait 1 second
2. Open DevTools → Application → Local Storage
3. Verify "illulachy-camera-state" key exists with {x, y, z, version}
4. Refresh page → canvas restores to last position
5. Clear localStorage → refresh → canvas shows initial view (hub centered)
</manual>
<acceptance>
- Camera state saves to localStorage after 500ms debounce
- Schema includes version field (value: 1)
- Saved state restores on page load
- Invalid/missing state falls back to initial zoom calculation
- No errors thrown on localStorage failures (graceful degradation)
</acceptance>
</verify>

<deliverables>
- src/lib/localStorageUtils.ts
- src/hooks/useCameraState.ts
</deliverables>
</task>

<task id="01-01-03" wave="1" depends_on="01-00-02">
<summary>Add keyboard navigation with arrow keys</summary>

<context>
Implement arrow key navigation to pan camera. Pan amount: 100px per keypress.
Keys should work globally (not require canvas focus). Smooth animation on movement.
</context>

<requirements>CANVAS-04</requirements>

<actions>
1. Add keyboard handler to Canvas.tsx:
   ```typescript
   import { useEffect, useCallback } from 'react'
   import { Editor } from 'tldraw'
   
   function useArrowKeyNavigation(editor: Editor | null) {
     const handleKeyDown = useCallback((e: KeyboardEvent) => {
       if (!editor) return
       
       const PAN_AMOUNT = 100
       const camera = editor.getCamera()
       let newX = camera.x
       let newY = camera.y
       
       switch (e.key) {
         case 'ArrowUp':
           newY = camera.y - PAN_AMOUNT
           break
         case 'ArrowDown':
           newY = camera.y + PAN_AMOUNT
           break
         case 'ArrowLeft':
           newX = camera.x - PAN_AMOUNT
           break
         case 'ArrowRight':
           newX = camera.x + PAN_AMOUNT
           break
         default:
           return
       }
       
       e.preventDefault()
       editor.setCamera(
         { x: newX, y: newY, z: camera.z },
         { animation: { duration: 150 } }
       )
     }, [editor])
     
     useEffect(() => {
       window.addEventListener('keydown', handleKeyDown)
       return () => window.removeEventListener('keydown', handleKeyDown)
     }, [handleKeyDown])
   }
   ```
2. Call `useArrowKeyNavigation(editorRef.current)` in Canvas component
3. Test all four arrow keys
</actions>

<verify>
<automated>npm run type-check</automated>
<manual>
1. Load canvas, ensure it's focused
2. Press ArrowUp → canvas pans up (smooth animation)
3. Press ArrowDown → canvas pans down
4. Press ArrowLeft → canvas pans left
5. Press ArrowRight → canvas pans right
6. Hold key → repeated pans (keyboard repeat rate)
7. Verify no conflict with browser shortcuts (no scroll)
</manual>
<acceptance>
- All four arrow keys trigger camera pan
- Pan animation is smooth (~150ms)
- Pan amount is noticeable but not jarring (~100px)
- Keys work without clicking canvas first (global listener)
- Browser default scroll behavior prevented
</acceptance>
</verify>

<deliverables>
- Updated src/components/Canvas.tsx with arrow key navigation
</deliverables>
</task>

<task id="01-01-04" wave="1" depends_on="01-00-03">
<summary>Calculate responsive initial zoom to fit hub at 40% viewport</summary>

<context>
Implement algorithm from RESEARCH.md to calculate zoom level where 640x360px hub
fills 40% of viewport. Handle edge cases (ultra-wide, portrait mobile). Clamp to zoom limits.
</context>

<requirements>CANVAS-05</requirements>

<actions>
1. Create `src/lib/cameraUtils.ts`:
   ```typescript
   import { 
     ViewportDimensions, 
     ZOOM_MIN, 
     ZOOM_MAX,
     HUB_WIDTH,
     HUB_HEIGHT,
     HUB_VIEWPORT_FILL
   } from '@/types'
   
   /**
    * Calculate zoom level to make hub fill 40% of viewport
    * Uses smaller of width/height-based calculation to fit both dimensions
    */
   export function calculateInitialZoom(viewport: ViewportDimensions): number {
     // Calculate zoom for each dimension
     const zoomByWidth = (viewport.width * HUB_VIEWPORT_FILL) / HUB_WIDTH
     const zoomByHeight = (viewport.height * HUB_VIEWPORT_FILL) / HUB_HEIGHT
     
     // Use smaller to ensure hub fits within viewport
     const calculated = Math.min(zoomByWidth, zoomByHeight)
     
     // Clamp to zoom limits
     return Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, calculated))
   }
   
   /**
    * Get viewport dimensions from tldraw editor
    */
   export function getViewportDimensions(editor: any): ViewportDimensions {
     const bounds = editor.getViewportScreenBounds()
     return { width: bounds.width, height: bounds.height }
   }
   
   /**
    * Calculate camera position to center hub in viewport
    */
   export function getCenterOnHubCamera(viewport: ViewportDimensions) {
     const zoom = calculateInitialZoom(viewport)
     return { x: 0, y: 0, z: zoom }
   }
   ```
2. Create `src/lib/cameraUtils.test.ts`:
   ```typescript
   import { describe, it, expect } from 'vitest'
   import { calculateInitialZoom } from './cameraUtils'
   
   describe('calculateInitialZoom', () => {
     it('desktop 1920x1080 → reasonable zoom', () => {
       const zoom = calculateInitialZoom({ width: 1920, height: 1080 })
       // Expected: min(1920*0.4/640, 1080*0.4/360) = min(1.2, 1.2) = 1.2
       expect(zoom).toBeCloseTo(1.2, 1)
     })
     
     it('portrait mobile 375x812 → uses width-based zoom', () => {
       const zoom = calculateInitialZoom({ width: 375, height: 812 })
       // Expected: min(375*0.4/640, 812*0.4/360) = min(0.23, 0.90) = 0.23
       expect(zoom).toBeCloseTo(0.23, 1)
     })
     
     it('ultra-wide 3440x1440 → uses height-based zoom', () => {
       const zoom = calculateInitialZoom({ width: 3440, height: 1440 })
       // Expected: min(3440*0.4/640, 1440*0.4/360) = min(2.15, 1.6) = 1.6
       expect(zoom).toBeCloseTo(1.6, 1)
     })
     
     it('clamps to ZOOM_MIN for tiny viewport', () => {
       const zoom = calculateInitialZoom({ width: 100, height: 50 })
       expect(zoom).toBe(0.1)
     })
     
     it('clamps to ZOOM_MAX for huge viewport', () => {
       const zoom = calculateInitialZoom({ width: 10000, height: 10000 })
       expect(zoom).toBe(4.0)
     })
   })
   ```
3. Install Vitest: `npm install -D vitest @vitest/ui`
4. Add to package.json scripts: `"test": "vitest", "test:ui": "vitest --ui"`
5. Run tests: `npm test`
</actions>

<verify>
<automated>npm test -- cameraUtils.test.ts</automated>
<manual>
1. Open app on desktop browser → hub should fill ~40% of width
2. Open DevTools → Toggle device toolbar → iPhone 12 Pro
3. Refresh → hub should fill ~40% of width (smaller zoom)
4. Resize to ultra-wide → hub should fit height constraint
</manual>
<acceptance>
- All unit tests pass
- Desktop (1920x1080): zoom ~1.2, hub fills ~40% viewport
- Mobile portrait: zoom ~0.23, hub visible and centered
- Ultra-wide: zoom ~1.6, hub doesn't overflow vertically
- Zoom never exceeds 0.1-4.0 limits
</acceptance>
</verify>

<deliverables>
- src/lib/cameraUtils.ts
- src/lib/cameraUtils.test.ts
- package.json (vitest added)
</deliverables>
</task>

---

## Wave 2: Controls & Visual Polish

<task id="01-02-01" wave="2" depends_on="01-01-01">
<summary>Create CanvasControls component with glassmorphism styling</summary>

<context>
Build zoom controls toolbar with glassmorphism effect. Buttons: zoom in, zoom out,
reset to hub, fit to screen. Position: bottom-right corner. Style per TOKENS.md.
</context>

<requirements>CANVAS-02</requirements>

<actions>
1. Create `src/components/CanvasControls.tsx`:
   ```typescript
   import { useCallback } from 'react'
   import { Editor } from 'tldraw'
   import { ZOOM_MIN, ZOOM_MAX } from '@/types'
   import { calculateInitialZoom, getViewportDimensions } from '@/lib/cameraUtils'
   
   interface CanvasControlsProps {
     editor: Editor | null
     visible: boolean
   }
   
   export function CanvasControls({ editor, visible }: CanvasControlsProps) {
     const zoomIn = useCallback(() => {
       if (!editor) return
       const camera = editor.getCamera()
       const newZoom = Math.min(camera.z * 1.25, ZOOM_MAX)
       editor.setCamera({ z: newZoom }, { animation: { duration: 150 } })
     }, [editor])
     
     const zoomOut = useCallback(() => {
       if (!editor) return
       const camera = editor.getCamera()
       const newZoom = Math.max(camera.z / 1.25, ZOOM_MIN)
       editor.setCamera({ z: newZoom }, { animation: { duration: 150 } })
     }, [editor])
     
     const resetToHub = useCallback(() => {
       if (!editor) return
       const viewport = getViewportDimensions(editor)
       const zoom = calculateInitialZoom(viewport)
       editor.setCamera({ x: 0, y: 0, z: zoom }, { animation: { duration: 300 } })
     }, [editor])
     
     const fitToScreen = useCallback(() => {
       if (!editor) return
       // Fit entire bounds in view
       editor.zoomToFit({ animation: { duration: 300 } })
     }, [editor])
     
     return (
       <div 
         className="fixed bottom-4 right-4 flex gap-2 p-3 rounded-xl"
         style={{
           background: 'var(--glass-bg)',
           backdropFilter: 'blur(var(--glass-blur))',
           border: '1px solid var(--glass-border)',
           boxShadow: 'var(--glass-shadow)',
           opacity: visible ? 1 : 0,
           pointerEvents: visible ? 'auto' : 'none',
           transition: 'opacity 200ms var(--ease-out)',
         }}
       >
         <ControlButton onClick={zoomOut} title="Zoom out">−</ControlButton>
         <ControlButton onClick={zoomIn} title="Zoom in">+</ControlButton>
         <ControlButton onClick={resetToHub} title="Reset to hub">⌂</ControlButton>
         <ControlButton onClick={fitToScreen} title="Fit to screen">◻</ControlButton>
       </div>
     )
   }
   
   function ControlButton({ 
     onClick, 
     title, 
     children 
   }: { 
     onClick: () => void
     title: string
     children: React.ReactNode 
   }) {
     return (
       <button
         onClick={onClick}
         title={title}
         className="w-10 h-10 flex items-center justify-center rounded-lg text-lg font-medium"
         style={{
           background: 'transparent',
           color: 'var(--text-secondary)',
           transition: 'color 150ms, background 150ms',
         }}
         onMouseEnter={(e) => {
           e.currentTarget.style.color = 'var(--interactive-hover)'
           e.currentTarget.style.background = 'var(--interactive-bg-subtle)'
         }}
         onMouseLeave={(e) => {
           e.currentTarget.style.color = 'var(--text-secondary)'
           e.currentTarget.style.background = 'transparent'
         }}
       >
         {children}
       </button>
     )
   }
   ```
2. Wire into Canvas.tsx (will be done in integration)
</actions>

<verify>
<automated>npm run type-check</automated>
<manual>
1. Render CanvasControls with visible=true
2. Verify glassmorphism effect visible (blur, semi-transparent)
3. Hover buttons → mauve accent color appears
4. Click + → canvas zooms in (smooth animation)
5. Click − → canvas zooms out
6. Click ⌂ → camera returns to hub position
7. Click ◻ → camera fits all content
</manual>
<acceptance>
- Controls have glassmorphism styling matching TOKENS.md
- Buttons respond to hover with mauve accent
- Zoom in/out respects ZOOM_MIN/ZOOM_MAX limits
- Reset smoothly animates to hub (300ms)
- Controls positioned bottom-right, 16px from edges
</acceptance>
</verify>

<deliverables>
- src/components/CanvasControls.tsx
</deliverables>
</task>

<task id="01-02-02" wave="2" depends_on="01-02-01">
<summary>Implement contextual visibility for controls (fade in/out)</summary>

<context>
Controls fade in on mouse move or interaction, fade out after 3s inactivity.
Mobile: controls stay visible longer (5s). Use CSS transitions for smooth fades.
</context>

<requirements>CANVAS-05</requirements>

<actions>
1. Create `src/hooks/useControlsVisibility.ts`:
   ```typescript
   import { useState, useEffect, useCallback, useRef } from 'react'
   
   interface UseControlsVisibilityOptions {
     hideDelay?: number  // Desktop: 3000ms
     mobileHideDelay?: number  // Mobile: 5000ms
   }
   
   export function useControlsVisibility(options: UseControlsVisibilityOptions = {}) {
     const { hideDelay = 3000, mobileHideDelay = 5000 } = options
     const [visible, setVisible] = useState(true)
     const timeoutRef = useRef<NodeJS.Timeout>()
     const isMobile = typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches
     
     const showControls = useCallback(() => {
       setVisible(true)
       clearTimeout(timeoutRef.current)
       
       const delay = isMobile ? mobileHideDelay : hideDelay
       timeoutRef.current = setTimeout(() => {
         setVisible(false)
       }, delay)
     }, [hideDelay, mobileHideDelay, isMobile])
     
     useEffect(() => {
       // Show on initial load
       showControls()
       
       // Show on mouse move
       const handleMouseMove = () => showControls()
       const handleTouchStart = () => showControls()
       const handleWheel = () => showControls()
       const handleKeyDown = () => showControls()
       
       window.addEventListener('mousemove', handleMouseMove)
       window.addEventListener('touchstart', handleTouchStart)
       window.addEventListener('wheel', handleWheel)
       window.addEventListener('keydown', handleKeyDown)
       
       return () => {
         clearTimeout(timeoutRef.current)
         window.removeEventListener('mousemove', handleMouseMove)
         window.removeEventListener('touchstart', handleTouchStart)
         window.removeEventListener('wheel', handleWheel)
         window.removeEventListener('keydown', handleKeyDown)
       }
     }, [showControls])
     
     return { visible, showControls }
   }
   ```
2. Wire into Canvas component with CanvasControls
3. Test visibility behavior
</actions>

<verify>
<automated>npm run type-check</automated>
<manual>
1. Load page → controls visible
2. Wait 3+ seconds (no interaction) → controls fade out
3. Move mouse → controls fade back in
4. Scroll wheel → controls stay visible, timer resets
5. Press arrow key → controls stay visible
6. DevTools → Toggle device → Touch device → verify 5s delay
</manual>
<acceptance>
- Controls visible on page load
- Controls fade out after 3s inactivity (desktop)
- Controls fade out after 5s inactivity (mobile/touch)
- Any interaction (mouse, touch, scroll, key) resets timer
- Fade transition is smooth (200ms opacity)
</acceptance>
</verify>

<deliverables>
- src/hooks/useControlsVisibility.ts
</deliverables>
</task>

<task id="01-02-03" wave="2" depends_on="01-01-01">
<summary>Add fog overlay for canvas boundaries</summary>

<context>
Create gradient vignette that darkens toward canvas edges. Uses --canvas-fog color.
Indicates "edge of content" without hard visual stop. CSS-only implementation.
</context>

<requirements>CANVAS-05</requirements>

<actions>
1. Create `src/components/CanvasFogOverlay.tsx`:
   ```typescript
   export function CanvasFogOverlay() {
     return (
       <div 
         className="fixed inset-0 pointer-events-none"
         style={{
           background: `
             radial-gradient(
               ellipse 80% 80% at center,
               transparent 30%,
               var(--canvas-fog) 100%
             )
           `,
           zIndex: 1,
         }}
       />
     )
   }
   ```
2. Add to Canvas component, positioned above tldraw but below controls
3. Adjust gradient values for subtle effect
</actions>

<verify>
<automated>npm run type-check</automated>
<manual>
1. Zoom out to minimum (10%) → edges should darken
2. Pan to edge of canvas → fog visible at boundaries
3. Fog should not interfere with interactions (pointer-events: none)
4. Effect should be subtle, not distracting
</manual>
<acceptance>
- Fog overlay renders as radial gradient vignette
- Center of canvas is clear (transparent)
- Edges darken with --canvas-fog color
- No interference with canvas interactions
- Effect is subtle (not heavy/distracting)
</acceptance>
</verify>

<deliverables>
- src/components/CanvasFogOverlay.tsx
</deliverables>
</task>

---

## Wave 3: Integration & Verification

<task id="01-03-01" wave="3" depends_on="01-01-01,01-01-02,01-01-03,01-01-04,01-02-01,01-02-02,01-02-03">
<summary>Integrate all components into final Canvas implementation</summary>

<context>
Wire together: Canvas + CanvasLoader + CanvasControls + CanvasFogOverlay + all hooks.
Add double-click to reset. Ensure all features work together without conflicts.
</context>

<requirements>CANVAS-01, CANVAS-02, CANVAS-04, CANVAS-06</requirements>

<actions>
1. Update `src/components/Canvas.tsx` to integrate all features:
   ```typescript
   import { useState, useRef, useEffect, useCallback } from 'react'
   import { Tldraw, Editor } from 'tldraw'
   import 'tldraw/tldraw.css'
   import { CanvasLoader } from './CanvasLoader'
   import { CanvasControls } from './CanvasControls'
   import { CanvasFogOverlay } from './CanvasFogOverlay'
   import { useCameraState } from '@/hooks/useCameraState'
   import { useControlsVisibility } from '@/hooks/useControlsVisibility'
   import { calculateInitialZoom, getViewportDimensions } from '@/lib/cameraUtils'
   
   export function Canvas() {
     const [isReady, setIsReady] = useState(false)
     const editorRef = useRef<Editor | null>(null)
     const { visible } = useControlsVisibility()
     
     const handleMount = useCallback((editor: Editor) => {
       editorRef.current = editor
       requestAnimationFrame(() => {
         requestAnimationFrame(() => setIsReady(true))
       })
     }, [])
     
     // Camera persistence
     useCameraState(editorRef.current)
     
     // Arrow key navigation
     useArrowKeyNavigation(editorRef.current)
     
     // Double-click to reset
     const handleDoubleClick = useCallback(() => {
       const editor = editorRef.current
       if (!editor) return
       const viewport = getViewportDimensions(editor)
       const zoom = calculateInitialZoom(viewport)
       editor.setCamera({ x: 0, y: 0, z: zoom }, { animation: { duration: 300 } })
     }, [])
     
     return (
       <>
         {!isReady && <CanvasLoader />}
         <div 
           className="fixed inset-0"
           style={{
             opacity: isReady ? 1 : 0,
             transition: 'opacity 250ms var(--ease-out)',
           }}
           onDoubleClick={handleDoubleClick}
         >
           <Tldraw hideUi onMount={handleMount} />
           <CanvasFogOverlay />
         </div>
         {isReady && <CanvasControls editor={editorRef.current} visible={visible} />}
       </>
     )
   }
   ```
2. Update `src/App.tsx`:
   ```typescript
   import { Canvas } from '@/components/Canvas'
   
   export default function App() {
     return <Canvas />
   }
   ```
3. Test all features working together
</actions>

<verify>
<automated>npm run type-check &amp;&amp; npm run build</automated>
<manual>
1. Cold load → skeleton appears → canvas fades in
2. Drag canvas → pans smoothly
3. Scroll wheel → zooms smoothly
4. Arrow keys → pans with animation
5. Controls visible → fade out after 3s
6. Click + → zooms in
7. Click ⌂ → resets to hub
8. Double-click background → resets to hub
9. Refresh → camera position restored from localStorage
10. Clear localStorage → refresh → shows initial zoom
</manual>
<acceptance>
- All individual features work together without conflicts
- Loading → ready transition is smooth
- Camera persistence works across refreshes
- Controls visibility responds to all interaction types
- Double-click reset works
- No console errors or warnings
</acceptance>
</verify>

<deliverables>
- src/components/Canvas.tsx (final integrated version)
- src/App.tsx (updated)
</deliverables>
</task>

<task id="01-03-02" wave="3" depends_on="01-03-01">
<summary>Performance validation: 60 FPS during pan/zoom</summary>

<context>
Validate canvas maintains 60 FPS during interactions using Chrome DevTools.
Test on desktop and mobile. Document any performance issues found.
</context>

<requirements>CANVAS-05</requirements>

<actions>
1. Desktop performance test:
   - Open Chrome DevTools → Performance panel
   - Click Record
   - Pan canvas rapidly for 3 seconds
   - Zoom in/out rapidly for 3 seconds
   - Stop recording
   - Check FPS graph: should show consistent 60 FPS
   - Check for "Long Tasks" warnings (none expected)
2. Mobile performance test:
   - Connect mobile device via Chrome Remote Debugging
   - OR use DevTools → Performance → CPU throttling (4x slowdown)
   - Repeat pan/zoom tests
   - Verify FPS stays above 50 (acceptable on mobile)
3. Document results:
   - Create `src/lib/__tests__/performance.md`:
     ```markdown
     # Performance Validation
     
     ## Desktop (Chrome, MacBook Pro M2)
     - Pan: 60 FPS ✓
     - Zoom: 60 FPS ✓
     - No long tasks
     
     ## Mobile (iPhone 14, Safari)
     - Pan: 58-60 FPS ✓
     - Zoom: 55-60 FPS ✓
     - Acceptable performance
     ```
</actions>

<verify>
<automated>echo "Performance tests require manual DevTools validation"</automated>
<manual>
1. Chrome DevTools → Performance → Record 5s of interaction
2. Verify FPS graph shows ≥60 FPS during pan
3. Verify FPS graph shows ≥60 FPS during zoom
4. Verify no "Long Task" warnings (red bars)
5. Optional: Lighthouse performance audit score ≥90
</manual>
<acceptance>
- Desktop: consistent 60 FPS during pan/zoom
- Mobile (or throttled): ≥50 FPS during pan/zoom
- No "Long Task" warnings in Performance panel
- No memory leaks during continuous interaction
</acceptance>
</verify>

<deliverables>
- src/lib/__tests__/performance.md (validation results)
</deliverables>
</task>

<task id="01-03-03" wave="3" depends_on="01-03-01">
<summary>Touch gesture testing on mobile/tablet</summary>

<context>
Validate pinch-to-zoom and drag-to-pan work on touch devices.
Test on real device or using Chrome DevTools device emulation.
</context>

<requirements>CANVAS-03</requirements>

<actions>
1. Test with Chrome DevTools device emulation:
   - Toggle device toolbar (Cmd+Shift+M)
   - Select "iPhone 14 Pro" or "iPad Pro"
   - Enable touch simulation
   - Test single-finger drag → should pan
   - Test pinch gesture (Shift+drag) → should zoom
2. Test on real device (if available):
   - Deploy to local network or use ngrok
   - Open on mobile Safari/Chrome
   - Single-finger drag → canvas pans
   - Two-finger pinch → canvas zooms
   - Verify no conflicts with browser gestures
3. Document touch behavior:
   - Create test notes in performance.md
</actions>

<verify>
<automated>echo "Touch tests require device/emulation"</automated>
<manual>
1. DevTools device emulation → touch drag → canvas pans
2. DevTools device emulation → pinch gesture → canvas zooms
3. Real device (optional) → confirm same behavior
4. No conflicts with browser back gesture (edge swipe)
5. Controls remain visible 5s on touch device
</manual>
<acceptance>
- Single-finger drag pans canvas smoothly
- Two-finger pinch zooms canvas smoothly
- No conflicts with browser native gestures
- Controls visibility delay is 5s on touch devices
- Performance acceptable (≥50 FPS)
</acceptance>
</verify>

<deliverables>
- Updated src/lib/__tests__/performance.md with touch test results
</deliverables>
</task>

<task id="01-03-04" wave="3" depends_on="01-03-01,01-03-02,01-03-03">
<summary>Final requirement verification checklist</summary>

<context>
Walk through all Phase 1 requirements and verify each is implemented correctly.
Create verification checklist document. Fix any issues found.
</context>

<requirements>CANVAS-01, CANVAS-02, CANVAS-03, CANVAS-04, CANVAS-05, CANVAS-06, TECH-01, TECH-02, TECH-04, TECH-05</requirements>

<actions>
1. Create verification checklist in `.planning/phases/01-canvas-foundation/01-VERIFICATION.md`:
   ```markdown
   # Phase 1: Requirement Verification
   
   ## Canvas Requirements
   
   | ID | Requirement | Status | Notes |
   |----|-------------|--------|-------|
   | CANVAS-01 | Pan with mouse drag | ✓ | tldraw built-in |
   | CANVAS-02 | Zoom with scroll wheel | ✓ | tldraw built-in |
   | CANVAS-03 | Touch gestures (drag, pinch) | ✓ | tldraw built-in |
   | CANVAS-04 | Arrow key navigation | ✓ | Custom implementation |
   | CANVAS-05 | 60 FPS performance | ✓ | Validated via DevTools |
   | CANVAS-06 | Loading state | ✓ | Skeleton + fade transition |
   
   ## Technical Requirements
   
   | ID | Requirement | Status | Notes |
   |----|-------------|--------|-------|
   | TECH-01 | Vite + React 19 + TypeScript | ✓ | Project setup complete |
   | TECH-02 | tldraw 4.5 | ✓ | v4.5.3 installed |
   | TECH-04 | Static SPA deployment | ✓ | npm run build works |
   | TECH-05 | TypeScript types | ✓ | camera.ts, content.ts |
   
   ## CONTEXT.md Decisions
   
   | Decision | Implemented | Notes |
   |----------|-------------|-------|
   | Hub at 40% viewport | ✓ | calculateInitialZoom |
   | Fade-in 200-300ms | ✓ | 250ms transition |
   | localStorage persistence | ✓ | useCameraState hook |
   | Zoom limits 10%-400% | ✓ | ZOOM_MIN/ZOOM_MAX |
   | Controls fade after 3s | ✓ | useControlsVisibility |
   | Glassmorphism style | ✓ | CSS custom properties |
   | Fog overlay at edges | ✓ | CanvasFogOverlay |
   | Double-click reset | ✓ | Canvas onDoubleClick |
   ```
2. Walk through each item, test manually
3. Fix any issues found
4. Update checklist with final status
</actions>

<verify>
<automated>npm run type-check &amp;&amp; npm run build &amp;&amp; npm test</automated>
<manual>
1. Review verification checklist
2. Confirm all ✓ items actually work
3. Confirm no ✗ items remain
4. Run full test suite
5. Build production bundle successfully
</manual>
<acceptance>
- All 10 requirements verified and working
- All CONTEXT.md decisions implemented
- No TypeScript errors
- Production build succeeds
- All tests pass
</acceptance>
</verify>

<deliverables>
- .planning/phases/01-canvas-foundation/01-VERIFICATION.md
- Any bug fixes discovered during verification
</deliverables>
</task>

---

## Verification Commands

```bash
# Type checking
npm run type-check

# Unit tests
npm test

# Build
npm run build

# Dev server
npm run dev

# All checks
npm run type-check && npm run build && npm test
```

## Success Criteria

Phase 1 is complete when:

1. **Canvas Navigation**
   - [x] User can drag to pan (mouse)
   - [x] User can scroll to zoom
   - [x] User can use touch gestures (mobile)
   - [x] User can navigate with arrow keys

2. **Performance**
   - [x] 60 FPS during pan/zoom (desktop)
   - [x] ≥50 FPS on mobile

3. **User Experience**
   - [x] Loading skeleton appears before canvas ready
   - [x] Smooth fade transition (250ms)
   - [x] Camera position persists across sessions
   - [x] Controls appear on interaction, hide after 3s
   - [x] Double-click resets to hub

4. **Technical**
   - [x] TypeScript compiles without errors
   - [x] Production build succeeds
   - [x] All unit tests pass

## Output

After completion, create `.planning/phases/01-canvas-foundation/01-SUMMARY.md` with:
- What was built
- Key decisions made
- Files created/modified
- Any deviations from plan
- Lessons learned

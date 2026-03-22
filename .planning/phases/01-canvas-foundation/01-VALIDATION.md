# Phase 1: Validation Strategy

**Phase:** Canvas Foundation  
**Created:** 2026-03-22  
**Nyquist Status:** Enabled  

---

## Test Strategy Overview

### Testing Pyramid

```
           E2E Tests
          (3 tests)
         /          \
    Integration Tests
        (5 tests)
       /            \
      Unit Tests
      (12 tests)
```

### Coverage Targets

| Test Type | Target Coverage | Priority |
|-----------|-----------------|----------|
| Unit Tests | 80% | HIGH |
| Integration Tests | 60% | MEDIUM |
| E2E Tests | 100% of success criteria | HIGH |
| Performance Tests | Manual validation | HIGH |

---

## Unit Tests

### Camera Utilities (`src/lib/cameraUtils.test.ts`)

| Test Case | Input | Expected Output | Status |
|-----------|-------|-----------------|--------|
| Desktop 1920x1080 | `{width: 1920, height: 1080}` | `zoom ≈ 1.2` | Pending |
| Portrait mobile 375x812 | `{width: 375, height: 812}` | `zoom ≈ 0.23` | Pending |
| Ultra-wide 3440x1440 | `{width: 3440, height: 1440}` | `zoom ≈ 1.6` | Pending |
| Tiny viewport (clamp min) | `{width: 100, height: 50}` | `zoom = 0.1` | Pending |
| Huge viewport (clamp max) | `{width: 10000, height: 10000}` | `zoom = 4.0` | Pending |

```typescript
// src/lib/cameraUtils.test.ts
import { describe, it, expect } from 'vitest'
import { calculateInitialZoom } from './cameraUtils'

describe('calculateInitialZoom', () => {
  it('calculates correct zoom for desktop viewport', () => {
    const zoom = calculateInitialZoom({ width: 1920, height: 1080 })
    expect(zoom).toBeCloseTo(1.2, 1)
  })
  
  it('calculates correct zoom for portrait mobile', () => {
    const zoom = calculateInitialZoom({ width: 375, height: 812 })
    expect(zoom).toBeCloseTo(0.23, 1)
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

### LocalStorage Utilities (`src/lib/localStorageUtils.test.ts`)

| Test Case | Description | Status |
|-----------|-------------|--------|
| Save camera state | Saves {x, y, z, version} to localStorage | Pending |
| Load camera state | Returns saved state or null | Pending |
| Schema version mismatch | Clears cache, returns null | Pending |
| Invalid JSON | Returns null, no throw | Pending |
| Clear camera state | Removes key from localStorage | Pending |

```typescript
// src/lib/localStorageUtils.test.ts
import { describe, it, expect, beforeEach } from 'vitest'
import { saveCameraState, loadCameraState, clearCameraState } from './localStorageUtils'

describe('localStorageUtils', () => {
  beforeEach(() => {
    localStorage.clear()
  })
  
  it('saves and loads camera state', () => {
    saveCameraState({ x: 100, y: 200, z: 1.5 })
    const loaded = loadCameraState()
    expect(loaded).toEqual({ x: 100, y: 200, z: 1.5, version: 1 })
  })
  
  it('returns null for missing state', () => {
    const loaded = loadCameraState()
    expect(loaded).toBeNull()
  })
  
  it('clears cache on schema mismatch', () => {
    localStorage.setItem('illulachy-camera-state', JSON.stringify({ x: 0, y: 0, z: 1, version: 999 }))
    const loaded = loadCameraState()
    expect(loaded).toBeNull()
    expect(localStorage.getItem('illulachy-camera-state')).toBeNull()
  })
})
```

### Controls Visibility Hook (`src/hooks/useControlsVisibility.test.ts`)

| Test Case | Description | Status |
|-----------|-------------|--------|
| Initial visibility | Controls visible on mount | Pending |
| Fade out after delay | Hidden after 3s inactivity | Pending |
| Mouse move resets timer | Visible on mouse move | Pending |
| Touch event resets timer | Visible on touch | Pending |
| Mobile longer delay | 5s delay on touch devices | Pending |

---

## Integration Tests

### Canvas + Controls Integration

| Test Case | Description | Validation |
|-----------|-------------|------------|
| Controls zoom in | Click + button → camera z increases | Check editor.getCamera().z |
| Controls zoom out | Click - button → camera z decreases | Check editor.getCamera().z |
| Controls reset | Click ⌂ → camera at (0, 0, initialZoom) | Check camera position |
| Controls visibility | Move mouse → controls visible | Check DOM opacity |
| Controls hide | Wait 3s → controls hidden | Check DOM opacity |

### Canvas + Camera Persistence Integration

| Test Case | Description | Validation |
|-----------|-------------|------------|
| Save on pan | Pan canvas → state saved | Check localStorage |
| Restore on mount | Refresh page → position restored | Check camera position |
| First visit behavior | No localStorage → initial zoom | Check zoom calculation |

---

## E2E Tests (Manual Verification)

### Initial Load Flow

```
GIVEN   User visits page first time
WHEN    Page loads
THEN    Skeleton loader appears
AND     Canvas fades in (250ms)
AND     Hub is centered at 40% viewport
AND     Controls are visible
```

### Pan/Zoom Interactions

```
GIVEN   Canvas is loaded
WHEN    User drags with mouse
THEN    Canvas pans smoothly at 60 FPS

WHEN    User scrolls wheel
THEN    Canvas zooms smoothly at 60 FPS

WHEN    User presses arrow keys
THEN    Canvas pans with animation (150ms)

WHEN    User double-clicks background
THEN    Camera resets to hub (300ms animation)
```

### Controls Behavior

```
GIVEN   Canvas is loaded
WHEN    User is inactive for 3 seconds
THEN    Controls fade out

WHEN    User moves mouse
THEN    Controls fade back in

WHEN    User clicks zoom in button
THEN    Camera zoom increases by 25%
```

### Persistence

```
GIVEN   User has panned/zoomed canvas
WHEN    User refreshes page
THEN    Camera position is restored from localStorage

GIVEN   User clears localStorage
WHEN    User refreshes page
THEN    Camera shows initial view (hub at 40%)
```

---

## Performance Tests

### 60 FPS Validation Protocol

**Desktop Test:**
1. Open Chrome DevTools → Performance panel
2. Click Record
3. Pan canvas continuously for 5 seconds
4. Zoom in/out continuously for 5 seconds
5. Stop recording
6. Analyze results:
   - FPS graph should show consistent ≥60 FPS
   - No "Long Task" warnings (red bars)
   - Frame time should be ≤16.67ms

**Mobile Test:**
1. Enable CPU throttling (4x slowdown)
2. Repeat pan/zoom tests
3. FPS should stay ≥50

### Performance Metrics to Track

| Metric | Desktop Target | Mobile Target |
|--------|----------------|---------------|
| FPS during pan | ≥60 | ≥50 |
| FPS during zoom | ≥60 | ≥50 |
| Frame time | ≤16.67ms | ≤20ms |
| Long tasks | 0 | ≤2 |
| Memory growth | Stable | Stable |

---

## Automated Verification Commands

| Requirement | Command | Expected Result |
|-------------|---------|-----------------|
| TECH-01 | `npm run type-check` | Exit code 0, no errors |
| TECH-04 | `npm run build` | Exit code 0, dist/ created |
| TECH-05 | `npm run type-check` | All types compile |
| Unit tests | `npm test` | All tests pass |
| Lint | `npm run lint` | No errors (warnings OK) |

### CI Pipeline Commands

```bash
# Full validation suite
npm run type-check && npm run build && npm test

# Quick smoke test
npm run type-check && npm run build
```

---

## Requirement-to-Test Mapping

### CANVAS-01: Pan with mouse drag

**Validation:** Manual + tldraw built-in
- tldraw provides pan-on-drag out of box
- Manual verification: drag canvas → it pans

### CANVAS-02: Zoom with scroll wheel

**Validation:** Manual + tldraw built-in
- tldraw provides scroll-to-zoom out of box
- Manual verification: scroll → canvas zooms

### CANVAS-03: Touch gestures

**Validation:** Manual (device emulation or real device)
- tldraw provides touch support out of box
- Manual verification: pinch-to-zoom, drag-to-pan

### CANVAS-04: Arrow key navigation

**Validation:** Manual + unit test
- Custom implementation tested via useArrowKeyNavigation
- Manual verification: press arrows → canvas pans

### CANVAS-05: 60 FPS performance

**Validation:** Chrome DevTools Performance panel
- Record 5s of interaction
- Verify FPS ≥60 (desktop) or ≥50 (mobile)

### CANVAS-06: Loading state

**Validation:** Manual
- Hard refresh page
- Verify skeleton visible briefly
- Verify smooth fade transition

### TECH-01: Vite + React 19 + TypeScript

**Validation:** `npm run build`
- Successful build confirms stack works
- Check package.json versions

### TECH-02: tldraw 4.5

**Validation:** `npm list tldraw`
- Should show tldraw@4.5.3

### TECH-04: Static SPA deployment

**Validation:** `npm run build && ls dist/`
- dist/ contains index.html + assets
- Can be served by any static host

### TECH-05: TypeScript types

**Validation:** `npm run type-check`
- camera.ts and content.ts compile
- No any types in critical paths

---

## Fast Feedback Latency

| Test Type | Target Time | Actual |
|-----------|-------------|--------|
| Single unit test | < 500ms | TBD |
| All unit tests | < 3s | TBD |
| Type check | < 5s | TBD |
| Build | < 30s | TBD |
| Full CI pipeline | < 60s | TBD |

---

## Test File Locations

```
src/
├── lib/
│   ├── cameraUtils.ts
│   ├── cameraUtils.test.ts          ← Unit tests
│   ├── localStorageUtils.ts
│   ├── localStorageUtils.test.ts    ← Unit tests
│   └── __tests__/
│       └── performance.md           ← Manual test results
├── hooks/
│   ├── useControlsVisibility.ts
│   └── useControlsVisibility.test.ts ← Unit tests
└── components/
    └── __tests__/
        └── Canvas.integration.test.tsx ← Integration tests (optional)
```

---

## Test Infrastructure Setup

### Vitest Configuration

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

### Test Setup File

```typescript
// src/test/setup.ts
import '@testing-library/jest-dom'

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
global.localStorage = localStorageMock as any

// Mock matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})
```

---

## Definition of Done

Phase 1 validation is complete when:

- [ ] All unit tests written and passing
- [ ] Type check passes with no errors
- [ ] Production build succeeds
- [ ] 60 FPS validated via Chrome DevTools
- [ ] Touch gestures tested (emulation or device)
- [ ] All 10 requirements verified in checklist
- [ ] Performance.md documents test results
- [ ] No P0/P1 bugs remaining

---

*Validation strategy created: 2026-03-22*  
*Last updated: 2026-03-22*

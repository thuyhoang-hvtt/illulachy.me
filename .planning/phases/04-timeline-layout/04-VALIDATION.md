# Phase 04 Validation Architecture

**Phase:** 04-timeline-layout  
**Goal:** Timeline nodes are positioned chronologically with no overlaps  
**Created:** 2026-03-23

## Test Framework

**Framework:** Vitest v4.1.0 (already installed)  
**Test runner:** `npm test`  
**Coverage tool:** Vitest built-in coverage (c8)

## Phase Requirements → Test Mapping

| Requirement | Description | Test File | Test Type | Verification Method |
|-------------|-------------|-----------|-----------|---------------------|
| TIME-01 | Timeline extends left from hub | tests/layout.test.ts | Unit | Assert all node X coordinates are negative |
| TIME-02 | Chronological positioning | tests/layout.test.ts | Unit | Assert older dates have more negative X |
| TIME-03 | Recent entries closest to hub | tests/layout.test.ts | Unit | Assert newest date has X closest to 0 |
| TIME-04 | YouTube displays correctly | Manual (browser) | Integration | Visual verification with Phase 3 shapes |
| TIME-05 | Blog displays correctly | Manual (browser) | Integration | Visual verification with Phase 3 shapes |
| TIME-06 | Project displays correctly | Manual (browser) | Integration | Visual verification with Phase 3 shapes |
| TIME-07 | Milestone displays correctly | Manual (browser) | Integration | Visual verification with Phase 3 shapes |

## Sampling Rate (Nyquist Validation)

### Per-Task Validation
- **Every implementation task:** Must have corresponding test file created
- **TDD approach:** Tests written before implementation (test-first)
- **Coverage target:** 80%+ for algorithm files (dateUtils, sessionSeed, forceSimulation)

### Per-Wave Validation
- **Wave 1 (Plan 04-01):** 3 test files required
  - `tests/dateUtils.test.ts` — Date-to-X mapping logic
  - `tests/sessionSeed.test.ts` — Session seed persistence
  - `tests/layout.test.ts` — Integration test for TIME-01, TIME-02, TIME-03
- **Wave 2 (Plan 04-02):** 2 test files required
  - `tests/TimelineOverlay.test.tsx` — Component rendering tests
  - `tests/useViewportTransform.test.ts` — Hook behavior tests

### Phase Gate
- **All automated tests pass:** `npm test` exits with code 0
- **Manual verification checkpoint:** TIME-04 through TIME-07 verified in browser
- **Performance gate:** Canvas maintains 60 FPS during pan/zoom (Chrome DevTools measurement)
- **Visual regression:** Constellation layout matches expected aesthetic (manual QA)

## Wave 0 Gaps

**Plan 04-01 Task 0** creates test scaffolds:
- `tests/layout.test.ts` — Empty scaffold with `describe('positionTimelineNodes', () => {})`
- `tests/dateUtils.test.ts` — Empty scaffold with `describe('dateUtils', () => {})`
- `tests/sessionSeed.test.ts` — Empty scaffold with `describe('sessionSeed', () => {})`

These scaffolds will be populated during Tasks 1-4 (TDD implementation).

## Test Coverage by Plan

### Plan 04-01: Core Timeline Layout Algorithm

**Unit tests:**
1. **dateUtils.test.ts** (Task 1)
   - Date string → timestamp conversion
   - Timestamp → X coordinate mapping
   - Variable density calculation (pixels-per-day)
   - Edge cases: partial dates, invalid dates, year boundaries

2. **sessionSeed.test.ts** (Task 2)
   - Seed generation from Date.now()
   - localStorage persistence (24-hour TTL)
   - Seed retrieval and reuse within session
   - Fallback behavior (no localStorage, expired seed)

3. **layout.test.ts** (Tasks 3-4)
   - **TIME-01:** All positioned nodes have negative X
   - **TIME-02:** Node order matches date order (chronologically increasing)
   - **TIME-03:** Newest entry has X closest to 0 (least negative)
   - Collision detection: No two nodes overlap (150px+ minimum gap)
   - Deterministic output: Same seed → same positions
   - Physics convergence: Simulation reaches stable state

**Integration tests:**
- Canvas.tsx integration (existing pattern from Phase 3)
- positionNodes.ts maintains `PositionedNode[]` interface contract

**Manual verification (Task 5 checkpoint):**
- Visual inspection: Constellation scatter aesthetic
- Temporal clustering: Activity periods form visible clusters
- Session stability: Layout consistent within visit, varies between sessions
- Performance: 60 FPS maintained during canvas interactions

### Plan 04-02: Visual Timeline Axis

**Component tests:**
1. **TimelineOverlay.test.tsx** (Task 2)
   - SVG layer renders with correct viewBox
   - Horizontal axis line at y=0
   - Connector lines from nodes to axis
   - Fade effect near hub (opacity calculation)
   - pointerEvents: 'none' attribute

2. **useViewportTransform.test.ts** (Task 1)
   - Hook tracks camera state changes
   - Returns current x, y, zoom values
   - Updates on pan/zoom events
   - Debouncing behavior (if implemented)

**Integration tests:**
- Canvas.tsx renders TimelineOverlay
- Positioned nodes memoization (useMemo dependency array)
- Camera synchronization (viewBox updates)

**Manual verification (Task 4 checkpoint):**
- **TIME-04:** YouTube nodes display with thumbnail/play button
- **TIME-05:** Blog nodes display as document cards
- **TIME-06:** Project nodes display as code windows
- **TIME-07:** Milestone nodes display as achievement badges
- Visual axis visibility and fade effect
- Camera zoom scaling (lines maintain constant screen width)
- Connector lines align with node chronological positions

## Test Execution Commands

```bash
# Run all tests
npm test

# Run specific test file
npm test -- tests/layout.test.ts

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode (development)
npm test -- --watch
```

## Success Criteria

**Phase 04 is complete when:**
1. ✅ All unit tests pass (dateUtils, sessionSeed, layout)
2. ✅ All component tests pass (TimelineOverlay, useViewportTransform)
3. ✅ Integration tests pass (Canvas.tsx renders with new algorithm)
4. ✅ TIME-01 through TIME-03 verified via automated tests
5. ✅ TIME-04 through TIME-07 verified via manual browser testing
6. ✅ Performance gate: 60 FPS maintained (Chrome DevTools measurement)
7. ✅ Visual QA: Constellation aesthetic matches CONTEXT.md decisions
8. ✅ Session stability verified: Same layout within visit, variation between sessions

## Validation Files Created During Phase

**Plan 04-01:**
- `tests/layout.test.ts` (Wave 0 scaffold → populated in Tasks 1-4)
- `tests/dateUtils.test.ts` (Task 1)
- `tests/sessionSeed.test.ts` (Task 2)

**Plan 04-02:**
- `tests/TimelineOverlay.test.tsx` (Task 2)
- `tests/useViewportTransform.test.ts` (Task 1)

**Total test files:** 5 (3 from Plan 01, 2 from Plan 02)

---

*Phase: 04-timeline-layout*  
*Validation architecture: Nyquist sampling with TDD + manual verification checkpoints*  
*Created: 2026-03-23*

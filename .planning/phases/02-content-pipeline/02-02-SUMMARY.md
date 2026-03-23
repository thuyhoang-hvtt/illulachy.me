---
phase: 02-content-pipeline
plan: 02
subsystem: content-pipeline
type: summary
tags:
  - vite
  - content-generation
  - watch-mode
  - sample-data
dependency_graph:
  requires:
    - 02-01
  provides:
    - vite-plugin-timeline
    - sample-content-files
    - runtime-timeline-access
  affects:
    - build-process
    - dev-workflow
tech_stack:
  added:
    - chokidar (file watching)
  patterns:
    - Vite plugin hooks (buildStart, configureServer)
    - File watcher with debouncing
    - HMR integration with full-reload
key_files:
  created:
    - src/vite-plugin-timeline.ts
    - content/2020/graduated-university.md
    - content/2021/first-project.md
    - content/2022/portfolio-redesign.md
    - content/2022/learning-react.md
    - content/2023/tldraw-discovery.md
    - content/2023/first-youtube-video.md
    - content/2023/building-in-public.md
    - content/2024/canvas-timeline-idea.md
    - content/2024/deep-dive-typescript.md
    - content/2024/illulachy-launch.md
    - content/2024/year-in-review.md
    - content/2024/draft-webgpu-post.md
  modified:
    - vite.config.ts
    - package.json
    - package-lock.json
    - public/timeline.json
decisions:
  - Vite plugin watches content/**/*.md with 100ms debounce for stability
  - Full page reload on content changes (simple, reliable for development)
  - Error messages sent via HMR error channel for dev visibility
  - timeline.json committed to git (not gitignored) per CONTEXT.md requirement
metrics:
  duration: 5 minutes
  tasks_completed: 3
  files_created: 16
  commits: 3
  completed: "2026-03-23T03:28:31Z"
---

# Phase 02 Plan 02: Vite Integration & Sample Content Summary

**One-liner:** Vite plugin with auto-regeneration on content changes, 12 sample entries (11 published + 1 draft) spanning 2020-2024 across all 4 content types.

## Overview

Completed integration of the content pipeline into the Vite build process with live file watching and hot module reload. Created comprehensive sample content spanning 5 years across all 4 content types for testing the timeline visualization in Phase 3.

## What Was Built

### 1. Vite Plugin for Timeline Generation (Task 1)

**File:** `src/vite-plugin-timeline.ts`

Created a Vite plugin that integrates timeline generation into both build and development workflows:

- **buildStart hook:** Runs `npm run generate-timeline` before bundling begins
- **configureServer hook:** Watches `content/**/*.md` files during development
- **Hot reload integration:** Triggers full page reload when content changes
- **Error handling:** Sends build errors via HMR error channel for dev feedback
- **File watching:** Uses chokidar with 100ms debounce for stability

**Integration:**
- Added plugin to `vite.config.ts` alongside React plugin
- Installed `chokidar` dependency for robust file watching
- Plugin logs timeline generation events to console

**Verification:**
```bash
npm run build  # Shows "[Timeline Plugin] Generating timeline.json..."
npm run dev    # Watches content/ and auto-regenerates on changes
```

### 2. Sample Content Entries (Task 2)

Created 12 markdown files organized by year (2020-2024):

**Milestones (2):**
- `2020/graduated-university.md` - Bachelor of Computer Science
- `2021/first-project.md` - First professional role

**Projects (3):**
- `2022/portfolio-redesign.md` - React/TypeScript/Tailwind portfolio
- `2022/learning-react.md` - React practice projects
- `2024/illulachy-launch.md` - Infinite canvas portfolio site

**Blog Posts (4):**
- `2023/tldraw-discovery.md` - First impressions of tldraw
- `2024/deep-dive-typescript.md` - TypeScript generics
- `2024/year-in-review.md` - 2023 year in review
- `2024/draft-webgpu-post.md` - Draft blog post (filtered out)

**YouTube Videos (3):**
- `2023/first-youtube-video.md` - Starting YouTube journey
- `2023/building-in-public.md` - Transparent development philosophy
- `2024/canvas-timeline-idea.md` - Infinite canvas portfolio concept

**Coverage:**
- 5 years of content (2020-2024)
- All 4 content types represented
- Mix of technical and milestone entries
- 1 draft entry to verify filtering works

### 3. Timeline JSON Generation (Task 3)

**Output:** `public/timeline.json`

Generated timeline data from sample content:

```json
{
  "nodes": [
    {
      "id": "graduated-university",
      "type": "milestone",
      "title": "Graduated from University",
      "date": "2020-05-01T00:00:00.000Z",
      "description": "Bachelor of Science in Computer Science",
      "institution": "University of Technology"
    },
    // ... 10 more entries
  ],
  "lastUpdated": "2026-03-23T03:25:25.771Z"
}
```

**Validation Results:**
- ✓ 11 published entries (12 files - 1 draft)
- ✓ Chronologically sorted (2020-05-01 to 2024-03-15)
- ✓ All 4 types present: milestone, project, blog, youtube
- ✓ ISO 8601 date format
- ✓ Draft entry excluded
- ✓ Type-specific fields preserved (institution, tech, thumbnail, url)

**Runtime Access:**
```bash
# Dev server serves /timeline.json
curl http://localhost:5173/timeline.json

# Production build includes timeline.json in dist/
```

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 1 - Bug] Fixed TypeScript verbatimModuleSyntax error**
- **Found during:** Task 1 - First build attempt
- **Issue:** Vite Plugin type import failed with "must be imported using a type-only import when 'verbatimModuleSyntax' is enabled"
- **Fix:** Changed `import { Plugin }` to `import type { Plugin }`
- **Files modified:** `src/vite-plugin-timeline.ts`
- **Commit:** 5df18e5

**2. [Rule 1 - Bug] Fixed HMR error message type mismatch**
- **Found during:** Task 1 - First build attempt
- **Issue:** TypeScript error on `server.ws.send()` - missing required `stack` property in error object
- **Fix:** Enhanced error handling to create proper Error object with stack trace
- **Files modified:** `src/vite-plugin-timeline.ts`
- **Commit:** 5df18e5

Both fixes were required for TypeScript compilation to succeed and were critical for task completion.

## Key Decisions

1. **Full page reload on content changes:** Chose full-reload over selective HMR for simplicity and reliability during development. Timeline visualization will likely need full re-render anyway.

2. **100ms debounce on file watching:** Prevents multiple regenerations during rapid file saves (editor auto-save, multi-file operations).

3. **timeline.json committed to git:** Per CONTEXT.md requirement, timeline.json is version-controlled rather than gitignored. This provides reproducible builds and allows testing without running the generator.

4. **Realistic sample data:** Created sample content with actual years, descriptions, and URLs to provide realistic test data for Phase 3 timeline visualization.

## Testing & Verification

### Automated Tests

1. **Build integration:**
   ```bash
   npm run build 2>&1 | grep "[Timeline Plugin]"
   # Output: [Timeline Plugin] Generating timeline.json...
   ```

2. **File count verification:**
   ```bash
   find content -name "*.md" | wc -l
   # Output: 12
   ```

3. **Timeline validation:**
   ```bash
   node -e "const d=require('./public/timeline.json'); \
     if(d.nodes.length !== 11) throw new Error('Expected 11 nodes'); \
     if(!d.nodes.every(n => n.date.match(/^\d{4}-\d{2}-\d{2}T/))) \
       throw new Error('Invalid date format'); \
     console.log('✓ timeline.json valid')"
   # Output: ✓ timeline.json valid
   ```

4. **Type distribution:**
   ```bash
   cat public/timeline.json | jq '.nodes | map(.type) | unique'
   # Output: ["blog", "milestone", "project", "youtube"]
   ```

5. **Draft filtering:**
   ```bash
   cat public/timeline.json | jq '.nodes[].title' | grep "WebGPU"
   # Output: (empty - draft correctly filtered out)
   ```

### Manual Verification

- ✓ Vite dev server starts without errors
- ✓ timeline.json accessible at `/timeline.json` during dev
- ✓ Build completes successfully
- ✓ Timeline generation logs visible in console
- ✓ Content files organized by year in intuitive structure

## Requirements Fulfilled

**From REQUIREMENTS.md:**

- **CONTENT-05:** ✅ Vite plugin watches content directory and regenerates timeline.json on changes
  - buildStart hook runs generator before bundling
  - configureServer hook watches content/**/*.md with chokidar
  - File changes trigger regeneration + HMR full-reload

**Must-Have Truths (from PLAN.md):**

- ✅ Vite plugin regenerates timeline.json on content file changes
- ✅ `npm run dev` watches content directory and auto-rebuilds
- ✅ `npm run build` generates timeline.json before Vite build
- ✅ 12 sample markdown entries exist
- ✅ Sample content spans all 4 types (youtube, blog, project, milestone)
- ✅ Timeline JSON loads at runtime via fetch('/timeline.json')

**Must-Have Artifacts:**

- ✅ `src/vite-plugin-timeline.ts` (53 lines, exports timelinePlugin)
- ✅ `public/timeline.json` (contains "nodes" array with 11 entries)
- ✅ `content/2024/canvas-timeline-idea.md` (type: youtube)

**Key Links:**

- ✅ vite.config.ts imports and uses timelinePlugin()
- ✅ Plugin spawns `npm run generate-timeline` in buildStart and watch handlers

## Performance Metrics

- **Duration:** 5 minutes 1 second
- **Tasks completed:** 3/3
- **Files created:** 16 (1 plugin + 12 content + 1 timeline + 2 config)
- **Commits:** 3 (atomic per task)
- **Auto-fixes:** 2 TypeScript compilation errors

## Next Steps

**Immediate:**
- Phase 3 (Timeline Shapes) can now fetch `/timeline.json` at runtime
- Sample content provides realistic test data for layout algorithms
- Dev workflow ready: edit content → see timeline update in browser

**Future Enhancements (out of scope for v1):**
- Selective HMR for timeline updates (avoid full page reload)
- Content validation in watch mode (warn on invalid frontmatter)
- Incremental timeline generation (only re-parse changed files)
- Timeline.json schema validation in CI/CD

## Self-Check: PASSED

**Files exist:**
```bash
✓ FOUND: src/vite-plugin-timeline.ts
✓ FOUND: vite.config.ts
✓ FOUND: content/2020/graduated-university.md
✓ FOUND: content/2021/first-project.md
✓ FOUND: content/2022/portfolio-redesign.md
✓ FOUND: content/2022/learning-react.md
✓ FOUND: content/2023/tldraw-discovery.md
✓ FOUND: content/2023/first-youtube-video.md
✓ FOUND: content/2023/building-in-public.md
✓ FOUND: content/2024/canvas-timeline-idea.md
✓ FOUND: content/2024/deep-dive-typescript.md
✓ FOUND: content/2024/illulachy-launch.md
✓ FOUND: content/2024/year-in-review.md
✓ FOUND: content/2024/draft-webgpu-post.md
✓ FOUND: public/timeline.json
```

**Commits exist:**
```bash
✓ FOUND: 5df18e5 (Task 1: Vite plugin)
✓ FOUND: 8efdeda (Task 2: Sample content)
✓ FOUND: 509db29 (Task 3: Timeline generation)
```

**Timeline content:**
```bash
✓ 11 nodes in timeline.json
✓ 4 unique types (milestone, project, blog, youtube)
✓ Chronologically sorted (2020 → 2024)
✓ Draft excluded
✓ ISO 8601 dates
```

All artifacts created, all commits recorded, all verification checks passed.

---

**Summary:** Successfully integrated content pipeline into Vite with watch mode and HMR. Created comprehensive sample content spanning 5 years and 4 content types. Timeline.json generated, validated, and committed. Developer workflow complete: edit markdown → see timeline update. Ready for Phase 3 (Timeline Shapes).

---
phase: 07-monorepo-scaffold
plan: "01"
subsystem: monorepo-infrastructure
tags: [turborepo, pnpm, monorepo, scaffold, portfolio]
dependency_graph:
  requires: []
  provides:
    - monorepo-root-config
    - pnpm-workspace
    - turborepo-task-graph
    - portfolio-at-apps-portfolio
  affects:
    - all-subsequent-v1.1-phases
tech_stack:
  added:
    - turbo@2.8.21
    - pnpm-workspace.yaml
  patterns:
    - Turborepo v2 task graph (tasks key, not pipeline)
    - pnpm strict mode with onlyBuiltDependencies
    - git mv for history-preserving file moves
key_files:
  created:
    - pnpm-workspace.yaml
    - turbo.json
    - .npmrc
    - apps/portfolio/package.json
    - pnpm-lock.yaml
  modified:
    - package.json (replaced vite-project-temp with illulachy-me monorepo root)
    - .gitignore (added .turbo)
    - apps/portfolio/src/vite-plugin-timeline.ts (REPO_ROOT path fix, pnpm spawn)
    - scripts/generate-timeline.ts (output paths to apps/portfolio/public/, type import paths)
    - apps/portfolio/src/lib/physics.ts (unused ROTATION_SPEED destructuring removed)
decisions:
  - Used turbo.json v2 tasks key (not pipeline) per Turborepo 2.x spec
  - Added onlyBuiltDependencies for fsevents and esbuild to prevent lifecycle script errors
  - REPO_ROOT computed as 3-levels-up from apps/portfolio/src/ for content path resolution
  - Generate-timeline type imports updated to apps/portfolio/src/types/ (not a shared package yet)
metrics:
  duration: 3 minutes
  completed: "2026-03-29"
  tasks_completed: 2
  files_modified: 8
---

# Phase 7 Plan 01: Monorepo Scaffold — Root Config and Portfolio Migration Summary

**One-liner:** Turborepo + pnpm monorepo root established with portfolio migrated to apps/portfolio/ via git mv, all paths fixed, and turbo build pipeline verified end-to-end.

## What Was Done

Created the Turborepo + pnpm workspaces monorepo foundation. The existing portfolio app (previously at repo root) was moved to `apps/portfolio/` using `git mv` to preserve full git history.

**Task 1: Monorepo root config and git mv**

- Removed `node_modules/` and `package-lock.json` (npm artifacts)
- Created `apps/` and `packages/` directories
- Moved all portfolio source files to `apps/portfolio/` via `git mv` (83 files)
- Created `pnpm-workspace.yaml` declaring `apps/*` and `packages/*` workspace packages
- Created `turbo.json` v2 with `tasks` key (build/dev/lint/test task graph)
- Replaced root `package.json` (was `vite-project-temp`) with monorepo root (`illulachy-me`)
- Created `apps/portfolio/package.json` named `@illu/portfolio` with all original deps
- Created `.npmrc` with pnpm 10 strict mode config
- Appended `.turbo` to `.gitignore`
- Ran `pnpm install` successfully (no phantom dep errors)

**Task 2: Fix broken path references**

- Rewrote `apps/portfolio/src/vite-plugin-timeline.ts`:
  - Added `fileURLToPath` and `path` imports for ESM `__dirname` computation
  - Added `REPO_ROOT = path.resolve(__dirname, '../../..')` (3 levels up from `apps/portfolio/src/`)
  - Changed `chokidar.watch('content/**/*.md')` to absolute path via `CONTENT_GLOB`
  - Changed `spawn('npm', ...)` to `spawn('pnpm', ...)` with `cwd: REPO_ROOT`
- Updated `scripts/generate-timeline.ts`:
  - Changed output paths from `public/` to `apps/portfolio/public/`
  - Fixed type imports from `../src/types/` to `../apps/portfolio/src/types/`

## Acceptance Criteria Met

- pnpm-workspace.yaml contains `"apps/*"` and `"packages/*"` — YES
- turbo.json contains `"tasks"` key (NOT `"pipeline"`) — YES
- turbo.json contains build/dev/lint/test task entries — YES
- Root package.json `"name"` is `"illulachy-me"` and `"private"` is `true` — YES
- Root package.json `"packageManager"` is `"pnpm@10.17.1"` — YES
- Root package.json `"devDependencies"` contains `"turbo"` — YES
- Root package.json `"pnpm"` object contains `"onlyBuiltDependencies"` with `"fsevents"` and `"esbuild"` — YES
- apps/portfolio/package.json `"name"` is `"@illu/portfolio"` — YES
- apps/portfolio/package.json `"dependencies"` contains konva, react, react-konva, zod, gray-matter — YES
- apps/portfolio/src/main.tsx exists (git mv preserved) — YES
- apps/portfolio/tests/ directory contains test files — YES
- .gitignore contains `.turbo` — YES
- .npmrc file exists — YES
- No `package-lock.json` at repo root — YES
- `pnpm-lock.yaml` exists at repo root — YES
- `pnpm install` from repo root exits 0 — YES
- vite-plugin-timeline.ts contains `import { fileURLToPath } from 'url'` — YES
- vite-plugin-timeline.ts contains `const REPO_ROOT = path.resolve(__dirname, '../../..')` — YES
- vite-plugin-timeline.ts contains `const CONTENT_GLOB = path.join(REPO_ROOT, 'content'` — YES
- vite-plugin-timeline.ts contains `spawn('pnpm'` — YES
- vite-plugin-timeline.ts contains `cwd: REPO_ROOT` — YES
- scripts/generate-timeline.ts contains `apps/portfolio/public/timeline.json` — YES
- scripts/generate-timeline.ts contains `apps/portfolio/public/about.json` — YES
- `pnpm run generate-timeline` exits 0 — YES
- apps/portfolio/public/timeline.json exists after generate — YES
- apps/portfolio/public/about.json exists after generate — YES
- `pnpm --filter @illu/portfolio build` exits 0 — YES
- apps/portfolio/dist/index.html exists after build — YES
- `pnpm build` from root (via turbo) succeeds — YES

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking] Fixed broken type import paths in generate-timeline.ts**
- **Found during:** Task 2
- **Issue:** `scripts/generate-timeline.ts` imported types via `../src/types/content.js` and `../src/types/about.js` — these pointed to the old root `src/` which no longer exists after git mv
- **Fix:** Updated to `../apps/portfolio/src/types/content.js` and `../apps/portfolio/src/types/about.js`
- **Files modified:** `scripts/generate-timeline.ts`
- **Commit:** fd096f5

**2. [Rule 1 - Bug] Removed unused ROTATION_SPEED from physics.ts destructuring**
- **Found during:** Task 2 (tsc -b compilation)
- **Issue:** `ROTATION_SPEED` was destructured from `PHYSICS_CONSTANTS` but never used in the function body (rotation uses instant `lerpAngle` with `t=1` instead). TypeScript's `noUnusedLocals: true` failed the build.
- **Fix:** Removed `ROTATION_SPEED` from the destructuring statement
- **Files modified:** `apps/portfolio/src/lib/physics.ts`
- **Commit:** fd096f5

**3. [Rule 3 - Blocking] Node.js version required for Vite 8 / rolldown**
- **Found during:** Task 2 first build attempt
- **Issue:** Vite 8 uses rolldown which requires Node.js 20.19+ or 22.12+. System default was Node 20.12.2. The rolldown native binding for darwin-arm64 was not downloaded initially.
- **Fix:** Switched to Node 22.19.0 (available via nvm) and re-ran `pnpm install` to fetch the missing platform binary. Build succeeded with Node 22.
- **Impact:** Users must use Node 22+ to build this project. Recommend adding `.nvmrc` with `22` in follow-up.
- **Files modified:** None (runtime environment fix)

## Known Stubs

None — all data flows are wired. `apps/portfolio/public/timeline.json` and `apps/portfolio/public/about.json` are generated from real content files.

## Deferred Issues

**Pre-existing test failures (5 tests)** — NOT caused by this migration:
- `tests/physics.test.ts`: rotation assertion expects gradual lerp but implementation uses instant rotation (`t=1`)
- `tests/useViewportTransform.test.ts` (3 tests): Konva Stage mock missing `scaleX` method
- `tests/useSpaceshipPhysics.test.ts`: Same Konva mock issue

See `.planning/phases/07-monorepo-scaffold/deferred-items.md` for details.

## Self-Check: PASSED

- pnpm-workspace.yaml: FOUND
- turbo.json: FOUND
- apps/portfolio/package.json: FOUND
- apps/portfolio/src/main.tsx: FOUND
- apps/portfolio/dist/index.html: FOUND
- apps/portfolio/public/timeline.json: FOUND
- apps/portfolio/public/about.json: FOUND
- pnpm-lock.yaml: FOUND
- Commit 33468a8: FOUND (Task 1)
- Commit fd096f5: FOUND (Task 2)

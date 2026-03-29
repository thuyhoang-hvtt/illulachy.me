---
phase: 07-monorepo-scaffold
plan: "02"
subsystem: content-package
tags: [content-package, astro, blog, url-migration, workspace]
dependency_graph:
  requires: [monorepo-root-config, pnpm-workspace, portfolio-at-apps-portfolio]
  provides:
    - illu-content-package
    - astro-blog-placeholder
    - url-migration-complete
  affects:
    - apps/portfolio
    - apps/blog
    - packages/content
tech_stack:
  added:
    - astro@6.x (blog placeholder)
    - "@illu/content (JIT shared package)"
  patterns:
    - JIT package exports (exports .ts source directly, no build step)
    - Proxy re-export files for backward-compatible type access
    - Absolute path resolution via __dirname + fileURLToPath in Node scripts
key_files:
  created:
    - packages/content/package.json
    - packages/content/tsconfig.json
    - packages/content/src/index.ts
    - packages/content/src/types/content.ts
    - packages/content/src/types/about.ts
    - packages/content/scripts/generate-timeline.ts
    - packages/content/scripts/generate-timeline.test.ts
    - packages/content/content/ (moved from root content/)
    - apps/portfolio/src/types/content.ts (proxy re-export)
    - apps/portfolio/src/types/about.ts (proxy re-export)
    - apps/blog/package.json
    - apps/blog/astro.config.ts
    - apps/blog/tsconfig.json
    - apps/blog/src/pages/index.astro
  modified:
    - apps/portfolio/package.json (added @illu/content workspace:*, removed fast-glob/gray-matter)
    - apps/portfolio/src/types/index.ts (wildcard re-exports through proxy files)
    - apps/portfolio/src/vite-plugin-timeline.ts (new content glob path, pnpm --filter invocation)
    - apps/portfolio/tsconfig.app.json (added @illu/content path alias)
    - apps/portfolio/tests/fixtures/content/valid/sample-blog.md (URL updated)
    - package.json (updated generate-timeline script, removed tsx devDep)
    - pnpm-lock.yaml (added Astro + @illu/content)
    - packages/content/content/2023/tldraw-discovery.md
    - packages/content/content/2024/deep-dive-typescript.md
    - packages/content/content/2024/draft-webgpu-post.md
    - packages/content/content/2024/year-in-review.md
decisions:
  - Proxy re-export files kept in apps/portfolio/src/types/ so 8+ importing files don't need path changes
  - tsconfig path alias added for @illu/content so TypeScript resolves JIT package source
  - generate-timeline.test.ts updated to use absolute REPO_ROOT paths for fixture resolution after move from scripts/ to packages/content/scripts/
  - Test fixture sample-blog.md URL updated alongside source content files (MONO-05 scope)
metrics:
  duration: 12 minutes
  completed: "2026-03-29"
  tasks_completed: 2
  files_modified: 22
---

# Phase 7 Plan 02: @illu/content Package and Blog Placeholder Summary

**One-liner:** @illu/content JIT package created with shared types and generate-timeline script, Astro blog placeholder scaffolded at apps/blog/, and all letters.illulachy.me references migrated to writing.illulachy.me.

## What Was Done

Completed the monorepo architecture by extracting shared content infrastructure into `@illu/content` and scaffolding the Astro blog placeholder.

### Task 1: Create @illu/content Package

- Created `packages/content/` with `package.json` (name: `@illu/content`, JIT exports pattern)
- Moved `ContentNode`, `TimelineData`, `ContentType` from `apps/portfolio/src/types/content.ts` to `packages/content/src/types/content.ts`
- Moved `aboutSchema`, `AboutData` from `apps/portfolio/src/types/about.ts` to `packages/content/src/types/about.ts`
- Created `packages/content/src/index.ts` exporting all shared types
- Moved `scripts/generate-timeline.ts` and test to `packages/content/scripts/`
- Moved `content/` directory (13 markdown files) to `packages/content/content/`
- Updated generate-timeline.ts to use `PACKAGE_ROOT`/`REPO_ROOT` absolute paths
- Added `@illu/content` workspace:* dependency to portfolio
- Added `@illu/content` path alias to `apps/portfolio/tsconfig.app.json`
- Created proxy re-export files (`apps/portfolio/src/types/content.ts`, `about.ts`) so 8+ portfolio components don't need import path changes
- Updated `vite-plugin-timeline.ts`: new content glob path (`packages/content/content/`), `pnpm --filter @illu/content` invocation
- Removed `fast-glob`, `gray-matter` from portfolio deps; removed `tsx` from root devDeps

### Task 2: Scaffold Blog Placeholder and URL Migration

- Created `apps/blog/` with Astro package.json (`@illu/blog`)
- Created `apps/blog/astro.config.ts` with `site: 'https://writing.illulachy.me'`
- Created `apps/blog/tsconfig.json` extending `astro/tsconfigs/strict`
- Created `apps/blog/src/pages/index.astro` (Coming soon placeholder)
- Updated 4 content files replacing `letters.illulachy.me` with `writing.illulachy.me`
- Updated test fixture `sample-blog.md` and test expectation to match new URL
- Fixed `generate-timeline.test.ts` to use `REPO_ROOT`-relative fixture paths (broken after script moved from `scripts/` to `packages/content/scripts/`)
- Regenerated `timeline.json` with updated URLs

## Acceptance Criteria Met

- packages/content/package.json `"name"` is `"@illu/content"` and `"private"` is `true` — YES
- packages/content/package.json `"exports"` has `".": "./src/index.ts"` (JIT pattern) — YES
- packages/content/package.json `"dependencies"` contains `fast-glob`, `gray-matter`, `zod` — YES
- packages/content/src/index.ts contains `export type { ContentNode, TimelineData }` — YES
- packages/content/src/index.ts contains `export { aboutSchema` — YES
- packages/content/src/types/content.ts contains `export interface ContentNode` — YES
- packages/content/src/types/about.ts contains `export const aboutSchema` — YES
- packages/content/scripts/generate-timeline.ts contains `PACKAGE_ROOT` — YES
- packages/content/scripts/generate-timeline.ts contains `apps/portfolio/public` in output path — YES
- packages/content/content/about.md exists — YES
- packages/content/content/2024/ directory exists — YES
- No `content/` directory at repo root — YES
- No `scripts/` directory at repo root — YES
- apps/portfolio/package.json contains `"@illu/content": "workspace:*"` — YES
- apps/portfolio/src/types/index.ts re-exports from content and about (via proxy files) — YES
- apps/portfolio/src/vite-plugin-timeline.ts contains `packages/content/content` in glob — YES
- apps/portfolio/src/vite-plugin-timeline.ts contains `--filter` and `@illu/content` — YES
- `pnpm --filter @illu/content generate-timeline` exits 0 — YES
- `pnpm --filter @illu/portfolio build` exits 0 — YES
- apps/portfolio/public/timeline.json exists after generation — YES
- apps/blog/package.json `"name"` is `"@illu/blog"` and `"private"` is `true` — YES
- apps/blog/package.json contains `"@illu/content": "workspace:*"` and `"astro"` — YES
- apps/blog/astro.config.ts contains `site: 'https://writing.illulachy.me'` — YES
- apps/blog/tsconfig.json contains `"extends": "astro/tsconfigs/strict"` — YES
- apps/blog/src/pages/index.astro contains `Coming soon` — YES
- `pnpm --filter @illu/blog build` exits 0 — YES
- All 4 content files updated to `writing.illulachy.me` — YES
- `grep -r "letters.illulachy.me" packages/ apps/ --exclude-dir=dist` returns no matches — YES
- `pnpm build` from repo root exits 0 (both portfolio and blog) — YES
- apps/portfolio/dist/index.html exists — YES
- apps/blog/dist/index.html exists — YES

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing Critical Functionality] Added tsconfig path alias for @illu/content**
- **Found during:** Task 1 (portfolio build attempt after package creation)
- **Issue:** TypeScript couldn't resolve `@illu/content` imports — the JIT package exports `.ts` source but tsconfig had no mapping to find it
- **Fix:** Added `"@illu/content": ["../../packages/content/src/index.ts"]` to `apps/portfolio/tsconfig.app.json` paths
- **Files modified:** `apps/portfolio/tsconfig.app.json`
- **Commit:** 4b5cd9d

**2. [Rule 2 - Missing Critical Functionality] Created proxy re-export files for portfolio types**
- **Found during:** Task 1 (tsc revealed 6 files importing `@/types/content` and `@/types/about` directly)
- **Issue:** 8+ portfolio source files import from `@/types/content` and `@/types/about` as specific module paths — moving these files to the content package broke all those imports
- **Fix:** Created thin proxy re-export files at `apps/portfolio/src/types/content.ts` and `apps/portfolio/src/types/about.ts` that re-export everything from `@illu/content`
- **Files modified:** `apps/portfolio/src/types/content.ts`, `apps/portfolio/src/types/about.ts`, `apps/portfolio/src/types/index.ts`
- **Commit:** 4b5cd9d

**3. [Rule 1 - Bug] Fixed generate-timeline.test.ts broken fixture paths**
- **Found during:** Task 2 (test path review after script moved from `scripts/` to `packages/content/scripts/`)
- **Issue:** Test used relative paths like `'tests/fixtures/...'` that resolved from CWD — after moving to `packages/content/scripts/`, these paths no longer resolve to `apps/portfolio/tests/fixtures/`
- **Fix:** Updated test file to compute `REPO_ROOT` via `fileURLToPath`/`__dirname` pattern and use absolute fixture paths
- **Files modified:** `packages/content/scripts/generate-timeline.test.ts`
- **Commit:** 3186855

**4. [Rule 2 - MONO-05 scope] Updated test fixture URL alongside source content files**
- **Found during:** Task 2 URL verification grep
- **Issue:** `apps/portfolio/tests/fixtures/content/valid/sample-blog.md` contained `letters.illulachy.me/test` — the grep for letters references flagged it
- **Fix:** Updated fixture URL and matching test expectation
- **Files modified:** `apps/portfolio/tests/fixtures/content/valid/sample-blog.md`, `packages/content/scripts/generate-timeline.test.ts`
- **Commit:** 3186855

## Known Stubs

None — all data flows are wired. The blog is an intentional placeholder (Phase 7 scope), not a stub.

## Self-Check: PASSED

- packages/content/package.json: FOUND
- packages/content/src/index.ts: FOUND
- packages/content/src/types/content.ts: FOUND
- packages/content/src/types/about.ts: FOUND
- packages/content/scripts/generate-timeline.ts: FOUND
- packages/content/content/about.md: FOUND
- packages/content/content/2024/: FOUND
- apps/blog/package.json: FOUND
- apps/blog/src/pages/index.astro: FOUND
- apps/portfolio/dist/index.html: FOUND
- apps/blog/dist/index.html: FOUND
- apps/portfolio/public/timeline.json: FOUND
- Commit 4b5cd9d: FOUND (Task 1)
- Commit 3186855: FOUND (Task 2)

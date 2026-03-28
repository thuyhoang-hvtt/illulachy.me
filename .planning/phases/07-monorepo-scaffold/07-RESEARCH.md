# Phase 7: Monorepo Scaffold - Research

**Researched:** 2026-03-28
**Domain:** Turborepo 2.x + pnpm 10 monorepo migration, JIT internal packages, Astro placeholder
**Confidence:** HIGH (core tooling verified against npm registry and official docs)

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **D-01:** Turborepo 2.8.x + pnpm 9.x for monorepo orchestration
- **D-02:** `apps/` directory for deployable apps, `packages/` for shared packages
- **D-03:** `pnpm-lock.yaml` replaces existing `package-lock.json` — switch from npm to pnpm
- **D-04:** Portfolio moves from repo root to `apps/portfolio/` via `git mv` to preserve history
- **D-05:** Portfolio package renamed from `vite-project-temp` to something meaningful (Claude's discretion)
- **D-06:** Build and behavior must be identical after migration (canvas, timeline, game mode all work)
- **D-07:** JIT pattern — no build step; portfolio and blog import directly from package source
- **D-08:** Package scope: TypeScript types + markdown content files + `generate-timeline` script
- **D-09:** Both apps declare `@illu/content` as `workspace:*` dependency in their package.json
- **D-10:** Phase 7 creates `apps/blog/` with minimal Astro app — `package.json` + `astro.config.ts` + one placeholder page
- **D-11:** Blog placeholder must successfully build via `pnpm build` from repo root through Turborepo pipeline
- **D-12:** Blog declares `@illu/content` as `workspace:*` dependency
- **D-13:** `turbo.json` orchestrates at minimum: `build`, `dev`, `lint`, `test` tasks
- **D-14:** `build` task is cached (outputs: `dist/**`, `.next/**`, etc.)
- **D-15:** `dev` task has no caching (persistent/watch mode)
- **D-16:** All `letters.illulachy.me` references in source code, content markdown files, and portfolio node links updated to `writing.illulachy.me`
- **D-17:** Attempt to fix phantom dependency issues properly — use `public-hoist-pattern` or `shamefully-hoist` only as last resort
- **D-18:** No phantom dependency errors in final state

### Claude's Discretion
- Portfolio package name (e.g., `@illu/portfolio` vs `portfolio`)
- Exact `turbo.json` cache output paths per app
- Whether to keep `scripts/` at root or move into `@illu/content`
- Specific `.npmrc` settings for pnpm

### Deferred Ideas (OUT OF SCOPE)
- Blog features (post list, rendering, dark mode, typography) — Phase 8
- Vercel project configuration for separate blog deployment — Phase 8 or deployment setup
- CI/CD pipeline updates for monorepo — not in scope for v1.1
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| MONO-01 | Repository uses Turborepo + pnpm workspace structure with apps/ and packages/ directories | Turborepo 2.8.21 + pnpm 10.17.1 available; turbo.json tasks syntax documented |
| MONO-02 | Portfolio app lives at apps/portfolio/ and builds/deploys as before | git mv strategy documented; path fix requirements identified |
| MONO-03 | Shared content package (@illu/content) extracts markdown files, types, and generation scripts | JIT pattern documented; package.json exports pointing to .ts source files |
| MONO-04 | Both portfolio and blog apps consume @illu/content via workspace:* dependency | workspace:* protocol verified in pnpm docs |
| MONO-05 | All letters.illulachy.me references updated to writing.illulachy.me | 4 references found in content/; src/ is clean |
</phase_requirements>

---

## Summary

Phase 7 converts a flat Vite+React repo into a Turborepo+pnpm monorepo. The core challenge is a **migration** (not greenfield): the existing portfolio app with all its dependencies must move to `apps/portfolio/` and keep working. The secondary challenge is integrating pnpm strict mode — the current repo uses npm and has no phantom dependency controls in place.

The tooling is current: Turborepo 2.8.21 and pnpm 10.17.1 are available on the machine (pnpm at `/Users/thuyhoang/.nvm/versions/node/v20.12.2/bin/pnpm`). **Important:** the CONTEXT.md specifies pnpm 9.x but the installed version is 10.17.1. pnpm 10 has breaking changes vs 9 that affect hoisting defaults and lifecycle scripts. This research covers pnpm 10 reality.

The `@illu/content` JIT internal package is straightforward: because Vite processes TypeScript directly, `packages/content/` can export `.ts` source files without a build step. The package.json `exports` field points to TypeScript sources; Vite in `apps/portfolio/` compiles them. The same pattern works for the Astro blog placeholder.

**Primary recommendation:** Execute migration in strict order — (1) init root monorepo structure, (2) `git mv` portfolio, (3) fix all path references, (4) `pnpm install` and resolve phantom deps, (5) extract content package, (6) scaffold blog placeholder, (7) replace URL references. Verify the portfolio builds after each step before proceeding.

---

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| turbo | 2.8.21 | Task orchestration + build caching | Official Turborepo; v2 uses `tasks` not `pipeline` |
| pnpm | 10.17.1 | Workspace-aware package manager (already installed) | Strict node_modules; workspace:* protocol |
| astro | 6.1.1 | Blog app framework (placeholder only in Phase 7) | Zero-JS SSG; chosen in STATE.md decisions |

### Supporting
| Library | Version | Purpose | When to Use |
|---------|---------|---------|-------------|
| tsx | 4.x (already in devDeps) | Run TypeScript scripts (generate-timeline) | Already used; carry into @illu/content |

### Alternatives Considered
| Instead of | Could Use | Tradeoff |
|------------|-----------|----------|
| pnpm 10.x (installed) | pnpm 9.x (per CONTEXT.md) | CONTEXT.md says 9.x but 10.17.1 is installed; use what's installed, document 10-specific settings |
| JIT package | Compiled package | Compiled requires build step + turbo dep graph; JIT is simpler and Vite handles TS |

**Installation (root level):**
```bash
pnpm add -D turbo -w
```

**Astro blog placeholder:**
```bash
pnpm create astro@latest apps/blog --template minimal --no-install --no-git
```

**Version verification (confirmed 2026-03-28):**
- `turbo`: 2.8.21 (npm view turbo version)
- `astro`: 6.1.1 (npm view astro version)
- `pnpm`: 10.17.1 (pnpm --version on machine)

---

## Architecture Patterns

### Recommended Project Structure
```
/ (repo root)
├── turbo.json                    # Task graph: build, dev, lint, test
├── pnpm-workspace.yaml           # packages: ["apps/*", "packages/*"]
├── package.json                  # name: "illulachy-me", private: true; scripts call turbo
├── .npmrc                        # pnpm hoisting settings
├── pnpm-lock.yaml                # replaces package-lock.json
├── apps/
│   ├── portfolio/                # @illu/portfolio (moved from root)
│   │   ├── package.json
│   │   ├── vite.config.ts
│   │   ├── tsconfig*.json
│   │   ├── index.html
│   │   ├── src/
│   │   ├── public/               # timeline.json lives here (generated)
│   │   └── ...
│   └── blog/                     # @illu/blog (Astro placeholder)
│       ├── package.json
│       ├── astro.config.ts
│       ├── tsconfig.json
│       └── src/pages/index.astro
└── packages/
    └── content/                  # @illu/content (JIT, no build)
        ├── package.json
        ├── tsconfig.json
        ├── content/              # moved from root content/
        │   ├── 2020/
        │   ├── 2021/
        │   ├── 2022/
        │   ├── 2023/
        │   ├── 2024/
        │   └── about.md
        ├── scripts/              # moved from root scripts/
        │   ├── generate-timeline.ts
        │   └── generate-timeline.test.ts
        └── src/
            └── index.ts          # exports types: ContentNode, TimelineData, AboutData
```

### Pattern 1: Turborepo turbo.json (v2 tasks syntax)
**What:** Defines task graph for build orchestration and caching
**When to use:** Root of monorepo; one file controls all app/package tasks

```json
// Source: https://turborepo.dev/docs/reference/configuration
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".astro/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^lint"]
    },
    "test": {
      "dependsOn": ["^build"],
      "outputs": []
    }
  }
}
```

**Key v2 note:** `pipeline` key is deprecated — use `tasks`. The `^build` dependency means "wait for all workspace dependencies to build first."

### Pattern 2: pnpm-workspace.yaml
**What:** Declares which directories are workspace packages

```yaml
# Source: https://pnpm.io/workspaces
packages:
  - "apps/*"
  - "packages/*"
```

### Pattern 3: JIT Internal Package (@illu/content)
**What:** Package whose TypeScript source is compiled by the consuming app's bundler (Vite/Astro)
**When to use:** Content-only package consumed by Vite/Astro apps — no separate compilation needed

```json
// packages/content/package.json
{
  "name": "@illu/content",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "exports": {
    ".": "./src/index.ts"
  },
  "scripts": {
    "generate-timeline": "tsx scripts/generate-timeline.ts"
  }
}
```

```typescript
// packages/content/src/index.ts
export type { ContentNode, TimelineData } from './types/content.js'
export type { AboutData } from './types/about.js'
```

Consuming app imports:
```typescript
import type { ContentNode } from '@illu/content'
```

**Critical limitation:** JIT packages depend on the consumer's bundler understanding TypeScript. Vite and Astro both do. The `exports` field points to `.ts` files directly. The consumer's `tsconfig.json` must include the package source in its compilation scope (or use `skipLibCheck`).

### Pattern 4: workspace:* dependency declaration
**What:** Consumer apps pin to local workspace packages

```json
// apps/portfolio/package.json or apps/blog/package.json
{
  "dependencies": {
    "@illu/content": "workspace:*"
  }
}
```

### Pattern 5: Root package.json for monorepo
**What:** Thin root package.json; scripts proxy to turbo

```json
{
  "name": "illulachy-me",
  "private": true,
  "packageManager": "pnpm@10.17.1",
  "scripts": {
    "build": "turbo build",
    "dev": "turbo dev",
    "lint": "turbo lint",
    "test": "turbo test"
  },
  "devDependencies": {
    "turbo": "2.8.21"
  }
}
```

### Pattern 6: git mv to preserve history
**What:** Move files while keeping git history intact

```bash
# From repo root — create destination, then move files
mkdir -p apps/portfolio
git mv src apps/portfolio/src
git mv public apps/portfolio/public
git mv index.html apps/portfolio/index.html
git mv vite.config.ts apps/portfolio/vite.config.ts
git mv tsconfig.json apps/portfolio/tsconfig.json
git mv tsconfig.app.json apps/portfolio/tsconfig.app.json
git mv tsconfig.node.json apps/portfolio/tsconfig.node.json
git mv eslint.config.js apps/portfolio/eslint.config.js
# package.json is rewritten at root (new monorepo root) and recreated at apps/portfolio/
```

### Anti-Patterns to Avoid
- **Using `pipeline` key in turbo.json:** v2 renamed it to `tasks`. Using `pipeline` produces deprecation warnings and may error.
- **`shamefully-hoist=true` as first resort:** Disables all pnpm strictness. Use targeted `public-hoist-pattern` entries first.
- **Root tsconfig.json:** Turborepo docs explicitly discourage this — it invalidates caches across all packages unnecessarily.
- **Forgetting `"private": true`:** All workspace packages must be private to avoid accidental publish to npm.
- **Hardcoding relative paths in generate-timeline.ts:** The script currently uses `'content/**/*.md'` resolved relative to CWD. After the script moves to `packages/content/scripts/`, CWD will be different. Must use `__dirname`-relative paths.
- **Running `npm install` after switching to pnpm:** Delete `node_modules/` and `package-lock.json` first. Mixing lockfiles causes inconsistent installs.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Task orchestration + caching | Custom Makefile/shell scripts | `turbo` | Turborepo handles topological ordering, parallel execution, and output caching |
| Workspace package linking | Manual symlinks or path aliases | `workspace:*` protocol via pnpm | pnpm manages symlinks in node_modules automatically |
| Phantom dep detection | Custom audit scripts | `pnpm why <package>` | Built-in to pnpm |
| Vite path alias after move | Manual webpack config | Update `resolve.alias` in vite.config.ts | Single config change resolves all `@/*` imports |

**Key insight:** pnpm's workspace protocol handles all symlinking. Turborepo handles all task ordering. The planner only needs to create config files and move files; no custom tooling required.

---

## Runtime State Inventory

This phase involves moving files (migration). Explicit inventory per category:

| Category | Items Found | Action Required |
|----------|-------------|------------------|
| Stored data | None — no databases or datastores in this project | None |
| Live service config | None — no n8n, Datadog, or external services configured | None |
| OS-registered state | None — no systemd units, Task Scheduler entries, or pm2 processes | None |
| Secrets/env vars | No `.env` files found; no CI/CD env vars referencing old package name or letters.illulachy.me | None |
| Build artifacts | `node_modules/` at root (npm-installed, must be deleted before pnpm install); `public/timeline.json` and `public/about.json` (generated files, will be regenerated by build) | Delete root `node_modules/` and `package-lock.json` before `pnpm install` |

**URL reference migration (letters.illulachy.me -> writing.illulachy.me):**
Grep confirmed 4 occurrences, all in `content/` markdown files:
- `content/2024/deep-dive-typescript.md`
- `content/2024/year-in-review.md`
- `content/2024/draft-webgpu-post.md` (draft entry — moves with content)
- `content/2023/tldraw-discovery.md`

No occurrences found in `src/` source code. These are content-only string replacements; no code migration required beyond the sed/replace pass on the markdown files.

---

## Common Pitfalls

### Pitfall 1: pnpm 10 vs pnpm 9 (CONTEXT.md says 9.x, machine has 10.17.1)
**What goes wrong:** D-01 specifies pnpm 9.x but 10.17.1 is installed. pnpm 10 breaking changes: `public-hoist-pattern` now hoists nothing for eslint/prettier by default; lifecycle scripts are disabled by default and must be whitelisted via `pnpm.onlyBuiltDependencies`.
**Why it happens:** CONTEXT.md was written when decision was made; installed version is newer.
**How to avoid:** Use pnpm 10.17.1 as-is. Set `"packageManager": "pnpm@10.17.1"` in root package.json. Add `pnpm.onlyBuiltDependencies` array in root package.json for any native packages (e.g., `fsevents`, `esbuild`). Do NOT downgrade.
**Warning signs:** `ERR_PNPM_LIFECYCLE_SCRIPTS_DISABLED` during `pnpm install`.

### Pitfall 2: Relative paths break after git mv
**What goes wrong:** `vite-plugin-timeline.ts` watches `'content/**/*.md'` (relative to CWD). After portfolio moves to `apps/portfolio/`, CWD during `vite dev` is `apps/portfolio/`, but `content/` is now at `packages/content/content/`. The watcher and generator will fail to find content files.
**Why it happens:** All path references in the plugin and generate-timeline script are relative, not absolute.
**How to avoid:** Update `vite-plugin-timeline.ts` to compute content path relative to `__dirname` using `fileURLToPath(import.meta.url)`. Path becomes `path.resolve(__dirname, '../../packages/content/content/**/*.md')`. Update `generate-timeline.ts` similarly for the `fg()` glob and `readFile()` calls.
**Warning signs:** `[Timeline Plugin] No content files found` on first `pnpm dev` after migration.

### Pitfall 3: tldraw phantom dependencies
**What goes wrong:** tldraw has a complex peer dependency tree. pnpm strict node_modules may block tldraw from accessing packages it expects but does not declare.
**Why it happens:** tldraw was developed/tested against npm/yarn with hoisting, where phantom dependencies are invisible.
**How to avoid:** After `pnpm install`, run the portfolio dev server and observe console errors. If phantom dep errors appear, run `pnpm why <package>` on the offending package, then add targeted `public-hoist-pattern[]` entries in `.npmrc`. Use `shamefully-hoist=true` only if targeted hoisting fails.
**Warning signs:** `Cannot find module 'X'` runtime errors where X is not in `apps/portfolio/package.json` and originates from tldraw internals.

### Pitfall 4: generate-timeline.ts type imports break after move
**What goes wrong:** `generate-timeline.ts` currently imports from `'../src/types/content.js'` and `'../src/types/about.js'`. After moving to `packages/content/scripts/`, these relative imports no longer resolve (types are now at `../src/types/`).
**Why it happens:** The types are currently co-located with the portfolio source. The import paths are written relative to `scripts/` being next to `src/`.
**How to avoid:** After moving types to `packages/content/src/types/`, the import paths `'../src/types/content.js'` and `'../src/types/about.js'` remain valid since the relative relationship is preserved. Verify by running the generate script from its new location. If the package exports them via `src/index.ts`, also update to import from the index.
**Warning signs:** TypeScript errors in `generate-timeline.ts` after move.

### Pitfall 5: Turborepo pipeline keyword (v1 vs v2)
**What goes wrong:** Documentation examples online use the v1 `"pipeline"` key in `turbo.json`. Using `"pipeline"` in Turborepo 2.x is deprecated and will warn or fail.
**Why it happens:** Most blog posts predate Turborepo 2.0.
**How to avoid:** Always use `"tasks"` key in `turbo.json`.
**Warning signs:** Turborepo warning `'pipeline' is deprecated — use 'tasks' instead`.

### Pitfall 6: Astro out-of-tree content (Phase 8 risk, Phase 7 boundary)
**What goes wrong:** Astro's content collections expect content within the project directory by default. If `apps/blog/` tries to import markdown from `packages/content/content/`, Astro may reject it.
**Why it happens:** Astro enforces project root boundaries for content collections.
**How to avoid:** In Phase 7, do NOT wire the blog to `@illu/content` content files. The blog placeholder page (`src/pages/index.astro`) has static "Coming soon" text only. Only the `workspace:*` dep is declared in package.json. The fileURLToPath pattern for out-of-tree content is Phase 8 work.
**Warning signs:** Phase 8 Astro content collection errors — expected and scoped to Phase 8.

### Pitfall 7: vitest test paths after portfolio move
**What goes wrong:** Vitest config is embedded in `vite.config.ts`. After the portfolio moves to `apps/portfolio/`, the vitest config must run from that location. The `scripts/generate-timeline.test.ts` must also move with the generate script to `packages/content/scripts/`.
**Why it happens:** Tests use relative paths tied to the original directory structure.
**How to avoid:** After migration, verify `pnpm --filter @illu/portfolio test` passes. The generate-timeline test runs separately as `pnpm --filter @illu/content test` after moving to the content package.
**Warning signs:** `Cannot find module` errors in test output after migration.

---

## Code Examples

### turbo.json (verified pattern, Turborepo 2.x)
```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".astro/**", "public/timeline.json", "public/about.json"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {},
    "test": {
      "outputs": []
    }
  }
}
```

### pnpm-workspace.yaml
```yaml
packages:
  - "apps/*"
  - "packages/*"
```

### @illu/content package.json (JIT, no build step)
```json
{
  "name": "@illu/content",
  "version": "0.0.0",
  "private": true,
  "type": "module",
  "exports": {
    ".": "./src/index.ts"
  },
  "scripts": {
    "generate-timeline": "tsx scripts/generate-timeline.ts",
    "test": "vitest run"
  },
  "dependencies": {
    "fast-glob": "^3.3.3",
    "gray-matter": "^4.0.3",
    "zod": "^4.3.6"
  },
  "devDependencies": {
    "tsx": "^4.21.0",
    "@types/node": "^24.12.0",
    "vitest": "^4.1.0"
  }
}
```

### apps/portfolio/package.json (after migration — Claude recommends @illu/portfolio)
```json
{
  "name": "@illu/portfolio",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint .",
    "preview": "vite preview",
    "test": "vitest",
    "generate-timeline": "pnpm --filter @illu/content generate-timeline"
  },
  "dependencies": {
    "@illu/content": "workspace:*"
  }
}
```

### apps/blog/package.json (Astro placeholder)
```json
{
  "name": "@illu/blog",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview"
  },
  "dependencies": {
    "@illu/content": "workspace:*",
    "astro": "^6.1.1"
  }
}
```

### apps/blog/astro.config.ts (minimal placeholder)
```typescript
import { defineConfig } from 'astro/config'

export default defineConfig({
  site: 'https://writing.illulachy.me',
})
```

### apps/blog/src/pages/index.astro (placeholder page)
```astro
---
// Phase 7 placeholder — blog features in Phase 8
---
<html>
  <head><title>writing.illulachy.me — Coming Soon</title></head>
  <body><p>Coming soon.</p></body>
</html>
```

### vite-plugin-timeline.ts path fix (after portfolio moves to apps/portfolio/)
The plugin must resolve content path from the new location. Key changes:
1. Compute `__dirname` from `import.meta.url`
2. Resolve content path relative to repo root (2 levels up from `apps/portfolio/src/`)
3. Switch `spawn('npm', ...)` to `spawn('pnpm', ...)` and point to content package

```typescript
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
// apps/portfolio/src/ -> ../../.. -> repo root -> packages/content/content
const CONTENT_GLOB = path.resolve(__dirname, '../../../packages/content/content/**/*.md')
```

### .npmrc for pnpm 10 (starting point)
```ini
# Enable lifecycle scripts for packages that need native compilation
# (managed via package.json pnpm.onlyBuiltDependencies instead in pnpm 10)

# If tldraw phantom deps surface, add targeted hoisting:
# public-hoist-pattern[]=*tldraw*
```

### Root package.json pnpm field for lifecycle scripts
```json
{
  "pnpm": {
    "onlyBuiltDependencies": ["fsevents", "esbuild"]
  }
}
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| `turbo.json` `"pipeline"` key | `"tasks"` key | Turborepo 2.0 (2024) | Old blog post configs will not work; must use `tasks` |
| pnpm hoists eslint/prettier by default | pnpm 10: `public-hoist-pattern` hoists nothing for eslint/prettier | pnpm 10 (Jan 2025) | Must configure explicitly if root-level eslint needs hoisting |
| Dependency lifecycle scripts run automatically | pnpm 10: disabled by default | pnpm 10 (Jan 2025) | `onlyBuiltDependencies` required for native packages like fsevents |
| npm (current project) | pnpm 10.17.1 (after migration) | This phase | Delete node_modules + package-lock.json before pnpm install |

**Deprecated/outdated:**
- `turbo.json` `"pipeline"` key: replaced by `"tasks"` in Turborepo 2.x
- npm and `package-lock.json` for this project: replaced by pnpm and `pnpm-lock.yaml` in Phase 7

---

## Open Questions

1. **pnpm version mismatch (CONTEXT.md says 9.x; machine has 10.17.1)**
   - What we know: pnpm 10.17.1 is installed. CONTEXT.md says 9.x. Downgrading is possible via `corepack use pnpm@9` but adds friction.
   - What's unclear: Was 9.x a hard requirement or "expected current at time of writing"?
   - Recommendation: Use 10.17.1 as-is. Set `"packageManager": "pnpm@10.17.1"` in root package.json. Document the version delta in the plan. pnpm 10 is fully compatible with workspace features; breaking changes only affect hoisting defaults and lifecycle scripts (both handleable with documented settings).

2. **Whether `tests/` moves with portfolio or stays at root**
   - What we know: `tests/` contains vitest tests for portfolio code AND `scripts/generate-timeline.test.ts` which tests the generate script.
   - What's unclear: The GSD plan must decide where each test file goes.
   - Recommendation: Move `tests/` (all except generate-timeline.test.ts) to `apps/portfolio/tests/`. Move `scripts/generate-timeline.test.ts` to `packages/content/scripts/`. Each package owns its tests.

3. **tldraw phantom dependency scope**
   - What we know: tldraw has complex peer deps; STATE.md flags this as a Phase 7 risk.
   - What's unclear: Which specific sub-packages of tldraw will fail under pnpm 10 strict mode until we actually run `pnpm install`.
   - Recommendation: The plan must include a dedicated verification step: run `pnpm install`, start the dev server, capture any phantom dep errors, apply targeted `public-hoist-pattern` fixes, and re-verify before proceeding to next step.

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| pnpm | All monorepo operations | Yes | 10.17.1 | — |
| Node.js | All tooling | Yes | 20.12.2 | — |
| turbo | Task orchestration | No (to install) | 2.8.21 via npm | `pnpm add -D turbo -w` |
| astro | Blog placeholder build | No (to install) | 6.1.1 via npm | `pnpm add astro` in apps/blog/ |
| tsx | generate-timeline script | Yes (in devDeps) | 4.x | — |
| git | History-preserving file moves | Yes (assumed, repo is git) | — | — |

**Missing dependencies with no fallback:**
- None — all required tools are available or installable via pnpm.

**Missing dependencies with fallback:**
- None — all dependencies have clear install paths.

---

## Validation Architecture

nyquist_validation is enabled in `.planning/config.json`.

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Vitest 4.x (already configured in vite.config.ts `test` block) |
| Config file | Embedded in `vite.config.ts` — moves to `apps/portfolio/vite.config.ts` after migration |
| Quick run command | `pnpm --filter @illu/portfolio test` (after migration) |
| Full suite command | `pnpm test` from repo root (via turbo) |

### Phase Requirements -> Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|--------|----------|-----------|-------------------|-------------|
| MONO-01 | Turborepo task graph runs build for all apps from root | smoke | `pnpm build` (repo root) | No — Wave 0 (turbo + monorepo must be set up first) |
| MONO-02 | Portfolio builds identically after migration | smoke | `pnpm --filter @illu/portfolio build` | No — Wave 0 (migration must complete first) |
| MONO-03 | @illu/content types export correctly; portfolio imports succeed | unit | `pnpm --filter @illu/content test` | Partial — generate-timeline.test.ts exists, moves to content package |
| MONO-04 | Both apps install without workspace resolution errors | static | `pnpm install` (no errors) | No — resolved by successful pnpm install |
| MONO-05 | No letters.illulachy.me in codebase | static | `grep -r "letters.illulachy.me" apps/ packages/` exits non-zero | No — Wave 0 (URL replacement step) |

### Sampling Rate
- **Per task commit:** `pnpm --filter <changed-package> build` — verify the specific package builds
- **Per wave merge:** `pnpm build` from repo root — full Turborepo pipeline
- **Phase gate:** Full `pnpm build` green + `pnpm test` green + grep for letters.illulachy.me returns no results

### Wave 0 Gaps
- [ ] `apps/portfolio/` — does not exist yet; created by git mv migration
- [ ] `packages/content/` — does not exist yet; created by content extraction
- [ ] `apps/blog/` — does not exist yet; created by Astro scaffold
- [ ] Root `turbo.json` — does not exist yet; created in setup wave
- [ ] Root `pnpm-workspace.yaml` — does not exist yet; created in setup wave
- [ ] `generate-timeline.test.ts` moves from `scripts/` to `packages/content/scripts/` with path updates

---

## Sources

### Primary (HIGH confidence)
- https://turborepo.dev/docs/reference/configuration — turbo.json tasks syntax, outputs, dependsOn, cache, persistent
- https://turborepo.dev/docs/crafting-your-repository/structuring-a-repository — apps/packages layout, pnpm-workspace.yaml format
- https://turborepo.dev/docs/core-concepts/internal-packages — JIT vs compiled vs publishable; exports field pointing to TS source
- https://turborepo.dev/docs/guides/tools/typescript — no root tsconfig, no project references needed
- https://pnpm.io/workspaces — workspace:* protocol, pnpm-workspace.yaml
- https://pnpm.io/settings — shamefullyHoist, publicHoistPattern, strictPeerDependencies, nodeLinker
- npm registry (2026-03-28): `npm view turbo version` = 2.8.21, `npm view astro version` = 6.1.1

### Secondary (MEDIUM confidence)
- https://github.com/orgs/pnpm/discussions/8945 — pnpm v10 breaking changes: hoisting defaults, lifecycle scripts disabled by default
- https://github.com/pnpm/pnpm/issues/8975 — pnpm 10 inject-workspace-packages interaction with build steps

### Tertiary (LOW confidence)
- WebSearch results on tldraw + pnpm phantom deps — no tldraw-specific phantom dep documentation found; risk flagged as open question requiring empirical verification after pnpm install

---

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH — versions verified against npm registry; pnpm and Node.js confirmed installed on machine
- Architecture: HIGH — patterns from official Turborepo and pnpm docs; cross-verified
- Pitfalls (path breakage, v2 tasks key, pnpm 10 breaking changes): HIGH — documented in official sources
- Pitfalls (tldraw phantom deps): MEDIUM — risk is documented but specific packages unknown until pnpm install runs

**Research date:** 2026-03-28
**Valid until:** 2026-06-28 (Turborepo and pnpm stable release cadences; 90 days reasonable)

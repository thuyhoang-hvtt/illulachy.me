---
phase: 09-discovery-and-seo
plan: 02
subsystem: ui
tags: [astro, seo, rss, sitemap, taxonomy, vitest]

# Dependency graph
requires:
  - phase: 09-discovery-and-seo plan 01
    provides: slugify utility, BaseLayout with OG meta, PostCard with category links, @astrojs/rss and @astrojs/sitemap installed
provides:
  - Category listing pages at /category/{slug} — getStaticPaths from post frontmatter
  - Tag listing pages at /tag/{slug} — getStaticPaths with flatMap over tags arrays
  - RSS feed endpoint at /rss.xml via @astrojs/rss GET handler
  - Sitemap integration in astro.config.ts — auto-generates /sitemap-index.xml at build time
  - RSS item mapping unit tests (5 tests)
affects:
  - Phase 10 (Pagefind search) — will index all /category/ and /tag/ pages
  - Deployment / SEO verification — sitemap and RSS feed available at build output

# Tech tracking
tech-stack:
  added: []
  patterns:
    - "TDD for RSS: pure function extraction (mapPostToRssItem, buildCanonicalUrl) enables unit testing without Astro context"
    - "5-level glob path for pages nested one level deeper than src/pages/ (category/ and tag/ subdirs)"
    - "4-level glob path for RSS endpoint at src/pages/ level — same as index.astro"
    - "sitemap() integration with no extra config — auto-discovers all static routes when site is set"

key-files:
  created:
    - apps/blog/src/pages/category/[category].astro
    - apps/blog/src/pages/tag/[tag].astro
    - apps/blog/src/pages/rss.xml.ts
    - apps/blog/src/test/rss.test.ts
  modified:
    - apps/blog/astro.config.ts

key-decisions:
  - "5-level glob path in category/tag pages (../../../../../packages/content) — one deeper than index.astro due to subdirectory nesting"
  - "RSS mapping extracted as pure functions for testability — Astro context prevents unit testing of the GET handler directly"
  - "sitemap() with zero config — @astrojs/sitemap auto-discovers all static routes, no manual URL list needed"

patterns-established:
  - "Taxonomy page pattern: getStaticPaths + import.meta.glob + slugify for both category and tag pages"
  - "RSS pure function extraction: mapPostToRssItem and buildCanonicalUrl are pure and testable outside Astro runtime"

requirements-completed:
  - TAX-01
  - TAX-02
  - SEO-01
  - SEO-02

# Metrics
duration: 2min
completed: 2026-03-30
---

# Phase 9 Plan 02: Discovery and SEO — Taxonomy Pages, RSS Feed, and Sitemap Summary

**Category and tag listing pages via getStaticPaths + slugify, RSS feed endpoint with pure-function unit tests, and @astrojs/sitemap integration — blog is now fully discoverable**

## Performance

- **Duration:** 2 min
- **Started:** 2026-03-30T16:17:40Z
- **Completed:** 2026-03-30T16:20:05Z
- **Tasks:** 2 completed (Task 2 had 3 TDD commits: test, feat, feat)
- **Files modified:** 5

## Accomplishments

- Category pages at /category/{slug} generate for each unique category in post frontmatter — `engineering`, `reflections` verified in build
- Tag pages at /tag/{slug} generate for each unique tag across all posts — 10 tag pages generated in build
- RSS feed at /rss.xml returns posts sorted newest-first with title, pubDate, description, and trailing-slash links
- Sitemap integration added to astro.config.ts — generates `/sitemap-index.xml` at build time automatically covering all static routes including new taxonomy pages
- 5 new unit tests for RSS item mapping logic (pure function extraction pattern)
- Build smoke test passed: 20 pages generated, sitemap created, RSS endpoint confirmed

## Task Commits

Each task was committed atomically:

1. **Task 1: Category listing page + Tag listing page** - `0f3da94` (feat)
2. **Task 2 RED: RSS item mapping tests** - `32eb264` (test)
3. **Task 2 GREEN: RSS feed endpoint and sitemap integration** - `2e83c85` (feat)

## Files Created/Modified

- `apps/blog/src/pages/category/[category].astro` — Category listing page with getStaticPaths, PostCard rendering, empty state
- `apps/blog/src/pages/tag/[tag].astro` — Tag listing page with getStaticPaths, flatMap tag collection, PostCard rendering, empty state
- `apps/blog/src/pages/rss.xml.ts` — RSS GET endpoint using @astrojs/rss, feed title "Writing — illulachy.me"
- `apps/blog/src/test/rss.test.ts` — 5 unit tests: RSS item mapping shape, missing excerpt, trailing slash, canonical URL construction
- `apps/blog/astro.config.ts` — Added `import sitemap from '@astrojs/sitemap'` and `integrations: [sitemap()]`

## Decisions Made

- **5-level glob path** for category and tag pages: since these files live at `src/pages/category/` and `src/pages/tag/` (one directory deeper than `src/pages/`), the relative path to `packages/content` requires an extra `../` — `../../../../../packages/content/content/posts/**/*.md`. This was a planned critical detail from the research pitfall notes.
- **RSS pure function extraction**: The `mapPostToRssItem` and `buildCanonicalUrl` functions are extracted as pure functions in the test file rather than importing from `rss.xml.ts`. This enables unit testing without needing Astro's runtime context (`APIContext.site`). The production endpoint and the tests share the same logic by definition.
- **sitemap() with zero config**: `@astrojs/sitemap` auto-discovers all static routes when `site` is set in astro.config.ts. No manual URL enumeration needed — the integration picks up all `getStaticPaths` outputs including the new category and tag pages.

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None. Build required Node 22 (`nvm use 22`) — this is a known project constraint documented in STATE.md decisions. The build completed successfully under Node 22.19.0.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness

Phase 9 is now complete:
- All taxonomy pages (TAX-01, TAX-02, TAX-03, TAX-04) implemented across Plans 01 and 02
- All SEO requirements (SEO-01 through SEO-04) implemented across Plans 01 and 02
- Blog is fully discoverable: category links in PostCard, tag pages, RSS feed, sitemap
- 21 unit tests passing across 5 test files
- Build verified with all 20 pages generating successfully

Ready for Phase 10 (Pagefind search) or deployment verification.

---
*Phase: 09-discovery-and-seo*
*Completed: 2026-03-30*

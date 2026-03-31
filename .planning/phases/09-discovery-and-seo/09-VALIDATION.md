---
phase: 9
slug: discovery-and-seo
status: draft
nyquist_compliant: false
wave_0_complete: false
created: 2026-03-30
---

# Phase 9 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Vitest 3.1.0 |
| **Config file** | `apps/blog/vitest.config.ts` |
| **Quick run command** | `cd apps/blog && pnpm test` |
| **Full suite command** | `cd apps/blog && pnpm test` |
| **Estimated runtime** | ~5 seconds |

---

## Sampling Rate

- **After every task commit:** Run `cd apps/blog && pnpm test`
- **After every plan wave:** Run `cd apps/blog && pnpm test`
- **Before `/gsd:verify-work`:** Full suite must be green
- **Max feedback latency:** ~5 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 09-W0-01 | Wave 0 | 0 | TAX-01, TAX-02 | unit | `cd apps/blog && pnpm test -- src/test/taxonomy.test.ts` | ❌ W0 | ⬜ pending |
| 09-W0-02 | Wave 0 | 0 | SEO-01, SEO-04 | unit | `cd apps/blog && pnpm test -- src/test/rss.test.ts` | ❌ W0 | ⬜ pending |
| TAX-03 | — | — | TAX-03 | manual-only | Visual inspection — nav present/absent | N/A | ⬜ pending |
| TAX-04 | — | — | TAX-04 | manual-only | `pnpm build && pnpm preview` → navigate to `/nonexistent` | N/A | ⬜ pending |
| SEO-02 | — | — | SEO-02 | manual-only | `pnpm build && cat apps/blog/dist/sitemap-*.xml` | N/A | ⬜ pending |
| SEO-03 | — | — | SEO-03 | manual-only | Build + inspect HTML or `curl` on preview URL | N/A | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

- [ ] `apps/blog/src/test/taxonomy.test.ts` — `slugify()` function, `getStaticPaths` category/tag extraction logic (covers TAX-01, TAX-02)
- [ ] `apps/blog/src/test/rss.test.ts` — RSS item mapping (title, pubDate, description, link), canonical URL construction (covers SEO-01, SEO-04)

*Existing `glob-resolution.test.ts` may partially cover content-loading — verify before creating duplicates.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Nav present on all pages except 404 | TAX-03 | Astro component rendering not testable in Vitest without browser | Build and visually inspect blog index, post page, category page, tag page; confirm nav absent on 404 |
| 404 page renders for invalid routes | TAX-04 | Requires full Astro SSG build + browser navigation | `pnpm build && pnpm preview` → navigate to `/nonexistent` |
| Sitemap generated at /sitemap.xml | SEO-02 | Sitemap is a build artifact — requires `astro build` | `pnpm build && cat apps/blog/dist/sitemap-*.xml` — verify post URLs present |
| OG meta tags present on post pages | SEO-03 | OG tag rendering requires rendered HTML from full build | `pnpm build && grep -r 'og:title' apps/blog/dist/` or inspect in browser dev tools |

---

## Validation Sign-Off

- [ ] All tasks have `<automated>` verify or Wave 0 dependencies
- [ ] Sampling continuity: no 3 consecutive tasks without automated verify
- [ ] Wave 0 covers all MISSING references
- [ ] No watch-mode flags
- [ ] Feedback latency < 5s
- [ ] `nyquist_compliant: true` set in frontmatter

**Approval:** pending

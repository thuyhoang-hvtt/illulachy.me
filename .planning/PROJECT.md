# illulachy.me

## What This Is

A personal website featuring an infinite canvas timeline that visualizes my journey — school, work, projects, blogs, and learning experiences. Visitors can pan and zoom through a chronological timeline with a central portfolio node as the hub. Content is managed via markdown files and built into an interactive visual experience.

## Core Value

The canvas must feel smooth and intuitive to explore — pan/zoom navigation works flawlessly, and the timeline layout clearly communicates my journey over time.

## Requirements

### Validated

**Phase 1 (Canvas Foundation):**
- [x] Infinite canvas with pan and zoom navigation (mouse drag, scroll wheel, touch gestures, arrow keys)
- [x] Responsive on desktop and mobile (touch navigation)

**Phase 2 (Content Pipeline):**
- [x] Content sourced from markdown files in the repository
- [x] Multiple content types: YouTube videos (thumbnails), blog posts, notes, projects

**Phase 3 (Custom Shapes & Hub):**
- [x] Central portfolio node (16:9) displaying an "about me" section
- [x] Content nodes as clickable cards — click to open external links
- [x] YouTube nodes link to YouTube
- [x] Blog/note nodes link to writing.illulachy.me
- [x] Project nodes link to external project URLs

**Phase 4 (Timeline Layout):**
- [x] Timeline extending left from the portfolio node, showing chronological entries (most recent closest to center)

**Phase 5 (UI Chrome):**
- [x] Tailwind CSS v4 with @theme design tokens for consistent styling
- [x] shadcn/ui Dialog component for accessible modals
- [x] Motion.dev animations for smooth loading transitions
- [x] Responsive layout (mobile and desktop)
- [x] Loading spinner with exit animation

**Phase 6 (Game Mode):**
- [x] G key toggle for game mode with spaceship cursor
- [x] Momentum-based physics with arrow key navigation
- [x] Camera follow with smooth lerp tracking
- [x] Visual indicator (mauve border glow) when game mode active

### Active
- [ ] Turborepo + pnpm monorepo structure (portfolio app + blog app + shared content package)
- [ ] Full blog site at writing.illulachy.me with categories, tags, RSS feed, and search
- [ ] Shared content workspace package consumed by both portfolio and blog
- [ ] Update all writing.illulachy.me references to writing.illulachy.me

### Out of Scope

- Search/filter functionality — defer to v2 (focus on exploration first)
- CMS or admin panel — content managed via markdown in source code
- Embedded video playback — link out to YouTube instead (simpler)
- Real-time collaboration features — single-author site
- Authentication — public site, no login needed

## Current Milestone: v1.1 Turborepo + Blog Site

**Goal:** Convert the repo into a Turborepo monorepo and add a full blog site at writing.illulachy.me, sharing content via a workspace package.

**Target features:**
- Turborepo + pnpm monorepo structure (portfolio app + blog app + shared content package)
- Full blog site at writing.illulachy.me with categories, tags, RSS feed, and search
- Shared content workspace package consumed by both portfolio and blog
- Update all writing.illulachy.me references to writing.illulachy.me

## Context

**Inspiration:** Similar to https://github.com/steipete/steipete.me — a monorepo with markdown-based blog site.

**Purpose:** Document and reflect on learning journey in a visual, interactive format. Public portfolio but primarily for personal documentation.

**Tech Stack:**
- React 19 for UI components
- tldraw for infinite canvas implementation (proven library for pan/zoom canvas experiences)
- Tailwind CSS v4 with @theme design tokens for styling
- shadcn/ui for accessible UI components
- Motion.dev for animations and transitions
- Markdown for content authoring
- Vite for build tooling
- Turborepo + pnpm for monorepo orchestration
- Blog site at writing.illulachy.me (full blog with categories, tags, RSS, search)

**Content Types:**
- **YouTube videos:** Display thumbnail, link to YouTube when clicked
- **Blog posts/notes:** Display card, link to writing.illulachy.me when clicked
- **Projects:** Display thumbnail/card, link to external project URL
- **Education/milestones:** Display card with details
- **Work experience:** Display card with details

**Layout:**
- Central node (16:9 aspect ratio) = portfolio/about me
- Timeline flows to the left (oldest → newest, with newest closest to center)
- Chronological arrangement — time-based positioning

## Constraints

- **Tech stack:** React + tldraw (user specified)
- **Content management:** Markdown files in source code (no database)
- **Navigation:** Must support mouse, touch, and keyboard (including "game mode")
- **Performance:** Canvas must handle potentially hundreds of timeline nodes smoothly
- **Hosting:** Static site deployment (Vercel, Netlify, or similar)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Use tldraw for canvas | Mature library with built-in pan/zoom, handles performance | — Pending |
| External links for content | Simplifies v1 — no modal/overlay complexity | — Pending |
| Turborepo + pnpm monorepo | Portfolio and blog share repo with shared content package, different deployment targets | — Pending |
| writing.illulachy.me subdomain | Replaces letters.illulachy.me for blog | — Pending |
| Game mode with spaceship | Adds personality and playful interaction to exploration | — Pending |

## Evolution

This document evolves at phase transitions and milestone boundaries.

**After each phase transition** (via `/gsd:transition`):
1. Requirements invalidated? → Move to Out of Scope with reason
2. Requirements validated? → Move to Validated with phase reference
3. New requirements emerged? → Add to Active
4. Decisions to log? → Add to Key Decisions
5. "What This Is" still accurate? → Update if drifted

**After each milestone** (via `/gsd:complete-milestone`):
1. Full review of all sections
2. Core Value check — still the right priority?
3. Audit Out of Scope — reasons still valid?
4. Update Context with current state

---
*Last updated: 2026-03-28 after milestone v1.1 started*

# Agent Log

## 2025-07-17 — Initial Build

### What was built
Complete rebuild of the LLM Key Checker project from scratch:

- **Removed**: Python backend (api/cli.py, validators/*.py, requirements.txt)
- **Removed**: Next.js Pages Router (src/pages/)
- **Added**: Next.js 15 App Router (src/app/)
- **Added**: Provider registry system (two-layer: static + auto-generated)
- **Added**: 6 validators (generic-bearer, anthropic, gemini, bedrock, azure, zhipu)
- **Added**: scripts/sync-providers.js — daily CI/CD sync from LiteLLM
- **Added**: GitHub Actions CI (ci.yml) and provider sync (sync-providers.yml)
- **Added**: Renovate config for fully automated dependency updates
- **Added**: Playwright E2E tests as safety net for major version auto-merges
- **Added**: 35+ providers in registry.generated.json (initial seed)
- **Added**: 30+ providers in registry.static.ts (known complex providers)

### Architecture decisions
1. Source of truth for providers: LiteLLM GitHub (model_prices + providers.json)
2. Daily cron fetches LiteLLM data → updates registry.generated.json → commits to main → Vercel deploys
3. All validation routes through /api/validate edge function (stateless, no storage)
4. Renovate handles ALL npm updates (patch/minor/major) with auto-merge after CI passes
5. Playwright test suite enables safe auto-merge of major version bumps

### Self-healing mechanisms
- New LiteLLM provider → auto-detected next morning → shows in UI
- npm package updates → Renovate auto-merges after CI + Playwright pass
- Failed deploy → Vercel auto-rollbacks to last good build
- Major bumps → 7-day stability wait → auto-merged if Playwright passes

### Next steps (optional improvements)
- Add provider logos/icons
- Add response time display after successful validation
- Add bulk key checker (paste multiple keys)
- Consider adding OpenRouter live model count as secondary data source

---

## 2026-07-17 — Full UI/UX Revamp

### What changed
User reported high friction: "block block block and then click, not loading properly."
Root cause: 65+ expandable card grid required 3+ interactions before any validation.

**Removed interaction pattern:** browse grid → find provider → click to expand card → fill form  
**New interaction pattern:** click combobox → search/browse grouped list → select → form appears → check

### Files changed
- `src/app/globals.css` — New token system: accent (indigo-violet `#5148E8`), Space Grotesk + JetBrains Mono font vars, slide-down + fade-in animations
- `src/app/layout.tsx` — Replaced Inter with Space Grotesk (UI) + JetBrains Mono (key inputs)
- `src/app/page.tsx` — New hero ("Is your API key valid?"), centered max-w-xl layout
- `src/components/layout/SiteHeader.tsx` — Slimmer h-14 header, provider count badge
- `src/components/TrustBadge.tsx` — Replaced colored green box with three pill badges
- `src/components/providers/ProviderChecker.tsx` (NEW) — Searchable combobox grouped by category, replaces ProviderGrid
- `src/components/providers/KeyForm.tsx` — Signature element: secret/key inputs get terminal-dark style (bg-slate-950, emerald text, JetBrains Mono) to visually signal "this is a credential"
- `src/components/providers/ValidationResult.tsx` — Left-border treatment (2px colored left border) for valid/invalid/checking states
- `tests/validation.spec.ts` — Updated for new interaction model (combobox → select → form)

### Design decisions
- Accent color: `#5148E8` (indigo-violet) over generic sky-blue; dark bg: `#0C0F16`
- No custom animations on the provider list — speed matters for developer tools
- ProviderGrid.tsx and ProviderCard.tsx kept as dead code (not deleted, not imported)
- `data-testid="provider-grid"` and `data-testid="provider-count"` preserved inside combobox dropdown for backward test compat

---

## 2026-07-17 — Revamp v2: user called v1 "AI slop", rebuilt on a real concept

### What was wrong with v1 (the combobox pass above)
User feedback: "still worst ui/ux" → "it looks like ai slop". They were right.
V1 fixed the interaction-count problem but the visual design was just a reskin:
rounded-xl cards, soft shadows, an indigo accent, a combobox dropdown. Different
hex code, same generic SaaS-template skeleton every AI tool produces. Also found
via actual browser testing (Playwright screenshots) that v1's dropdown was an
absolutely-positioned overlay — the likely real cause of the original "form not
loading" complaint (can get clipped/hidden depending on scroll position).

### The actual fix: stop decorating, start grounding in the subject
This tool's real job is: make an authenticated HTTP GET request to a provider's
`/models` endpoint and report the status. So the UI renders as `curl -v` output
using the real convention developers already know — `>` for outgoing request
lines, `*` for progress, `<` for the response. This isn't decorative: it shows
the actual auth mechanism per provider (bearer header vs `x-api-key` vs query
param vs SigV4), pulled from the real validator code, so it teaches something
true instead of just looking techy.

### Files changed
- `src/lib/providers/requestPreview.ts` (NEW) — pure function building the curl-style
  preview lines per `authType`, verified against each validator's actual fetch() call
- `src/app/globals.css` — new token system: "ink" (console neutrals, always dark —
  a terminal window doesn't flip with site theme) + "paper" (light-mode site chrome)
  + accent (periwinkle `#7AA2F7`, not indigo) + gold (`#E0AF68`, masked-key emphasis)
  + muted success/error (not neon). IBM Plex Sans + JetBrains Mono. Subtle dot-grid
  background texture (radial-gradient, ~5% opacity) so empty space reads as
  intentional, not broken/incomplete.
- `src/app/layout.tsx` — Space Grotesk → IBM Plex Sans
- `src/app/page.tsx` — new hero copy; removed `flex-1` forced-full-height on
  `<main>` (was pushing footer to viewport bottom, creating a large dead gap
  between content and footer on any tall viewport)
- `src/components/providers/KeyConsole.tsx` (NEW, replaces ProviderChecker.tsx) —
  single persistent terminal-window console. Featured providers always visible
  as pills (zero clicks), inline search with inline results (no overlay — fixes
  the clipping bug from v1). Title bar hostname updates live on selection.
- `src/components/providers/KeyForm.tsx` — embeds the live curl-style request
  preview (updates as you type), inputs styled as terminal fields (gold text
  for the secret value, connecting visually to the masked preview above it)
- `src/components/providers/ValidationResult.tsx` — curl `<` response convention;
  deliberately does NOT fabricate a fake HTTP status code (API only returns
  `{valid, message}`, no real status code available) — shows `result: valid/invalid`
  instead, staying truthful
- Deleted for real this time: `ProviderGrid.tsx`, `ProviderCard.tsx`,
  `ProviderChecker.tsx` (v1 left the first two as unused dead code — fixed)
- `tests/validation.spec.ts` — rewritten for the new DOM; all 8 pass incl. a
  real network call against Groq's API for the invalid-key case

### Bugs found via actual Playwright screenshots (not guessing)
1. Featured-provider pills used `category === 'popular'` sliced to 8 — cut off
   OpenAI (alphabetically last) entirely. Fixed with an explicit curated
   `FEATURED_PROVIDER_IDS` priority list (openai, anthropic, gemini, groq,
   deepseek, mistral, openrouter, xai) — real-world usage prominence, not the
   registry's data-source category (DeepSeek is filed under "chinese" despite
   being one of the most-used APIs) and not alphabetical order.
2. `flex-1` on `<main>` forced the footer to the viewport bottom regardless of
   content height → large dead gap on any screen taller than the content.
   Fixed by letting the page flow naturally; leftover space now falls after
   the footer (normal), not between content and footer (looked broken).

### Design decisions worth remembering for next time
- The console is a terminal window, so it's always dark — does not flip with
  the site's light/dark toggle. Only the page chrome around it (header, hero,
  footer) responds to the toggle. Reduces variants to design/maintain, and is
  itself a deliberate, defensible choice (real terminal emulators don't change
  color with the OS theme either).
- Before trusting any AI-generated frontend pass as "done": actually launch it
  in Playwright and screenshot desktop light/dark + mobile + the interactive
  states, rather than reasoning about Tailwind classes in the abstract. Two
  real bugs above were only caught this way — reading the code gave no signal.

---

## 2026-07-22 — Full site rebuild: single tool → scrolling product page

### Why
User feedback: the v2 console (terminal/curl-preview concept, still good and
kept) was sitting on a page that otherwise looked "old school" — a static
block with no motion, no scroll, nothing that felt like a 2026 product site.
Asked for a complete visual rewamp: fluid, smooth-scrolling, researched
against current live sites, fully autonomous, no scope limit.

### What was built
Turned the single-block utility into a full scrolling product page while
keeping the actual tool (the terminal console) as the centerpiece, not a
footnote:
`Header (scroll-aware, Cmd+K) → Hero → Console → Provider marquee →
How it works → Security bento → Stats band → FAQ → Final CTA → Footer`

**New dependencies:** `motion` (scroll reveals, springs), `lenis` (inertia
smooth scroll), `cmdk` (accessible command palette), `geist` (Vercel's
Geist Sans/Mono — replaces IBM Plex Sans/JetBrains Mono site-wide).

**New architecture (all under `src/`):**
- `components/motion/` — `SmoothScrollProvider` (Lenis + global
  `MotionConfig reducedMotion="user"`), `Reveal` (shared scroll-reveal
  wrapper, one easing/duration system for the whole site via
  `lib/motion/variants.ts`), `AnimatedCounter`, `MagneticButton`,
  `useScrollToSection` / `useJumpToConsole` (Lenis-aware anchor nav).
- `components/decor/` — `AuroraBackground` (pure-CSS animated gradient
  blobs, transform-only so it's compositor-only/cheap), `NoiseOverlay`.
- `components/sections/` — one file per marketing section (Hero,
  ConsoleSection, ProviderMarquee, HowItWorks, SecurityBento, StatsBand,
  Faq, FinalCta), each pulling copy from `lib/content/*.ts` instead of
  hardcoding strings inline.
- `components/providers/ProviderSelectionContext.tsx` — lifts "which
  provider is selected" out of the console so the header's command
  palette, the provider marquee, and the console itself can all read/write
  the same selection without prop-drilling.
- `lib/providers/detectProvider.ts` — the actual friction-reduction
  feature, not just a reskin: recognizes ~12 providers' key *shapes*
  (`sk-ant-` → Anthropic, `AIzaSy` → Gemini, `gsk_` → Groq, `AKIA`/`ASIA` →
  Bedrock's access key field specifically, etc.) and routes a pasted key
  straight to the right form, pre-filled, zero provider-picking required.
  Falls back to a helpful message (not a dead end) when a key's shape isn't
  recognized. The console's search input now doubles as the paste target.
- `components/providers/CommandPalette.tsx` — Cmd+K/Ctrl+K: jump to any
  section or select any provider by name, from anywhere on the page.

### Design decisions
- Tokens: dropped the old `paper-*` custom scale for site chrome in favor
  of Tailwind's built-in `zinc` + `dark:` variants (one less bespoke thing
  to maintain — every Tailwind contributor already knows this pattern).
  Kept `ink-*` as-is (still the console's fixed-dark scale, per the prior
  entry's reasoning). New `accent` hue (indigo→violet, `#7C66F0`) is
  deliberately different from both prior passes' colors.
- Stats/security/FAQ copy is 100% checkable against the actual repo (no
  invented "rate limited" badge — grepped the codebase first and confirmed
  it isn't implemented yet, so it isn't claimed).
- Added the LICENSE file — README already claimed MIT but the file never
  existed. Small integrity fix while touching trust-related copy.
- `next lint` no longer exists in this Next.js version (the CLI subcommand
  was removed). Added `eslint.config.mjs` using `eslint-config-next`'s
  already-flat-config default export directly; `package.json`'s `lint`
  script now runs `eslint .`.

### Bugs found via testing (not by reading the code)
1. **Console picker↔form transition had a ~360ms mandatory delay.** I'd
   wrapped the provider-picker/key-form switch in
   `AnimatePresence mode="wait"` for polish. This directly contradicted a
   design decision already recorded in this log ("no custom animations on
   the provider list — speed matters for developer tools") and, worse, it
   was the root cause of a real interaction race: clicking a provider and
   immediately typing (which is exactly what a fast user — or a Playwright
   test — does) could land the keystroke while the old view was still
   exiting, silently losing it. Fixed by dropping `AnimatePresence` there
   entirely and going back to plain conditional rendering + the
   lightweight CSS `animate-fade-in` utility. Console interactions are
   instant again; full test suite went from ~25s to ~11s. The rest of the
   page (a one-time scroll-reveal, not a repeated action loop) keeps the
   fuller motion treatment.
2. **`Reveal`'s `whileInView` never fires for non-scrolled full captures**
   (Playwright `fullPage` screenshots, and — a real user-facing case —
   browser Print/Save-as-PDF). IntersectionObserver only fires on real
   scroll; a renderer that draws the whole page height in one pass without
   scrolling leaves below-the-fold content stuck at `opacity: 0`. Added a
   `@media print` override in `globals.css` that forces every motion value
   back to resting state. (For my own screenshot QA, the fix was simply to
   script a scroll-through before capturing — same underlying cause.)
3. `lucide-react` at the installed version ships **no brand/logo icons**
   (`Github`, etc. were removed, presumably over trademark concerns) —
   only generic icons remain (`GitFork` and friends). Swapped every
   `Github` icon usage for `GitFork`.
4. A `CommandGroup` heading's `uppercase` Tailwind class was applied to the
   whole group container, and `text-transform` is inherited — every item
   label under "NAVIGATE"/"PROVIDERS" rendered in caps too. Fixed by
   scoping the heading-only styles to `[cmdk-group-heading]` specifically
   via an arbitrary descendant selector.
5. React 18 Strict Mode's newer `react-hooks/set-state-in-effect` lint
   rule flags the common `useState(false)` + `useEffect(() => setState(true))`
   "mounted" pattern (used for hydration-safe client-only rendering, and
   already present in the pre-existing `ThemeToggle`). Replaced with
   `useSyncExternalStore(subscribeNever, () => true, () => false)` in a new
   `src/hooks/useHasMounted.ts` — same intent, no direct `setState` call in
   an effect body, and it's the one other client-only value (`useIsMac` in
   `SiteHeader`) needed too.

### Verification performed
`chrome-devtools` MCP could not attach in this sandbox (Chrome 150's newer
remote-debugging restriction on the default profile directory, and no OS
Accessibility permission available to toggle `chrome://inspect`'s in-app
remote-debugging switch programmatically). Used Playwright directly
instead (already a project dependency): full `tsc --noEmit` + `eslint .` +
`next build` all clean; full Playwright suite (12 tests, including new
coverage for paste-detection and the command palette) green on repeated
runs, both parallel and `--workers=1`; manual screenshot sweep of desktop
light/dark, mobile, and every interactive state against the **production**
build (`next build && next start`, not just `next dev`) — zero console/page
errors throughout.

### Next steps (optional future improvements)
- Real provider logos/icons (still text-only chips — noted as a gap since
  the very first entry in this log; still true).
- A `NEXT_PUBLIC_APP_URL`-driven `metadataBase` instead of the hardcoded
  placeholder domain in `layout.tsx`, once a real production domain exists.
- Rate limiting on `/api/validate` (referenced as *not yet done* in the new
  security copy — keep that copy honest if this gets built).

---

## 2026-07-22 — "Nothing works" when shared via a random local port

### What happened
Asked to spin the app up on a random port and share the link. First attempt
used `next dev -p <port>`. User reported "nothing works." Dev server log
showed why:
```
⚠ Blocked cross-origin request to Next.js dev resource /_next/webpack-hmr
  from "192.168.42.3". Cross-origin access to Next.js dev resources is
  blocked by default for safety.
```
`next dev`'s dev-only resources (HMR websocket, etc.) refuse cross-origin
requests unless the origin is added to `allowedDevOrigins` in
`next.config.ts` — and accessing via the LAN IP (rather than `localhost`)
counts as cross-origin. Right lesson: a dev server was the wrong tool for
"here's a link to click," full stop — production doesn't have this whole
class of restriction (no HMR to block).

### Fix
Serve `next build && next start -p <port>` instead for any "give me a
link" request going forward. Verified with Playwright against **both**
`localhost` and the LAN IP: page loads, zero console/request errors,
provider-pick + type-into-field interactivity confirmed on both origins.

### Also found while verifying (unrelated, fixed anyway)
A raw `locator.click()` on an off-screen element (Playwright's own
actionability auto-scroll, not a real user gesture) could land the target
just outside `Reveal`'s `-10%/-10%` viewport margin, leaving it stuck at
`opacity: 0` despite being interactive. Confirmed the actual real-user
paths were already fine (gradual scroll, Lenis-animated smooth-scroll from
the CTA, and direct `#section` anchor-link navigation on load all check
out at `opacity: 1`) — but softened the margin to `0px 0px -5% 0px` anyway
(shrink only the bottom edge, only slightly) since it costs nothing and
removes a theoretical failure mode. See `src/components/motion/Reveal.tsx`.

### Lesson for next time
When asked to "spin up and give me a link" (as opposed to "start the dev
server"), default to a production build. Dev mode's HMR/cross-origin
protections are correct behavior for local development but will look like
a completely broken app to anyone who isn't `localhost`.

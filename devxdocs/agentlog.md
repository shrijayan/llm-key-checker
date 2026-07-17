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

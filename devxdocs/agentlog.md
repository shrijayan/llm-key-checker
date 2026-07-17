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

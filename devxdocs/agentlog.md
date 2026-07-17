# Agent Log

## 2026-07-17
- Designed full CI/CD setup for Next.js + Vercel + GitHub project
- Created: renovate.json (primary dep update tool with auto-merge rules)
- Created: .github/dependabot.yml (alternative to Renovate, or GitHub Actions updates only)
- Created: .github/workflows/ci.yml (build + lint on every PR)
- Created: .github/workflows/auto-merge.yml (Dependabot auto-merge, only needed if NOT using Renovate)
- Recommendation: use Renovate (not Dependabot) for npm — better grouping, native automerge, minimumReleaseAge safety
- Vercel deploys automatically via GitHub App — no Actions workflow needed for deployment

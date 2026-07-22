import type { LucideIcon } from 'lucide-react'
import { ShieldOff, Zap, Code2, UserX, Lock, RefreshCw } from 'lucide-react'

export interface SecurityItem {
  icon: LucideIcon
  title: string
  description: string
}

/**
 * Every claim here is checkable against the actual source in the repo —
 * see next.config.ts for headers, api/validate/route.ts for storage
 * behavior, and .github/workflows/sync-providers.yml for the registry sync.
 * Nothing is listed that isn't actually implemented (no fabricated "rate
 * limited" badge, for example — that's still on the roadmap).
 *
 * Six equal cards, rendered in a 3x2 grid — deliberately simple so adding a
 * 7th fact later is a one-line change, not a span-math puzzle.
 */
export const SECURITY_ITEMS: SecurityItem[] = [
  {
    icon: ShieldOff,
    title: 'Zero storage',
    description:
      'Your key exists in memory for exactly one request, then it\u2019s gone. No database, no cache, no disk.',
  },
  {
    icon: Zap,
    title: 'Stateless functions',
    description: 'Every check runs in an ephemeral serverless function with nothing to breach later.',
  },
  {
    icon: Code2,
    title: 'Open source',
    description: 'Every validator is public. Read the exact request before you trust it with a key.',
  },
  {
    icon: UserX,
    title: 'No accounts, no tracking',
    description: 'No login, no analytics script, nothing that could ever correlate you with a key.',
  },
  {
    icon: Lock,
    title: 'Hardened by default',
    description:
      'HTTPS-only, strict referrer policy, no framing, no MIME sniffing — enforced on every response.',
  },
  {
    icon: RefreshCw,
    title: 'Self-updating registry',
    description: 'The provider list syncs daily from LiteLLM and is tested in CI before it ever reaches you.',
  },
]

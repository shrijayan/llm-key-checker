import { ShieldCheck, Zap, GitBranch } from 'lucide-react'

const ITEMS = [
  { icon: ShieldCheck, label: 'no storage' },
  { icon: Zap, label: 'stateless' },
  { icon: GitBranch, label: 'open source' },
] as const

export function TrustBadge() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 font-mono text-xs text-zinc-500 dark:text-zinc-400">
      {ITEMS.map(({ icon: Icon, label }) => (
        <span key={label} className="flex items-center gap-1.5">
          <Icon className="w-3.5 h-3.5 text-success-600 dark:text-success-400" />
          {label}
        </span>
      ))}
    </div>
  )
}

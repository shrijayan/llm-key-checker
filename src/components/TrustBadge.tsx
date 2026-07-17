import { Shield, Code, Eye } from 'lucide-react'

export function TrustBadge() {
  return (
    <div className="mb-8 p-4 rounded-xl border border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-950/30">
      <div className="flex flex-wrap justify-center gap-6 text-sm text-green-700 dark:text-green-400">
        <span className="flex items-center gap-2">
          <Shield className="w-4 h-4" />
          No backend storage — keys never saved
        </span>
        <span className="flex items-center gap-2">
          <Eye className="w-4 h-4" />
          Stateless edge function — discards after check
        </span>
        <span className="flex items-center gap-2">
          <Code className="w-4 h-4" />
          Open source — verify the code yourself
        </span>
      </div>
    </div>
  )
}

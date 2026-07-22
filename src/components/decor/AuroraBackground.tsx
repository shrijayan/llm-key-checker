interface AuroraBackgroundProps {
  className?: string
}

/**
 * Slow-drifting gradient blobs behind the hero. Pure CSS (transform +
 * animation, no JavaScript), so it costs nothing on the main thread and
 * keeps scrolling smooth. Respects `prefers-reduced-motion` globally via the
 * base stylesheet, which freezes all animations for those users.
 */
export function AuroraBackground({ className }: AuroraBackgroundProps) {
  return (
    <div
      aria-hidden="true"
      className={`pointer-events-none absolute inset-0 -z-10 overflow-hidden ${className ?? ''}`}
    >
      <div className="animate-aurora-1 absolute left-1/2 top-[-12%] h-[34rem] w-[34rem] -translate-x-1/2 rounded-full bg-accent-500/25 blur-[110px] dark:bg-accent-500/25" />
      <div className="animate-aurora-2 absolute right-[-12%] top-[6%] h-[28rem] w-[28rem] rounded-full bg-violet-400/20 blur-[100px] dark:bg-violet-500/20" />
      <div className="animate-aurora-3 absolute left-[-14%] bottom-[-18%] h-[30rem] w-[30rem] rounded-full bg-cyan-300/20 blur-[110px] dark:bg-cyan-400/15" />
    </div>
  )
}

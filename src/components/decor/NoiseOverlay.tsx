/**
 * A fixed, whole-viewport grain texture. At this low an opacity it reads as
 * "considered" rather than "broken" — the same trick used on most premium
 * dark-mode product sites to keep large flat surfaces from looking sterile.
 * `pointer-events-none` keeps it from ever intercepting a click.
 */
export function NoiseOverlay() {
  return (
    <div
      aria-hidden="true"
      className="bg-noise pointer-events-none fixed inset-0 z-30 opacity-[0.025] dark:opacity-[0.05]"
    />
  )
}

import { ImageResponse } from 'next/og'

/** Exact path data from lucide-react's KeyRound icon — same mark already used as the header wordmark, kept in sync by using the same source. */
const KEY_PATH =
  'M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z'

interface BuildIconOptions {
  size: number
  /** Apple applies its own corner-rounding mask to touch icons — give it a full square there. Everywhere else looks better with rounding baked in. */
  rounded?: boolean
}

/**
 * Shared renderer behind icon.tsx and apple-icon.tsx — same brand mark
 * (the gradient + key glyph from the site header), generated at whatever
 * size each file convention needs instead of hand-exporting static PNGs.
 */
export function buildIconResponse({ size, rounded = true }: BuildIconOptions) {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #7C66F0 0%, #A855F7 60%, #22D3EE 100%)',
          borderRadius: rounded ? size * 0.22 : 0,
        }}
      >
        <svg
          width={size * 0.6}
          height={size * 0.6}
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d={KEY_PATH} />
          <circle cx="16.5" cy="7.5" r="0.5" fill="white" stroke="none" />
        </svg>
      </div>
    ),
    { width: size, height: size }
  )
}

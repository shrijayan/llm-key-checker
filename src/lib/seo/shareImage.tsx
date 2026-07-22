import { ImageResponse } from 'next/og'
import { ALL_PROVIDERS } from '@/lib/providers/registry'

const KEY_PATH =
  'M2.586 17.414A2 2 0 0 0 2 18.828V21a1 1 0 0 0 1 1h3a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h1a1 1 0 0 0 1-1v-1a1 1 0 0 1 1-1h.172a2 2 0 0 0 1.414-.586l.814-.814a6.5 6.5 0 1 0-4-4z'

export const shareImageSize = { width: 1200, height: 630 }

/**
 * Shared renderer behind opengraph-image.tsx and twitter-image.tsx — one
 * design, generated on demand instead of a hand-exported static asset that
 * would quietly drift out of sync with the real provider count or copy.
 */
export function buildShareImageResponse() {
  const providerCount = ALL_PROVIDERS.length

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#08090c',
          backgroundImage:
            'radial-gradient(circle at 26% 22%, rgba(124,102,240,0.38), transparent 52%), ' +
            'radial-gradient(circle at 76% 70%, rgba(34,211,238,0.28), transparent 50%)',
          padding: '64px',
          fontFamily: 'Inter, system-ui, sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 56 }}>
          <div
            style={{
              display: 'flex',
              width: 52,
              height: 52,
              borderRadius: 14,
              alignItems: 'center',
              justifyContent: 'center',
              background: 'linear-gradient(135deg, #7C66F0 0%, #A855F7 60%, #22D3EE 100%)',
            }}
          >
            <svg
              width={30}
              height={30}
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
          <div style={{ display: 'flex', fontSize: 30, fontWeight: 600, color: '#e4e4e7' }}>
            key-checker
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}
        >
          <div style={{ display: 'flex', fontSize: 62, fontWeight: 700, color: 'white' }}>
            Does your API key
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: 62,
              fontWeight: 700,
              marginTop: 4,
              backgroundImage: 'linear-gradient(90deg, #9c88fb, #c084fc, #22d3ee)',
              backgroundClip: 'text',
              color: 'transparent',
            }}
          >
            actually work?
          </div>
        </div>

        <div style={{ display: 'flex', marginTop: 44, fontSize: 26, color: '#a1a1aa' }}>
          {providerCount}+ providers · open source · zero storage
        </div>
      </div>
    ),
    { ...shareImageSize }
  )
}

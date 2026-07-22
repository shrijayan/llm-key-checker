import { buildIconResponse } from '@/lib/seo/icon'

export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

/** iOS applies its own corner-rounding mask to touch icons, so this one ships as a full square. */
export default function AppleIcon() {
  return buildIconResponse({ size: 180, rounded: false })
}

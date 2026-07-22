import { buildShareImageResponse, shareImageSize } from '@/lib/seo/shareImage'

export const alt = 'LLM Key Checker — Does your API key actually work?'
export const size = shareImageSize
export const contentType = 'image/png'

export default function TwitterImage() {
  return buildShareImageResponse()
}

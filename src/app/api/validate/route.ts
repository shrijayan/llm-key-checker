import { NextRequest, NextResponse } from 'next/server'
import { getProvider } from '@/lib/providers/registry'
import { validate } from '@/lib/providers/validators/index'
import type { ValidationRequest } from '@/lib/providers/types'

export const runtime = 'nodejs'  // Use nodejs for @aws-sdk compatibility

export async function POST(request: NextRequest) {
  let body: ValidationRequest

  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { valid: false, message: 'Invalid request body' },
      { status: 400 }
    )
  }

  const { providerId, credentials } = body

  if (!providerId || typeof providerId !== 'string') {
    return NextResponse.json(
      { valid: false, message: 'providerId is required' },
      { status: 400 }
    )
  }

  if (!credentials || typeof credentials !== 'object') {
    return NextResponse.json(
      { valid: false, message: 'credentials is required' },
      { status: 400 }
    )
  }

  const provider = getProvider(providerId)
  if (!provider) {
    return NextResponse.json(
      { valid: false, message: `Unknown provider: ${providerId}` },
      { status: 400 }
    )
  }

  try {
    const result = await validate(provider, { providerId, credentials })
    return NextResponse.json(result)
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Validation failed'
    return NextResponse.json({ valid: false, message }, { status: 500 })
  }
}

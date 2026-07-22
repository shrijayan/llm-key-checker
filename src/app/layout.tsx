import type { Metadata, Viewport } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { ThemeProvider } from 'next-themes'
import { ALL_PROVIDERS } from '@/lib/providers/registry'
import { SmoothScrollProvider } from '@/components/motion/SmoothScrollProvider'
import './globals.css'

const providerCount = ALL_PROVIDERS.length

export const metadata: Metadata = {
  metadataBase: new URL('https://llm-key-checker.vercel.app'),
  title: 'LLM Key Checker — Does your API key actually work?',
  description: `Paste any LLM API key and get a real answer in seconds. Supports ${providerCount}+ providers including OpenAI, Anthropic, Gemini, Groq and AWS Bedrock. Open source. Zero storage, ever.`,
  keywords: ['LLM', 'API key', 'validator', 'OpenAI', 'Anthropic', 'Groq', 'Gemini', 'Bedrock'],
  openGraph: {
    title: 'LLM Key Checker',
    description: `Paste any LLM API key and get a real answer in seconds. ${providerCount}+ providers. Open source. Zero storage.`,
    type: 'website',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fafafa' },
    { media: '(prefers-color-scheme: dark)', color: '#08090c' },
  ],
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <SmoothScrollProvider>{children}</SmoothScrollProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}

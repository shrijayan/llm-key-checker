import type { Metadata } from 'next'
import { IBM_Plex_Sans, JetBrains_Mono } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import './globals.css'

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-ibm-plex-sans',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  weight: ['400', '500', '600'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'LLM Key Checker — Validate any LLM API key instantly',
  description:
    'Paste your LLM API key and instantly verify it works. Supports 65+ providers including OpenAI, Anthropic, Groq, Gemini, AWS Bedrock. Open source. No storage.',
  keywords: ['LLM', 'API key', 'validator', 'OpenAI', 'Anthropic', 'Groq', 'Gemini', 'Bedrock'],
  openGraph: {
    title: 'LLM Key Checker',
    description: 'Validate any LLM API key instantly. Open source. No storage.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${ibmPlexSans.variable} ${jetbrainsMono.variable}`}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

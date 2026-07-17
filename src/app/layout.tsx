import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { ThemeProvider } from 'next-themes'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'LLM Key Checker — Validate any LLM API key instantly',
  description:
    'Paste your LLM API key and instantly verify it works. Supports 50+ providers including OpenAI, Anthropic, Groq, Gemini, AWS Bedrock, and all Chinese providers. Open source. No backend storage.',
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
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}

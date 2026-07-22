import { SiteHeader } from '@/components/layout/SiteHeader'
import { SiteFooter } from '@/components/layout/SiteFooter'
import { Hero } from '@/components/sections/Hero'
import { ConsoleSection } from '@/components/sections/ConsoleSection'
import { ProviderMarquee } from '@/components/sections/ProviderMarquee'
import { HowItWorks } from '@/components/sections/HowItWorks'
import { SecurityBento } from '@/components/sections/SecurityBento'
import { StatsBand } from '@/components/sections/StatsBand'
import { Faq } from '@/components/sections/Faq'
import { FinalCta } from '@/components/sections/FinalCta'
import { NoiseOverlay } from '@/components/decor/NoiseOverlay'
import { ProviderSelectionProvider } from '@/components/providers/ProviderSelectionContext'
import { ALL_PROVIDERS } from '@/lib/providers/registry'

export default function Home() {
  return (
    <ProviderSelectionProvider>
      <div className="relative flex min-h-screen flex-col overflow-x-clip">
        <NoiseOverlay />
        <SiteHeader />

        <main>
          <Hero />
          <ConsoleSection />
          <ProviderMarquee providers={ALL_PROVIDERS} />
          <HowItWorks />
          <SecurityBento />
          <StatsBand />
          <Faq />
          <FinalCta />
        </main>

        <SiteFooter />
      </div>
    </ProviderSelectionProvider>
  )
}

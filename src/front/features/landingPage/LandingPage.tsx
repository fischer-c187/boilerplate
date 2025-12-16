import { CtaSection } from './CtaSection'
import { FaqSection } from './FaqSection'
import { FeaturesGrid } from './FeaturesGrid'
import { HeroSection } from './HeroSection'
import { PricingSection } from './PricingSection'
import { TechStackMarquee } from './TechStackMarquee'

export function LandingPage() {
  return (
    <main className="flex-grow">
      <HeroSection />
      <TechStackMarquee />
      <FeaturesGrid />
      <PricingSection />
      <FaqSection />
      <CtaSection />
    </main>
  )
}

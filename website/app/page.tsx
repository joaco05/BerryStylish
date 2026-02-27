import { Navbar } from "@/components/landing/navbar"
import { HeroSection } from "@/components/landing/hero-section"
import { MarqueeBanner } from "@/components/landing/marquee-banner"
import { FeaturesSection } from "@/components/landing/features-section"
import { HowItWorks } from "@/components/landing/how-it-works"
import { NFTShowcase } from "@/components/landing/nft-showcase"
import { RoadmapSection } from "@/components/landing/roadmap-section"
import { CTASection } from "@/components/landing/cta-section"
import { Footer } from "@/components/landing/footer"

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <MarqueeBanner />
        <FeaturesSection />
        <HowItWorks />
        <NFTShowcase />
        <RoadmapSection />
        <CTASection />
      </main>
      <Footer />
    </>
  )
}

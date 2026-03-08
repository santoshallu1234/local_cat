import { Hero } from "@/components/hero"
import { Features } from "@/components/features"
import { HowItWorks } from "@/components/how-it-works"
import { AnswerIndication } from "@/components/answer-indication"
import { CodingAssistance } from "@/components/coding-assistance"
import { AssessmentEnvironments } from "@/components/assessment-environments"
import { AppPreview } from "@/components/app-preview"
import { Performance } from "@/components/performance"
import { Trust } from "@/components/trust"
import { DownloadCTA } from "@/components/download-cta"
import { Footer } from "@/components/footer"
import { Navigation } from "@/components/navigation"

export default function Home() {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <AnswerIndication />
        <CodingAssistance />
        <AssessmentEnvironments />
        <AppPreview />
        <Performance />
        <Trust />
        <DownloadCTA />
      </main>
      <Footer />
    </div>
  )
}
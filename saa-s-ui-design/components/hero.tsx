"use client"

import { Button } from "@/components/ui/button"
import { Download, Play } from "lucide-react"
import { useEffect, useState } from "react"

export function Hero() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="relative overflow-hidden pt-32 pb-24 lg:pt-40 lg:pb-32">
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      </div>

      <div className="container mx-auto px-4 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div
            className={`mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-1.5 text-sm backdrop-blur-sm transition-all duration-700 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
            </span>
            Windows Desktop Application Available
          </div>

          <h1
            className={`mb-6 text-balance text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl transition-all duration-700 delay-100 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            When preparation meets precision.
          </h1>

          <p
            className={`mb-10 text-balance text-lg text-muted-foreground sm:text-xl lg:text-2xl transition-all duration-700 delay-200 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            An intelligent desktop companion designed to assist during aptitude tests, coding rounds, and assessments.
          </p>

          <div
            className={`flex flex-col items-center justify-center gap-4 sm:flex-row transition-all duration-700 delay-300 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
          >
            <Button size="lg" className="gap-2 text-base hover:scale-105 transition-transform">
              <Download className="h-5 w-5" />
              Download Windows App
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="gap-2 text-base bg-transparent hover:scale-105 transition-transform"
            >
              <Play className="h-5 w-5" />
              See How It Works
            </Button>
          </div>

          <div
            className={`mt-16 lg:mt-20 transition-all duration-1000 delay-500 ${
              isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
            }`}
          >
            <div className="relative mx-auto aspect-[16/9] max-w-5xl overflow-hidden rounded-xl border border-border bg-gradient-to-br from-muted/50 to-muted shadow-2xl backdrop-blur-sm animate-in fade-in duration-1000">
              <div className="absolute inset-0 flex items-center justify-center">
                <img
                  src="/abstract-ai-desktop-workflow-interface-modern.jpg"
                  alt="AI Assistant Interface"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -skew-x-12 animate-[shimmer_3s_ease-in-out_infinite]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

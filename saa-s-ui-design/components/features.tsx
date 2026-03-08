"use client"

import { Brain, Code, Gauge, Layout, Sparkles, Zap } from "lucide-react"
import { Card } from "@/components/ui/card"
import { useEffect, useRef, useState } from "react"

const features = [
  {
    icon: Sparkles,
    title: "Smart MCQ Detection",
    description: "Automatically identifies questions on screen and provides instant assistance.",
  },
  {
    icon: Brain,
    title: "Aptitude & Reasoning Engine",
    description: "Handles quantitative aptitude, logical reasoning, and verbal ability in real time.",
  },
  {
    icon: Code,
    title: "Coding Round Support",
    description: "Solves programming questions using algorithmic and optimized approaches.",
  },
  {
    icon: Layout,
    title: "Desktop-Level Intelligence",
    description: "Works seamlessly across test platforms via a secure Windows application.",
  },
  {
    icon: Zap,
    title: "Low-Latency Responses",
    description: "Optimized for speed with near-instant outputs.",
  },
  {
    icon: Gauge,
    title: "Discreet & Minimal UI",
    description: "Stays out of the way while you focus on the task.",
  },
]

export function Features() {
  const [visibleCards, setVisibleCards] = useState<number[]>([])
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Stagger the animation of cards
            features.forEach((_, index) => {
              setTimeout(() => {
                setVisibleCards((prev) => [...prev, index])
              }, index * 100)
            })
            observer.disconnect()
          }
        })
      },
      { threshold: 0.1 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section id="features" className="py-24 lg:py-32" ref={sectionRef}>
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-balance text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Powerful features for seamless assistance
          </h2>
          <p className="text-balance text-lg text-muted-foreground">
            Built to help you excel in assessments with intelligent, real-time support.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon
            const isVisible = visibleCards.includes(index)
            return (
              <Card
                key={feature.title}
                className={`group relative overflow-hidden border border-border/50 bg-card/50 p-6 backdrop-blur-sm transition-all duration-500 hover:border-border hover:bg-card/80 hover:shadow-lg ${
                  isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                }`}
              >
                <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">{feature.description}</p>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}

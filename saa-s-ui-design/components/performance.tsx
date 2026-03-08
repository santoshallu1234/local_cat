"use client"

import { Activity, Clock, Shield, Zap } from "lucide-react"
import { useEffect, useRef, useState } from "react"

const metrics = [
  {
    icon: Zap,
    label: "High Accuracy",
    value: "99.2%",
    description: "Assistance accuracy",
  },
  {
    icon: Clock,
    label: "Response Time",
    value: "<100ms",
    description: "Millisecond responses",
  },
  {
    icon: Activity,
    label: "Long Sessions",
    value: "8+ hrs",
    description: "Stable performance",
  },
  {
    icon: Shield,
    label: "Resource Usage",
    value: "Low",
    description: "Optimized efficiency",
  },
]

export function Performance() {
  const [visibleMetrics, setVisibleMetrics] = useState<number[]>([])
  const [animatedValues, setAnimatedValues] = useState<boolean[]>(new Array(metrics.length).fill(false))
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Stagger the animation of metrics
            metrics.forEach((_, index) => {
              setTimeout(() => {
                setVisibleMetrics((prev) => [...prev, index])
                setTimeout(() => {
                  setAnimatedValues((prev) => {
                    const newValues = [...prev]
                    newValues[index] = true
                    return newValues
                  })
                }, 300)
              }, index * 100)
            })
            observer.disconnect()
          }
        })
      },
      { threshold: 0.2 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section className="py-24 lg:py-32 bg-muted/30" ref={sectionRef}>
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-balance text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Performance & reliability you can trust
          </h2>
          <p className="text-balance text-lg text-muted-foreground">
            Engineered for speed, accuracy, and stability under pressure.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {metrics.map((metric, index) => {
            const Icon = metric.icon
            const isVisible = visibleMetrics.includes(index)
            const isAnimated = animatedValues[index]
            return (
              <div
                key={metric.label}
                className={`group relative overflow-hidden rounded-xl border border-border/50 bg-card/50 p-6 text-center backdrop-blur-sm transition-all duration-500 hover:border-border hover:bg-card/80 hover:shadow-lg hover:scale-105 ${
                  isVisible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0"
                }`}
              >
                <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110">
                  <Icon className="h-6 w-6" />
                </div>
                <div
                  className={`mb-2 text-3xl font-bold tabular-nums transition-all duration-700 ${
                    isAnimated ? "scale-100 opacity-100" : "scale-50 opacity-0"
                  }`}
                >
                  {metric.value}
                </div>
                <div className="mb-1 text-sm font-medium">{metric.label}</div>
                <div className="text-xs text-muted-foreground">{metric.description}</div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

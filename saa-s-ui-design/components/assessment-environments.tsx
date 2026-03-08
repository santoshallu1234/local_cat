"use client"

import { useEffect, useRef, useState } from "react"

export function AssessmentEnvironments() {
  const [animationPhase, setAnimationPhase] = useState(0)
  const sectionRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return

    const interval = setInterval(() => {
      setAnimationPhase((prev) => (prev + 1) % 6)
    }, 3000)

    return () => clearInterval(interval)
  }, [isVisible])

  const platforms = ["Unstop", "Superset", "GoDigital", "Mettl", "HackerRank", "CodeChef"]

  const environments = [
    { label: "Browser", position: "top-4 left-4" },
    { label: "Secure Test", position: "top-4 right-4" },
    { label: "Code Editor", position: "bottom-4 left-4" },
    { label: "MCQ Interface", position: "bottom-4 right-4" },
  ]

  return (
    <section
      ref={sectionRef}
      className="relative py-32 overflow-hidden bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950"
    >
      {/* Background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-20" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Built for Real Assessment Environments</h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Designed to operate seamlessly within existing workflows
          </p>
        </div>

        {/* Cinematic Animation Container */}
        <div className="relative max-w-5xl mx-auto aspect-video bg-slate-950/50 rounded-3xl border border-slate-800/50 backdrop-blur-sm overflow-hidden">
          {/* Central Core Engine */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div
              className={`relative transition-all duration-1000 ${
                animationPhase >= 0 ? "opacity-100 scale-100" : "opacity-0 scale-50"
              }`}
            >
              {/* Pulsing Core */}
              <div className="relative">
                <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-3xl animate-pulse" />
                <div className="relative bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full p-12 md:p-16">
                  <div className="w-32 h-32 md:w-40 md:h-40 bg-slate-950 rounded-full flex items-center justify-center border-2 border-indigo-400/50">
                    <div className="text-center">
                      <div className="text-sm md:text-base font-semibold text-indigo-300">Local Desktop</div>
                      <div className="text-xs md:text-sm font-medium text-indigo-400">Intelligence</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Orbiting Data Particles */}
              <div
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  animationPhase >= 1 ? "opacity-100" : "opacity-0"
                }`}
              >
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-2 h-2 bg-indigo-400/60 rounded-full"
                    style={{
                      top: "50%",
                      left: "50%",
                      animation: `orbit ${4 + i * 0.5}s linear infinite`,
                      animationDelay: `${i * 0.5}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Assessment Environment Frames */}
          {environments.map((env, index) => (
            <div
              key={env.label}
              className={`absolute ${env.position} transition-all duration-1000 ${
                animationPhase >= 2
                  ? "opacity-100 translate-x-0 translate-y-0"
                  : index === 0
                    ? "opacity-0 -translate-x-8 -translate-y-8"
                    : index === 1
                      ? "opacity-0 translate-x-8 -translate-y-8"
                      : index === 2
                        ? "opacity-0 -translate-x-8 translate-y-8"
                        : "opacity-0 translate-x-8 translate-y-8"
              }`}
            >
              <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4 md:p-6 min-w-[140px] md:min-w-[180px]">
                <div className="w-12 h-12 bg-slate-700/50 rounded-lg mb-2 flex items-center justify-center">
                  <div className="w-6 h-6 border-2 border-slate-500 rounded" />
                </div>
                <div className="text-xs font-medium text-slate-400">{env.label}</div>
              </div>
            </div>
          ))}

          {/* Platform Compatibility Labels */}
          <div
            className={`absolute bottom-8 left-1/2 -translate-x-1/2 transition-all duration-1000 ${
              animationPhase >= 3 ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
          >
            <div className="flex flex-wrap gap-3 md:gap-4 justify-center px-4">
              {platforms.map((platform) => (
                <div
                  key={platform}
                  className="px-3 md:px-4 py-1.5 md:py-2 bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-full text-xs md:text-sm font-medium text-slate-400"
                >
                  {platform}
                </div>
              ))}
            </div>
          </div>

          {/* Adaptive Shield Layer */}
          <div
            className={`absolute inset-0 transition-opacity duration-1000 ${
              animationPhase >= 4 ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-indigo-500/5 to-transparent animate-shimmer" />
            <div className="absolute inset-8 border-2 border-indigo-500/20 rounded-2xl" />
          </div>

          {/* Zero Disruption Message */}
          {animationPhase === 5 && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-1000">
              <div className="text-center space-y-3 px-4">
                <div className="text-2xl md:text-3xl font-bold text-white">No interference. No disruption.</div>
                <div className="text-xl md:text-2xl font-semibold text-indigo-400">Just assistance.</div>
              </div>
            </div>
          )}
        </div>

        {/* Confidence Statement */}
        <div
          className={`text-center mt-12 transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <p className="text-lg md:text-xl font-semibold text-slate-300">Trusted in real placement scenarios.</p>
        </div>
      </div>

      <style jsx>{`
        @keyframes orbit {
          0% {
            transform: translate(-50%, -50%) rotate(0deg) translateX(150px) rotate(0deg);
          }
          100% {
            transform: translate(-50%, -50%) rotate(360deg) translateX(150px)
              rotate(-360deg);
          }
        }
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 3s infinite;
        }
      `}</style>
    </section>
  )
}

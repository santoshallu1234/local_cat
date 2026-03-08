"use client"

import { useEffect, useState } from "react"
import { ArrowUpLeft, ArrowUpRight, ArrowDownLeft, ArrowDownRight } from "lucide-react"

export function AnswerIndication() {
  const [step, setStep] = useState(0)
  const [direction, setDirection] = useState<"topLeft" | "topRight" | "bottomLeft" | "bottomRight">("topRight")

  useEffect(() => {
    const directions: Array<"topLeft" | "topRight" | "bottomLeft" | "bottomRight"> = [
      "topRight",
      "topLeft",
      "bottomRight",
      "bottomLeft",
    ]
    const currentDirectionIndex = directions.indexOf(direction)

    const timer = setTimeout(
      () => {
        if (step === 0)
          setStep(1) // Show keyboard
        else if (step === 1)
          setStep(2) // Show processing
        else if (step === 2)
          setStep(3) // Show cursor movement
        else if (step === 3)
          setStep(4) // Show answer highlight
        else if (step === 4) {
          // Reset and cycle to next direction
          setStep(0)
          setDirection(directions[(currentDirectionIndex + 1) % directions.length])
        }
      },
      step === 2 ? 1500 : step === 3 ? 2000 : step === 4 ? 2000 : 1500,
    )

    return () => clearTimeout(timer)
  }, [step, direction])

  const getDirectionLabel = () => {
    switch (direction) {
      case "topLeft":
        return "A"
      case "topRight":
        return "B"
      case "bottomLeft":
        return "C"
      case "bottomRight":
        return "D"
    }
  }

  const getCursorTransform = () => {
    if (step !== 3) return "translate(-50%, -50%)"
    switch (direction) {
      case "topLeft":
        return "translate(calc(-50% - 30px), calc(-50% - 30px))"
      case "topRight":
        return "translate(calc(-50% + 30px), calc(-50% - 30px))"
      case "bottomLeft":
        return "translate(calc(-50% - 30px), calc(-50% + 30px))"
      case "bottomRight":
        return "translate(calc(-50% + 30px), calc(-50% + 30px))"
    }
  }

  return (
    <section className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/50 to-background" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-balance">How Answer Indication Works</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto text-balance">
            A precise, keyboard-driven system that communicates answers through directional cursor movement
          </p>
        </div>

        {/* Main Animation Container */}
        <div className="max-w-5xl mx-auto mb-12">
          <div className="relative bg-card border border-border rounded-2xl overflow-hidden shadow-2xl">
            {/* Mock Assessment Interface */}
            <div className="bg-slate-900/90 p-8">
              {/* Question Header */}
              <div className="mb-8 pb-4 border-b border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-slate-400">Question 12 of 50</span>
                  <span className="text-sm text-slate-400">Time: 45:23</span>
                </div>
              </div>

              {/* Question */}
              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-6 text-slate-100">
                  What is the time complexity of binary search in a sorted array?
                </h3>

                {/* Options */}
                <div className="space-y-3">
                  {[
                    { id: "A", text: "O(n²)", dir: "topLeft" },
                    { id: "B", text: "O(log n)", dir: "topRight" },
                    { id: "C", text: "O(n)", dir: "bottomLeft" },
                    { id: "D", text: "O(1)", dir: "bottomRight" },
                  ].map((option) => (
                    <div
                      key={option.id}
                      className={`relative p-4 rounded-lg border transition-all duration-500 ${
                        step === 4 && direction === option.dir
                          ? "bg-blue-500/20 border-blue-500 shadow-lg shadow-blue-500/20"
                          : "bg-slate-800/50 border-slate-700"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-700 text-sm font-medium text-slate-200">
                          {option.id}
                        </span>
                        <span className="text-slate-200">{option.text}</span>
                      </div>
                      {step === 4 && direction === option.dir && (
                        <div className="absolute -top-3 right-4 bg-blue-500 text-white text-xs px-3 py-1 rounded-full shadow-lg animate-in fade-in slide-in-from-top-2">
                          Suggested answer
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Cursor */}
              <div className="relative h-40 flex items-center justify-center">
                <div
                  className="absolute transition-all duration-1000 ease-out"
                  style={{
                    left: "50%",
                    top: "50%",
                    transform: getCursorTransform(),
                  }}
                >
                  <div className="relative">
                    {/* Cursor Icon */}
                    <svg width="24" height="24" viewBox="0 0 24 24" className="text-white filter drop-shadow-lg">
                      <path fill="currentColor" d="M8.5 2L3 21l7.5-5L18 21l-2-8h6z" />
                    </svg>

                    {/* Processing Loader */}
                    {step === 2 && (
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 animate-in fade-in">
                        <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                  </div>
                </div>

                {/* Step Indicators */}
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-center">
                  {step === 1 && (
                    <div className="bg-blue-500/20 border border-blue-500 rounded-lg px-4 py-2 animate-in fade-in slide-in-from-bottom-2">
                      <span className="text-sm text-blue-300">Shortcut triggered</span>
                    </div>
                  )}
                  {step === 2 && (
                    <div className="bg-amber-500/20 border border-amber-500 rounded-lg px-4 py-2 animate-in fade-in slide-in-from-bottom-2">
                      <span className="text-sm text-amber-300">Analyzing question...</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Keyboard Overlay */}
              {step === 1 && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
                  <div className="bg-slate-800 border border-slate-600 rounded-xl p-6 shadow-2xl animate-in zoom-in-95">
                    <div className="flex items-center gap-2 mb-2">
                      {["Ctrl", "Shift", "Y"].map((key, idx) => (
                        <div key={key}>
                          <div
                            className="px-4 py-2 bg-slate-700 border-2 border-blue-500 rounded-lg text-white font-mono shadow-lg shadow-blue-500/50 animate-pulse"
                            style={{ animationDelay: `${idx * 150}ms` }}
                          >
                            {key}
                          </div>
                        </div>
                      ))}
                    </div>
                    <p className="text-sm text-slate-300 text-center mt-3">Keyboard shortcut activated</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Direction Legend */}
        <div className="max-w-2xl mx-auto">
          <div className="bg-card border border-border rounded-xl p-8">
            <h3 className="text-lg font-semibold mb-6 text-center">Direction Mapping</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary">
                  <ArrowUpLeft className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-mono text-sm text-muted-foreground">Diagonal Top-Left</div>
                  <div className="font-semibold text-lg">Option A</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-mono text-sm text-muted-foreground">Diagonal Top-Right</div>
                  <div className="font-semibold text-lg">Option B</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary">
                  <ArrowDownLeft className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-mono text-sm text-muted-foreground">Diagonal Bottom-Left</div>
                  <div className="font-semibold text-lg">Option C</div>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary">
                  <ArrowDownRight className="w-5 h-5" />
                </div>
                <div>
                  <div className="font-mono text-sm text-muted-foreground">Diagonal Bottom-Right</div>
                  <div className="font-semibold text-lg">Option D</div>
                </div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground text-center mt-6">
              The cursor moves approximately 30px diagonally to indicate the suggested answer
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}

"use client"

import { useState, useEffect } from "react"
import { Code, Zap } from "lucide-react"

export function CodingAssistance() {
  const [step, setStep] = useState<"idle" | "trigger" | "processing" | "typing" | "complete">("idle")
  const [code, setCode] = useState("")
  const [tabPressCount, setTabPressCount] = useState(0)

  const fullCode = `function reverseString(str) {
  return str.split('').reverse().join('');
}`

  const codeSegments = [
    "f",
    "u",
    "n",
    "c",
    "t",
    "i",
    "o",
    "n",
    " ",
    "r",
    "e",
    "v",
    "e",
    "r",
    "s",
    "e",
    "S",
    "t",
    "r",
    "i",
    "n",
    "g",
    "(",
    "s",
    "t",
    "r",
    ")",
    " ",
    "{",
    "\n",
    "  ",
    "r",
    "e",
    "t",
    "u",
    "r",
    "n",
    " ",
    "s",
    "t",
    "r",
    ".",
    "s",
    "p",
    "l",
    "i",
    "t",
    "(",
    "'",
    "'",
    ")",
    ".",
    "r",
    "e",
    "v",
    "e",
    "r",
    "s",
    "e",
    "(",
    ")",
    ".",
    "j",
    "o",
    "i",
    "n",
    "(",
    "'",
    "'",
    ")",
    ";",
    "\n",
    "}",
  ]

  useEffect(() => {
    let timer: NodeJS.Timeout

    if (step === "idle") {
      timer = setTimeout(() => setStep("trigger"), 2000)
    } else if (step === "trigger") {
      timer = setTimeout(() => setStep("processing"), 1500)
    } else if (step === "processing") {
      timer = setTimeout(() => {
        setStep("typing")
        setTabPressCount(0)
        setCode("")
      }, 2000)
    } else if (step === "typing") {
      if (tabPressCount < codeSegments.length) {
        timer = setTimeout(() => {
          setCode((prev) => prev + codeSegments[tabPressCount])
          setTabPressCount((prev) => prev + 1)
        }, 150)
      } else {
        timer = setTimeout(() => setStep("complete"), 500)
      }
    } else if (step === "complete") {
      timer = setTimeout(() => {
        setStep("idle")
        setCode("")
        setTabPressCount(0)
      }, 3000)
    }

    return () => clearTimeout(timer)
  }, [step, tabPressCount])

  return (
    <section className="relative py-32 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-slate-950 to-background" />

      <div className="container relative z-10 mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Code className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Coding Assistance</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-balance">How Coding Assistance Works</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
            Watch how the TAB-driven code generation works in real-time
          </p>
        </div>

        {/* Main Demo Area */}
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-6 bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
            {/* Left: Problem Statement */}
            <div className="p-8 border-r border-slate-800">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="ml-2 text-sm text-slate-400">problem.txt</span>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-3">Problem:</h3>
                  <p className="text-slate-300 leading-relaxed">Write a function to reverse a string.</p>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-slate-400 mb-2">Constraints:</h4>
                  <ul className="text-slate-400 text-sm space-y-1 list-disc list-inside">
                    <li>Input: string</li>
                    <li>Output: reversed string</li>
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-slate-400 mb-2">Example:</h4>
                  <div className="bg-slate-950/50 rounded-lg p-3 font-mono text-sm">
                    <div className="text-slate-500">
                      Input: <span className="text-green-400">"hello"</span>
                    </div>
                    <div className="text-slate-500">
                      Output: <span className="text-blue-400">"olleh"</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Code Editor */}
            <div className="p-8 bg-slate-950/80 relative">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="ml-2 text-sm text-slate-400">solution.js</span>
              </div>

              <div className="font-mono text-sm min-h-[280px] relative">
                {step === "idle" && (
                  <div className="flex items-center">
                    <span className="text-slate-600">1</span>
                    <span className="ml-4 w-2 h-5 bg-slate-400 animate-pulse" />
                  </div>
                )}

                {(step === "trigger" || step === "processing" || step === "typing" || step === "complete") && (
                  <pre className="text-slate-200 whitespace-pre leading-relaxed">
                    <code className={step === "complete" ? "text-green-300" : ""}>
                      {code}
                      {step === "typing" && <span className="inline-block w-2 h-5 bg-blue-400 animate-pulse ml-0.5" />}
                    </code>
                  </pre>
                )}

                {step === "processing" && (
                  <div className="absolute top-0 left-0 flex items-center justify-center w-full h-full">
                    <div className="flex items-center gap-3 bg-slate-900/90 px-6 py-4 rounded-lg border border-slate-700">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-100" />
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse delay-200" />
                    </div>
                  </div>
                )}
              </div>

              {/* Status Caption */}
              <div className="mt-8 pt-6 border-t border-slate-800">
                <div className="text-sm text-center">
                  {step === "idle" && <span className="text-slate-500">Waiting for activation...</span>}
                  {step === "trigger" && (
                    <span className="text-blue-400 flex items-center justify-center gap-2">
                      <Zap className="w-4 h-4" />
                      Coding mode activated
                    </span>
                  )}
                  {step === "processing" && (
                    <span className="text-yellow-400">Analyzing problem & preparing solution...</span>
                  )}
                  {step === "typing" && (
                    <span className="text-blue-400">Each TAB reveals the next part of the solution</span>
                  )}
                  {step === "complete" && (
                    <span className="text-green-400 flex items-center justify-center gap-2">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Solution generated
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Keyboard Visualization */}
          <div className="mt-8 flex justify-center">
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-xl p-6 inline-block">
              <div className="flex items-center gap-3">
                {/* Ctrl Key */}
                <div
                  className={`px-4 py-3 rounded-lg border-2 font-mono text-sm font-semibold transition-all ${
                    step === "trigger"
                      ? "bg-blue-500 border-blue-400 text-white shadow-lg shadow-blue-500/50"
                      : "bg-slate-800 border-slate-700 text-slate-400"
                  }`}
                >
                  Ctrl
                </div>

                <span className="text-slate-600 text-xl">+</span>

                {/* Shift Key */}
                <div
                  className={`px-4 py-3 rounded-lg border-2 font-mono text-sm font-semibold transition-all ${
                    step === "trigger"
                      ? "bg-blue-500 border-blue-400 text-white shadow-lg shadow-blue-500/50"
                      : "bg-slate-800 border-slate-700 text-slate-400"
                  }`}
                >
                  Shift
                </div>

                <span className="text-slate-600 text-xl">+</span>

                {/* R Key */}
                <div
                  className={`px-4 py-3 rounded-lg border-2 font-mono text-sm font-semibold transition-all ${
                    step === "trigger"
                      ? "bg-blue-500 border-blue-400 text-white shadow-lg shadow-blue-500/50"
                      : "bg-slate-800 border-slate-700 text-slate-400"
                  }`}
                >
                  R
                </div>

                <span className="mx-4 text-slate-600">|</span>

                {/* Tab Key */}
                <div
                  className={`px-6 py-3 rounded-lg border-2 font-mono text-sm font-semibold transition-all ${
                    step === "typing"
                      ? "bg-green-500 border-green-400 text-white shadow-lg shadow-green-500/50 scale-110"
                      : "bg-slate-800 border-slate-700 text-slate-400"
                  }`}
                >
                  TAB
                </div>
              </div>
            </div>
          </div>

          {/* Legend - Always Visible */}
          <div className="mt-12 max-w-2xl mx-auto">
            <div className="bg-slate-900/30 backdrop-blur-sm border border-slate-800 rounded-xl p-6">
              <h3 className="text-sm font-semibold text-slate-300 mb-4 text-center">How It Works</h3>
              <div className="grid gap-3">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 flex-1">
                    <kbd className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-xs font-mono">Ctrl</kbd>
                    <span className="text-slate-600">+</span>
                    <kbd className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-xs font-mono">
                      Shift
                    </kbd>
                    <span className="text-slate-600">+</span>
                    <kbd className="px-2 py-1 bg-slate-800 border border-slate-700 rounded text-xs font-mono">R</kbd>
                  </div>
                  <span className="text-slate-600">→</span>
                  <span className="text-slate-400 text-sm flex-1">Start coding mode</span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 flex-1">
                    <span className="text-slate-400 text-sm">Wait ~2 seconds</span>
                  </div>
                  <span className="text-slate-600">→</span>
                  <span className="text-slate-400 text-sm flex-1">Analysis & preparation</span>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 flex-1">
                    <kbd className="px-3 py-1 bg-slate-800 border border-slate-700 rounded text-xs font-mono">TAB</kbd>
                    <span className="text-slate-600 text-xs">(press repeatedly)</span>
                  </div>
                  <span className="text-slate-600">→</span>
                  <span className="text-slate-400 text-sm flex-1">Print next code segment</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

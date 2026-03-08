"use client"

import { Button } from "@/components/ui/button"
import { Moon, Sun } from "lucide-react"
import { useEffect, useState } from "react"

export function Navigation() {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const root = document.documentElement
    const initialTheme = root.classList.contains("dark")
    setIsDark(initialTheme)
  }, [])

  const toggleTheme = () => {
    const root = document.documentElement
    root.classList.toggle("dark")
    setIsDark(!isDark)
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <span className="text-sm font-bold text-primary-foreground">AI</span>
              </div>
              <span className="text-lg font-semibold">AI Auto Marker</span>
            </div>
            <div className="hidden items-center gap-6 md:flex">
              <a href="/features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                Features
              </a>
              <a href="/faq" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                FAQ
              </a>
              <a href="/buy-token" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                Buy Token
              </a>
              <a href="/logs" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                Token Logs
              </a>
              <a href="/windows-app" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                Windows App
              </a>
              <a href="/contact" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                Contact
              </a>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={toggleTheme} className="h-9 w-9">
              {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              <span className="sr-only">Toggle theme</span>
            </Button>
            <Button variant="outline" className="hidden sm:inline-flex bg-transparent">
              Sign In
            </Button>
            <Button>Get Started</Button>
          </div>
        </div>
      </div>
    </nav>
  )
}

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-muted/30">
      <div className="container mx-auto px-4 py-12 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="text-sm font-bold text-primary-foreground">AI</span>
            </div>
            <span className="text-lg font-semibold">AI Auto Marker</span>
          </div>

          <nav className="flex flex-wrap justify-center gap-6 text-sm">
            <a href="/features" className="text-muted-foreground transition-colors hover:text-foreground">
              Features
            </a>
            <a href="/windows-app" className="text-muted-foreground transition-colors hover:text-foreground">
              Windows App
            </a>
            <a href="/buy-token" className="text-muted-foreground transition-colors hover:text-foreground">
              Buy Token
            </a>
            <a href="/faq" className="text-muted-foreground transition-colors hover:text-foreground">
              FAQ
            </a>
            <a href="/contact" className="text-muted-foreground transition-colors hover:text-foreground">
              Contact
            </a>
          </nav>
        </div>

        <div className="mt-8 border-t border-border/40 pt-8 text-center text-sm text-muted-foreground">
          <p>© 2025 AI Auto Marker. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

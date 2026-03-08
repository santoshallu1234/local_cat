export function AppPreview() {
  return (
    <section className="py-24 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-balance text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Built for real-world assessment environments
          </h2>
          <p className="text-balance text-lg text-muted-foreground">
            A seamless, unobtrusive interface that works alongside your workflow.
          </p>
        </div>

        <div className="mx-auto max-w-6xl">
          {/* Main window preview */}
          <div className="relative overflow-hidden rounded-xl border border-border bg-card shadow-2xl">
            {/* Window chrome */}
            <div className="flex items-center gap-2 border-b border-border bg-muted/30 px-4 py-3">
              <div className="flex gap-1.5">
                <div className="h-3 w-3 rounded-full bg-red-500/80" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                <div className="h-3 w-3 rounded-full bg-green-500/80" />
              </div>
              <div className="ml-4 flex-1">
                <div className="h-6 w-full max-w-md rounded bg-muted px-3 py-1 text-xs text-muted-foreground">
                  Assessment Platform
                </div>
              </div>
            </div>

            {/* Preview content */}
            <div className="aspect-[16/9] bg-gradient-to-br from-muted/30 to-background">
              <img src="/floating-ai-assistant-panel-mcq-detection-code-sol.jpg" alt="Application Preview" className="h-full w-full object-cover" />
            </div>

            {/* Floating assistant panel overlay */}
            <div className="absolute bottom-8 right-8 w-80 overflow-hidden rounded-xl border border-border/50 bg-card/90 shadow-xl backdrop-blur-xl">
              <div className="border-b border-border/50 bg-primary/5 px-4 py-3">
                <div className="flex items-center gap-2">
                  <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-xs font-bold text-primary-foreground">
                    AI
                  </div>
                  <span className="text-sm font-medium">Assistant Active</span>
                  <div className="ml-auto flex h-2 w-2">
                    <span className="absolute inline-flex h-2 w-2 animate-ping rounded-full bg-green-500 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                  </div>
                </div>
              </div>
              <div className="p-4">
                <div className="mb-2 text-xs font-medium text-muted-foreground">MCQ Detected</div>
                <div className="rounded-lg bg-muted/50 p-3 text-sm leading-relaxed">
                  Analyzing question and providing optimal solution...
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

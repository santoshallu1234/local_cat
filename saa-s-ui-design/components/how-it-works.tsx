import { Download, Rocket, Sparkles } from "lucide-react"

const steps = [
  {
    icon: Download,
    title: "Install the Windows App",
    description: "Download and install our lightweight desktop companion in seconds.",
  },
  {
    icon: Rocket,
    title: "Open any assessment",
    description: "Launch your test platform or coding environment as usual.",
  },
  {
    icon: Sparkles,
    title: "Get instant AI assistance",
    description: "Receive contextual help automatically as you work through questions.",
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 lg:py-32 bg-muted/30">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-balance text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Get started in 3 simple steps
          </h2>
          <p className="text-balance text-lg text-muted-foreground">
            Setup takes less than a minute. No complex configuration required.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div key={step.title} className="relative">
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="absolute left-[2.25rem] top-[4.5rem] hidden h-0.5 w-[calc(100%+2rem)] bg-gradient-to-r from-primary/50 to-primary/20 lg:block" />
                )}

                <div className="relative flex flex-col items-center text-center">
                  <div className="mb-6 flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-2xl border-2 border-primary bg-primary/10 text-primary backdrop-blur-sm">
                    <Icon className="h-8 w-8" />
                  </div>
                  <div className="mb-2 text-sm font-medium text-primary">Step {index + 1}</div>
                  <h3 className="mb-3 text-2xl font-semibold">{step.title}</h3>
                  <p className="max-w-sm text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

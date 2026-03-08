import { Database, Lock, UserCheck } from "lucide-react"

const trustPoints = [
  {
    icon: Database,
    title: "No unnecessary data storage",
    description: "We only keep what you need, when you need it.",
  },
  {
    icon: Lock,
    title: "Local + secure processing",
    description: "Your data stays on your device whenever possible.",
  },
  {
    icon: UserCheck,
    title: "User-controlled behavior",
    description: "You decide when and how the assistant helps you.",
  },
]

export function Trust() {
  return (
    <section className="py-24 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="mx-auto mb-16 max-w-2xl text-center">
          <h2 className="mb-4 text-balance text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Your trust, our priority
          </h2>
          <p className="text-balance text-lg text-muted-foreground">
            Designed with privacy and security at the foundation.
          </p>
        </div>

        <div className="mx-auto grid max-w-4xl gap-8 md:grid-cols-3">
          {trustPoints.map((point) => {
            const Icon = point.icon
            return (
              <div key={point.title} className="flex flex-col items-center text-center">
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-7 w-7" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">{point.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{point.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

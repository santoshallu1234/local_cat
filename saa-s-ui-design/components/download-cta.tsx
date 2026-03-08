import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

export function DownloadCTA() {
  return (
    <section id="download" className="py-24 lg:py-32">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-primary/10 via-primary/5 to-background p-12 text-center backdrop-blur-sm lg:p-20">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,rgba(120,119,198,0.15),rgba(255,255,255,0))] dark:bg-[radial-gradient(ellipse_80%_50%_at_50%_50%,rgba(120,119,198,0.3),rgba(255,255,255,0))]" />

          <div className="mx-auto max-w-2xl">
            <h2 className="mb-4 text-balance text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
              Get the Windows Application
            </h2>
            <p className="mb-8 text-balance text-lg text-muted-foreground">
              Start preparing smarter today. Compatible with Windows 10 & 11.
            </p>
            <Button size="lg" className="gap-2 text-base">
              <Download className="h-5 w-5" />
              Download for Windows
            </Button>
            <p className="mt-4 text-xs text-muted-foreground">Windows 10 & 11 supported • Free trial available</p>
          </div>
        </div>
      </div>
    </section>
  )
}

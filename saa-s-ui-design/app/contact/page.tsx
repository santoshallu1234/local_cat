import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export default function ContactPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mx-auto max-w-4xl text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
            <p className="text-xl text-muted-foreground">
              Get in touch with our team for support, feedback, or partnership inquiries
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
            <div>
              <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
              <p className="text-muted-foreground mb-8">
                We'd love to hear from you! Whether you have a question about our extension, 
                need technical support, or want to provide feedback, our team is ready to help.
              </p>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-2">📧 Email Support</h3>
                  <p className="text-muted-foreground mb-1">For general inquiries and support requests:</p>
                  <a href="mailto:support@ai-auto-marker.com" className="text-primary hover:underline">
                    support@ai-auto-marker.com
                  </a>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">🐛 Bug Reports</h3>
                  <p className="text-muted-foreground mb-1">To report bugs or technical issues:</p>
                  <a href="mailto:bugs@ai-auto-marker.com" className="text-primary hover:underline">
                    bugs@ai-auto-marker.com
                  </a>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">💡 Feature Requests</h3>
                  <p className="text-muted-foreground mb-1">To suggest new features or improvements:</p>
                  <a href="mailto:feedback@ai-auto-marker.com" className="text-primary hover:underline">
                    feedback@ai-auto-marker.com
                  </a>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold mb-2">🤝 Partnerships</h3>
                  <p className="text-muted-foreground mb-1">For business development and partnership inquiries:</p>
                  <a href="mailto:partnerships@ai-auto-marker.com" className="text-primary hover:underline">
                    partnerships@ai-auto-marker.com
                  </a>
                </div>
              </div>
            </div>
            
            <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
              <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium mb-2">Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    className="w-full px-4 py-3 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    className="w-full px-4 py-3 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2">Subject</label>
                  <select 
                    id="subject" 
                    className="w-full px-4 py-3 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  >
                    <option value="">Select a subject</option>
                    <option value="support">Technical Support</option>
                    <option value="feedback">Product Feedback</option>
                    <option value="bug">Bug Report</option>
                    <option value="partnership">Partnership Inquiry</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2">Message</label>
                  <textarea 
                    id="message" 
                    rows={5}
                    className="w-full px-4 py-3 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  ></textarea>
                </div>
                
                <button 
                  type="submit" 
                  className="w-full py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-16">Follow Our Development</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-card rounded-xl p-6 border border-border shadow-sm text-center">
              <div className="text-4xl mb-4">🐙</div>
              <h3 className="text-xl font-bold mb-3">GitHub Repository</h3>
              <p className="text-muted-foreground mb-4">
                Check out our source code, contribute, or report issues on GitHub.
              </p>
              <a href="#" className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
                View on GitHub
              </a>
            </div>
            
            <div className="bg-card rounded-xl p-6 border border-border shadow-sm text-center">
              <div className="text-4xl mb-4">📢</div>
              <h3 className="text-xl font-bold mb-3">Twitter</h3>
              <p className="text-muted-foreground mb-4">
                Follow us on Twitter for updates, tips, and announcements.
              </p>
              <a href="#" className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
                Follow @AIMarker
              </a>
            </div>
            
            <div className="bg-card rounded-xl p-6 border border-border shadow-sm text-center">
              <div className="text-4xl mb-4">📘</div>
              <h3 className="text-xl font-bold mb-3">Documentation</h3>
              <p className="text-muted-foreground mb-4">
                Read our comprehensive documentation for detailed guides.
              </p>
              <a href="#" className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
                Read Docs
              </a>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export default function FAQPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mx-auto max-w-4xl text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Frequently Asked Questions</h1>
            <p className="text-xl text-muted-foreground">
              Find answers to common questions about AI Auto Marker Chrome Extension
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-16">Common Questions</h2>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
              <h3 className="text-xl font-bold mb-4">How do I install the AI Auto Marker extension?</h3>
              <p className="text-muted-foreground mb-4">
                To install the extension, follow these steps:
              </p>
              <ol className="list-decimal pl-5 space-y-2 text-muted-foreground">
                <li>Download the extension ZIP file from our website</li>
                <li>Extract the ZIP file to a folder on your computer</li>
                <li>Open Chrome and navigate to chrome://extensions/</li>
                <li>Enable "Developer mode" in the top right corner</li>
                <li>Click "Load unpacked" and select the extracted extension folder</li>
                <li>The extension will now appear in your toolbar</li>
              </ol>
            </div>

            <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
              <h3 className="text-xl font-bold mb-4">How do I use the extension to solve MCQs?</h3>
              <p className="text-muted-foreground mb-4">
                Using the extension is simple:
              </p>
              <ol className="list-decimal pl-5 space-y-2 text-muted-foreground">
                <li>Navigate to any webpage containing MCQs</li>
                <li>Press Ctrl+Shift+U to capture the page</li>
                <li>Wait for the AI to process the content (usually 1-3 seconds)</li>
                <li>A popup will appear with the answers</li>
                <li>Click "Copy" to save the answers to your clipboard</li>
              </ol>
            </div>

            <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
              <h3 className="text-xl font-bold mb-4">What types of questions can the AI solve?</h3>
              <p className="text-muted-foreground mb-4">
                Our AI can solve various types of questions including:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                <li>Multiple choice questions (MCQs)</li>
                <li>True/False questions</li>
                <li>Fill in the blank questions</li>
                <li>Short answer questions</li>
                <li>Programming questions (with code solutions)</li>
              </ul>
              <p className="mt-4 text-muted-foreground">
                The AI works best with clearly formatted questions in English.
              </p>
            </div>

            <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
              <h3 className="text-xl font-bold mb-4">Is my data secure when using this extension?</h3>
              <p className="text-muted-foreground mb-4">
                Yes, your data is completely secure:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                <li>All processing happens in real-time</li>
                <li>No data is stored on our servers</li>
                <li>All communications use HTTPS encryption</li>
                <li>We never share your data with third parties</li>
              </ul>
              <p className="mt-4 text-muted-foreground">
                We are committed to protecting your privacy and data security.
              </p>
            </div>

            <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
              <h3 className="text-xl font-bold mb-4">Why isn't the extension working on some websites?</h3>
              <p className="text-muted-foreground mb-4">
                There are a few reasons why the extension might not work on certain websites:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                <li>The website may have copy protection enabled</li>
                <li>The MCQs may be in an image format that's hard to process</li>
                <li>The website may block extension access for security reasons</li>
                <li>The questions may be too complex or unclear for the AI</li>
              </ul>
              <p className="mt-4 text-muted-foreground">
                If you encounter issues, try taking a screenshot manually and uploading it.
              </p>
            </div>

            <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
              <h3 className="text-xl font-bold mb-4">How accurate are the AI-generated answers?</h3>
              <p className="text-muted-foreground mb-4">
                Our AI has an accuracy rate of over 90% for standard MCQs. However, accuracy can vary based on:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                <li>Clarity and formatting of the questions</li>
                <li>Complexity of the subject matter</li>
                <li>Quality of the text extraction from the webpage</li>
              </ul>
              <p className="mt-4 text-muted-foreground">
                We recommend reviewing the answers before submitting them for important assessments.
              </p>
            </div>

            <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
              <h3 className="text-xl font-bold mb-4">Can I customize the popup display time?</h3>
              <p className="text-muted-foreground mb-4">
                Yes, you can customize how long the popup stays visible:
              </p>
              <ol className="list-decimal pl-5 space-y-2 text-muted-foreground">
                <li>Click the AI Auto Marker icon in your Chrome toolbar</li>
                <li>The settings page will open</li>
                <li>Select your preferred time from the dropdown menu</li>
                <li>Click "Save Settings" to apply your changes</li>
              </ol>
              <p className="mt-4 text-muted-foreground">
                Options range from 1 second to never auto-close.
              </p>
            </div>

            <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
              <h3 className="text-xl font-bold mb-4">What should I do if I encounter an error?</h3>
              <p className="text-muted-foreground mb-4">
                If you encounter an error, try these troubleshooting steps:
              </p>
              <ol className="list-decimal pl-5 space-y-2 text-muted-foreground">
                <li>Refresh the webpage and try again</li>
                <li>Restart your browser</li>
                <li>Check your internet connection</li>
                <li>Reinstall the extension</li>
                <li>Check the browser console for error messages (Ctrl+Shift+J)</li>
              </ol>
              <p className="mt-4 text-muted-foreground">
                If the problem persists, contact our support team with details about the error.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Need More Help?</h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            If you have any questions that aren't answered here, please don't hesitate to reach out to our support team.
          </p>
          <a href="/contact" className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-base font-medium text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors">
            Contact Support
          </a>
        </div>
      </section>

      <Footer />
    </div>
  )
}
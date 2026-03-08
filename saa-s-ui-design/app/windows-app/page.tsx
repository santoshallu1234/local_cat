import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"

export default function WindowsAppPage() {
  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-blue-600">AI Auto Marker for Windows</h1>
            <p className="text-xl text-muted-foreground mb-12">
              Solve MCQs and Programming Questions with Our Powerful Desktop Application
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="bg-black rounded-t-lg p-5 shadow-2xl mx-auto max-w-2xl">
              <div className="bg-gray-900 rounded-lg p-4 h-80 flex flex-col justify-center items-center relative overflow-hidden">
                <div className="text-white text-center w-full">
                  <div className="mb-8">
                    <div className="text-lg font-bold mb-4">What is the output of: print(2 ** 3 + 1)?</div>
                    <div className="grid grid-cols-2 gap-3 max-w-xs mx-auto">
                      <div className="bg-gray-800 p-2 rounded text-sm">A) 6</div>
                      <div className="bg-gray-800 p-2 rounded text-sm">B) 7</div>
                      <div className="bg-gray-800 p-2 rounded text-sm">C) 9</div>
                      <div className="bg-gray-800 p-2 rounded text-sm">D) 8</div>
                    </div>
                  </div>
                  
                  <div className="absolute top-5 right-5 animate-pulse">
                    <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold">
                      ↙ C
                    </div>
                  </div>
                </div>
              </div>
              <div className="h-5 bg-gray-300 rounded-b-lg flex justify-center pt-1">
                <div className="w-1/2 h-2 bg-gray-400 rounded"></div>
              </div>
            </div>
            
            <div className="flex justify-center gap-6 mt-8 flex-wrap">
              <div className="flex items-center gap-2 bg-white bg-opacity-80 px-4 py-2 rounded-full shadow">
                <span className="text-xl">🔒</span>
                <span className="font-bold text-gray-800">Undetectable Solution</span>
              </div>
              <div className="flex items-center gap-2 bg-white bg-opacity-80 px-4 py-2 rounded-full shadow">
                <span className="text-xl">⚡</span>
                <span className="font-bold text-gray-800">Instant Answers</span>
              </div>
              <div className="flex items-center gap-2 bg-white bg-opacity-80 px-4 py-2 rounded-full shadow">
                <span className="text-xl">💻</span>
                <span className="font-bold text-gray-800">Works on Any PC</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-16">Why Choose Our Windows App?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-bold mb-3">Undetectable Solution</h3>
              <p className="text-muted-foreground mb-4">
                Completely invisible to proctoring systems and assessment handlers. Works with popular platforms like Unstop, Godigital, Mettl, and Superset without being detected.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Undetectable by monitoring software</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Works with major assessment platforms</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>No traces left on system</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold mb-3">Versatile Problem Solving</h3>
              <p className="text-muted-foreground mb-4">
                Solve any type of MCQ or programming question with our advanced AI technology.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Multiple choice questions</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Programming problems</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold mb-3">Lightning Fast</h3>
              <p className="text-muted-foreground mb-4">
                Get instant answers to your questions in under 10 seconds.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Answers within 10 seconds</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>High-level MCQ solving</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Complex programming solutions</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-bold mb-3">Very Reasonable Price</h3>
              <p className="text-muted-foreground mb-4">
                Affordable pricing with great value - just a small fee for unlimited usage.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>One-time affordable payment</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Pay only what you need</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
              <div className="text-4xl mb-4">💻</div>
              <h3 className="text-xl font-bold mb-3">Portable & Easy</h3>
              <p className="text-muted-foreground mb-4">
                Works on any new or unknown PC without installation hassles.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Portable across devices</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>No complex setup</span>
                </li>
                <li className="flex items-start">
                  <span className="text-green-500 mr-2">✓</span>
                  <span>Premium token only requirement</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
              <div className="text-4xl mb-4">⌨️</div>
              <h4 className="text-xl font-bold mb-3">Smart Typing</h4>
              <p className="text-muted-foreground">
                Types solutions character-by-character with each Tab key press
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-16">How It Works</h2>
          <div className="max-w-4xl mx-auto">
            <div className="bg-card rounded-xl p-8 border border-border shadow-sm">
              <h3 className="text-2xl font-bold mb-6 text-center">Complete Process Demonstration</h3>
              
              <div className="space-y-8">
                <div>
                  <h4 className="text-lg font-semibold mb-3">Step 1: MCQ Appears on Screen</h4>
                  <div className="bg-gray-100 p-4 rounded-lg">
                    <div className="font-medium mb-2">What is the capital of France?</div>
                    <div className="grid grid-cols-2 gap-2 max-w-xs">
                      <div className="bg-white p-2 rounded text-sm">A) London</div>
                      <div className="bg-white p-2 rounded text-sm">B) Berlin</div>
                      <div className="bg-white p-2 rounded text-sm bg-green-100 border border-green-300">C) Paris</div>
                      <div className="bg-white p-2 rounded text-sm">D) Madrid</div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold mb-3">Step 2: Press Ctrl+Shift+Y</h4>
                  <div className="flex justify-center">
                    <div className="flex gap-2 bg-gray-800 p-3 rounded-lg">
                      <span className="bg-gray-700 px-3 py-1 rounded text-white">Ctrl</span>
                      <span className="text-gray-300">+</span>
                      <span className="bg-gray-700 px-3 py-1 rounded text-white">Shift</span>
                      <span className="text-gray-300">+</span>
                      <span className="bg-gray-700 px-3 py-1 rounded text-white">Y</span>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold mb-3">Step 3: AI Analysis & Answer Detection</h4>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="text-blue-800">Analyzing question... Determining correct answer: C) Paris</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold mb-3">Step 4: Discreet Cursor Movement</h4>
                  <div className="flex flex-col items-center">
                    <div className="relative bg-gray-200 p-8 rounded-lg w-full max-w-md mb-4">
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-gray-500">
                        🔍 Initial Position
                      </div>
                      <div className="absolute top-3/4 left-1/4 transform -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white font-bold animate-pulse">
                        ↙ C
                      </div>
                    </div>
                    <p className="text-muted-foreground text-center">
                      For answer C, the cursor moves 50px diagonally to the bottom-left<br />
                      This subtle movement indicates the correct answer without any visible interface
                    </p>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold mb-3">Step 5: Undetectable Operation</h4>
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <p className="text-green-800 mb-2">Complete process happens invisibly in the background</p>
                    <p className="text-green-800">Works with proctoring software like Unstop, Godigital, Mettl, and Superset</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-12">
                <h4 className="text-lg font-semibold mb-4 text-center">Complete Answer Mapping System</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white p-4 rounded-lg border text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-2">A</div>
                    <div className="text-sm text-muted-foreground">Moves 50px to top-right diagonal ↗</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-2">B</div>
                    <div className="text-sm text-muted-foreground">Moves 50px to top-left diagonal ↖</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-2">C</div>
                    <div className="text-sm text-muted-foreground">Moves 50px to bottom-left diagonal ↙</div>
                  </div>
                  <div className="bg-white p-4 rounded-lg border text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-2">D</div>
                    <div className="text-sm text-muted-foreground">Moves 50px to bottom-right diagonal ↘</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Programming Solver Section */}
      <section className="py-16">
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-6">Programming Question Solver</h2>
          <p className="text-xl text-muted-foreground text-center mb-12 max-w-3xl mx-auto">
            Our AI Auto Marker Windows application can also solve complex programming questions with ease. See how it works:
          </p>
          
          <div className="max-w-6xl mx-auto">
            <div className="bg-black rounded-t-lg p-5 shadow-2xl mx-auto max-w-2xl mb-12">
              <div className="bg-gray-900 rounded-lg p-4 h-80">
                <div className="text-white">
                  <div className="text-sm text-gray-400 mb-2">programming_question.py</div>
                  <div className="font-mono text-sm">
                    <div>def fibonacci(n):</div>
                    <div className="ml-4">if n &lt;= 1:</div>
                    <div className="ml-8">return n</div>
                    <div className="ml-4">else:</div>
                    <div className="ml-8">return fibonacci(n-1) + fibonacci(n-2)</div>
                    <div></div>
                    <div className="mt-4"># Find the 10th Fibonacci number</div>
                    <div>result = fibonacci(10)</div>
                    <div>print("10th Fibonacci number is:", result)</div>
                  </div>
                </div>
              </div>
              <div className="h-5 bg-gray-300 rounded-b-lg flex justify-center pt-1">
                <div className="w-1/2 h-2 bg-gray-400 rounded"></div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
                <div className="text-2xl font-bold text-blue-600 mb-4">1</div>
                <h3 className="text-xl font-bold mb-3">Capture with Ctrl+Shift+R</h3>
                <p className="text-muted-foreground mb-4">
                  Press Ctrl+Shift+R to capture and analyze the programming question
                </p>
                <div className="flex justify-center">
                  <div className="flex gap-2 bg-gray-800 p-2 rounded">
                    <span className="bg-gray-700 px-2 py-1 rounded text-white text-sm">Ctrl</span>
                    <span className="text-gray-300 text-sm">+</span>
                    <span className="bg-gray-700 px-2 py-1 rounded text-white text-sm">Shift</span>
                    <span className="text-gray-300 text-sm">+</span>
                    <span className="bg-gray-700 px-2 py-1 rounded text-white text-sm">R</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
                <div className="text-2xl font-bold text-blue-600 mb-4">2</div>
                <h3 className="text-xl font-bold mb-3">AI Analysis & Storage</h3>
                <p className="text-muted-foreground mb-4">
                  AI processes the code and stores the solution locally
                </p>
                <div className="bg-blue-50 p-3 rounded text-center">
                  <div className="text-blue-800 text-sm mb-1">Analyzing code...</div>
                  <div className="text-blue-800 text-sm">Solution saved to device</div>
                </div>
              </div>
              
              <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
                <div className="text-2xl font-bold text-blue-600 mb-4">3</div>
                <h3 className="text-xl font-bold mb-3">Type with Tab Key</h3>
                <p className="text-muted-foreground mb-4">
                  Press the Tab key to automatically type the solution letter by letter
                </p>
                <div className="flex justify-center mb-3">
                  <div className="bg-gray-800 px-4 py-2 rounded">
                    <span className="text-white">Tab</span>
                  </div>
                </div>
                <div className="bg-gray-100 p-2 rounded font-mono text-sm">
                  <span className="text-blue-600">d</span>
                  <span className="text-blue-600">e</span>
                  <span className="text-blue-600">f</span>
                  <span className="text-blue-600"> </span>
                  <span className="text-blue-600">f</span>
                  <span className="text-blue-600">i</span>
                  <span className="text-blue-600">b</span>
                  <span className="text-blue-600">o</span>
                  <span className="text-blue-600">n</span>
                  <span className="text-blue-600">a</span>
                  <span className="text-blue-600">c</span>
                  <span className="text-blue-600">c</span>
                  <span className="text-blue-600">i</span>
                  <span className="text-blue-600">(</span>
                  <span className="text-blue-600">n</span>
                  <span className="text-blue-600">)</span>
                  <span className="text-blue-600">:</span>
                </div>
                <p className="text-muted-foreground text-sm mt-2 text-center">
                  Each press of the Tab key types one character of the solution
                </p>
              </div>
            </div>
            
            <div className="max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold text-center mb-8">Key Features for Programming Questions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-card rounded-xl p-6 border border-border shadow-sm text-center">
                  <div className="text-4xl mb-4">🧠</div>
                  <h4 className="text-lg font-bold mb-2">Advanced Code Analysis</h4>
                  <p className="text-muted-foreground text-sm">
                    Understands complex programming logic and algorithms
                  </p>
                </div>
                <div className="bg-card rounded-xl p-6 border border-border shadow-sm text-center">
                  <div className="text-4xl mb-4">💾</div>
                  <h4 className="text-lg font-bold mb-2">Local Storage</h4>
                  <p className="text-muted-foreground text-sm">
                    Solutions stored securely on your device
                  </p>
                </div>
                <div className="bg-card rounded-xl p-6 border border-border shadow-sm text-center">
                  <div className="text-4xl mb-4">⌨️</div>
                  <h4 className="text-lg font-bold mb-2">Smart Typing</h4>
                  <p className="text-muted-foreground text-sm">
                    Types solutions letter-by-letter with human-like speed
                  </p>
                </div>
                <div className="bg-card rounded-xl p-6 border border-border shadow-sm text-center">
                  <div className="text-4xl mb-4">🛡️</div>
                  <h4 className="text-lg font-bold mb-2">Undetectable</h4>
                  <p className="text-muted-foreground text-sm">
                    Works invisibly with proctoring software
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section className="py-16 bg-primary/5">
        <div className="container mx-auto px-4 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">Get Started Today</h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Download the Windows app today and experience AI-powered assistance for your assessments.
          </p>
          
          <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="text-left">
                <h3 className="text-2xl font-bold mb-4">Installation Steps</h3>
                <ol className="list-decimal pl-5 space-y-3 text-left max-w-md mx-auto">
                  <li className="pl-2">Download the Windows installer</li>
                  <li className="pl-2">Run the setup wizard</li>
                  <li className="pl-2">Follow the simple installation process</li>
                  <li className="pl-2">Launch AI Auto Marker and start solving questions!</li>
                </ol>
                <p className="mt-4 text-muted-foreground">
                  Once installed, the application will be available from your Start Menu. Simply launch it and begin capturing and solving MCQs and programming questions instantly.
                </p>
              </div>
              <div className="flex flex-col items-center">
                <a 
                  href="https://github.com/santoshallu1234/local_cat/releases/download/v1.0.0/ai_auto_marker_windows-1.0.0-setup.exe" 
                  className="inline-flex items-center justify-center rounded-md bg-primary px-8 py-4 text-base font-medium text-primary-foreground shadow-sm hover:bg-primary/90 transition-colors mb-4"
                  download
                >
                  <span className="mr-2">📥</span>
                  <span>Download Windows App</span>
                </a>
                <p className="text-muted-foreground">Size: ~110MB</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
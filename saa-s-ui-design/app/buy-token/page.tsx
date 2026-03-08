"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { useState, useEffect } from "react"
import { BACKEND_URL } from "@/lib/constants"

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function BuyTokenPage() {
  const [showPurchaseForm, setShowPurchaseForm] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState({
    name: 'Pro Plan',
    price: 3900, // in paise
    amount: '₹39',
    uses: 50
  })

  useEffect(() => {
    // Dynamically load Razorpay script
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    document.head.appendChild(script)

    return () => {
      // Clean up script when component unmounts
      document.head.removeChild(script)
    }
  }, [])

  const handlePlanSelection = (planName: string, price: number, amount: string, uses: number) => {
    setSelectedPlan({ name: planName, price, amount, uses })
    setShowPurchaseForm(true)
  }

  const handleBackToPlans = () => {
    setShowPurchaseForm(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Get form data
    const formData = new FormData(e.target as HTMLFormElement)
    const email = formData.get('email') as string
    const confirmEmail = formData.get('confirmEmail') as string
    
    // Validate emails match
    if (email !== confirmEmail) {
      alert('Email addresses do not match')
      return
    }
    
    // Validate terms agreement
    const termsAgreed = formData.get('terms')
    if (!termsAgreed) {
      alert('Please agree to the terms and conditions')
      return
    }
    
    // Check if Razorpay is loaded
    if (typeof window.Razorpay === 'undefined') {
      alert('Payment gateway not loaded. Please try again.')
      return
    }
    
    try {
      // Create order on backend
      const response = await fetch(`${BACKEND_URL}/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          amount: selectedPlan.price,
          plan: selectedPlan.name,
          uses: selectedPlan.uses
        }),
      });
      
      const orderData = await response.json();
      
      if (!orderData.success) {
        alert('Failed to create order: ' + orderData.error);
        return;
      }
      
      // Initialize Razorpay payment
      const options = {
        key: 'rzp_test_your_key_here', // Replace with your Razorpay key
        amount: selectedPlan.price,
        currency: 'INR',
        name: 'AI Auto Marker',
        description: `${selectedPlan.name} - ${selectedPlan.uses} uses`,
        image: '/icon.png',
        order_id: orderData.id || orderData.orderId, // Handle different response formats
        handler: async function (response: any) {
          try {
            // Verify payment on backend
            const verifyResponse = await fetch(`${BACKEND_URL}/verify-payment`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                email: email,
                plan: selectedPlan.name,
                uses: selectedPlan.uses
              }),
            });
            
            const verifyData = await verifyResponse.json();
            
            if (verifyData.success) {
              alert(`Payment successful! Your premium token has been sent to ${email}`);
              // Reset form and go back to plans
              setShowPurchaseForm(false);
            } else {
              alert('Payment verification failed: ' + verifyData.error);
            }
          } catch (error) {
            console.error('Error verifying payment:', error);
            alert('Error verifying payment. Please contact support.');
          }
        },
        prefill: {
          email: email,
        },
        theme: {
          color: '#4285f4'
        }
      }
      
      const rzp = new window.Razorpay(options)
      rzp.open()
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Error creating order. Please try again.');
    }
  }

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <section className="pt-32 pb-20">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="mx-auto max-w-4xl text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Unlock Premium AI Power</h1>
            <p className="text-xl text-muted-foreground">
              Choose the perfect plan for your MCQ solving needs
            </p>
          </div>
        </div>
      </section>

      <section className={`py-16 ${showPurchaseForm ? 'hidden' : ''}`}>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Premium Token Plans</h2>
            <p className="text-xl text-muted-foreground">
              Select the plan that best fits your requirements
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {/* Pro Plan - 50 Uses */}
            <div className="bg-card rounded-xl p-6 border border-border shadow-sm relative">
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-bold">
                Most Popular
              </div>
              <h3 className="text-2xl font-bold mb-4 text-center">Pro Plan</h3>
              <div className="text-center mb-6">
                <span className="text-4xl font-bold">₹39</span>
                <span className="text-muted-foreground ml-2">One-time</span>
              </div>
              <div className="mb-8">
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>50 uses of premium model</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Highest accuracy answers</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Priority processing</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Detailed usage logs</span>
                  </li>
                </ul>
              </div>
              <button 
                className="w-full py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
                onClick={() => handlePlanSelection('Pro Plan', 3900, '₹39', 50)}
              >
                Select Plan
              </button>
            </div>
            
            {/* Premium Plan - 100 Uses */}
            <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
              <h3 className="text-2xl font-bold mb-4 text-center">Premium Plan</h3>
              <div className="text-center mb-6">
                <span className="text-4xl font-bold">₹69</span>
                <span className="text-muted-foreground ml-2">One-time</span>
              </div>
              <div className="mb-8">
                <ul className="space-y-3">
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>100 uses of premium model</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Highest accuracy answers</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Priority processing</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Detailed usage logs</span>
                  </li>
                  <li className="flex items-center">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Extended validity period</span>
                  </li>
                </ul>
              </div>
              <button 
                className="w-full py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
                onClick={() => handlePlanSelection('Premium Plan', 6900, '₹69', 100)}
              >
                Select Plan
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Token Purchase Section */}
      <section className={`py-16 ${showPurchaseForm ? '' : 'hidden'}`}>
        <div className="container mx-auto px-4 lg:px-8">
          <div className="back-to-plans mb-8">
            <button 
              onClick={handleBackToPlans}
              className="px-4 py-2 bg-muted text-foreground rounded-md font-medium hover:bg-muted/80 transition-colors"
            >
              ← Back to Plans
            </button>
          </div>
          
          <h2 className="text-3xl font-bold mb-8 text-center">Complete Your Purchase</h2>
          <div className="max-w-2xl mx-auto bg-card rounded-xl p-8 border border-border shadow-sm">
            <div className="mb-8">
              <h3 className="text-xl font-bold mb-4">Your Selected Plan</h3>
              <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
                <span className="text-lg font-semibold">{selectedPlan.name}</span>
                <span className="text-2xl font-bold text-primary">{selectedPlan.amount}</span>
              </div>
            </div>
            
            <div className="mb-8">
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">Email Address *</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email"
                    className="w-full px-4 py-3 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    required 
                    placeholder="Enter your email address"
                  />
                  <p className="mt-2 text-sm text-muted-foreground">We'll send your premium token to this email</p>
                </div>
                
                <div>
                  <label htmlFor="confirmEmail" className="block text-sm font-medium mb-2">Confirm Email Address *</label>
                  <input 
                    type="email" 
                    id="confirmEmail" 
                    name="confirmEmail"
                    className="w-full px-4 py-3 rounded-md border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                    required 
                    placeholder="Confirm your email address"
                  />
                </div>
                
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="terms" 
                    name="terms"
                    className="h-4 w-4 text-primary focus:ring-primary border-border rounded"
                    required
                  />
                  <label htmlFor="terms" className="ml-2 block text-sm text-foreground">
                    I agree to the <a href="#" className="text-primary hover:underline">Terms of Service</a> and <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                  </label>
                </div>
                
                <button 
                  type="submit" 
                  className="w-full py-3 bg-primary text-primary-foreground rounded-md font-medium hover:bg-primary/90 transition-colors"
                >
                  Proceed to Payment
                </button>
              </form>
              
              <div id="purchaseMessage" className="mt-4 text-center text-red-500 hidden">
                Please fill in all required fields
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={`py-16 bg-muted/50 ${showPurchaseForm ? 'hidden' : ''}`}>
        <div className="container mx-auto px-4 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-16">Premium Features Included</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-card rounded-xl p-6 border border-border shadow-sm text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold mb-3">Enhanced Accuracy</h3>
              <p className="text-muted-foreground">
                Access to advanced AI models for more precise MCQ solving
              </p>
            </div>
            <div className="bg-card rounded-xl p-6 border border-border shadow-sm text-center">
              <div className="text-4xl mb-4">🚀</div>
              <h3 className="text-xl font-bold mb-3">Priority Processing</h3>
              <p className="text-muted-foreground">
                Faster response times compared to free tier
              </p>
            </div>
            <div className="bg-card rounded-xl p-6 border border-border shadow-sm text-center">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-bold mb-3">Detailed Analytics</h3>
              <p className="text-muted-foreground">
                Track your usage and performance metrics
              </p>
            </div>
            <div className="bg-card rounded-xl p-6 border border-border shadow-sm text-center">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-bold mb-3">Secure & Private</h3>
              <p className="text-muted-foreground">
                All processing happens securely with no data retention
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
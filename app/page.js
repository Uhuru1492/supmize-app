'use client'
import { useState } from 'react'

export default function Home() {
  const [supplements, setSupplements] = useState(['', '', ''])
  const [email, setEmail] = useState('')

  const addSupplement = () => {
    setSupplements([...supplements, ''])
  }

  const updateSupplement = (index, value) => {
    const newSupps = [...supplements]
    newSupps[index] = value
    setSupplements(newSupps)
  }

  const handleAnalyze = (e) => {
    e.preventDefault()
    // Redirect to app download for now
    window.location.href = 'https://apps.apple.com/app/supmize/id6756226894'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-orange-50">
      
      {/* Warning Banner */}
      <div className="bg-gradient-to-r from-red-600 to-orange-600 text-white py-3 px-4 text-center sticky top-0 z-50 shadow-lg">
        <p className="text-sm md:text-base font-semibold">
          ⚠️ 68% of supplement users have dangerous interactions they don't know about
        </p>
      </div>

      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block bg-gradient-to-br from-teal-600 to-teal-700 text-white w-20 h-20 rounded-3xl flex items-center justify-center text-4xl font-bold mb-6 shadow-xl">
            💊
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Are Your Supplements<br />Working Against Each Other?
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Stop wasting money on supplements that cancel each other out. Get personalized optimization in 2 minutes.
          </p>
          
          {/* App Store Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a 
              href="https://apps.apple.com/app/supmize/id6756226894" 
              target="_blank"
              className="inline-block transform hover:scale-105 transition"
            >
              <img 
                src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" 
                alt="Download on App Store" 
                className="h-14"
              />
            </a>
          </div>
        </div>
      </section>

      {/* Free Interaction Check Form */}
      <section className="py-12 px-4">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl p-8 border-2 border-teal-100">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 text-center">
            Free Interaction Check
          </h2>
          <p className="text-gray-600 mb-8 text-center">
            Enter your supplements below to discover dangerous interactions, redundancies, and timing conflicts.
          </p>

          <form onSubmit={handleAnalyze} className="space-y-4">
            {supplements.map((supp, index) => (
              <div key={index}>
                <input
                  type="text"
                  placeholder={`Supplement ${index + 1}`}
                  value={supp}
                  onChange={(e) => updateSupplement(index, e.target.value)}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:outline-none text-lg"
                  required={index < 2}
                />
              </div>
            ))}

            <button
              type="button"
              onClick={addSupplement}
              className="text-teal-600 font-semibold hover:text-teal-700 flex items-center gap-2"
            >
              <span className="text-2xl">+</span> Add Another Supplement
            </button>

            <div className="pt-4">
              <input
                type="email"
                placeholder="Your Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:outline-none text-lg mb-4"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-teal-600 to-teal-700 text-white py-4 rounded-lg font-bold text-lg hover:from-teal-700 hover:to-teal-800 transition shadow-lg"
            >
              Analyze My Supplements FREE
            </button>

            <p className="text-center text-sm text-gray-500 mt-3">
              No credit card required. Results in 60 seconds.
            </p>
          </form>
        </div>
      </section>

      {/* Problem Cards */}
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center text-gray-900 mb-12">
            What You're Missing Without Supmize
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Card 1 */}
            <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-red-500">
              <div className="text-4xl mb-3">⚠️</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Dangerous Interactions</h3>
              <p className="text-gray-600 leading-relaxed">
                Calcium blocks iron absorption by 50%. St. John's Wort makes birth control ineffective. Your "healthy" routine could be harming you.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-orange-500">
              <div className="text-4xl mb-3">💸</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Wasted Money</h3>
              <p className="text-gray-600 leading-relaxed">
                Taking 3 products with B12? You're absorbing only 10% and peeing out the rest. Average person wastes $73/month on redundant supplements.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-yellow-500">
              <div className="text-4xl mb-3">⏰</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Wrong Timing</h3>
              <p className="text-gray-600 leading-relaxed">
                Taking magnesium in the morning? It should be at night for sleep. Taking iron with coffee? You're absorbing almost nothing.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-purple-500">
              <div className="text-4xl mb-3">❓</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Missing Nutrients</h3>
              <p className="text-gray-600 leading-relaxed">
                Taking Vitamin D without K2? Without magnesium? You need cofactors for absorption. Most stacks have critical gaps.
              </p>
            </div>

            {/* Card 5 */}
            <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-blue-500">
              <div className="text-4xl mb-3">🔬</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Wrong Forms</h3>
              <p className="text-gray-600 leading-relaxed">
                Magnesium oxide has 4% absorption. Glycinate has 80%. The form matters as much as the dose—but nobody tells you this.
              </p>
            </div>

            {/* Card 6 */}
            <div className="bg-white p-6 rounded-xl shadow-lg border-l-4 border-red-600">
              <div className="text-4xl mb-3">🏥</div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Medication Conflicts</h3>
              <p className="text-gray-600 leading-relaxed">
                Grapefruit + statins = dangerous. Vitamin K + blood thinners = risky. Your doctor doesn't track your supplements.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">
            How Supmize Protects You
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            
            <div className="p-6 bg-gradient-to-br from-teal-50 to-teal-100 rounded-2xl">
              <div className="text-4xl mb-3">📸</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Scan Before You Buy</h3>
              <p className="text-gray-600">
                Point your camera at any supplement in the store. Get instant safety analysis before spending money.
              </p>
            </div>

            <div className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl">
              <div className="text-4xl mb-3">🧬</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">AI-Powered Analysis</h3>
              <p className="text-gray-600">
                Advanced AI analyzes millions of interactions between supplements, medications, and health conditions.
              </p>
            </div>

            <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl">
              <div className="text-4xl mb-3">💰</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Track Your Savings</h3>
              <p className="text-gray-600">
                See exactly how much you've saved by avoiding unsafe combinations and redundant products.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Simple Pricing</h2>
          <p className="text-gray-600 mb-10">Start free, upgrade when you're ready</p>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            
            <div className="p-8 bg-gray-50 rounded-2xl border-2 border-gray-200">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
              <p className="text-4xl font-bold text-teal-600 mb-6">£0<span className="text-lg text-gray-600">/month</span></p>
              <ul className="text-left space-y-3 mb-6">
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 font-bold">✓</span>
                  <span>1 AI Analysis per month</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 font-bold">✓</span>
                  <span>3 Shop Checks per month</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-600 font-bold">✓</span>
                  <span>Full supplement tracking</span>
                </li>
              </ul>
            </div>

            <div className="p-8 bg-gradient-to-br from-teal-600 to-teal-700 text-white rounded-2xl shadow-xl border-2 border-teal-500">
              <div className="inline-block bg-orange-500 text-xs font-bold px-3 py-1 rounded-full mb-2">
                MOST POPULAR
              </div>
              <h3 className="text-2xl font-bold mb-2">Pro</h3>
              <p className="text-4xl font-bold mb-6">£4.99<span className="text-lg opacity-80">/month</span></p>
              <ul className="text-left space-y-3 mb-6">
                <li className="flex items-start gap-2">
                  <span className="font-bold">✓</span>
                  <span>Unlimited AI Analysis</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">✓</span>
                  <span>Unlimited Shop Checks</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="font-bold">✓</span>
                  <span>Priority support</span>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 px-4 bg-gradient-to-br from-teal-600 to-teal-800 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Stop Gambling With Your Health
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands who've discovered dangerous interactions and saved money
          </p>
          <a 
            href="https://apps.apple.com/app/supmize/id6756226894" 
            target="_blank"
            className="inline-block transform hover:scale-105 transition"
          >
            <img 
              src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" 
              alt="Download on App Store" 
              className="h-16"
            />
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-gray-900 text-gray-400 text-center">
        <div className="max-w-6xl mx-auto">
          <div className="mb-4">
            <a href="/privacy" className="hover:text-white mx-3 text-sm">Privacy Policy</a>
            <a href="/terms" className="hover:text-white mx-3 text-sm">Terms & Conditions</a>
            <a href="mailto:admin@voise.co.uk" className="hover:text-white mx-3 text-sm">Contact</a>
          </div>
          <p className="text-sm">© 2025 Voise Limited. All rights reserved.</p>
          <p className="text-xs mt-2 opacity-75">243 Weald Drive, Crawley, West Sussex, RH10 6PD, United Kingdom</p>
        </div>
      </footer>

    </div>
  )
}

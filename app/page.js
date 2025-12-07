export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-orange-50">
      
      {/* Hero Section */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="inline-block bg-gradient-to-br from-teal-600 to-teal-700 text-white w-24 h-24 rounded-3xl flex items-center justify-center text-4xl font-bold mb-6 shadow-lg">
            💊
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4">
            Avoid Dangerous<br />Supplement Interactions
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            AI-powered supplement safety checker. Scan products in-store, track your stack, and save money on unsafe supplements.
          </p>
          
          {/* App Store Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-6">
            <a 
              href="https://apps.apple.com/app/supmize/id6756226894" 
              target="_blank"
              className="inline-block"
            >
              <img 
                src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg" 
                alt="Download on App Store" 
                className="h-14"
              />
            </a>
            <a 
              href="https://play.google.com/store" 
              target="_blank"
              className="inline-block opacity-50 cursor-not-allowed"
            >
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg" 
                alt="Get it on Google Play" 
                className="h-14"
              />
            </a>
          </div>
          <p className="text-sm text-gray-500">Android version coming soon</p>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            Why Choose Supmize?
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            
            {/* Feature 1 */}
            <div className="p-6 bg-gradient-to-br from-red-50 to-red-100 rounded-2xl">
              <div className="text-4xl mb-4">⚠️</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Catch Dangerous Interactions
              </h3>
              <p className="text-gray-600">
                AI analyzes interactions between supplements, medications, and health conditions before they harm you.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl">
              <div className="text-4xl mb-4">📸</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Scan Before You Buy
              </h3>
              <p className="text-gray-600">
                Point your camera at any supplement in the store and get instant safety analysis.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Stop Wasting Money
              </h3>
              <p className="text-gray-600">
                Track every dollar saved by avoiding unsafe combinations and redundant products.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl">
              <div className="text-4xl mb-4">💊</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Track Your Complete Stack
              </h3>
              <p className="text-gray-600">
                Manage all your supplements in one place with smart reminders for perfect timing.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl">
              <div className="text-4xl mb-4">🧬</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                AI-Powered Analysis
              </h3>
              <p className="text-gray-600">
                Advanced AI analyzes millions of interactions and provides personalized recommendations.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="p-6 bg-gradient-to-br from-teal-50 to-teal-100 rounded-2xl">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Your Privacy Protected
              </h3>
              <p className="text-gray-600">
                Health data stays private and encrypted. GDPR compliant. Delete your data anytime.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            How It Works
          </h2>
          <div className="space-y-6">
            
            <div className="flex gap-4 items-start">
              <div className="bg-teal-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                1
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">Add Your Supplements</h3>
                <p className="text-gray-600">Scan labels or manually enter your supplements, medications, and health conditions.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="bg-teal-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                2
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">Get AI Analysis</h3>
                <p className="text-gray-600">Our AI analyzes your complete stack for dangerous interactions and optimization opportunities.</p>
              </div>
            </div>

            <div className="flex gap-4 items-start">
              <div className="bg-teal-600 text-white w-10 h-10 rounded-full flex items-center justify-center font-bold flex-shrink-0">
                3
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">Stay Safe & Save Money</h3>
                <p className="text-gray-600">Follow personalized recommendations and track your savings over time.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Simple Pricing</h2>
          <p className="text-gray-600 mb-8">Start free, upgrade when you're ready</p>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            
            {/* Free Tier */}
            <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
              <p className="text-4xl font-bold text-teal-600 mb-6">£0<span className="text-lg text-gray-600">/month</span></p>
              <ul className="text-left space-y-3 mb-6">
                <li className="flex items-start gap-2">
                  <span className="text-teal-600">✓</span>
                  <span>1 AI Analysis per month</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-600">✓</span>
                  <span>3 Shop Checks per month</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-600">✓</span>
                  <span>Full supplement tracking</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-teal-600">✓</span>
                  <span>Smart reminders</span>
                </li>
              </ul>
            </div>

            {/* Pro Tier */}
            <div className="p-8 bg-gradient-to-br from-teal-600 to-teal-700 text-white rounded-2xl shadow-xl">
              <div className="inline-block bg-orange-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-2">
                MOST POPULAR
              </div>
              <h3 className="text-2xl font-bold mb-2">Pro</h3>
              <p className="text-4xl font-bold mb-6">£4.99<span className="text-lg opacity-80">/month</span></p>
              <ul className="text-left space-y-3 mb-6">
                <li className="flex items-start gap-2">
                  <span>✓</span>
                  <span>Unlimited AI Analysis</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>✓</span>
                  <span>Unlimited Shop Checks</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>✓</span>
                  <span>Priority support</span>
                </li>
                <li className="flex items-start gap-2">
                  <span>✓</span>
                  <span>Advanced insights</span>
                </li>
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 px-4 bg-gradient-to-br from-teal-600 to-teal-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Take Control of Your Health?
          </h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands who've stopped taking dangerous supplements
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a 
              href="https://apps.apple.com/app/supmize/id6756226894" 
              target="_blank"
              className="inline-block"
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

      {/* Footer */}
      <footer className="py-8 px-4 bg-gray-900 text-gray-400 text-center">
        <div className="max-w-6xl mx-auto">
          <div className="mb-4">
            <a href="/privacy" className="hover:text-white mx-3">Privacy Policy</a>
            <a href="/terms" className="hover:text-white mx-3">Terms & Conditions</a>
            <a href="mailto:admin@voise.co.uk" className="hover:text-white mx-3">Contact</a>
          </div>
          <p className="text-sm">© 2025 Voise Limited. All rights reserved.</p>
          <p className="text-xs mt-2">243 Weald Drive, Crawley, West Sussex, RH10 6PD, United Kingdom</p>
        </div>
      </footer>

    </div>
  )
}

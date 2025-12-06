export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-orange-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 md:p-12">
        <h1 className="text-4xl font-bold text-teal-700 mb-4">Terms & Conditions</h1>
        <p className="text-gray-600 mb-8">Last updated: December 6, 2025</p>
        <div className="space-y-6 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-teal-700 mb-3">1. Service Provider</h2>
            <div className="p-4 bg-teal-50 rounded-lg">
              <p className="font-semibold text-teal-900">Voise Limited</p>
              <p className="text-sm mt-2">243 Weald Drive, Crawley, West Sussex, RH10 6PD, United Kingdom</p>
              <p className="text-sm mt-2">Email: admin@voise.co.uk</p>
            </div>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-teal-700 mb-3">2. Medical Disclaimer</h2>
            <div className="p-6 bg-red-50 border-l-4 border-red-500 rounded-lg">
              <p className="font-bold text-red-900">⚠️ IMPORTANT: Supmize is NOT a medical device. Information is for educational purposes only. Always consult healthcare providers before making changes to supplements or medications.</p>
            </div>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-teal-700 mb-3">3. Subscription</h2>
            <p>Free: 1 analysis/month, 3 shop checks/month. Pro (£4.99/month): Unlimited analysis and shop checks. Auto-renews monthly. Cancel anytime.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-teal-700 mb-3">4. Account Deletion</h2>
            <p>You may delete your account at any time from the Profile tab. This permanently deletes all your data within 30 days.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-teal-700 mb-3">5. Limitation of Liability</h2>
            <p>Supmize is provided "AS IS". We are not liable for health consequences. Total liability limited to £59.88 (12 months subscription).</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-teal-700 mb-3">6. Governing Law</h2>
            <p>These Terms are governed by the laws of England and Wales. Disputes subject to jurisdiction of English courts.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-teal-700 mb-3">7. Contact</h2>
            <p className="font-semibold">Voise Limited - admin@voise.co.uk</p>
          </section>
        </div>
      </div>
    </div>
  )
}

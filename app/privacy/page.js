export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-orange-50 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8 md:p-12">
        <h1 className="text-4xl font-bold text-teal-700 mb-4">Privacy Policy</h1>
        <p className="text-gray-600 mb-8">Last updated: December 6, 2025</p>
        <div className="space-y-6 text-gray-700 leading-relaxed">
          <section>
            <h2 className="text-2xl font-bold text-teal-700 mb-3">1. Introduction</h2>
            <p>Welcome to Supmize. We are Voise Limited, a company incorporated in England and Wales. We are committed to protecting your privacy and ensuring the security of your personal health information.</p>
            <div className="mt-4 p-4 bg-teal-50 rounded-lg">
              <p className="font-semibold text-teal-900">Data Controller: Voise Limited</p>
              <p className="text-sm mt-2">243 Weald Drive, Crawley, West Sussex, RH10 6PD, United Kingdom</p>
              <p className="text-sm mt-2">Email: admin@voise.co.uk</p>
            </div>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-teal-700 mb-3">2. Information We Collect</h2>
            <p>We collect health information (supplements, medications, conditions, allergies), account information (email, credentials), and usage data (app usage, device info, error logs).</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-teal-700 mb-3">3. How We Use Your Information</h2>
            <p>We use your information for AI analysis, Shop Check scanning, reminders, service improvement, and customer support.</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-teal-700 mb-3">4. Your Rights</h2>
            <p>You have the right to access, correct, delete, export, and restrict your data. Use the Delete Account option in Profile or email admin@voise.co.uk</p>
          </section>
          <section>
            <h2 className="text-2xl font-bold text-teal-700 mb-3">5. Contact</h2>
            <p className="font-semibold">Voise Limited, 243 Weald Drive, Crawley, West Sussex, RH10 6PD, UK - admin@voise.co.uk</p>
          </section>
        </div>
      </div>
    </div>
  )
}

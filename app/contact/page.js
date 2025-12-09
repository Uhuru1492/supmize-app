'use client'
import { useState } from 'react'

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setStatus('')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (response.ok) {
        setStatus('success')
        setFormData({ name: '', email: '', subject: '', message: '' })
      } else {
        setStatus('error')
      }
    } catch (error) {
      setStatus('error')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-orange-50">
      
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-2">
            <div className="bg-gradient-to-br from-teal-600 to-teal-700 text-white w-10 h-10 rounded-xl flex items-center justify-center text-xl font-bold">
              💊
            </div>
            <span className="text-xl font-bold text-gray-900">Supmize</span>
          </a>
          <nav className="hidden md:flex gap-6">
            <a href="/" className="text-gray-600 hover:text-teal-600">Home</a>
            <a href="/contact" className="text-teal-600 font-semibold">Contact</a>
          </nav>
        </div>
      </header>

      {/* Contact Section */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Get in Touch
            </h1>
            <p className="text-xl text-gray-600">
              Have questions? We'd love to hear from you.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            
            {/* Contact Form */}
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
              
              {status === 'success' && (
                <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-6">
                  ✅ Message sent successfully! We'll get back to you soon.
                </div>
              )}
              
              {status === 'error' && (
                <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
                  ❌ Something went wrong. Please email us directly at admin@voise.co.uk
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:outline-none"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:outline-none"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Subject *
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:outline-none"
                    placeholder="What's this about?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows="5"
                    className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:outline-none resize-none"
                    placeholder="Tell us more..."
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-teal-600 to-teal-700 text-white py-3 rounded-lg font-bold hover:from-teal-700 hover:to-teal-800 transition disabled:opacity-50"
                >
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>

            {/* Contact Info */}
            <div className="space-y-6">
              
              <div className="bg-gradient-to-br from-teal-50 to-teal-100 rounded-2xl p-6">
                <div className="text-3xl mb-3">📧</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Email Us</h3>
                <a href="mailto:admin@voise.co.uk" className="text-teal-600 hover:text-teal-700 font-semibold">
                  admin@voise.co.uk
                </a>
                <p className="text-gray-600 text-sm mt-2">
                  We typically respond within 24 hours
                </p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6">
                <div className="text-3xl mb-3">🏢</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Company</h3>
                <p className="text-gray-700">
                  <strong>Voise Limited</strong><br />
                  243 Weald Drive<br />
                  Crawley, West Sussex<br />
                  RH10 6PD<br />
                  United Kingdom
                </p>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6">
                <div className="text-3xl mb-3">💬</div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Support</h3>
                <p className="text-gray-600 mb-3">
                  Need help with the app?
                </p>
                <a 
                  href="mailto:admin@voise.co.uk?subject=Support Request" 
                  className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                >
                  Get Support
                </a>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-gray-900 text-gray-400 text-center">
        <div className="max-w-6xl mx-auto">
          <div className="mb-4">
            <a href="/" className="hover:text-white mx-3 text-sm">Home</a>
            <a href="/privacy" className="hover:text-white mx-3 text-sm">Privacy Policy</a>
            <a href="/terms" className="hover:text-white mx-3 text-sm">Terms & Conditions</a>
            <a href="/contact" className="hover:text-white mx-3 text-sm">Contact</a>
          </div>
          <p className="text-sm">© 2025 Voise Limited. All rights reserved.</p>
          <p className="text-xs mt-2 opacity-75">243 Weald Drive, Crawley, West Sussex, RH10 6PD, United Kingdom</p>
        </div>
      </footer>

    </div>
  )
}

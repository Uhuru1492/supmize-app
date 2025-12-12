'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function NewsletterComposer() {
  const router = useRouter()
  const [subject, setSubject] = useState('')
  const [content, setContent] = useState('')
  const [sender, setSender] = useState('Supmize <onboarding@resend.dev>')
  const [sending, setSending] = useState(false)
  const [subscriberCount, setSubscriberCount] = useState(0)
  const [result, setResult] = useState(null)

  useEffect(() => {
    const auth = localStorage.getItem('adminAuth')
    if (auth !== 'true') {
      router.push('/admin')
      return
    }

    fetchSubscriberCount()
  }, [])

  const fetchSubscriberCount = async () => {
    const { data } = await supabase
      .from('newsletter_subscribers')
      .select('email', { count: 'exact' })
    
    setSubscriberCount(data?.length || 0)
  }

  const handleSend = async (e) => {
    e.preventDefault()
    
    if (!subject || !content) {
      alert('Please fill in subject and content')
      return
    }

    if (!confirm(`Send newsletter to ${subscriberCount} subscribers?`)) {
      return
    }

    setSending(true)
    setResult(null)

    try {
      const response = await fetch('/api/send-newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subject, content, sender })
      })

      const data = await response.json()
      
      if (data.success) {
        setResult({
          type: 'success',
          message: `✅ Newsletter sent to ${data.sent} subscribers! ${data.failed > 0 ? `(${data.failed} failed)` : ''}`
        })
        setSubject('')
        setContent('')
      } else {
        setResult({
          type: 'error',
          message: `❌ Failed to send: ${data.error}`
        })
      }
    } catch (error) {
      setResult({
        type: 'error',
        message: `❌ Error: ${error.message}`
      })
    } finally {
      setSending(false)
    }
  }

  const insertTemplate = (template) => {
    const templates = {
      welcome: {
        subject: 'Welcome to Supmize! 🎉',
        content: `
          <h2>Welcome to Supmize!</h2>
          <p>Thanks for subscribing to our newsletter.</p>
          <p>We'll keep you updated on:</p>
          <ul>
            <li>Supplement safety tips</li>
            <li>Latest research on interactions</li>
            <li>Money-saving recommendations</li>
            <li>New features in the app</li>
          </ul>
          <p><a href="https://apps.apple.com/app/supmize/id6756226894" style="background:#0d7377;color:white;padding:12px 24px;text-decoration:none;border-radius:8px;display:inline-block;">Download Supmize</a></p>
        `
      },
      update: {
        subject: 'New Features in Supmize 🚀',
        content: `
          <h2>What's New in Supmize</h2>
          <p>We've just released exciting new features:</p>
          <ul>
            <li><strong>Feature 1:</strong> Description here</li>
            <li><strong>Feature 2:</strong> Description here</li>
          </ul>
          <p>Update your app now to try them!</p>
        `
      },
      tip: {
        subject: 'Supplement Safety Tip 💊',
        content: `
          <h2>This Week's Supplement Safety Tip</h2>
          <p><strong>Did you know?</strong></p>
          <p>Insert your safety tip here...</p>
          <p>Stay safe with Supmize!</p>
        `
      }
    }

    const selected = templates[template]
    setSubject(selected.subject)
    setContent(selected.content)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/admin')}
              className="text-gray-600 hover:text-gray-900"
            >
              ← Back to Admin
            </button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Newsletter Composer</h1>
              <p className="text-xs text-gray-500">{subscriberCount} subscribers</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        
        <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
          <h3 className="font-bold text-gray-900 mb-3">Quick Templates</h3>
          <div className="flex gap-3">
            <button
              onClick={() => insertTemplate('welcome')}
              className="px-4 py-2 bg-teal-50 text-teal-700 rounded-lg font-semibold hover:bg-teal-100"
            >
              Welcome Email
            </button>
            <button
              onClick={() => insertTemplate('update')}
              className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-semibold hover:bg-blue-100"
            >
              Product Update
            </button>
            <button
              onClick={() => insertTemplate('tip')}
              className="px-4 py-2 bg-orange-50 text-orange-700 rounded-lg font-semibold hover:bg-orange-100"
            >
              Safety Tip
            </button>
          </div>
        </div>

        {result && (
          <div className={`p-4 rounded-lg mb-6 ${
            result.type === 'success' 
              ? 'bg-green-50 text-green-800 border border-green-200'
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {result.message}
          </div>
        )}

        <form onSubmit={handleSend} className="bg-white rounded-xl shadow-sm border p-6">
          
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              From (Sender)
            </label>
            <input
              type="text"
              value={sender}
              onChange={(e) => setSender(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:outline-none"
              placeholder="Supmize <onboarding@resend.dev>"
            />
            <p className="text-xs text-gray-500 mt-1">
              Note: Use onboarding@resend.dev for testing. To use your domain, verify it in Resend first.
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Subject Line *
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:outline-none"
              placeholder="Your newsletter subject..."
              required
            />
          </div>

          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Email Content (HTML) *
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="15"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-teal-500 focus:outline-none font-mono text-sm"
              placeholder="<h1>Your newsletter content...</h1>"
              required
            />
          </div>

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={sending}
              className="flex-1 bg-gradient-to-r from-teal-600 to-teal-700 text-white py-4 rounded-lg font-bold hover:from-teal-700 hover:to-teal-800 transition disabled:opacity-50"
            >
              {sending ? '📧 Sending...' : `📧 Send to ${subscriberCount} Subscribers`}
            </button>
            
            <button
              type="button"
              onClick={() => {
                setSubject('')
                setContent('')
                setResult(null)
              }}
              className="px-6 py-4 border-2 border-gray-300 text-gray-700 rounded-lg font-bold hover:bg-gray-50"
            >
              Clear
            </button>
          </div>
        </form>

      </div>
    </div>
  )
}

'use client'
import { useState, useEffect } from 'react'

export default function Account() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const emailParam = params.get('email')
    if (emailParam) setEmail(emailParam)
  }, [])

  async function handleSubscribe() {
    if (!email) {
      alert('Email is required')
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/subscription/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const data = await response.json()
      
      if (data.error) {
        setError(data.error)
        setLoading(false)
        return
      }

      if (data.url) {
        window.location.href = data.url
      }
    } catch (err) {
      setError(err.message)
      setLoading(false)
    }
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>🔬 Supmize Pro</h1>
        <p style={styles.subtitle}>Upgrade to unlock unlimited access</p>

        <div style={styles.priceBox}>
          <span style={styles.price}>$9.99</span>
          <span style={styles.period}>/month</span>
        </div>

        <div style={styles.features}>
          <div style={styles.feature}>✅ Unlimited Shop Checks</div>
          <div style={styles.feature}>✅ Unlimited AI Analysis</div>
          <div style={styles.feature}>✅ PDF Export</div>
          <div style={styles.feature}>✅ Priority Support</div>
          <div style={styles.feature}>✅ Save Money & Stay Safe</div>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        <input
          type="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        <button
          onClick={handleSubscribe}
          disabled={loading}
          style={styles.button}
        >
          {loading ? 'Loading...' : 'Subscribe Now'}
        </button>

        <p style={styles.note}>Cancel anytime. No hidden fees.</p>
      </div>
    </div>
  )
}

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0d7377 0%, #14FFEC 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  card: {
    background: 'white',
    borderRadius: '20px',
    padding: '40px',
    maxWidth: '500px',
    width: '100%',
    boxShadow: '0 20px 60px rgba(0,0,0,0.3)'
  },
  title: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: '#0d7377',
    marginBottom: '10px',
    textAlign: 'center'
  },
  subtitle: {
    fontSize: '18px',
    color: '#666',
    marginBottom: '30px',
    textAlign: 'center'
  },
  priceBox: {
    textAlign: 'center',
    marginBottom: '30px'
  },
  price: {
    fontSize: '48px',
    fontWeight: 'bold',
    color: '#0d7377'
  },
  period: {
    fontSize: '24px',
    color: '#999'
  },
  features: {
    marginBottom: '30px'
  },
  feature: {
    fontSize: '16px',
    padding: '12px 0',
    borderBottom: '1px solid #f0f0f0'
  },
  error: {
    backgroundColor: '#fee',
    color: '#c00',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '16px',
    fontSize: '14px'
  },
  input: {
    width: '100%',
    padding: '15px',
    fontSize: '16px',
    borderRadius: '10px',
    border: '2px solid #e0e0e0',
    marginBottom: '20px',
    boxSizing: 'border-box'
  },
  button: {
    width: '100%',
    padding: '18px',
    fontSize: '18px',
    fontWeight: 'bold',
    color: 'white',
    background: '#0d7377',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer'
  },
  note: {
    textAlign: 'center',
    color: '#999',
    fontSize: '14px',
    marginTop: '20px'
  }
}

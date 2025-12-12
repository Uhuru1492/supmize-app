'use client'
import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [supplements, setSupplements] = useState([])
  const [newSupplement, setNewSupplement] = useState({ name: '', dosage: '', timing: '' })
  const [loading, setLoading] = useState(true)
  const [analyzing, setAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState(null)
  const router = useRouter()

  useEffect(() => {
    checkUser()
    getSupplements()
  }, [])

  async function checkUser() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      router.push('/')
    } else {
      setUser(user)
      setLoading(false)
    }
  }

  async function getSupplements() {
    const { data, error } = await supabase
      .from('supplements')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (data) setSupplements(data)
  }

  async function addSupplement(e) {
    e.preventDefault()
    if (!newSupplement.name) return

    const { error } = await supabase
      .from('supplements')
      .insert([{ 
        user_id: user.id, 
        ...newSupplement 
      }])

    if (!error) {
      setNewSupplement({ name: '', dosage: '', timing: '' })
      getSupplements()
    }
  }

  async function deleteSupplement(id) {
    await supabase.from('supplements').delete().eq('id', id)
    getSupplements()
  }

  async function analyzeStack() {
    if (supplements.length < 2) {
      alert('Add at least 2 supplements to analyze')
      return
    }

    setAnalyzing(true)
    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ supplements })
      })
      
      const data = await response.json()
      setAnalysis(data.analysis)
    } catch (error) {
      console.error('Analysis error:', error)
      alert('Analysis failed. Please try again.')
    } finally {
      setAnalyzing(false)
    }
  }

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-orange-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-teal-600 to-teal-700 text-white w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold">
                Sz
              </div>
              <div>
                <h1 className="text-2xl font-bold text-teal-900">Supmize Dashboard</h1>
                <p className="text-sm text-gray-600">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Add Supplement Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-teal-900 mb-4">Add Supplement</h2>
          <form onSubmit={addSupplement} className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Supplement name"
              value={newSupplement.name}
              onChange={(e) => setNewSupplement({...newSupplement, name: e.target.value})}
              className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-teal-600 focus:outline-none"
              required
            />
            <input
              type="text"
              placeholder="Dosage (e.g., 1000mg)"
              value={newSupplement.dosage}
              onChange={(e) => setNewSupplement({...newSupplement, dosage: e.target.value})}
              className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-teal-600 focus:outline-none"
            />
            <input
              type="text"
              placeholder="Timing (e.g., Morning)"
              value={newSupplement.timing}
              onChange={(e) => setNewSupplement({...newSupplement, timing: e.target.value})}
              className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-teal-600 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-gradient-to-r from-teal-600 to-teal-700 text-white py-2 rounded-xl font-semibold hover:shadow-lg transition"
            >
              Add
            </button>
          </form>
        </div>

        {/* Supplements List */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-teal-900">Your Supplement Stack</h2>
            {supplements.length >= 2 && (
              <button
                onClick={analyzeStack}
                disabled={analyzing}
                className="bg-orange-500 text-white px-6 py-2 rounded-xl font-semibold hover:bg-orange-600 transition disabled:opacity-50"
              >
                {analyzing ? 'Analyzing...' : '🔍 Analyze Stack'}
              </button>
            )}
          </div>

          {supplements.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No supplements yet. Add your first one above!</p>
          ) : (
            <div className="space-y-3">
              {supplements.map((supp) => (
                <div key={supp.id} className="flex items-center justify-between p-4 bg-teal-50 rounded-xl">
                  <div>
                    <h3 className="font-semibold text-teal-900">{supp.name}</h3>
                    <p className="text-sm text-gray-600">
                      {supp.dosage && `${supp.dosage}`}
                      {supp.timing && ` • ${supp.timing}`}
                    </p>
                  </div>
                  <button
                    onClick={() => deleteSupplement(supp.id)}
                    className="text-red-500 hover:text-red-700 transition"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Analysis Results */}
        {analysis && (
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-teal-900 mb-4">Analysis Results</h2>
            <div className="prose max-w-none">
              <div className="whitespace-pre-wrap text-gray-700">{analysis}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

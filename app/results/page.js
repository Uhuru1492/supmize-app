'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ResultsPage() {
  const router = useRouter()
  const [results, setResults] = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem('analysisResults')
    if (stored) {
      setResults(JSON.parse(stored))
    } else {
      router.push('/')
    }
  }, [])

  if (!results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your results...</p>
        </div>
      </div>
    )
  }

  const formatAnalysis = (text) => {
    const sections = text.split(/(?=##\s)/g)
    
    return sections.map((section, index) => {
      const lines = section.split('\n').filter(line => line.trim())
      if (lines.length === 0) return null

      const titleLine = lines[0].replace(/^##\s*/, '').trim()
      const emoji = titleLine.match(/^[^\w\s]+/)?.[0] || ''
      const title = titleLine.replace(/^[^\w\s]+\s*/, '').trim()
      
      let bgColor = 'bg-teal-50'
      let borderColor = 'border-teal-500'
      
      if (title.toLowerCase().includes('dangerous') || title.toLowerCase().includes('warning')) {
        bgColor = 'bg-red-50'
        borderColor = 'border-red-500'
      } else if (title.toLowerCase().includes('optimization') || title.toLowerCase().includes('improve')) {
        bgColor = 'bg-orange-50'
        borderColor = 'border-orange-500'
      } else if (title.toLowerCase().includes('savings') || title.toLowerCase().includes('money')) {
        bgColor = 'bg-green-50'
        borderColor = 'border-green-500'
      }

      return (
        <div key={index} className={`${bgColor} p-6 rounded-xl border-l-4 ${borderColor} shadow-md`}>
          <h3 className="text-xl font-bold text-gray-900 mb-3">
            {emoji && <span className="mr-2">{emoji}</span>}
            {title}
          </h3>
          <div className="space-y-2">
            {lines.slice(1).map((line, i) => {
              const cleanLine = line.replace(/^[-•*]\s*/, '').replace(/^\*\*(.*?)\*\*/, '$1').trim()
              if (!cleanLine) return null
              
              const isBullet = line.trim().match(/^[-•*]/)
              
              return (
                <p key={i} className={isBullet ? 'flex items-start gap-2' : ''}>
                  {isBullet && <span className="text-teal-600 font-bold mt-1">•</span>}
                  <span className="text-gray-700">{cleanLine}</span>
                </p>
              )
            })}
          </div>
        </div>
      )
    }).filter(Boolean)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-orange-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        
        <div className="text-center mb-8">
          <div className="inline-block bg-green-500 text-white px-6 py-2 rounded-full font-bold mb-4">
            ✅ Analysis Complete
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Your Supplement Analysis
          </h1>
          <p className="text-gray-600">
            Based on: {results.supplements.join(', ')}
          </p>
        </div>

        <div className="space-y-6 mb-8">
          {formatAnalysis(results.analysis)}
        </div>

        <div className="bg-gradient-to-br from-teal-600 to-teal-700 text-white p-8 rounded-2xl text-center">
          <h2 className="text-2xl font-bold mb-3">Want Full Protection?</h2>
          <p className="mb-6 opacity-90">
            Get unlimited analyses, shop checks, and track your complete supplement stack
          </p>
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

        <div className="text-center mt-8">
          <button
            onClick={() => router.push('/')}
            className="text-teal-600 hover:text-teal-700 font-semibold"
          >
            ← Analyze Another Stack
          </button>
        </div>

      </div>
    </div>
  )
}

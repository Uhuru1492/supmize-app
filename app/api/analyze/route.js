import Anthropic from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request) {
  try {
    const { supplements } = await request.json()

    if (!supplements || supplements.length < 2) {
      return NextResponse.json(
        { error: 'Need at least 2 supplements' },
        { status: 400 }
      )
    }

    const supplementList = supplements.map(s => 
      `- ${s.name}${s.dosage ? ` (${s.dosage})` : ''}${s.timing ? ` - taken ${s.timing}` : ''}`
    ).join('\n')

    const prompt = `You are an expert supplement analyst. Analyze this supplement stack and provide a comprehensive, actionable report.

SUPPLEMENT STACK:
${supplementList}

Provide analysis in this EXACT JSON format:
{
  "overallScore": 85,
  "summary": "Brief 2-3 sentence overview",
  "dangerousInteractions": [
    {"supplements": "Iron + Calcium", "severity": "high", "issue": "explanation", "solution": "what to do"}
  ],
  "timingConflicts": [
    {"supplements": "names", "issue": "explanation", "solution": "optimal timing"}
  ],
  "redundancies": [
    {"supplements": "names", "issue": "overlap explanation", "solution": "recommendation"}
  ],
  "missingCofactors": [
    {"for": "supplement name", "missing": "cofactor name", "reason": "why needed", "benefit": "what it does"}
  ],
  "optimizations": [
    {"supplement": "name", "current": "current approach", "better": "improved approach", "benefit": "expected improvement"}
  ],
  "moneySaved": 45,
  "safetyScore": 8
}

Be specific, actionable, and honest. If no issues in a category, use empty array.`

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 3000,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = message.content[0].text
    const match = text.match(/\{[\s\S]*\}/)
    
    if (!match) {
      return NextResponse.json({ error: 'Parse failed' }, { status: 400 })
    }

    return NextResponse.json(JSON.parse(match[0]))

  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 })
  }
}

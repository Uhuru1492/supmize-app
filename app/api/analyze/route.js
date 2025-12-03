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
        { error: 'Please provide at least 2 supplements' },
        { status: 400 }
      )
    }

    // Format supplements for analysis
    const supplementList = supplements.map(s => 
      `${s.name}${s.dosage ? ` (${s.dosage})` : ''}${s.timing ? ` - ${s.timing}` : ''}`
    ).join('\n')

    const prompt = `You are a supplement interaction expert. Analyze the following supplement stack and provide:

1. **Dangerous Interactions**: Any supplements that should NOT be taken together
2. **Timing Conflicts**: Supplements that block each other's absorption
3. **Redundancies**: Overlapping nutrients or wasted money
4. **Missing Cofactors**: Important nutrients needed for absorption
5. **Optimization Tips**: Better timing or forms for maximum benefit

Supplement Stack:
${supplementList}

Provide a clear, actionable analysis. Be specific about WHY interactions occur and WHAT to do about them.`

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      messages: [
        { role: 'user', content: prompt }
      ],
    })

    const analysis = message.content[0].text

    return NextResponse.json({ analysis })

  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json(
      { error: 'Analysis failed', details: error.message },
      { status: 500 }
    )
  }
}

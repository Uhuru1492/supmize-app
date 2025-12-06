import Anthropic from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request) {
  try {
    const { supplements, medications, healthConditions, allergies } = await request.json()

    const hasData = (supplements?.length > 0) || (medications?.length > 0) || 
                    (healthConditions?.length > 0) || (allergies?.length > 0)

    if (!hasData) {
      return NextResponse.json(
        { error: 'Add at least one supplement, medication, or health condition' },
        { status: 400 }
      )
    }

    const supplementList = supplements?.map(s => 
      `- ${s.name}${s.dosage ? ` (${s.dosage})` : ''}${s.timing ? ` - taken ${s.timing}` : ''}`
    ).join('\n') || 'None'

    const medsList = medications?.map(m =>
      `- ${m.name}${m.dosage ? ` (${m.dosage})` : ''}`
    ).join('\n') || 'None'

    const conditionsList = healthConditions?.map(c => `- ${c.condition}`).join('\n') || 'None'
    const allergiesList = allergies?.map(a => `- ${a.allergen}`).join('\n') || 'None'

    const prompt = `You are an expert supplement and medication analyst. Analyze this person's complete health profile and provide a detailed, easy-to-read analysis.

CURRENT SUPPLEMENTS:
${supplementList}

PRESCRIPTION MEDICATIONS:
${medsList}

HEALTH CONDITIONS:
${conditionsList}

ALLERGIES:
${allergiesList}

Provide a comprehensive analysis in clear, readable paragraphs. Structure your response with these sections:

1. **OVERVIEW** - 2-3 sentences summarizing their current stack and health profile

2. **⚠️ DANGEROUS INTERACTIONS** - Any life-threatening or severe interactions between supplements, medications, and health conditions. Be specific about what to stop immediately.

3. **⚡ OPTIMIZATION OPPORTUNITIES** - How they can improve timing, dosing, or combinations for better results

4. **💊 RECOMMENDED ADDITIONS** - What supplements they should consider adding based on their medications/conditions, with clear reasoning

5. **💰 COST SAVINGS** - Any redundant supplements they can eliminate

6. **✅ SAFETY SCORE** - Rate their stack 1-10 for safety

Be conversational, specific, and actionable. Focus on practical advice they can implement immediately.`

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }],
    })

    const analysis = message.content[0].text

    return NextResponse.json({ analysis })

  } catch (error) {
    console.error('Analysis error:', error)
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 })
  }
}
// Updated Sat Dec  6 06:10:58 EAT 2025

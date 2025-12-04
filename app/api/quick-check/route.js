import Anthropic from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request) {
  try {
    const { newSupplement, currentStack, medications, healthConditions, allergies } = await request.json()

    if (!newSupplement) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 })
    }

    const stackList = currentStack?.map(s => 
      `- ${s.name}${s.dosage ? ` (${s.dosage})` : ''}`
    ).join('\n') || 'None'

    const medsList = medications?.map(m =>
      `- ${m.name}${m.dosage ? ` (${m.dosage})` : ''}`
    ).join('\n') || 'None'

    const conditionsList = healthConditions?.map(c => `- ${c.condition}`).join('\n') || 'None'
    const allergiesList = allergies?.map(a => `- ${a.allergen}`).join('\n') || 'None'

    const prompt = `You are a medical safety expert. A person is IN A STORE considering buying a supplement.

THEIR CURRENT SUPPLEMENTS:
${stackList}

THEIR PRESCRIPTION MEDICATIONS:
${medsList}

THEIR HEALTH CONDITIONS:
${conditionsList}

THEIR ALLERGIES:
${allergiesList}

NEW SUPPLEMENT THEY'RE CONSIDERING:
${newSupplement.name}${newSupplement.dosage ? ` (${newSupplement.dosage})` : ''}

CRITICAL: Check for dangerous interactions with MEDICATIONS and health conditions first - these are life-threatening!

Respond ONLY with valid JSON:
{
  "verdict": "safe" | "warning" | "danger",
  "emoji": "✅" | "⚠️" | "❌",
  "title": "short verdict (5-8 words)",
  "reason": "WHY this verdict (mention specific medications/conditions if relevant)",
  "action": "what to do",
  "alternatives": ["alternative 1", "alternative 2"] or null,
  "moneySaved": 0 (if redundant with current supplements)
}

Use "danger" for:
- Interactions with prescription medications (e.g., Vitamin K + Warfarin)
- Contraindications with health conditions (e.g., high-dose iron + hemochromatosis)
- Contains allergens they listed

Use "warning" for:
- Minor timing issues
- Absorption conflicts
- Dosage concerns

Use "safe" if no issues with medications, conditions, allergies, or current supplements.`

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = message.content[0].text
    const match = text.match(/\{[\s\S]*\}/)
    
    if (!match) {
      return NextResponse.json({ error: 'Parse failed' }, { status: 400 })
    }

    return NextResponse.json(JSON.parse(match[0]))

  } catch (error) {
    console.error('Quick check error:', error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

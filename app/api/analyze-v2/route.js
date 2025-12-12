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

    const supplementList = supplements?.map(s => {
      let text = `- ${s.name}`
      if (s.dosage) text += ` (${s.dosage})`
      if (s.timing) text += ` - taken ${s.timing}`
      return text
    }).join('\n') || 'None'

    const medsList = medications?.map(m => {
      let text = `- ${m.name}`
      if (m.dosage) text += ` (${m.dosage})`
      return text
    }).join('\n') || 'None'

    const conditionsList = healthConditions?.map(c => `- ${c.condition}`).join('\n') || 'None'
    const allergiesList = allergies?.map(a => `- ${a.allergen}`).join('\n') || 'None'

    const prompt = `You are an expert supplement and medication analyst. Analyze this person's complete health profile and provide a detailed analysis with numerical scores.

CURRENT SUPPLEMENTS:
${supplementList}

PRESCRIPTION MEDICATIONS:
${medsList}

HEALTH CONDITIONS:
${conditionsList}

ALLERGIES:
${allergiesList}

Provide your analysis in this EXACT JSON format (and ONLY JSON, no other text):

{
  "overallScore": 85,
  "safetyScore": 90,
  "efficacyScore": 80,
  "transparencyScore": 85,
  "categoryAverage": 72,
  "summary": "Brief 2-3 sentence overview of their stack",
  "theGood": [
    "Positive point 1",
    "Positive point 2",
    "Positive point 3"
  ],
  "theBad": [
    "Concern 1 (if any)",
    "Concern 2 (if any)"
  ],
  "dangerousInteractions": [
    {
      "severity": "high",
      "interaction": "Description of interaction",
      "action": "What to do immediately"
    }
  ],
  "optimizations": [
    {
      "title": "Optimization suggestion",
      "description": "How to implement it",
      "expectedBenefit": "What improvement to expect"
    }
  ],
  "recommendations": [
    {
      "supplement": "Supplement name",
      "reason": "Why they should consider it",
      "dosage": "Recommended dosage"
    }
  ],
  "costSavings": [
    {
      "supplement": "Supplement that can be removed",
      "reason": "Why it's redundant or unnecessary",
      "monthlySavings": 25
    }
  ]
}

Scoring guide (0-100):
- Overall: Holistic assessment of the entire stack
- Safety: Risk of interactions and side effects (higher = safer)
- Efficacy: How well the stack addresses their needs (higher = more effective)
- Transparency: Quality and dosing clarity of their supplements (higher = better)
- Category Average: What typical users score (usually 65-75)

Be specific, actionable, and evidence-based. Return ONLY the JSON object, no markdown formatting.`

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }],
    })

    const text = message.content[0].text
    
    // Try to parse JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    
    if (!jsonMatch) {
      console.error('No JSON found in enhanced analysis response')
      // Fallback to regular text analysis
      return NextResponse.json({ 
        analysis: text,
        enhanced: false 
      })
    }

    try {
      const parsed = JSON.parse(jsonMatch[0])
      return NextResponse.json({ 
        ...parsed,
        enhanced: true 
      })
    } catch (parseError) {
      console.error('JSON parse error:', parseError)
      // Fallback to regular text analysis
      return NextResponse.json({ 
        analysis: text,
        enhanced: false 
      })
    }

  } catch (error) {
    console.error('Enhanced analysis error:', error)
    return NextResponse.json({ 
      error: error.message || 'Analysis failed',
      details: error.toString()
    }, { status: 500 })
  }
}

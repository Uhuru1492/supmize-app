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

    const prompt = `You are an expert supplement and medication analyst. Analyze this person's complete health profile and provide a STRUCTURED JSON response.

CURRENT SUPPLEMENTS:
${supplementList}

PRESCRIPTION MEDICATIONS:
${medsList}

HEALTH CONDITIONS:
${conditionsList}

ALLERGIES:
${allergiesList}

Return ONLY a valid JSON object (no markdown, no explanation) with this EXACT structure:

{
  "overallScore": 85,
  "safetyScore": 90,
  "efficacyScore": 80,
  "transparencyScore": 85,
  "summary": "Brief 2-3 sentence overview of their stack",
  "theGood": [
    "Positive point 1 with specific detail",
    "Positive point 2 with specific detail",
    "Positive point 3 with specific detail"
  ],
  "theBad": [
    "Concern 1 with specific detail and what to do",
    "Concern 2 with specific detail and what to do"
  ],
  "dangerousInteractions": [
    {
      "severity": "high",
      "interaction": "Specific interaction description",
      "action": "What to do immediately"
    }
  ],
  "optimizations": [
    {
      "title": "Timing improvement",
      "description": "Specific recommendation",
      "expectedBenefit": "What they'll gain"
    }
  ],
  "recommendations": [
    {
      "supplement": "Name",
      "reason": "Why they should add it",
      "dosage": "Recommended amount"
    }
  ],
  "costSavings": [
    {
      "supplement": "Name to eliminate",
      "reason": "Why it's redundant",
      "monthlySavings": "$15"
    }
  ]
}

Scoring guidelines:
- Overall Score (0-100): Weighted average of safety, efficacy, transparency
- Safety Score (0-100): Based on interaction risks, contraindications
- Efficacy Score (0-100): Based on optimal timing, absorption, synergies
- Transparency Score (0-100): Based on ingredient quality, third-party testing

Be specific, actionable, and evidence-based. Return ONLY the JSON object.`

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }],
    })

    let analysisText = message.content[0].text.trim()
    
    // Remove markdown code fences if present
    analysisText = analysisText.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    
    // Parse the JSON response
    const analysisData = JSON.parse(analysisText)

    return NextResponse.json({ 
      analysis: analysisData,
      success: true 
    })

  } catch (error) {
    console.error('Analysis error:', error)
    
    // Fallback to text-based analysis if JSON parsing fails
    return NextResponse.json({ 
      error: 'Analysis failed',
      fallback: true 
    }, { status: 500 })
  }
}

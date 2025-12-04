import Anthropic from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request) {
  try {
    const { supplements, medications, healthConditions, allergies } = await request.json()

    // Check if user has ANY data to analyze
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

    const prompt = `You are an expert supplement and medication analyst. Analyze this person's complete health profile.

CURRENT SUPPLEMENTS:
${supplementList}

PRESCRIPTION MEDICATIONS:
${medsList}

HEALTH CONDITIONS:
${conditionsList}

ALLERGIES:
${allergiesList}

Provide a comprehensive analysis. If they have medications/conditions but few supplements, suggest what they SHOULD add. If they have supplements + medications, check for dangerous interactions.

Respond in EXACT JSON format:
{
  "overallScore": 75,
  "summary": "2-3 sentence overview of their health profile",
  "dangerousInteractions": [
    {"supplements": "names", "severity": "high|medium|low", "issue": "what's wrong", "solution": "what to do"}
  ],
  "timingConflicts": [
    {"supplements": "names", "issue": "timing problem", "solution": "better schedule"}
  ],
  "redundancies": [
    {"supplements": "names", "issue": "overlap", "solution": "consolidate"}
  ],
  "missingCofactors": [
    {"for": "supplement/medication", "missing": "what's needed", "reason": "why", "benefit": "improvement"}
  ],
  "optimizations": [
    {"supplement": "name", "current": "current approach", "better": "improved approach", "benefit": "result"}
  ],
  "recommendedSupplements": [
    {"name": "supplement", "reason": "why they need it based on conditions/meds", "benefit": "expected outcome"}
  ],
  "moneySaved": 0,
  "safetyScore": 8
}

CRITICAL: Check medication interactions first - these are life-threatening! If someone takes Warfarin and Vitamin K, this is DANGEROUS. If diabetic taking high-dose chromium, this is DANGEROUS.

Be specific and actionable. Empty arrays if no issues in that category.`

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
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

import Anthropic from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request) {
  try {
    const { newSupplement, currentStack } = await request.json()
    if (!newSupplement || !currentStack) {
      return NextResponse.json({ error: 'Missing data' }, { status: 400 })
    }
    const stackList = currentStack.map(s => `- ${s.name}${s.dosage ? ` 
(${s.dosage})` : ''}`).join('\n')
    const prompt = `You are a supplement safety expert analyzing an 
in-store purchase decision.

CURRENT STACK:
${stackList}

CONSIDERING:
${newSupplement.name}${newSupplement.dosage ? ` (${newSupplement.dosage})` 
: ''}

Respond with JSON: 
{"verdict":"safe|warning|danger","emoji":"✅|⚠️|❌","title":"short 
verdict","reason":"explanation","action":"what to 
do","alternatives":["alt1","alt2"],"moneySaved":0}`

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [{ role: 'user', content: prompt }]
    })
    const text = message.content[0].text
    const match = text.match(/\{[\s\S]*\}/)
    if (!match) return NextResponse.json({ error: 'Parse failed' }, { 
status: 400 })
    return NextResponse.json(JSON.parse(match[0]))
  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

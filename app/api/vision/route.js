import Anthropic from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request) {
  try {
    const { imageBase64 } = await request.json()
    
    if (!imageBase64) {
      return NextResponse.json({ error: 'Image required' }, { status: 400 
})
    }

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: 'image/jpeg',
              data: imageBase64
            }
          },
          {
            type: 'text',
            text: 'Analyze this supplement label and extract: supplement 
name, dosage per serving, form (capsule/tablet/etc), and best timing to 
take it. Respond only with valid JSON in this exact format: 
{"name":"","dosage":"","form":"","timing":""}'
          }
        ]
      }]
    })

    const text = message.content[0].text
    const match = text.match(/\{[\s\S]*\}/)
    
    if (!match) {
      return NextResponse.json({ error: 'Could not parse response' }, { 
status: 400 })
    }

    return NextResponse.json(JSON.parse(match[0]))

  } catch (error) {
    console.error('Vision API error:', error)
    return NextResponse.json({ error: 'Analysis failed' }, { status: 500 
})
  }
}

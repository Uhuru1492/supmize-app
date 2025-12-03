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
            text: 'Extract supplement data as JSON: 
{"name":"","dosage":"","form":"","timing":""}'
          }
        ]
      }]
    })

    const text = message.content[0].text
    const match = text.match(/\{[\s\S]*\}/)
    
    if (!match) {
      return NextResponse.json({ error: 'Parse failed' }, { status: 400 })
    }

    return NextResponse.json(JSON.parse(match[0]))

  } catch (error) {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

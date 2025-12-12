import Anthropic from '@anthropic-ai/sdk'
import { NextResponse } from 'next/server'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request) {
  try {
    const { imageBase64 } = await request.json()
    
    if (!imageBase64) {
      return NextResponse.json({ error: 'Image required' }, { status: 400 })
    }

    console.log('Vision API: Processing image...')

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
            text: 'Look at this supplement label and extract the information in this exact JSON format: {"name":"supplement name","dosage":"dosage amount","form":"pill/capsule/powder/etc","timing":"morning/evening/with food/etc if shown"}. Only return the JSON, nothing else.'
          }
        ]
      }]
    })

    const text = message.content[0].text
    console.log('Vision API response:', text)

    // Try to extract JSON from response
    const match = text.match(/\{[\s\S]*\}/)
    
    if (!match) {
      console.error('No JSON found in response:', text)
      return NextResponse.json({ 
        error: 'Could not extract supplement info from image',
        details: text 
      }, { status: 400 })
    }

    const parsed = JSON.parse(match[0])
    console.log('Parsed supplement:', parsed)

    return NextResponse.json(parsed)

  } catch (error) {
    console.error('Vision API error:', error)
    return NextResponse.json({ 
      error: error.message || 'Vision analysis failed',
      details: error.toString()
    }, { status: 500 })
  }
}

import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request) {
  try {
    const { name, email, subject, message } = await request.json()

    // Save to database
    const { data, error } = await supabase
      .from('contact_messages')
      .insert([
        { 
          name,
          email,
          subject,
          message
        }
      ])
      .select()

    if (error) {
      console.error('Contact form error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to send message' },
        { status: 500 }
      )
    }

    // TODO: Send email notification to admin
    // await sendEmail({
    //   to: 'admin@voise.co.uk',
    //   subject: `Contact Form: ${subject}`,
    //   body: `From: ${name} (${email})\n\n${message}`
    // })

    return NextResponse.json({ 
      success: true,
      message: 'Message received' 
    })
  } catch (error) {
    console.error('Contact API error:', error)
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    )
  }
}

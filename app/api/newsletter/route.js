import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function POST(request) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { success: false, error: 'Invalid email' },
        { status: 400 }
      )
    }

    // Store email in Supabase
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .insert([
        { 
          email: email,
          subscribed_at: new Date().toISOString(),
          source: 'website'
        }
      ])
      .select()

    if (error) {
      // If duplicate email (already subscribed)
      if (error.code === '23505') {
        return NextResponse.json({ 
          success: true,
          message: 'Already subscribed' 
        })
      }
      
      console.error('Newsletter signup error:', error)
      return NextResponse.json(
        { success: false, error: 'Failed to subscribe' },
        { status: 500 }
      )
    }

    // TODO: Send welcome email with free guide
    // You can integrate with Resend, SendGrid, etc.
    
    return NextResponse.json({ 
      success: true,
      message: 'Subscribed successfully' 
    })
  } catch (error) {
    console.error('Newsletter API error:', error)
    return NextResponse.json(
      { success: false, error: 'Server error' },
      { status: 500 }
    )
  }
}

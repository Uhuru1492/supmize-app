import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { supabase } from '@/lib/supabase'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request) {
  try {
    const { subject, content, sender } = await request.json()

    // Get all newsletter subscribers
    const { data: subscribers, error } = await supabase
      .from('newsletter_subscribers')
      .select('email')

    if (error || !subscribers || subscribers.length === 0) {
      return NextResponse.json(
        { success: false, error: 'No subscribers found' },
        { status: 400 }
      )
    }

    // Send emails in batches
    const emails = subscribers.map(sub => sub.email)
    
    // Send to all subscribers
    const results = await Promise.all(
      emails.map(async (email) => {
        try {
          const { data, error } = await resend.emails.send({
            from: sender || 'Supmize <onboarding@resend.dev>',
            to: [email],
            subject: subject,
            html: content
          })
          
          return { email, success: !error, error }
        } catch (err) {
          return { email, success: false, error: err.message }
        }
      })
    )

    const successCount = results.filter(r => r.success).length
    const failCount = results.filter(r => !r.success).length

    return NextResponse.json({ 
      success: true,
      sent: successCount,
      failed: failCount,
      total: emails.length
    })
  } catch (error) {
    console.error('Send newsletter error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

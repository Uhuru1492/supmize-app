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

    const emails = subscribers.map(sub => sub.email)
    
    // Send to all subscribers
    const results = await Promise.all(
      emails.map(async (email) => {
        try {
          console.log('Sending to:', email)
          const result = await resend.emails.send({
            from: sender || 'Supmize <onboarding@resend.dev>',
            to: [email],
            subject: subject,
            html: content
          })
          
          console.log('Result:', result)
          
          return { email, success: !result.error, error: result.error, data: result.data }
        } catch (err) {
          console.error('Send error:', err)
          return { email, success: false, error: err.message }
        }
      })
    )

    console.log('All results:', results)

    const successCount = results.filter(r => r.success).length
    const failCount = results.filter(r => !r.success).length
    const errors = results.filter(r => !r.success).map(r => ({ email: r.email, error: r.error }))

    return NextResponse.json({ 
      success: true,
      sent: successCount,
      failed: failCount,
      total: emails.length,
      errors: errors
    })
  } catch (error) {
    console.error('Send newsletter error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}

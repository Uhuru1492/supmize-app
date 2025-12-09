import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

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

    // Send welcome email automatically
    try {
      await resend.emails.send({
        from: 'Supmize <newsletter@supmize.com>',
        to: [email],
        subject: 'Welcome to Supmize! 🎉',
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="display: inline-block; background: linear-gradient(135deg, #0d7377, #14b8a6); color: white; width: 80px; height: 80px; border-radius: 20px; line-height: 80px; font-size: 40px; margin-bottom: 20px;">
                💊
              </div>
              <h1 style="color: #0d7377; margin: 0;">Welcome to Supmize!</h1>
            </div>

            <p style="font-size: 16px;">Hi there! 👋</p>

            <p style="font-size: 16px;">Thanks for subscribing to our newsletter. We're excited to help you stay safe and save money on supplements!</p>

            <div style="background: #f0f9ff; border-left: 4px solid #0d7377; padding: 20px; margin: 30px 0; border-radius: 8px;">
              <h3 style="margin-top: 0; color: #0d7377;">📚 Your Free Gift: Supplement Safety Guide</h3>
              <p style="margin-bottom: 0;">We'll be sending you our comprehensive guide on the 7 most dangerous supplement interactions in the next email. Stay tuned!</p>
            </div>

            <h3 style="color: #0d7377;">What to expect from us:</h3>
            <ul style="font-size: 16px;">
              <li><strong>Weekly Safety Tips:</strong> Learn about dangerous supplement interactions</li>
              <li><strong>Money-Saving Advice:</strong> Stop wasting money on redundant supplements</li>
              <li><strong>Latest Research:</strong> Evidence-based supplement recommendations</li>
              <li><strong>App Updates:</strong> Be the first to know about new features</li>
            </ul>

            <div style="text-align: center; margin: 40px 0;">
              <a href="https://apps.apple.com/app/supmize/id6756226894" style="display: inline-block; background: linear-gradient(135deg, #0d7377, #14b8a6); color: white; padding: 16px 32px; text-decoration: none; border-radius: 12px; font-weight: bold; font-size: 18px;">
                📱 Download Supmize App
              </a>
            </div>

            <div style="background: #fff5f0; border: 1px solid #ff6b35; padding: 20px; margin: 30px 0; border-radius: 8px;">
              <h3 style="margin-top: 0; color: #ff6b35;">⚠️ Did you know?</h3>
              <p style="margin-bottom: 0;">68% of supplement users have dangerous interactions they don't know about. Supmize helps you catch them before they harm you.</p>
            </div>

            <p style="font-size: 16px;">Questions? Just reply to this email - we'd love to hear from you!</p>

            <p style="font-size: 16px;">Stay safe,<br><strong>The Supmize Team</strong></p>

            <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 40px 0;">

            <p style="font-size: 12px; color: #6b7280; text-align: center;">
              Voise Limited | 243 Weald Drive, Crawley, West Sussex, RH10 6PD, UK<br>
              <a href="https://www.supmize.com" style="color: #0d7377;">Visit our website</a> | 
              <a href="https://www.supmize.com/privacy" style="color: #0d7377;">Privacy Policy</a>
            </p>

          </body>
          </html>
        `
      })
      
      console.log('Welcome email sent to:', email)
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError)
      // Don't fail the whole request if email fails
    }
    
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

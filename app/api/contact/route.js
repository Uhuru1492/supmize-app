import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const { name, email, subject, message } = await request.json()

    // For now, just log it (you can add email service later)
    console.log('Contact form submission:', { name, email, subject, message })

    // TODO: Add email service integration (Resend, SendGrid, etc.)
    // For now, we'll just return success
    
    // You can add this to send to your email:
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
    console.error('Contact form error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to send message' },
      { status: 500 }
    )
  }
}

import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request) {
  const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
  const { email } = await request.json()

  if (!email) {
    return NextResponse.json({ error: 'Email required' }, { status: 400 })
  }

  try {
    const customers = await stripe.customers.list({ email, limit: 1 })
    let customer
    
    if (customers.data.length > 0) {
      customer = customers.data[0]
    } else {
      customer = await stripe.customers.create({ email })
    }

    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Supmize Pro',
              description: 'Unlimited Shop Checks & AI Analysis'
            },
            unit_amount: 999,
            recurring: {
              interval: 'month'
            }
          },
          quantity: 1
        }
      ],
      success_url: 'https://supmize-app.vercel.app/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: `https://supmize-app.vercel.app/account?email=${email}`,
      metadata: {
        email
      }
    })

    return NextResponse.json({ url: session.url })
  } catch (error) {
    console.error('Stripe error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

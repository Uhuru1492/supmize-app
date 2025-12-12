import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-11-20.acacia',
})

// Only create Supabase client if keys are available (not during build)
const getSupabase = () => {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return null
  }
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  )
}

export async function POST(request) {
  const supabase = getSupabase()
  if (!supabase) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 })
  }

  const body = await request.text()
  const sig = request.headers.get('stripe-signature')

  let event

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message)
    return NextResponse.json({ error: 'Webhook error' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object

    const customerEmail = session.customer_email || session.customer_details?.email

    if (!customerEmail) {
      console.error('No email found in session')
      return NextResponse.json({ error: 'No email' }, { status: 400 })
    }

    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('email', customerEmail)
      .single()

    if (!user) {
      console.error('User not found:', customerEmail)
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    const trialEnd = new Date()
    trialEnd.setDate(trialEnd.getDate() + 14)

    await supabase
      .from('users')
      .update({
        subscription_status: 'active',
        subscription_plan: 'pro',
        stripe_customer_id: session.customer,
        stripe_subscription_id: session.subscription,
        trial_ends_at: trialEnd.toISOString(),
      })
      .eq('id', user.id)

    console.log('User upgraded to Pro:', customerEmail)
  }

  if (event.type === 'customer.subscription.deleted') {
    const subscription = event.data.object

    await supabase
      .from('users')
      .update({
        subscription_status: 'canceled',
        subscription_plan: 'free',
      })
      .eq('stripe_subscription_id', subscription.id)

    console.log('Subscription canceled:', subscription.id)
  }

  return NextResponse.json({ received: true })
}

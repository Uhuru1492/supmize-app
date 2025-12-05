import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export const dynamic = 'force-dynamic'

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
)

export async function POST(request) {
  try {
    const body = await request.text()
    const sig = request.headers.get('stripe-signature')

    let event

    try {
      event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message)
      return NextResponse.json({ error: 'Webhook signature verification failed' }, { status: 400 })
    }

    console.log('Webhook event received:', event.type)

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object
      const email = session.metadata?.email || session.customer_details?.email

      console.log('Processing checkout for email:', email)

      if (!email) {
        console.error('No email found in session')
        return NextResponse.json({ error: 'No email found' }, { status: 400 })
      }

      const { data: authData, error: authError } = await supabase.auth.admin.listUsers()
      
      if (authError) {
        console.error('Auth error:', authError)
        return NextResponse.json({ error: 'Auth error' }, { status: 500 })
      }

      const user = authData.users.find(u => u.email === email)

      if (!user) {
        console.error('User not found for email:', email)
        return NextResponse.json({ error: 'User not found' }, { status: 404 })
      }

      console.log('Updating subscription for user:', user.id)

      const { error: updateError } = await supabase
        .from('user_preferences')
        .update({
          subscription_status: 'active',
          subscription_plan: 'pro',
          stripe_customer_id: session.customer,
          stripe_subscription_id: session.subscription
        })
        .eq('user_id', user.id)

      if (updateError) {
        console.error('Update error:', updateError)
        return NextResponse.json({ error: 'Update failed' }, { status: 500 })
      }

      console.log('Subscription updated successfully!')
    }

    if (event.type === 'customer.subscription.deleted') {
      const subscription = event.data.object
      
      await supabase
        .from('user_preferences')
        .update({
          subscription_status: 'inactive',
          subscription_plan: 'free'
        })
        .eq('stripe_subscription_id', subscription.id)
    }

    return NextResponse.json({ received: true }, { status: 200 })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

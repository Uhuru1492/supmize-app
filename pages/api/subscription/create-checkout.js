const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { email } = req.body

  if (!email) {
    return res.status(400).json({ error: 'Email required' })
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
      success_url: 'https://supmize.com/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: `https://supmize.com/account?email=${email}`,
      metadata: {
        email
      }
    })

    res.status(200).json({ url: session.url })
  } catch (error) {
    console.error('Stripe error:', error)
    res.status(500).json({ error: error.message })
  }
}

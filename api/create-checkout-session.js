/**
 * Stripe Checkout session creator — serverless function stub.
 * -----------------------------------------------------------------------
 * This file is written for Vercel's Node serverless function format.
 * If you deploy elsewhere (Netlify, Cloudflare, your own Express server),
 * adapt the request/response handling accordingly — the Stripe logic
 * in the middle stays the same.
 *
 * SETUP:
 * 1. `npm install stripe` in your deployed backend environment.
 * 2. Create a Product + recurring Price in your Stripe dashboard, copy
 *    its price ID (starts with `price_...`).
 * 3. Set environment variables on your host:
 *      STRIPE_SECRET_KEY=sk_live_...   (or sk_test_... while testing)
 *      APP_URL=https://your-deployed-domain.co.za
 * 4. Set VITE_STRIPE_PRICE_ID in your frontend .env to that price ID,
 *    or pass a priceId explicitly from the client.
 * 5. You'll also need a webhook handler (not included here) that listens
 *    for `checkout.session.completed` and `customer.subscription.deleted`
 *    events to actually mark a user as premium/free in your database —
 *    the client-side tier toggle in SubscriptionContext.jsx is a demo
 *    only and must NOT be trusted for real access control.
 */

// import Stripe from 'stripe'
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { priceId } = req.body || {}
  if (!priceId) {
    return res.status(400).json({ error: 'Missing priceId' })
  }

  try {
    // Uncomment once Stripe is installed and configured:
    //
    // const session = await stripe.checkout.sessions.create({
    //   mode: 'subscription',
    //   line_items: [{ price: priceId, quantity: 1 }],
    //   success_url: `${process.env.APP_URL}/?checkout=success`,
    //   cancel_url: `${process.env.APP_URL}/?checkout=cancelled`,
    // })
    // return res.status(200).json({ url: session.url })

    return res.status(501).json({
      error: 'Stripe not configured yet. See comments in api/create-checkout-session.js.',
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Failed to create checkout session' })
  }
}

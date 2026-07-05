import React, { createContext, useContext, useEffect, useState } from 'react'

/**
 * SubscriptionContext
 * -----------------------------------------------------------------------
 * Tracks whether the current user is on the free or premium ("Pro Swaai")
 * tier, and exposes helpers to gate features and trigger checkout.
 *
 * IMPORTANT — this is a starter scaffold, not a production billing system:
 * - Tier is persisted to localStorage for demo purposes only. A real app
 *   needs a backend (or Supabase/Firebase/etc.) with a `users` table and
 *   server-side verification of subscription status — never trust the
 *   client alone to decide who gets premium content.
 * - `startCheckout()` calls /api/create-checkout-session (see /api folder),
 *   which you must deploy as a serverless function (Vercel/Netlify) with
 *   your own Stripe secret key and price IDs.
 * - `devToggleTier()` is a local-only shortcut for testing the UI without
 *   a real Stripe account. Remove it before going live.
 */

const SubscriptionContext = createContext(null)

const STORAGE_KEY = 'lekeswaai_tier'

export function SubscriptionProvider({ children }) {
  const [tier, setTier] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) || 'free'
  })
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [checkoutError, setCheckoutError] = useState(null)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, tier)
  }, [tier])

  const isPremium = tier === 'premium'

  async function startCheckout(priceId = import.meta.env.VITE_STRIPE_PRICE_ID) {
    setCheckoutLoading(true)
    setCheckoutError(null)
    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      })
      if (!res.ok) throw new Error('Could not start checkout')
      const { url } = await res.json()
      window.location.href = url
    } catch (err) {
      setCheckoutError(
        'Checkout isn\'t wired up yet — deploy /api/create-checkout-session with your Stripe keys to enable real payments.'
      )
      console.error(err)
    } finally {
      setCheckoutLoading(false)
    }
  }

  // DEV ONLY — lets you preview premium features without Stripe configured.
  function devToggleTier() {
    setTier((t) => (t === 'premium' ? 'free' : 'premium'))
  }

  return (
    <SubscriptionContext.Provider
      value={{ tier, isPremium, startCheckout, checkoutLoading, checkoutError, devToggleTier }}
    >
      {children}
    </SubscriptionContext.Provider>
  )
}

export function useSubscription() {
  const ctx = useContext(SubscriptionContext)
  if (!ctx) throw new Error('useSubscription must be used inside SubscriptionProvider')
  return ctx
}

import { useSubscription } from '../context/SubscriptionContext'

export default function PricingSection() {
  const { isPremium, startCheckout, checkoutLoading, checkoutError } = useSubscription()

  return (
    <section id="pricing" className="px-6 py-20 md:px-12">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-3xl font-semibold text-fairway">Simple pricing, no lock-in</h2>
        <p className="mt-3 text-ink/60">Cancel any time. Prices in South African Rand.</p>
        {/* Adjust these prices/features to match your real business model */}

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-3xl border border-ink/10 bg-white/60 p-8 text-left">
            <h3 className="text-xl font-semibold text-ink">Free</h3>
            <p className="mt-1 text-3xl font-semibold text-ink">R0</p>
            <ul className="mt-6 space-y-3 text-sm text-ink/70">
              <li>✓ Unlimited swing uploads</li>
              <li>✓ 2 core faults detected (slice-causing over-the-top, early extension)</li>
              <li>✓ Drills + video links for those faults</li>
              <li className="text-ink/40">✗ Full fault library</li>
              <li className="text-ink/40">✗ Swing history &amp; progress tracking</li>
            </ul>
          </div>

          <div className="relative rounded-3xl border-2 border-gold bg-white p-8 text-left shadow-lg shadow-gold/10">
            <span className="absolute -top-3 left-8 rounded-full bg-gold px-3 py-1 text-xs font-semibold text-ink">
              Most popular
            </span>
            <h3 className="text-xl font-semibold text-ink">Pro Swaai</h3>
            <p className="mt-1 text-3xl font-semibold text-ink">
              R99<span className="text-base font-normal text-ink/50">/month</span>
            </p>
            <ul className="mt-6 space-y-3 text-sm text-ink/70">
              <li>✓ Everything in Free</li>
              <li>✓ Full fault library (chicken wing, reverse spine, sway, and more)</li>
              <li>✓ Swing history — track how your patterns change over time</li>
              <li>✓ Priority drill recommendations tuned to your recent swings</li>
            </ul>
            <button
              onClick={() => startCheckout()}
              disabled={isPremium || checkoutLoading}
              className="mt-6 w-full rounded-full bg-fairway px-6 py-3 font-semibold text-sand transition hover:bg-fairway-dark disabled:opacity-50"
            >
              {isPremium ? 'You\'re on Pro Swaai' : checkoutLoading ? 'Loading…' : 'Upgrade to Pro Swaai'}
            </button>
            {checkoutError && (
              <p className="mt-3 text-xs text-bushveld-dark">{checkoutError}</p>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

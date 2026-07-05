import { useSubscription } from '../context/SubscriptionContext'

export default function Header() {
  const { isPremium, devToggleTier } = useSubscription()

  return (
    <header className="flex items-center justify-between px-6 py-5 md:px-12">
      <div className="flex items-center gap-3">
        <svg width="34" height="34" viewBox="0 0 64 64" aria-hidden="true">
          <rect width="64" height="64" rx="14" fill="#1F4D3D" />
          <path d="M14 46 A 22 22 0 0 1 50 20" stroke="#D4A93A" strokeWidth="4" fill="none" strokeLinecap="round" />
          <circle cx="50" cy="20" r="4" fill="#C1622D" />
          <circle cx="14" cy="46" r="3" fill="#EDE6D6" />
        </svg>
        <span className="font-display text-xl font-semibold tracking-tight text-fairway">
          LekeSwaai
        </span>
        {isPremium && (
          <span className="ml-1 rounded-full bg-gold/20 px-2.5 py-0.5 text-xs font-semibold text-bushveld-dark">
            Pro Swaai
          </span>
        )}
      </div>

      <nav className="flex items-center gap-4">
        <a href="#pricing" className="hidden text-sm font-medium text-ink/70 hover:text-ink md:inline">
          Pricing
        </a>
        {/* Dev-only tier toggle for local testing without Stripe wired up */}
        <button
          onClick={devToggleTier}
          className="rounded-full border border-ink/15 px-3 py-1.5 text-xs font-medium text-ink/60 hover:border-ink/30 hover:text-ink"
          title="Dev only: preview premium without payment"
        >
          {isPremium ? 'Preview: Free view' : 'Preview: Pro view'}
        </button>
      </nav>
    </header>
  )
}

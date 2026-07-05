import { youtubeSearchUrl } from '../data/faultLibrary'
import { useSubscription } from '../context/SubscriptionContext'

export default function DrillCard({ fault, confidence, onUpgradeClick }) {
  const { isPremium } = useSubscription()
  const locked = fault.tier === 'premium' && !isPremium

  return (
    <div className="rounded-2xl border border-ink/10 bg-white/70 p-6 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-lg font-semibold text-fairway">{fault.name}</h3>
        <span className="whitespace-nowrap rounded-full bg-fairway/10 px-2.5 py-1 font-mono text-xs text-fairway">
          {Math.round(confidence * 100)}% match
        </span>
      </div>

      {locked ? (
        <div className="mt-4 rounded-xl bg-sand p-5 text-center">
          <p className="text-sm text-ink/70">
            This fault and its drills are part of <span className="font-semibold">Pro Swaai</span>.
          </p>
          <button
            onClick={onUpgradeClick}
            className="mt-3 rounded-full bg-gold px-5 py-2 text-sm font-semibold text-ink hover:bg-gold/90"
          >
            Unlock Pro Swaai
          </button>
        </div>
      ) : (
        <>
          <p className="mt-3 text-sm text-ink/70">{fault.plainEnglish}</p>

          <div className="mt-4 space-y-4">
            {fault.drills.map((drill) => (
              <div key={drill.title} className="rounded-xl bg-sand/70 p-4">
                <p className="font-semibold text-ink">{drill.title}</p>
                <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-ink/70">
                  {drill.steps.map((step, i) => (
                    <li key={i}>{step}</li>
                  ))}
                </ol>
              </div>
            ))}
          </div>

          <a
            href={youtubeSearchUrl(fault.videoQuery)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-highveld hover:text-highveld-dark"
          >
            Watch coaching videos on this →
          </a>
        </>
      )}
    </div>
  )
}

import { getFaultById } from '../data/faultLibrary'
import DrillCard from './DrillCard'

export default function ResultsPanel({ faults, onRestart, onUpgradeClick }) {
  if (faults.length === 1 && faults[0].id === 'low-confidence') {
    return (
      <section className="mx-auto max-w-2xl rounded-3xl border border-ink/10 bg-white/60 p-8 text-center">
        <h2 className="text-2xl font-semibold text-fairway">Couldn't get a clean read</h2>
        <p className="mt-3 text-ink/70">
          The pose tracking wasn't confident enough on this clip to call anything
          reliably. Try again with better lighting, the full body in frame,
          and the camera roughly at chest height, face-on to the swing.
        </p>
        <button
          onClick={onRestart}
          className="mt-6 rounded-full bg-fairway px-6 py-2.5 font-semibold text-sand hover:bg-fairway-dark"
        >
          Try another clip
        </button>
      </section>
    )
  }

  if (faults.length === 0) {
    return (
      <section className="mx-auto max-w-2xl rounded-3xl border border-ink/10 bg-white/60 p-8 text-center">
        <h2 className="text-2xl font-semibold text-fairway">Nothing major jumped out 👏</h2>
        <p className="mt-3 text-ink/70">
          Your positions through the swing look solid against our checks. That
          doesn't mean it's perfect — try a down-the-line angle too, or check
          in with a coach for the finer details a camera can't see.
        </p>
        <button
          onClick={onRestart}
          className="mt-6 rounded-full bg-fairway px-6 py-2.5 font-semibold text-sand hover:bg-fairway-dark"
        >
          Analyse another swing
        </button>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-3xl px-4">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-semibold text-fairway">Here's what we found</h2>
        <p className="mt-2 text-sm text-ink/60">
          Ranked by how strongly each pattern showed up. Start with the top one.
        </p>
      </div>

      <div className="space-y-5">
        {faults.map(({ id, confidence }) => {
          const fault = getFaultById(id)
          if (!fault) return null
          return (
            <DrillCard key={id} fault={fault} confidence={confidence} onUpgradeClick={onUpgradeClick} />
          )
        })}
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={onRestart}
          className="rounded-full border border-ink/15 px-6 py-2.5 font-semibold text-ink/70 hover:border-ink/30"
        >
          Analyse another swing
        </button>
      </div>
    </section>
  )
}

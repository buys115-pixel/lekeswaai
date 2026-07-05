export default function Hero({ onStart }) {
  return (
    <section className="relative overflow-hidden px-6 pb-16 pt-8 md:px-12 md:pb-24">
      <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
        <div>
          <p className="mb-3 font-mono text-sm uppercase tracking-widest text-bushveld">
            Braai-side swing analysis
          </p>
          <h1 className="text-4xl font-semibold leading-[1.05] text-fairway md:text-6xl">
            Fix your swaai
            <br />
            before your next round.
          </h1>
          <p className="mt-6 max-w-md text-lg text-ink/70">
            Upload a swing video, get a straight-talking breakdown of what's
            going wrong, and drills built for how you actually practise —
            no jargon, no overseas coach who's never seen a Highveld
            headwind.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <button
              onClick={onStart}
              className="rounded-full bg-fairway px-7 py-3.5 font-semibold text-sand shadow-lg shadow-fairway/20 transition hover:bg-fairway-dark"
            >
              Analyse my swing
            </button>
            <a
              href="#pricing"
              className="rounded-full border border-ink/15 px-7 py-3.5 font-semibold text-ink/80 transition hover:border-ink/30"
            >
              See pricing
            </a>
          </div>
          <p className="mt-4 text-xs text-ink/50">
            Your video is analysed on your own device — nothing gets uploaded to a server.
          </p>
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-md">
          <svg viewBox="0 0 400 400" className="h-full w-full" aria-hidden="true">
            <circle cx="200" cy="200" r="190" fill="#1F4D3D" opacity="0.04" />
            {/* Signature swing tempo arc */}
            <path
              d="M 90 300 A 150 150 0 0 1 300 110"
              stroke="#D4A93A"
              strokeWidth="6"
              fill="none"
              strokeLinecap="round"
              className="tempo-arc"
            />
            <circle cx="90" cy="300" r="8" fill="#EDE6D6" stroke="#1F4D3D" strokeWidth="3" />
            <circle cx="300" cy="110" r="8" fill="#C1622D" />
            {/* simple stick-figure swing suggestion */}
            <line x1="200" y1="180" x2="200" y2="280" stroke="#1F4D3D" strokeWidth="5" strokeLinecap="round" />
            <circle cx="200" cy="160" r="16" fill="#1F4D3D" />
            <line x1="200" y1="195" x2="150" y2="150" stroke="#1F4D3D" strokeWidth="5" strokeLinecap="round" />
            <line x1="200" y1="280" x2="175" y2="340" stroke="#1F4D3D" strokeWidth="5" strokeLinecap="round" />
            <line x1="200" y1="280" x2="230" y2="340" stroke="#1F4D3D" strokeWidth="5" strokeLinecap="round" />
          </svg>
          <p className="text-center font-mono text-xs text-ink/40">
            back &nbsp;→&nbsp; top &nbsp;→&nbsp; impact
          </p>
        </div>
      </div>
    </section>
  )
}

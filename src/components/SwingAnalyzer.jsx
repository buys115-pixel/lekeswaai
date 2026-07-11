import { useEffect, useRef, useState } from 'react'
import { extractPoseSequence } from '../lib/poseDetection'
import { findSwingPhases, detectFaults } from '../lib/swingAnalysis'

const STAGES = [
  'Loading the pose model…',
  'Watching your swing frame by frame…',
  'Finding your address, top, and impact…',
  'Checking your positions against common faults…',
]

export default function SwingAnalyzer({ video, handedness, onComplete, onCancel }) {
  const canvasRef = useRef(null)
  const [progress, setProgress] = useState(0)
  const [stageIdx, setStageIdx] = useState(0)
  const [error, setError] = useState(null)
  const [stalled, setStalled] = useState(false)
  const lastProgressAt = useRef(Date.now())

  useEffect(() => {
    let cancelled = false

    // Watchdog: if progress hasn't moved in 20s, something's stuck
    // (common on slower phones/older hardware). We can't forcibly abort
    // mid-inference, but we can let the user know it's not just slow —
    // and give them a way out instead of staring at a stalled bar forever.
    const watchdog = setInterval(() => {
      if (Date.now() - lastProgressAt.current > 20000) {
        setStalled(true)
      }
    }, 4000)

    async function run() {
      try {
        setStageIdx(0)
        const canvas = canvasRef.current
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        const ctx = canvas.getContext('2d')

        setStageIdx(1)
        const frames = await extractPoseSequence(video, {
          sampleFps: 12,
          onProgress: (p, keypoints) => {
            if (cancelled) return
            lastProgressAt.current = Date.now()
            setStalled(false)
            setProgress(p)
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
            if (keypoints) drawKeypoints(ctx, keypoints)
          },
        })

        if (cancelled) return
        if (frames.length < 5) {
          setError(
            "Couldn't track a clear body pose in this video. Try a clip with better lighting, the full body in frame, and less motion blur."
          )
          return
        }

        setStageIdx(2)
        const phases = findSwingPhases(frames, handedness)
        if (!phases) {
          setError("Couldn't identify swing phases clearly enough. A face-on, well-lit clip works best.")
          return
        }

        setStageIdx(3)
        const faults = detectFaults(phases, handedness)

        if (!cancelled) onComplete({ phases, faults })
      } catch (err) {
        console.error(err)
        if (!cancelled) {
          setError('Something went wrong analysing that video. Try a different clip, or refresh and try again.')
        }
      }
    }

    run()
    return () => {
      cancelled = true
      clearInterval(watchdog)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function drawKeypoints(ctx, keypoints) {
    keypoints.forEach((kp) => {
      if ((kp.score ?? 0) < 0.3) return
      ctx.beginPath()
      ctx.arc(kp.x, kp.y, 5, 0, 2 * Math.PI)
      ctx.fillStyle = '#D4A93A'
      ctx.fill()
    })
  }

  return (
    <section className="mx-auto max-w-2xl rounded-3xl border border-ink/10 bg-white/60 p-8 text-center shadow-sm">
      <h2 className="text-2xl font-semibold text-fairway">Analysing your swing</h2>
      <p className="mt-2 text-sm text-ink/60">{STAGES[stageIdx]}</p>

      <div className="relative mx-auto mt-6 max-w-md overflow-hidden rounded-2xl bg-ink">
        <canvas ref={canvasRef} className="w-full" />
      </div>

      <div className="mx-auto mt-6 h-2 max-w-md overflow-hidden rounded-full bg-ink/10">
        <div
          className="h-full bg-gold transition-all duration-150"
          style={{ width: `${Math.round(progress * 100)}%` }}
        />
      </div>
      <p className="mt-2 font-mono text-xs text-ink/40">{Math.round(progress * 100)}%</p>

      {stalled && !error && (
        <div className="mt-6 rounded-xl bg-highveld/10 p-4 text-sm text-highveld-dark">
          This is taking longer than usual — some phones are just slower at this.
          You can keep waiting, or try a shorter clip instead.
        </div>
      )}

      {error && (
        <div className="mt-6 rounded-xl bg-bushveld/10 p-4 text-sm text-bushveld-dark">
          {error}
        </div>
      )}

      {(stalled || error) && onCancel && (
        <button
          onClick={onCancel}
          className="mt-4 rounded-full border border-ink/15 px-5 py-2 text-sm font-semibold text-ink/70 hover:border-ink/30"
        >
          Try a different clip
        </button>
      )}
    </section>
  )
}

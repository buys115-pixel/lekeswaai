import { KEYPOINT } from './poseDetection'

/**
 * Swing analysis heuristics
 * -----------------------------------------------------------------------
 * IMPORTANT — read this before trusting the numbers:
 * These are simplified, single-camera 2D heuristics, not biomechanical
 * ground truth. A real swing has depth (z-axis) that a single 2D camera
 * can't see, so angles here are estimates, most reliable from a
 * face-on or down-the-line view with the golfer fully in frame.
 * Treat every flag as "worth checking with a coach or a better camera
 * angle", not a diagnosis.
 *
 * The pipeline:
 * 1. Find swing phases (address / top of backswing / impact / follow-through)
 *    using wrist height as a simple proxy.
 * 2. Compute a handful of angles/positions at those phases.
 * 3. Compare against loose thresholds to flag likely faults.
 */

function kp(frame, name) {
  return frame.keypoints[KEYPOINT[name]]
}

function angleBetween(a, b, c) {
  // angle at point b, formed by points a-b-c, in degrees
  const ab = { x: a.x - b.x, y: a.y - b.y }
  const cb = { x: c.x - b.x, y: c.y - b.y }
  const dot = ab.x * cb.x + ab.y * cb.y
  const magAb = Math.hypot(ab.x, ab.y)
  const magCb = Math.hypot(cb.x, cb.y)
  if (magAb === 0 || magCb === 0) return null
  const cos = Math.max(-1, Math.min(1, dot / (magAb * magCb)))
  return (Math.acos(cos) * 180) / Math.PI
}

function avgConfidence(frame) {
  return frame.keypoints.reduce((s, k) => s + (k.score ?? 0), 0) / frame.keypoints.length
}

/**
 * Identifies the 4 key phases of the swing from a pose sequence,
 * using lead-wrist vertical position as a simple proxy for swing phase.
 * Assumes a right-handed golfer facing left-to-right or vice versa;
 * left/right is treated symmetrically since we don't know handedness
 * without asking the user (see AnalysisFlow: handedness is captured
 * up front and used to pick lead/trail side).
 */
export function findSwingPhases(frames, handedness = 'right') {
  const leadWristKey = handedness === 'right' ? 'left_wrist' : 'right_wrist'
  const valid = frames.filter((f) => kp(f, leadWristKey)?.score > 0.3)
  if (valid.length < 5) return null

  const wristYs = valid.map((f) => kp(f, leadWristKey).y)
  const addressIdx = 0
  const topIdx = wristYs.indexOf(Math.min(...wristYs.slice(0, Math.floor(valid.length * 0.6))))
  // impact: after top, wrist returns near address height, fastest downward motion
  let impactIdx = topIdx
  let maxDrop = 0
  for (let i = topIdx + 1; i < valid.length - 1; i++) {
    const drop = wristYs[i + 1] - wristYs[i - 1]
    if (drop > maxDrop) {
      maxDrop = drop
      impactIdx = i
    }
  }
  const followIdx = Math.min(valid.length - 1, impactIdx + Math.floor((impactIdx - topIdx) * 0.5))

  return {
    address: valid[addressIdx],
    top: valid[topIdx],
    impact: valid[impactIdx],
    follow: valid[followIdx],
  }
}

/**
 * Runs all fault heuristics against the identified phases.
 * Returns an array of { id, confidence } for faults that triggered,
 * sorted by confidence descending. `confidence` is 0..1, a rough signal
 * of how strongly the heuristic fired — not a statistical probability.
 */
export function detectFaults(phases, handedness = 'right') {
  if (!phases) return []
  const { address, top, impact } = phases
  const lead = handedness === 'right' ? 'left' : 'right'
  const trail = handedness === 'right' ? 'right' : 'left'
  const results = []

  // Quality gate: skip heuristics if key landmarks weren't confidently tracked
  const minConf = Math.min(avgConfidence(address), avgConfidence(top), avgConfidence(impact))
  if (minConf < 0.25) {
    return [{ id: 'low-confidence', confidence: 1 }]
  }

  // --- Over-the-top: lead shoulder moves markedly toward the ball
  // horizontally between top-of-backswing and impact, faster than the
  // hips rotate through.
  const shoulderKey = `${lead}_shoulder`
  const hipKey = `${lead}_hip`
  const shoulderShift = Math.abs(kp(impact, shoulderKey).x - kp(top, shoulderKey).x)
  const hipShift = Math.abs(kp(impact, hipKey).x - kp(top, hipKey).x)
  if (hipShift > 0 && shoulderShift / hipShift > 1.6) {
    results.push({ id: 'over-the-top', confidence: Math.min(1, (shoulderShift / hipShift - 1.6) / 1.5 + 0.5) })
  }

  // --- Early extension: hip depth (x-position, as proxy for toward-camera
  // movement in a face-on view) moves toward the ball beyond a threshold
  // between address and impact.
  const hipXAddress = kp(address, hipKey).x
  const hipXImpact = kp(impact, hipKey).x
  const shoulderWidth = Math.abs(kp(address, 'left_shoulder').x - kp(address, 'right_shoulder').x) || 1
  const hipDrift = Math.abs(hipXImpact - hipXAddress) / shoulderWidth
  if (hipDrift > 0.15) {
    results.push({ id: 'early-extension', confidence: Math.min(1, hipDrift / 0.4) })
  }

  // --- Chicken wing: lead elbow angle at impact is noticeably bent
  // rather than extended.
  const elbowAngle = angleBetween(
    kp(impact, `${lead}_shoulder`),
    kp(impact, `${lead}_elbow`),
    kp(impact, `${lead}_wrist`)
  )
  if (elbowAngle !== null && elbowAngle < 150) {
    results.push({ id: 'chicken-wing', confidence: Math.min(1, (150 - elbowAngle) / 40) })
  }

  // --- Reverse spine angle: at the top, shoulder line tilts toward
  // target side instead of away, using shoulder height vs hip height
  // to approximate spine lean.
  const trailShoulderY = kp(top, `${trail}_shoulder`).y
  const leadShoulderY = kp(top, `${lead}_shoulder`).y
  const trailHipY = kp(top, `${trail}_hip`).y
  const spineLeanTop = trailShoulderY - trailHipY - (leadShoulderY - kp(top, `${lead}_hip`).y)
  if (spineLeanTop < -8) {
    results.push({ id: 'reverse-spine', confidence: Math.min(1, Math.abs(spineLeanTop) / 25) })
  }

  // --- Lateral sway: lead hip moves away from the target beyond a
  // threshold from address to top (should rotate more than slide).
  const hipXTop = kp(top, hipKey).x
  const swayAmount = Math.abs(hipXTop - hipXAddress) / shoulderWidth
  if (swayAmount > 0.25) {
    results.push({ id: 'sway', confidence: Math.min(1, swayAmount / 0.5) })
  }

  // --- Flat shoulder turn: shoulder line at the top is close to
  // horizontal rather than tilted with the spine.
  const shoulderTilt = Math.abs(
    Math.atan2(
      kp(top, `${trail}_shoulder`).y - kp(top, `${lead}_shoulder`).y,
      kp(top, `${trail}_shoulder`).x - kp(top, `${lead}_shoulder`).x
    ) * (180 / Math.PI)
  )
  if (shoulderTilt < 15) {
    results.push({ id: 'flat-shoulder-turn', confidence: Math.min(1, (15 - shoulderTilt) / 15) })
  }

  return results.sort((a, b) => b.confidence - a.confidence)
}

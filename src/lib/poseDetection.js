/**
 * Pose detection wrapper (TensorFlow.js + MoveNet)
 * -----------------------------------------------------------------------
 * Runs entirely in the browser — no video is uploaded to any server,
 * which is both a privacy win and the reason this works without a backend.
 *
 * We lazy-import tfjs so it doesn't bloat the initial page load; it's
 * only pulled in once the user actually starts an analysis.
 */

let detectorPromise = null

async function getDetector() {
  if (!detectorPromise) {
    detectorPromise = (async () => {
      const tf = await import('@tensorflow/tfjs')
      await import('@tensorflow/tfjs-backend-webgl')
      const poseDetection = await import('@tensorflow-models/pose-detection')
      await tf.setBackend('webgl')
      await tf.ready()
      return poseDetection.createDetector(poseDetection.SupportedModels.MoveNet, {
        modelType: poseDetection.movenet.modelType?.SINGLEPOSE_THUNDER ?? 'SinglePose.Thunder',
      })
    })()
  }
  return detectorPromise
}

/**
 * Extracts pose keypoints from a video element, sampling at a target frame
 * rate but capped to a maximum total frame count. The cap matters most on
 * mobile: a 16-second clip at 12fps is ~190 frames of pose inference, which
 * can take a long time on phone hardware. Capping keeps analysis time
 * roughly bounded regardless of how long the uploaded clip is.
 * @param {HTMLVideoElement} videoEl - a video element with a loaded source
 * @param {object} opts
 * @param {number} opts.sampleFps - preferred frames per second to sample (default 15)
 * @param {number} opts.maxFrames - hard cap on total frames processed (default 60)
 * @param {(progress: number, keypoints: Array|null) => void} opts.onProgress - 0..1 progress + latest keypoints
 * @returns {Promise<Array<{time: number, keypoints: Array}>>}
 */
export async function extractPoseSequence(videoEl, { sampleFps = 15, maxFrames = 60, onProgress } = {}) {
  const detector = await getDetector()
  const duration = videoEl.duration
  // If sampling at sampleFps would exceed maxFrames, stretch the interval
  // so total frames stay within the cap instead of just running longer.
  const frameInterval = Math.max(1 / sampleFps, duration / maxFrames)
  const frames = []
  const totalSteps = Math.min(maxFrames, Math.floor(duration / frameInterval))

  for (let i = 0; i <= totalSteps; i++) {
    const t = i * frameInterval
    await seekTo(videoEl, t)
    const poses = await detector.estimatePoses(videoEl, { flipHorizontal: false })
    const keypoints = poses[0]?.keypoints ?? null
    if (keypoints) {
      frames.push({ time: t, keypoints })
    }
    if (onProgress) onProgress(i / totalSteps, keypoints)
  }

  return frames
}

function seekTo(videoEl, time, timeoutMs = 2000) {
  return new Promise((resolve) => {
    let settled = false
    function onSeeked() {
      if (settled) return
      settled = true
      videoEl.removeEventListener('seeked', onSeeked)
      clearTimeout(timer)
      resolve()
    }
    // Safety net: some mobile browsers occasionally never fire 'seeked'
    // for a given seek (especially on detached/backgrounded video
    // elements). Without this, analysis can hang forever on a black
    // screen. If the event doesn't arrive in time, we proceed anyway —
    // worst case that one frame is slightly off, which the fault
    // heuristics are tolerant of.
    const timer = setTimeout(onSeeked, timeoutMs)
    videoEl.addEventListener('seeked', onSeeked)
    videoEl.currentTime = time
  })
}

/** MoveNet keypoint name -> index, for readability elsewhere */
export const KEYPOINT = {
  nose: 0,
  left_eye: 1,
  right_eye: 2,
  left_ear: 3,
  right_ear: 4,
  left_shoulder: 5,
  right_shoulder: 6,
  left_elbow: 7,
  right_elbow: 8,
  left_wrist: 9,
  right_wrist: 10,
  left_hip: 11,
  right_hip: 12,
  left_knee: 13,
  right_knee: 14,
  left_ankle: 15,
  right_ankle: 16,
}

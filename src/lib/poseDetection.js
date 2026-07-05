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
 * Extracts pose keypoints from a video element at a fixed frame rate.
 * @param {HTMLVideoElement} videoEl - a video element with a loaded source
 * @param {object} opts
 * @param {number} opts.sampleFps - how many frames per second to sample (default 15)
 * @param {(progress: number, keypoints: Array|null) => void} opts.onProgress - 0..1 progress + latest keypoints
 * @returns {Promise<Array<{time: number, keypoints: Array}>>}
 */
export async function extractPoseSequence(videoEl, { sampleFps = 15, onProgress } = {}) {
  const detector = await getDetector()
  const duration = videoEl.duration
  const frameInterval = 1 / sampleFps
  const frames = []
  const totalSteps = Math.floor(duration / frameInterval)

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

function seekTo(videoEl, time) {
  return new Promise((resolve) => {
    function onSeeked() {
      videoEl.removeEventListener('seeked', onSeeked)
      resolve()
    }
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

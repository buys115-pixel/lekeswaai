import { useRef, useState } from 'react'

export default function VideoUploader({ onReady }) {
  const [handedness, setHandedness] = useState('right')
  const [fileName, setFileName] = useState(null)
  const [error, setError] = useState(null)
  const videoRef = useRef(null)
  const inputRef = useRef(null)

  function handleFile(file) {
    if (!file) return
    if (!file.type.startsWith('video/')) {
      setError('That doesn\'t look like a video file — try a .mp4 or .mov clip.')
      return
    }
    setError(null)
    setFileName(file.name)
    const url = URL.createObjectURL(file)
    const video = document.createElement('video')
    video.src = url
    video.muted = true
    video.playsInline = true
    video.onloadedmetadata = () => {
      onReady({ video, handedness })
    }
  }

  return (
    <section className="mx-auto max-w-2xl rounded-3xl border border-ink/10 bg-white/60 p-8 shadow-sm">
      <h2 className="text-2xl font-semibold text-fairway">Upload your swing</h2>
      <p className="mt-2 text-sm text-ink/60">
        Best results: face-on view (camera at chest height, facing you square-on),
        full body in frame, from address to follow-through.
      </p>

      <div className="mt-6">
        <p className="mb-2 text-sm font-medium text-ink/80">Which hand do you lead with?</p>
        <div className="flex gap-3">
          {['right', 'left'].map((h) => (
            <button
              key={h}
              onClick={() => setHandedness(h)}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                handedness === h
                  ? 'bg-fairway text-sand'
                  : 'border border-ink/15 text-ink/70 hover:border-ink/30'
              }`}
            >
              {h === 'right' ? 'Right-handed golfer' : 'Left-handed golfer'}
            </button>
          ))}
        </div>
      </div>

      <div
        className="mt-6 flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-ink/20 bg-sand/60 px-6 py-12 text-center"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault()
          handleFile(e.dataTransfer.files[0])
        }}
      >
        <p className="text-ink/60">Drag a swing video here, or</p>
        <button
          onClick={() => inputRef.current?.click()}
          className="rounded-full bg-bushveld px-6 py-2.5 font-semibold text-sand hover:bg-bushveld-dark"
        >
          Choose a video
        </button>
        <input
          ref={inputRef}
          type="file"
          accept="video/*"
          className="hidden"
          onChange={(e) => handleFile(e.target.files[0])}
        />
        {fileName && <p className="mt-2 text-sm text-fairway">Loaded: {fileName}</p>}
        {error && <p className="mt-2 text-sm text-bushveld-dark">{error}</p>}
      </div>

      <video ref={videoRef} className="hidden" />
    </section>
  )
}

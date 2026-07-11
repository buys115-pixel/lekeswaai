import { useRef, useState } from 'react'
import Header from './components/Header'
import Hero from './components/Hero'
import VideoUploader from './components/VideoUploader'
import SwingAnalyzer from './components/SwingAnalyzer'
import ResultsPanel from './components/ResultsPanel'
import PricingSection from './components/PricingSection'

// Simple states for the flow — no router needed for a single-page tool.
const STAGE = {
  LANDING: 'landing',
  UPLOAD: 'upload',
  ANALYZING: 'analyzing',
  RESULTS: 'results',
}

export default function App() {
  const [stage, setStage] = useState(STAGE.LANDING)
  const [videoData, setVideoData] = useState(null) // { video, handedness }
  const [faults, setFaults] = useState([])
  const uploadRef = useRef(null)
  // This video element is mounted once and stays in the DOM for the whole
  // flow (upload -> analyzing -> results), rather than being created fresh
  // and detached inside VideoUploader. That matters on mobile — several
  // mobile browsers throttle or refuse to reliably decode/seek a <video>
  // that's been removed from the page, which is what caused analysis to
  // hang on a black screen on some phones.
  const sharedVideoRef = useRef(null)

  function goToUpload() {
    setStage(STAGE.UPLOAD)
    setTimeout(() => uploadRef.current?.scrollIntoView({ behavior: 'smooth' }), 50)
  }

  function handleVideoReady(data) {
    setVideoData(data)
    setStage(STAGE.ANALYZING)
  }

  function handleAnalysisComplete({ faults: detected }) {
    setFaults(detected)
    setStage(STAGE.RESULTS)
  }

  function restart() {
    setVideoData(null)
    setFaults([])
    setStage(STAGE.UPLOAD)
  }

  function scrollToPricing() {
    document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen">
      <Header />
      <Hero onStart={goToUpload} />

      <div ref={uploadRef} className="px-4 py-4">
        {stage === STAGE.UPLOAD && (
          <VideoUploader videoRef={sharedVideoRef} onReady={handleVideoReady} />
        )}

        {stage === STAGE.ANALYZING && videoData && (
          <SwingAnalyzer
            video={sharedVideoRef.current}
            handedness={videoData.handedness}
            onComplete={handleAnalysisComplete}
            onCancel={restart}
          />
        )}

        {stage === STAGE.RESULTS && (
          <ResultsPanel faults={faults} onRestart={restart} onUpgradeClick={scrollToPricing} />
        )}
      </div>

      {/* Kept small and visually tucked away, but deliberately NOT
          display:none — real presence in the DOM/layout is what keeps
          mobile browsers decoding it reliably. */}
      <video
        ref={sharedVideoRef}
        muted
        playsInline
        className="pointer-events-none fixed bottom-1 right-1 h-1 w-1 opacity-0"
        aria-hidden="true"
      />

      <PricingSection />

      <footer className="border-t border-ink/10 px-6 py-8 text-center text-sm text-ink/40 md:px-12">
        LekeSwaai — built for South African golfers. Not a substitute for a real coach's eye.
      </footer>
    </div>
  )
}

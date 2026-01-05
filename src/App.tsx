import { useEffect, useRef, useState } from 'react'
import { BreathingCoach } from './components/BreathingCoach'
import { Controls, type ThemeKey } from './components/Controls'

function App() {
  const {
    sessionState,
    stepIndex,
    countdown,
    isTransitioning,
    phaseLabel,
    nextPhaseLabel,
    nextCountdown,
    ringProgress,
    selectedSession,
    selectedPattern,
    setSelectedSession,
    setSelectedPattern,
    onCircleClick,
  } = BreathingCoach()

  const [selectedTheme, setSelectedTheme] = useState<ThemeKey>('sky')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isChimeEnabled, setIsChimeEnabled] = useState(false)
  const chimeRef = useRef<HTMLAudioElement | null>(null)
  const prevStepIndexRef = useRef<number | null>(null)

  useEffect(() => {
    const handleChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement))
    }

    document.addEventListener('fullscreenchange', handleChange)
    handleChange()
    return () => {
      document.removeEventListener('fullscreenchange', handleChange)
    }
  }, [])

  const toggleFullscreen = async () => {
    if (!document.documentElement.requestFullscreen || !document.exitFullscreen) {
      return
    }

    if (document.fullscreenElement) {
      await document.exitFullscreen()
      return
    }

    await document.documentElement.requestFullscreen()
  }

  useEffect(() => {
    if (sessionState !== 'running') {
      prevStepIndexRef.current = null
      return
    }

    if (prevStepIndexRef.current === null) {
      prevStepIndexRef.current = stepIndex
      return
    }

    if (prevStepIndexRef.current === stepIndex) {
      return
    }

    prevStepIndexRef.current = stepIndex

    if (!isChimeEnabled) {
      return
    }

    if (!chimeRef.current) {
      chimeRef.current = new Audio('/271370__inoshirodesign__singing-bowl-strike-sound.mp3')
      chimeRef.current.preload = 'auto'
      chimeRef.current.volume = 0.45
    }

    chimeRef.current.currentTime = 0
    void chimeRef.current.play()
  }, [isChimeEnabled, sessionState, stepIndex])

  return (
    <div className="app" data-theme={selectedTheme}>
      <div className="corner-actions">
        <button
          type="button"
          className={`corner-button ${isChimeEnabled ? 'is-active' : ''}`}
          onClick={() => setIsChimeEnabled(prev => !prev)}
          aria-label={isChimeEnabled ? 'Disable chime' : 'Enable chime'}
          title={isChimeEnabled ? 'Chime on' : 'Chime off'}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M15 17H9m6 0a3 3 0 0 1-6 0m6 0H9m8-5V9a5 5 0 1 0-10 0v3l-2 2v1h14v-1l-2-2Z"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      <button
        type="button"
        className="corner-button"
        onClick={() => void toggleFullscreen()}
        aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
        title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
      >
        {isFullscreen ? (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M9 3H5a2 2 0 0 0-2 2v4M15 3h4a2 2 0 0 1 2 2v4M9 21H5a2 2 0 0 1-2-2v-4M15 21h4a2 2 0 0 0 2-2v-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M9 5H5v4M15 5h4v4M9 19H5v-4M15 19h4v-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </button>
      </div>
      <div className="breathing-container">
        <Controls
          sessionState={sessionState}
          phaseLabel={phaseLabel}
          countdown={countdown}
          isTransitioning={isTransitioning}
          nextPhaseLabel={nextPhaseLabel}
          nextCountdown={nextCountdown}
          ringProgress={ringProgress}
          selectedSession={selectedSession}
          selectedPattern={selectedPattern}
          selectedTheme={selectedTheme}
          onSessionChange={setSelectedSession}
          onPatternChange={setSelectedPattern}
          onThemeChange={setSelectedTheme}
          onCircleClick={onCircleClick}
        />
      </div>
    </div>
  )
}

export default App

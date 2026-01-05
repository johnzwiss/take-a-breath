import { useEffect, useState } from 'react'
import { BreathingCoach } from './components/BreathingCoach'
import { Controls, type ThemeKey } from './components/Controls'

function App() {
  const {
    sessionState,
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

  return (
    <div className="app" data-theme={selectedTheme}>
      <button
        type="button"
        className="fullscreen-toggle"
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

import { useState } from 'react'
import { BreathingCoach } from './components/BreathingCoach'
import { Controls, type ThemeKey } from './components/Controls'
import './styles/app.css'

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

  return (
    <div className="app" data-theme={selectedTheme}>
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

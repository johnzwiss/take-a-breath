import { BreathingCoach } from './components/BreathingCoach'
import { Controls } from './components/Controls'
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

  return (
    <div className="app">
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
          onSessionChange={setSelectedSession}
          onPatternChange={setSelectedPattern}
          onCircleClick={onCircleClick}
        />
      </div>
    </div>
  )
}

export default App

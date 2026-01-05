import type { PatternKey, SessionKey, SessionState } from './BreathingCoach';
import { useMemo } from 'react';

export type ThemeKey = 'sky' | 'wv' | 'joshua';

interface ControlsProps {
  sessionState: SessionState;
  phaseLabel: string;
  countdown: number;
  isTransitioning: boolean;
  nextPhaseLabel: string;
  nextCountdown: number;
  ringProgress: number;
  selectedSession: SessionKey;
  selectedPattern: PatternKey;
  selectedTheme: ThemeKey;
  onSessionChange: (v: SessionKey) => void;
  onPatternChange: (v: PatternKey) => void;
  onThemeChange: (v: ThemeKey) => void;
  onCircleClick: () => void;
}

const sessionOptions: { value: SessionKey; label: string }[] = [
  { value: '60', label: '1 minute' },
  { value: '180', label: '3 minutes' },
  { value: '300', label: '5 minutes' },
  { value: 'continuous', label: 'Continuous' },
];

const patternOptions: { value: PatternKey; label: string }[] = [
  { value: 'box', label: 'Box (4–4–4–4)' },
  { value: '478', label: '4–7–8' },
  { value: 'calm', label: 'Calm (5 in, 5 out)' },
];

const themeOptions: { value: ThemeKey; label: string }[] = [
  { value: 'sky', label: 'Sky' },
  { value: 'wv', label: 'Dolly Sods' },
  { value: 'joshua', label: 'Joshua Tree' },
];

export function Controls({
  sessionState,
  phaseLabel,
  countdown,
  isTransitioning,
  nextPhaseLabel,
  nextCountdown,
  ringProgress,
  selectedSession,
  selectedPattern,
  selectedTheme,
  onSessionChange,
  onPatternChange,
  onThemeChange,
  onCircleClick,
}: ControlsProps) {
  const isRunning = sessionState === 'running';

  const currentText = useMemo(() => {
    if (!isRunning) {
      return 'Take a breath';
    }

    return phaseLabel;
  }, [isRunning, phaseLabel]);

  const nextText = useMemo(() => {
    if (!isRunning) {
      return 'Take a breath';
    }

    return nextPhaseLabel;
  }, [isRunning, nextPhaseLabel]);

  const currentCount = countdown;
  const nextCount = nextCountdown;

  const clampedProgress = Math.min(1, Math.max(0, ringProgress));
  const radius = 118;
  const circumference = 2 * Math.PI * radius;
  // Higher offset hides more of the ring to show countdown direction.
  const dashOffset = circumference * (1 - clampedProgress);

  return (
    <div className="controls">
      <div className="primary-controls">
        <button
          onClick={onCircleClick}
          className="breath-button"
          aria-label={isRunning ? "Stop" : "Start"}
        >
          <svg className="progress-ring" viewBox="0 0 260 260" aria-hidden="true">
            <circle className="progress-ring-bg" cx="130" cy="130" r={radius} />
            <circle
              className="progress-ring-fg"
              cx="130"
              cy="130"
              r={radius}
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
            />
          </svg>
          <span className={`button-content ${isTransitioning ? 'crossfade' : ''}`}>
            <span className="button-layer button-layer-current">
              <span className="button-text">{currentText}</span>
              {isRunning && <span className="button-countdown">{currentCount}</span>}
            </span>
            <span className="button-layer button-layer-next" aria-hidden="true">
              <span className="button-text">{nextText}</span>
              {isRunning && <span className="button-countdown">{nextCount}</span>}
            </span>
          </span>
        </button>
      </div>

      <div className="dropdown-row">
        <div className="select-wrap">
          <select
            className="select"
            value={selectedSession}
            onChange={e => onSessionChange(e.target.value as SessionKey)}
            aria-label="Session length"
          >
            {sessionOptions.map(o => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div className="select-wrap">
          <select
            className="select"
            value={selectedPattern}
            onChange={e => onPatternChange(e.target.value as PatternKey)}
            aria-label="Breathing pattern"
          >
            {patternOptions.map(o => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div className="select-wrap">
          <select
            className="select"
            value={selectedTheme}
            onChange={e => onThemeChange(e.target.value as ThemeKey)}
            aria-label="Theme"
          >
            {themeOptions.map(o => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

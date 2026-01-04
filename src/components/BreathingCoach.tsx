import { useState, useEffect, useCallback, useMemo, useRef } from 'react';

export type SessionState = 'idle' | 'running';
export type Phase = 'inhale' | 'hold' | 'exhale';

export type PatternKey = 'box' | '478' | 'calm';
export type SessionKey = '60' | '180' | '300' | 'continuous';

const FADE_MS = 500;

const phaseLabels: Record<Phase, string> = {
  inhale: 'Inhale',
  hold: 'Hold',
  exhale: 'Exhale',
};

type Step = {
  phase: Phase;
  durationSec: number;
};

type Pattern = {
  key: PatternKey;
  label: string;
  steps: Step[];
};

const patterns: Record<PatternKey, Pattern> = {
  box: {
    key: 'box',
    label: 'Box (4–4–4–4)',
    steps: [
      { phase: 'inhale', durationSec: 4 },
      { phase: 'hold', durationSec: 4 },
      { phase: 'exhale', durationSec: 4 },
      { phase: 'hold', durationSec: 4 },
    ],
  },
  '478': {
    key: '478',
    label: '4–7–8',
    steps: [
      { phase: 'inhale', durationSec: 4 },
      { phase: 'hold', durationSec: 7 },
      { phase: 'exhale', durationSec: 8 },
    ],
  },
  calm: {
    key: 'calm',
    label: 'Calm (5 in, 5 out)',
    steps: [
      { phase: 'inhale', durationSec: 5 },
      { phase: 'exhale', durationSec: 5 },
    ],
  },
};

const sessionOptions: { key: SessionKey; label: string; seconds: number | null }[] = [
  { key: '60', label: '1 minute', seconds: 60 },
  { key: '180', label: '3 minutes', seconds: 180 },
  { key: '300', label: '5 minutes', seconds: 300 },
  { key: 'continuous', label: 'Continuous', seconds: null },
];

export function BreathingCoach() {
  const [sessionState, setSessionState] = useState<SessionState>('idle');
  const [selectedSession, setSelectedSession] = useState<SessionKey>('60');
  const [selectedPattern, setSelectedPattern] = useState<PatternKey>('box');

  const [activeSession, setActiveSession] = useState<SessionKey>('60');
  const [activePattern, setActivePattern] = useState<PatternKey>('box');

  const [stepIndex, setStepIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [stopAtCycleEnd, setStopAtCycleEnd] = useState(false);

  const [nowMs, setNowMs] = useState(() => Date.now());

  const tickerId = useRef<number | null>(null);
  const sessionStartMs = useRef<number | null>(null);
  const phaseStartMs = useRef<number | null>(null);
  const transitionStartMs = useRef<number | null>(null);
  const pendingStepIndex = useRef<number | null>(null);

  const clearTimer = useCallback(() => {
    if (tickerId.current !== null) {
      clearInterval(tickerId.current);
      tickerId.current = null;
    }
  }, []);

  const startTicker = useCallback(() => {
    clearTimer();
    tickerId.current = window.setInterval(() => {
      setNowMs(Date.now());
    }, 50);
  }, [clearTimer]);

  const patternForDisplay = sessionState === 'running' ? activePattern : selectedPattern;
  const stepsForDisplay = useMemo(() => patterns[patternForDisplay].steps, [patternForDisplay]);
  const stepIndexForDisplay = sessionState === 'running' ? stepIndex : 0;

  const activeSteps = useMemo(() => patterns[activePattern].steps, [activePattern]);
  const activeStep = stepsForDisplay[Math.min(stepIndexForDisplay, stepsForDisplay.length - 1)];
  const phaseDurationMs = activeStep.durationSec * 1000;

  const sessionTotalSec = useMemo(() => {
    const found = sessionOptions.find(o => o.key === activeSession);
    return found?.seconds ?? 60;
  }, [activeSession]);

  const isContinuous = activeSession === 'continuous';

  const sessionElapsedMs = sessionStartMs.current === null ? 0 : nowMs - sessionStartMs.current;
  const sessionTotalMs = sessionTotalSec === null ? null : sessionTotalSec * 1000;
  const sessionRemainingMs = sessionTotalMs === null ? null : Math.max(0, sessionTotalMs - sessionElapsedMs);
  const sessionRemainingSec = sessionRemainingMs === null ? null : Math.ceil(sessionRemainingMs / 1000);

  const computeCountdown = (durationSec: number, startMs: number | null) => {
    if (startMs === null) {
      return durationSec;
    }
    const elapsedMs = Math.max(0, nowMs - startMs);
    const remainingMs = Math.max(0, durationSec * 1000 - elapsedMs);
    return Math.max(1, Math.min(durationSec, Math.floor(remainingMs / 1000) + 1));
  };

  const phaseElapsedMsRaw = phaseStartMs.current === null ? 0 : nowMs - phaseStartMs.current;
  const phaseElapsedMs = Math.max(0, phaseElapsedMsRaw);
  const countdown = computeCountdown(activeStep.durationSec, phaseStartMs.current);

  const nextStepIndexForDisplay = isTransitioning ? pendingStepIndex.current : null;
  const nextStepForDisplay =
    nextStepIndexForDisplay === null ? null : activeSteps[Math.min(nextStepIndexForDisplay, activeSteps.length - 1)];
  const nextPhaseLabel = nextStepForDisplay ? phaseLabels[nextStepForDisplay.phase] : phaseLabels[activeStep.phase];
  const nextCountdown = nextStepForDisplay
    ? computeCountdown(nextStepForDisplay.durationSec, transitionStartMs.current)
    : countdown;

  const phaseProgress = Math.min(1, Math.max(0, phaseElapsedMs / phaseDurationMs));
  const sessionProgress =
    sessionTotalMs === null
      ? null
      : sessionTotalMs === 0
        ? 0
        : (sessionRemainingMs ?? 0) / sessionTotalMs;

  const ringProgress = sessionState === 'idle' ? 1 : isContinuous ? phaseProgress : stopAtCycleEnd ? 0 : (sessionProgress ?? 0);

  const beginPhaseTransition = useCallback(() => {
    const nextIndex = stepIndex + 1;
    pendingStepIndex.current = nextIndex >= activeSteps.length ? 0 : nextIndex;
    transitionStartMs.current = Date.now();
    setIsTransitioning(true);
  }, [activeSteps.length, stepIndex]);

  const commitPhaseTransition = useCallback(() => {
    const next = pendingStepIndex.current;
    if (next === null) {
      setIsTransitioning(false);
      return;
    }

    const wraps = next === 0 && stepIndex === activeSteps.length - 1;
    if (wraps && stopAtCycleEnd) {
      setSessionState('idle');
      setStepIndex(0);
      setIsTransitioning(false);
      setStopAtCycleEnd(false);
      clearTimer();
      sessionStartMs.current = null;
      phaseStartMs.current = null;
      pendingStepIndex.current = null;
      return;
    }

    setStepIndex(next);
    pendingStepIndex.current = null;
    setIsTransitioning(false);
    phaseStartMs.current = transitionStartMs.current ?? Date.now();
    transitionStartMs.current = null;
  }, [activeSteps.length, clearTimer, stepIndex, stopAtCycleEnd]);

  const startBreathing = useCallback(() => {
    setActiveSession(selectedSession);
    setActivePattern(selectedPattern);
    setStepIndex(0);
    setIsTransitioning(false);
    setStopAtCycleEnd(false);
    sessionStartMs.current = Date.now();
    phaseStartMs.current = Date.now();
    transitionStartMs.current = null;
    setSessionState('running');
  }, [selectedPattern, selectedSession]);

  const stopBreathing = useCallback(() => {
    setSessionState('idle');
    setStepIndex(0);
    setIsTransitioning(false);
    setStopAtCycleEnd(false);
    clearTimer();
    sessionStartMs.current = null;
    phaseStartMs.current = null;
    transitionStartMs.current = null;
  }, [clearTimer]);

  const onCircleClick = useCallback(() => {
    if (sessionState === 'running') {
      stopBreathing();
    } else {
      startBreathing();
    }
  }, [sessionState, startBreathing, stopBreathing]);

  useEffect(() => {
    if (sessionState === 'running') {
      startTicker();
      return () => {
        clearTimer();
      };
    }

    clearTimer();
  }, [sessionState, startTicker, clearTimer]);

  useEffect(() => {
    if (sessionState !== 'running') {
      return;
    }

    if (sessionTotalMs !== null && sessionRemainingMs === 0 && !stopAtCycleEnd) {
      setStopAtCycleEnd(true);
    }
  }, [sessionRemainingMs, sessionState, sessionTotalMs, stopAtCycleEnd]);

  useEffect(() => {
    if (sessionState !== 'running') {
      return;
    }

    if (isTransitioning) {
      return;
    }

    if (phaseStartMs.current === null) {
      return;
    }

    if (phaseElapsedMs >= Math.max(0, phaseDurationMs - FADE_MS)) {
      beginPhaseTransition();
    }
  }, [isTransitioning, phaseDurationMs, phaseElapsedMs, sessionState, beginPhaseTransition]);

  useEffect(() => {
    if (sessionState !== 'running') {
      return;
    }

    if (!isTransitioning) {
      return;
    }

    const id = window.setTimeout(() => {
      commitPhaseTransition();
    }, FADE_MS);

    return () => {
      clearTimeout(id);
    };
  }, [isTransitioning, commitPhaseTransition, sessionState]);

  return {
    sessionState,
    countdown,
    isTransitioning,
    isContinuous,
    phaseLabel: phaseLabels[activeStep.phase],
    nextPhaseLabel,
    nextCountdown,
    ringProgress,
    selectedSession,
    selectedPattern,
    setSelectedSession,
    setSelectedPattern,
    sessionRemaining: sessionRemainingSec,
    onCircleClick,
  };
}

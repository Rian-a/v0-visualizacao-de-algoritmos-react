'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { algorithms, SortStep, SortResult, AlgorithmName } from '@/algorithms';

interface UseSortingAnimationOptions {
  initialSpeed?: number;
}

interface UseSortingAnimationReturn {
  currentStep: number;
  totalSteps: number;
  currentArray: number[];
  comparing: number[];
  swapping: number[];
  sorted: number[];
  description: string;
  pseudocodeLine: number;
  comparisons: number;
  swaps: number;
  elapsedTime: number;
  isPlaying: boolean;
  isComplete: boolean;
  speed: number;
  steps: SortStep[];
  play: () => void;
  pause: () => void;
  step: () => void;
  reset: () => void;
  setSpeed: (speed: number) => void;
  startSorting: (array: number[], algorithm: AlgorithmName) => void;
}

export function useSortingAnimation(options: UseSortingAnimationOptions = {}): UseSortingAnimationReturn {
  const { initialSpeed = 500 } = options;

  const [steps, setSteps] = useState<SortStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(initialSpeed);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [totalComparisons, setTotalComparisons] = useState(0);
  const [totalSwaps, setTotalSwaps] = useState(0);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const elapsedBeforePauseRef = useRef(0);

  const currentStepData = steps[currentStep] || {
    array: [],
    comparing: [],
    swapping: [],
    sorted: [],
    description: '',
    pseudocodeLine: 0,
  };

  const isComplete = currentStep >= steps.length - 1 && steps.length > 0;

  // Count comparisons and swaps up to current step
  const countMetrics = useCallback(() => {
    let comps = 0;
    let swps = 0;
    
    for (let i = 0; i <= currentStep && i < steps.length; i++) {
      if (steps[i].comparing.length === 2) comps++;
      if (steps[i].swapping.length > 0) swps++;
    }
    
    return { comparisons: comps, swaps: swps };
  }, [currentStep, steps]);

  const metrics = countMetrics();

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const updateElapsedTime = useCallback(() => {
    if (startTimeRef.current !== null) {
      setElapsedTime(elapsedBeforePauseRef.current + (Date.now() - startTimeRef.current));
    }
  }, []);

  const advanceStep = useCallback(() => {
    setCurrentStep((prev) => {
      if (prev < steps.length - 1) {
        return prev + 1;
      }
      setIsPlaying(false);
      return prev;
    });
    updateElapsedTime();
  }, [steps.length, updateElapsedTime]);

  useEffect(() => {
    if (isPlaying && !isComplete) {
      timerRef.current = setTimeout(() => {
        advanceStep();
      }, speed);
    }

    return clearTimer;
  }, [isPlaying, isComplete, currentStep, speed, advanceStep, clearTimer]);

  const play = useCallback(() => {
    if (isComplete) return;
    if (startTimeRef.current === null) {
      startTimeRef.current = Date.now();
    }
    setIsPlaying(true);
  }, [isComplete]);

  const pause = useCallback(() => {
    clearTimer();
    if (startTimeRef.current !== null) {
      elapsedBeforePauseRef.current += Date.now() - startTimeRef.current;
      startTimeRef.current = null;
    }
    setIsPlaying(false);
  }, [clearTimer]);

  const step = useCallback(() => {
    if (isComplete) return;
    pause();
    advanceStep();
  }, [isComplete, pause, advanceStep]);

  const reset = useCallback(() => {
    clearTimer();
    setCurrentStep(0);
    setIsPlaying(false);
    setElapsedTime(0);
    startTimeRef.current = null;
    elapsedBeforePauseRef.current = 0;
  }, [clearTimer]);

  const startSorting = useCallback((array: number[], algorithm: AlgorithmName) => {
    clearTimer();
    const result: SortResult = algorithms[algorithm](array);
    setSteps(result.steps);
    setTotalComparisons(result.comparisons);
    setTotalSwaps(result.swaps);
    setCurrentStep(0);
    setIsPlaying(false);
    setElapsedTime(0);
    startTimeRef.current = null;
    elapsedBeforePauseRef.current = 0;
  }, [clearTimer]);

  return {
    currentStep,
    totalSteps: steps.length,
    currentArray: currentStepData.array,
    comparing: currentStepData.comparing,
    swapping: currentStepData.swapping,
    sorted: currentStepData.sorted,
    description: currentStepData.description,
    pseudocodeLine: currentStepData.pseudocodeLine,
    comparisons: metrics.comparisons,
    swaps: metrics.swaps,
    elapsedTime,
    isPlaying,
    isComplete,
    speed,
    steps,
    play,
    pause,
    step,
    reset,
    setSpeed,
    startSorting,
  };
}

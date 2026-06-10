'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { Product } from '@/algorithms/types';
import { searchAlgorithms } from '@/algorithms/searchIndex';
import {
  SearchAlgorithmName,
  SearchField,
  SearchMode,
  SearchResult,
  SearchStep,
} from '@/algorithms/searchTypes';

interface UseSearchAnimationOptions {
  initialSpeed?: number;
}

const EMPTY_STEP: SearchStep = {
  currentIndex: -1,
  foundIndices: [],
  discarded: [],
  left: -1,
  mid: -1,
  right: -1,
  description: '',
  pseudocodeLine: 0,
  comparisons: 0,
};

export function useSearchAnimation(options: UseSearchAnimationOptions = {}) {
  const { initialSpeed = 500 } = options;

  const [steps, setSteps] = useState<SearchStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(initialSpeed);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [totalComparisons, setTotalComparisons] = useState(0);

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const elapsedBeforePauseRef = useRef(0);

  const currentStepData = steps[currentStep] || EMPTY_STEP;
  const isComplete = currentStep >= steps.length - 1 && steps.length > 0;

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

  const startSearch = useCallback(
    (
      products: Product[],
      algorithm: SearchAlgorithmName,
      field: SearchField,
      query: string,
      mode: SearchMode
    ) => {
      clearTimer();
      const result: SearchResult = searchAlgorithms[algorithm](products, field, query, mode);
      setSteps(result.steps);
      setTotalComparisons(result.comparisons);
      setCurrentStep(0);
      setIsPlaying(false);
      setElapsedTime(0);
      startTimeRef.current = null;
      elapsedBeforePauseRef.current = 0;
    },
    [clearTimer]
  );

  return {
    currentStep,
    totalSteps: steps.length,
    currentIndex: currentStepData.currentIndex,
    foundIndices: currentStepData.foundIndices,
    discarded: currentStepData.discarded,
    left: currentStepData.left,
    mid: currentStepData.mid,
    right: currentStepData.right,
    description: currentStepData.description,
    pseudocodeLine: currentStepData.pseudocodeLine,
    comparisons: currentStepData.comparisons,
    totalComparisons,
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
    startSearch,
  };
}

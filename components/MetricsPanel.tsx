'use client';

import { formatTime } from '@/utils/helpers';

interface MetricsPanelProps {
  comparisons: number;
  swaps: number;
  elapsedTime: number;
  currentStep: number;
  totalSteps: number;
  algorithmName: string;
}

export function MetricsPanel({
  comparisons,
  swaps,
  elapsedTime,
  currentStep,
  totalSteps,
  algorithmName,
}: MetricsPanelProps) {
  const progress = totalSteps > 0 ? (currentStep / (totalSteps - 1)) * 100 : 0;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-card rounded-lg border">
      <div className="text-center">
        <div className="text-2xl font-bold text-blue-500">{comparisons}</div>
        <div className="text-xs text-muted-foreground">Comparações</div>
      </div>
      
      <div className="text-center">
        <div className="text-2xl font-bold text-red-500">{swaps}</div>
        <div className="text-xs text-muted-foreground">Trocas</div>
      </div>
      
      <div className="text-center">
        <div className="text-2xl font-bold text-green-500">
          {formatTime(elapsedTime)}
        </div>
        <div className="text-xs text-muted-foreground">Tempo</div>
      </div>
      
      <div className="text-center">
        <div className="text-2xl font-bold text-purple-500">{algorithmName}</div>
        <div className="text-xs text-muted-foreground">Algoritmo</div>
      </div>

      <div className="col-span-2 md:col-span-4">
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs text-muted-foreground">Progresso</span>
          <span className="text-xs text-muted-foreground">
            {currentStep} / {Math.max(0, totalSteps - 1)} passos
          </span>
        </div>
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-150"
            style={{ width: `${Math.min(100, progress)}%` }}
          />
        </div>
      </div>
    </div>
  );
}

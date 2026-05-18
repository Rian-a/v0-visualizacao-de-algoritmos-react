'use client';

import { cn } from '@/lib/utils';

interface BarVisualizerProps {
  values: number[];
  normalizedValues: number[];
  comparing: number[];
  swapping: number[];
  sorted: number[];
  maxHeight?: number;
}

export function BarVisualizer({
  values,
  normalizedValues,
  comparing,
  swapping,
  sorted,
  maxHeight = 300,
}: BarVisualizerProps) {
  const barWidth = Math.max(20, Math.min(60, 800 / values.length));
  const gap = Math.max(2, Math.min(8, 200 / values.length));

  const getBarColor = (index: number) => {
    if (swapping.includes(index)) return 'bg-red-500';
    if (comparing.includes(index)) return 'bg-yellow-400';
    if (sorted.includes(index)) return 'bg-green-500';
    return 'bg-blue-500';
  };

  const getBarLabel = (index: number) => {
    if (swapping.includes(index)) return 'Troca';
    if (comparing.includes(index)) return 'Comparando';
    if (sorted.includes(index)) return 'Ordenado';
    return '';
  };

  return (
    <div className="flex items-end justify-center p-4 bg-muted/30 rounded-lg min-h-[350px] overflow-x-auto">
      <div 
        className="flex items-end justify-center"
        style={{ gap: `${gap}px` }}
      >
        {values.map((value, index) => {
          const height = (normalizedValues[index] / 100) * maxHeight;
          const label = getBarLabel(index);
          
          return (
            <div
              key={index}
              className="flex flex-col items-center"
            >
              {label && (
                <span className="text-[10px] text-muted-foreground mb-1 whitespace-nowrap">
                  {label}
                </span>
              )}
              <span className="text-xs text-foreground mb-1 font-mono">
                {Math.round(value)}
              </span>
              <div
                className={cn(
                  'rounded-t transition-all duration-150',
                  getBarColor(index)
                )}
                style={{
                  width: `${barWidth}px`,
                  height: `${height}px`,
                }}
              />
              <span className="text-[10px] text-muted-foreground mt-1">
                {index}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

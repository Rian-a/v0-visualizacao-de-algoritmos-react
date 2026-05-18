'use client';

import { cn } from '@/lib/utils';

interface HeapVisualizerProps {
  array: number[];
  heapSize: number;
  comparing: number[];
  swapping: number[];
  heapifying: number[];
}

export function HeapVisualizer({
  array,
  heapSize,
  comparing,
  swapping,
  heapifying,
}: HeapVisualizerProps) {
  if (array.length === 0) return null;

  // Calcular níveis do heap
  const levels: number[][] = [];
  let index = 0;
  let levelSize = 1;
  
  while (index < heapSize) {
    const level: number[] = [];
    for (let i = 0; i < levelSize && index < heapSize; i++) {
      level.push(index);
      index++;
    }
    levels.push(level);
    levelSize *= 2;
  }

  const getNodeColor = (idx: number) => {
    if (swapping.includes(idx)) return 'bg-red-500 text-white';
    if (comparing.includes(idx)) return 'bg-yellow-400 text-black';
    if (heapifying.includes(idx)) return 'bg-purple-500 text-white';
    if (idx >= heapSize) return 'bg-muted text-muted-foreground';
    return 'bg-blue-500 text-white';
  };

  return (
    <div className="p-4 bg-muted/30 rounded-lg">
      <h4 className="text-sm font-semibold mb-4 text-center">Visualização da Heap Binária</h4>
      <div className="flex flex-col items-center gap-2">
        {levels.map((level, levelIndex) => (
          <div
            key={levelIndex}
            className="flex justify-center gap-2"
            style={{
              width: '100%',
              gap: `${Math.max(4, 80 / (levelIndex + 1))}px`,
            }}
          >
            {level.map((nodeIndex) => {
              const value = array[nodeIndex];
              const left = 2 * nodeIndex + 1;
              const right = 2 * nodeIndex + 2;
              
              return (
                <div key={nodeIndex} className="flex flex-col items-center">
                  <div
                    className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors',
                      getNodeColor(nodeIndex)
                    )}
                  >
                    {Math.round(value)}
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-1">
                    [{nodeIndex}]
                  </div>
                  {/* Mostrar filhos */}
                  {(left < heapSize || right < heapSize) && (
                    <div className="text-[9px] text-muted-foreground">
                      {left < heapSize && `L:${left}`}
                      {left < heapSize && right < heapSize && ' '}
                      {right < heapSize && `R:${right}`}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
      
      <div className="flex justify-center gap-4 mt-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-blue-500" />
          <span>No Heap</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-purple-500" />
          <span>Heapificando</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-yellow-400" />
          <span>Comparando</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <span>Troca</span>
        </div>
      </div>
    </div>
  );
}

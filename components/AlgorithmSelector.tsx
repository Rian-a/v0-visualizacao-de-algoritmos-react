'use client';

import { AlgorithmName } from '@/algorithms/types';
import { algorithmInfos } from '@/algorithms';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface AlgorithmSelectorProps {
  selected: AlgorithmName;
  onSelect: (algorithm: AlgorithmName) => void;
  disabled?: boolean;
}

const algorithmOrder: AlgorithmName[] = ['bubble', 'selection', 'insertion', 'merge', 'quick', 'heap'];

export function AlgorithmSelector({
  selected,
  onSelect,
  disabled = false,
}: AlgorithmSelectorProps) {
  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {algorithmOrder.map((alg) => {
        const info = algorithmInfos[alg];
        return (
          <Button
            key={alg}
            variant={selected === alg ? 'default' : 'outline'}
            size="sm"
            onClick={() => onSelect(alg)}
            disabled={disabled}
            className={cn(
              'min-w-[120px]',
              selected === alg && 'ring-2 ring-primary ring-offset-2 ring-offset-background'
            )}
          >
            {info.name}
          </Button>
        );
      })}
    </div>
  );
}

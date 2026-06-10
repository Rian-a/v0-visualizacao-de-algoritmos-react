'use client';

import { Product } from '@/algorithms/types';
import { SearchField } from '@/algorithms/searchTypes';
import { cn } from '@/lib/utils';
import { formatValue } from '@/utils/helpers';
import { getSearchFieldLabel } from '@/utils/searchHelpers';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface SearchVisualizerProps {
  products: Product[];
  field: SearchField;
  currentIndex: number;
  foundIndices: number[];
  discarded: number[];
  left: number;
  mid: number;
  right: number;
}

type CellState = 'normal' | 'comparing' | 'discarded' | 'found' | 'left' | 'right';

function getDisplayValue(product: Product, field: SearchField): string {
  if (field === 'title') return product.title;
  return formatValue(product[field], field);
}

export function SearchVisualizer({
  products,
  field,
  currentIndex,
  foundIndices,
  discarded,
  left,
  mid,
  right,
}: SearchVisualizerProps) {
  const getState = (index: number): CellState => {
    if (foundIndices.includes(index)) return 'found';
    if (index === mid && mid !== -1) return 'comparing';
    if (index === currentIndex && currentIndex !== -1) return 'comparing';
    if (discarded.includes(index)) return 'discarded';
    return 'normal';
  };

  const stateClasses: Record<CellState, string> = {
    normal: 'bg-card border-border text-foreground',
    comparing: 'bg-yellow-400 border-yellow-500 text-black scale-105 shadow-lg',
    discarded: 'bg-muted/40 border-border text-muted-foreground opacity-40',
    found: 'bg-green-500 border-green-600 text-white scale-105 shadow-lg',
    left: 'bg-blue-500/20 border-blue-500',
    right: 'bg-pink-500/20 border-pink-500',
  };

  return (
    <TooltipProvider>
      <div className="flex flex-wrap gap-2 justify-center">
        {products.map((product, index) => {
          const state = getState(index);
          const isLeft = index === left && left !== -1;
          const isRight = index === right && right !== -1;
          const isMid = index === mid && mid !== -1;

          return (
            <Tooltip key={product.id}>
              <TooltipTrigger asChild>
                <div className="flex flex-col items-center gap-1">
                  {/* Marcadores de ponteiros da busca binária */}
                  <div className="flex gap-0.5 h-4 items-center">
                    {isLeft && (
                      <span className="text-[10px] font-bold text-blue-400">L</span>
                    )}
                    {isMid && (
                      <span className="text-[10px] font-bold text-yellow-400">M</span>
                    )}
                    {isRight && (
                      <span className="text-[10px] font-bold text-pink-400">R</span>
                    )}
                  </div>
                  <div
                    className={cn(
                      'relative w-14 h-14 md:w-16 md:h-16 rounded-lg border-2 flex flex-col items-center justify-center transition-all duration-300 cursor-default',
                      stateClasses[state],
                      isLeft && state === 'normal' && 'ring-2 ring-blue-500',
                      isRight && state === 'normal' && 'ring-2 ring-pink-500'
                    )}
                  >
                    <span className="text-[10px] font-mono opacity-70">#{index}</span>
                    <span className="text-xs font-bold truncate max-w-full px-1">
                      {getDisplayValue(product, field)}
                    </span>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <div className="text-xs space-y-1">
                  <p className="font-bold max-w-[200px]">{product.title}</p>
                  <p>Preço: {formatValue(product.price, 'price')}</p>
                  <p>Vendidos: {product.sold_quantity}</p>
                  <p>Disponíveis: {product.available_quantity}</p>
                  <p className="text-muted-foreground">
                    Índice {index} · {getSearchFieldLabel(field)}
                  </p>
                </div>
              </TooltipContent>
            </Tooltip>
          );
        })}
      </div>
    </TooltipProvider>
  );
}

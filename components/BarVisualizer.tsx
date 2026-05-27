'use client';

import { cn } from '@/lib/utils';
import { Product, SortField } from '@/algorithms/types';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { getFieldLabel, formatValue } from '@/utils/helpers';
import { Crown, TrendingDown } from 'lucide-react';

interface BarVisualizerProps {
  values: number[];
  normalizedValues: number[];
  comparing: number[];
  swapping: number[];
  sorted: number[];
  products: Product[];
  sortField: SortField;
  maxHeight?: number;
}

export function BarVisualizer({
  values,
  normalizedValues,
  comparing,
  swapping,
  sorted,
  products,
  sortField,
  maxHeight = 300,
}: BarVisualizerProps) {
  const barWidth = Math.max(30, Math.min(60, 800 / values.length));
  const gap = Math.max(2, Math.min(8, 200 / values.length));

  // Find max and min values for highlighting
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);

  const getBarColor = (index: number, value: number) => {
    if (swapping.includes(index)) return 'bg-red-500';
    if (comparing.includes(index)) return 'bg-yellow-400';
    if (sorted.includes(index)) return 'bg-green-500';
    if (value === maxValue) return 'bg-blue-600 ring-2 ring-blue-300';
    if (value === minValue) return 'bg-blue-400 ring-2 ring-blue-200';
    return 'bg-blue-500';
  };

  const getBarLabel = (index: number) => {
    if (swapping.includes(index)) return 'Troca';
    if (comparing.includes(index)) return 'Comparando';
    if (sorted.includes(index)) return 'Ordenado';
    return '';
  };

  const truncateName = (name: string, maxLength: number = 8) => {
    if (name.length <= maxLength) return name;
    return name.substring(0, maxLength) + '...';
  };

  // Find product by value (approximate match for floating point)
  const findProductByValue = (value: number): Product | undefined => {
    if (!products || products.length === 0) return undefined;
    return products.find(p => {
      const productValue = p[sortField];
      return Math.abs(productValue - value) < 0.01;
    });
  };

  return (
    <TooltipProvider delayDuration={100}>
      <div className="flex items-end justify-center p-4 bg-muted/30 rounded-lg min-h-[400px] overflow-x-auto">
        <div 
          className="flex items-end justify-center"
          style={{ gap: `${gap}px` }}
        >
          {values.map((value, index) => {
            const height = (normalizedValues[index] / 100) * maxHeight;
            const label = getBarLabel(index);
            const product = findProductByValue(value);
            const isMax = value === maxValue;
            const isMin = value === minValue;
            
            return (
              <Tooltip key={index}>
                <TooltipTrigger asChild>
                  <div
                    className="flex flex-col items-center cursor-pointer"
                  >
                    {/* Max/Min indicators */}
                    {isMax && (
                      <Crown className="h-4 w-4 text-yellow-500 mb-1" />
                    )}
                    {isMin && !isMax && (
                      <TrendingDown className="h-4 w-4 text-blue-300 mb-1" />
                    )}
                    
                    {/* State label */}
                    {label && (
                      <span className="text-[10px] text-muted-foreground mb-1 whitespace-nowrap">
                        {label}
                      </span>
                    )}
                    
                    {/* Value display */}
                    <span className={cn(
                      "text-xs mb-1 font-mono",
                      isMax && "text-yellow-500 font-bold",
                      isMin && !isMax && "text-blue-300 font-bold",
                      !isMax && !isMin && "text-foreground"
                    )}>
                      {formatValue(value, sortField)}
                    </span>
                    
                    {/* Bar */}
                    <div
                      className={cn(
                        'rounded-t transition-all duration-150',
                        getBarColor(index, value)
                      )}
                      style={{
                        width: `${barWidth}px`,
                        height: `${height}px`,
                      }}
                    />
                    
                    {/* Product name (truncated) */}
                    <span className="text-[9px] text-muted-foreground mt-1 text-center max-w-[60px] truncate" title={product?.title}>
                      {product ? truncateName(product.title.split(' ')[0], 6) : `#${index}`}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-xs">
                  {product ? (
                    <div className="space-y-1 text-sm">
                      <p className="font-semibold text-balance">{product.title}</p>
                      <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
                        <span className="text-muted-foreground">Preço:</span>
                        <span className={sortField === 'price' ? 'font-bold text-primary' : ''}>
                          R$ {product.price.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                        </span>
                        <span className="text-muted-foreground">Vendidos:</span>
                        <span className={sortField === 'sold_quantity' ? 'font-bold text-primary' : ''}>
                          {product.sold_quantity.toLocaleString('pt-BR')} un
                        </span>
                        <span className="text-muted-foreground">Disponíveis:</span>
                        <span className={sortField === 'available_quantity' ? 'font-bold text-primary' : ''}>
                          {product.available_quantity.toLocaleString('pt-BR')} un
                        </span>
                      </div>
                      {(isMax || isMin) && (
                        <p className={cn(
                          "text-xs font-medium mt-1 pt-1 border-t",
                          isMax && "text-yellow-500",
                          isMin && "text-blue-300"
                        )}>
                          {isMax ? `Maior ${getFieldLabel(sortField).toLowerCase()}` : `Menor ${getFieldLabel(sortField).toLowerCase()}`}
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="text-sm">
                      <p>Valor: {formatValue(value, sortField)}</p>
                      <p className="text-muted-foreground">Índice: {index}</p>
                    </div>
                  )}
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>
      </div>
    </TooltipProvider>
  );
}

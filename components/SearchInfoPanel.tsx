'use client';

import { SearchInfo } from '@/algorithms/searchTypes';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle } from 'lucide-react';

interface SearchInfoPanelProps {
  info: SearchInfo;
  currentPseudocodeLine: number;
  currentDescription: string;
}

export function SearchInfoPanel({
  info,
  currentPseudocodeLine,
  currentDescription,
}: SearchInfoPanelProps) {
  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Narração do passo atual */}
      <div className="p-4 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-lg border border-blue-500/20">
        <h4 className="text-sm font-semibold mb-2 text-blue-400">Passo Atual</h4>
        <p className="text-sm">{currentDescription || 'Aguardando início...'}</p>
      </div>

      {/* Pseudocódigo */}
      <div className="flex-1 min-h-0">
        <h4 className="text-sm font-semibold mb-2">Pseudocódigo</h4>
        <ScrollArea className="h-[200px] rounded-lg border bg-muted/50 p-3">
          <pre className="text-xs font-mono">
            {info.pseudocode.map((line, index) => (
              <div
                key={index}
                className={cn(
                  'py-0.5 px-2 rounded transition-colors',
                  currentPseudocodeLine === index && 'bg-yellow-500/30 text-yellow-200'
                )}
              >
                <span className="text-muted-foreground mr-2">{index + 1}</span>
                {line}
              </div>
            ))}
          </pre>
        </ScrollArea>
      </div>

      {/* Explicação didática */}
      <div>
        <h4 className="text-sm font-semibold mb-2">Sobre o Algoritmo</h4>
        <div className="text-sm text-muted-foreground space-y-2">
          <p><strong className="text-foreground">O que é:</strong> {info.description}</p>
          <p><strong className="text-foreground">Como funciona:</strong> {info.howItWorks}</p>
          <p><strong className="text-foreground">Quando utilizar:</strong> {info.whenToUse}</p>
        </div>
      </div>

      {/* Vantagens e Desvantagens */}
      <div className="grid grid-cols-1 gap-3">
        <div>
          <h4 className="text-sm font-semibold mb-2 text-green-400">Vantagens</h4>
          <ul className="space-y-1">
            {info.advantages.map((adv, i) => (
              <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-green-400 mt-0.5 shrink-0" />
                {adv}
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold mb-2 text-red-400">Desvantagens</h4>
          <ul className="space-y-1">
            {info.disadvantages.map((dis, i) => (
              <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                <XCircle className="h-3.5 w-3.5 text-red-400 mt-0.5 shrink-0" />
                {dis}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Complexidade */}
      <div>
        <h4 className="text-sm font-semibold mb-2">Complexidade</h4>
        <div className="grid grid-cols-3 gap-2">
          <div className="p-2 bg-green-500/10 rounded border border-green-500/20">
            <div className="text-xs text-green-400">Melhor</div>
            <Badge variant="outline" className="mt-1 font-mono text-xs">
              {info.bestCase}
            </Badge>
          </div>
          <div className="p-2 bg-yellow-500/10 rounded border border-yellow-500/20">
            <div className="text-xs text-yellow-400">Médio</div>
            <Badge variant="outline" className="mt-1 font-mono text-xs">
              {info.averageCase}
            </Badge>
          </div>
          <div className="p-2 bg-red-500/10 rounded border border-red-500/20">
            <div className="text-xs text-red-400">Pior</div>
            <Badge variant="outline" className="mt-1 font-mono text-xs">
              {info.worstCase}
            </Badge>
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          {info.complexityExplanation}
        </p>
      </div>
    </div>
  );
}

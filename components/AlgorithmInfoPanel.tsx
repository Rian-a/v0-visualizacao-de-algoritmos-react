'use client';

import { AlgorithmInfo } from '@/algorithms/types';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';

interface AlgorithmInfoPanelProps {
  info: AlgorithmInfo;
  currentPseudocodeLine: number;
  currentDescription: string;
}

export function AlgorithmInfoPanel({
  info,
  currentPseudocodeLine,
  currentDescription,
}: AlgorithmInfoPanelProps) {
  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Descrição atual */}
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

      {/* Explicação do algoritmo */}
      <div>
        <h4 className="text-sm font-semibold mb-2">Sobre o Algoritmo</h4>
        <div className="text-sm text-muted-foreground space-y-2">
          <p>{info.description}</p>
          <p><strong className="text-foreground">Estratégia:</strong> {info.strategy}</p>
          <p><strong className="text-green-400">Eficiente para:</strong> {info.efficient}</p>
          <p><strong className="text-red-400">Ineficiente para:</strong> {info.inefficient}</p>
          <p><strong className="text-foreground">Estrutura de dados:</strong> {info.dataStructure}</p>
        </div>
      </div>

      {/* Complexidade */}
      <div>
        <h4 className="text-sm font-semibold mb-2">Complexidade</h4>
        <div className="grid grid-cols-2 gap-2">
          <div className="p-2 bg-green-500/10 rounded border border-green-500/20">
            <div className="text-xs text-green-400">Melhor caso</div>
            <Badge variant="outline" className="mt-1 font-mono">
              {info.bestCase}
            </Badge>
          </div>
          <div className="p-2 bg-yellow-500/10 rounded border border-yellow-500/20">
            <div className="text-xs text-yellow-400">Caso médio</div>
            <Badge variant="outline" className="mt-1 font-mono">
              {info.averageCase}
            </Badge>
          </div>
          <div className="p-2 bg-red-500/10 rounded border border-red-500/20">
            <div className="text-xs text-red-400">Pior caso</div>
            <Badge variant="outline" className="mt-1 font-mono">
              {info.worstCase}
            </Badge>
          </div>
          <div className="p-2 bg-blue-500/10 rounded border border-blue-500/20">
            <div className="text-xs text-blue-400">Espaço</div>
            <Badge variant="outline" className="mt-1 font-mono">
              {info.spaceComplexity}
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

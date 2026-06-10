'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Product } from '@/algorithms/types';
import {
  SearchAlgorithmName,
  SearchField,
  SearchMode,
} from '@/algorithms/searchTypes';
import { searchInfos } from '@/algorithms/searchIndex';
import { isSortedByField } from '@/algorithms/binarySearch';
import { linearSearch } from '@/algorithms/linearSearch';
import { binarySearch } from '@/algorithms/binarySearch';
import { useSearchAnimation } from '@/hooks/useSearchAnimation';
import { getSearchFieldLabel, sortProductsByField } from '@/utils/searchHelpers';
import { formatTime } from '@/utils/helpers';

import { SearchVisualizer } from './SearchVisualizer';
import { SearchInfoPanel } from './SearchInfoPanel';
import { SearchComparison } from './SearchComparison';
import { Controls } from './Controls';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { Search, AlertCircle } from 'lucide-react';

interface SearchSectionProps {
  products: Product[];
}

const searchFields: SearchField[] = ['title', 'price', 'sold_quantity', 'available_quantity'];

export function SearchSection({ products }: SearchSectionProps) {
  const [algorithm, setAlgorithm] = useState<SearchAlgorithmName>('linear');
  const [field, setField] = useState<SearchField>('title');
  const [mode, setMode] = useState<SearchMode>('partial');
  const [query, setQuery] = useState('');

  // Resultados da comparação entre buscas
  const [linearResult, setLinearResult] = useState<{ comparisons: number; time: number } | null>(null);
  const [binaryResult, setBinaryResult] = useState<{ comparisons: number; time: number } | null>(null);

  // Referência para rolar até a seção de comparação ao comparar
  const comparisonRef = useRef<HTMLDivElement>(null);

  const {
    currentIndex,
    foundIndices,
    discarded,
    left,
    mid,
    right,
    description,
    pseudocodeLine,
    comparisons,
    elapsedTime,
    isPlaying,
    isComplete,
    speed,
    totalSteps,
    currentStep,
    play,
    pause,
    step,
    reset,
    setSpeed,
    startSearch,
  } = useSearchAnimation();

  // Para busca binária, os dados precisam estar ordenados pelo campo.
  // Ordenamos uma cópia para garantir o funcionamento correto.
  const displayProducts = useMemo(() => {
    if (algorithm === 'binary') {
      return sortProductsByField(products, field);
    }
    return products;
  }, [algorithm, products, field]);

  // Verifica se o dataset (na ordem exibida) está ordenado pelo campo
  const isSorted = useMemo(() => isSortedByField(displayProducts, field), [displayProducts, field]);

  const info = searchInfos[algorithm];

  // Reinicia animação quando muda configuração
  useEffect(() => {
    reset();
    setLinearResult(null);
    setBinaryResult(null);
  }, [algorithm, field, mode, reset]);

  const handleStartSearch = useCallback(() => {
    if (!query.trim()) return;
    startSearch(displayProducts, algorithm, field, query, mode);
  }, [query, displayProducts, algorithm, field, mode, startSearch]);

  // Executa ambas as buscas para comparação (sem animação, apenas métricas)
  const handleCompare = useCallback(() => {
    if (!query.trim()) return;

    // Linear sempre usa a ordem original
    const linStart = performance.now();
    const linRes = linearSearch(products, field, query, mode);
    const linTime = performance.now() - linStart;
    setLinearResult({ comparisons: linRes.comparisons, time: linTime });

    // Binária requer dados ordenados
    if (field !== 'title' || mode === 'exact') {
      const sorted = sortProductsByField(products, field);
      const binStart = performance.now();
      const binRes = binarySearch(sorted, field, query, mode);
      const binTime = performance.now() - binStart;
      setBinaryResult({ comparisons: binRes.comparisons, time: binTime });
    } else {
      setBinaryResult(null);
    }

    // Rola até a seção de comparação para que o resultado fique visível
    requestAnimationFrame(() => {
      comparisonRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }, [query, products, field, mode]);

  // Busca binária não suporta busca parcial por substring
  const binaryDisabled = field === 'title' && mode === 'partial';
  const binaryAvailableForCompare = !(field === 'title' && mode === 'partial');

  const resultCount = foundIndices.length;

  return (
    <div className="space-y-6">
      {/* Configurações de busca */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Search className="h-5 w-5" />
            Configurações de Busca
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Algoritmo */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Algoritmo</Label>
            <div className="flex gap-2 flex-wrap">
              <Button
                variant={algorithm === 'linear' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setAlgorithm('linear')}
                disabled={isPlaying}
                className={cn(algorithm === 'linear' && 'ring-2 ring-primary ring-offset-2 ring-offset-background')}
              >
                Busca Linear
              </Button>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <span>
                      <Button
                        variant={algorithm === 'binary' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setAlgorithm('binary')}
                        disabled={isPlaying || binaryDisabled}
                        className={cn(algorithm === 'binary' && 'ring-2 ring-primary ring-offset-2 ring-offset-background')}
                      >
                        Busca Binária
                      </Button>
                    </span>
                  </TooltipTrigger>
                  {binaryDisabled && (
                    <TooltipContent>
                      <p className="max-w-[240px] text-xs">
                        A Busca Binária exige que os dados estejam ordenados pelo campo selecionado.
                        Não é possível usá-la com busca parcial por título.
                      </p>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>

          {/* Campo de busca */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Campo de busca</Label>
            <div className="flex gap-2 flex-wrap">
              {searchFields.map((f) => (
                <Button
                  key={f}
                  variant={field === f ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setField(f)}
                  disabled={isPlaying}
                  className={cn(field === f && 'ring-2 ring-primary ring-offset-2 ring-offset-background')}
                >
                  {getSearchFieldLabel(f)}
                </Button>
              ))}
            </div>
          </div>

          {/* Modo de busca */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Modo de busca</Label>
            <RadioGroup
              value={mode}
              onValueChange={(v) => setMode(v as SearchMode)}
              className="flex gap-6"
              disabled={isPlaying}
            >
              <div className="flex items-center gap-2">
                <RadioGroupItem value="exact" id="mode-exact" />
                <Label htmlFor="mode-exact" className="text-sm cursor-pointer">Busca Exata</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="partial" id="mode-partial" />
                <Label htmlFor="mode-partial" className="text-sm cursor-pointer">Busca Parcial</Label>
              </div>
            </RadioGroup>
            <p className="text-xs text-muted-foreground mt-1">
              {mode === 'exact'
                ? 'Retorna apenas correspondências exatas.'
                : 'Retorna qualquer item que contenha o texto informado (apenas no campo Título).'}
            </p>
          </div>

          {/* Campo de input */}
          <div>
            <Label htmlFor="search-input" className="text-sm font-medium mb-2 block">
              Valor a procurar
            </Label>
            <div className="flex gap-2 flex-wrap">
              <Input
                id="search-input"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={field === 'title' ? 'Ex: notebook' : 'Ex: 2599'}
                className="max-w-xs"
                disabled={isPlaying}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleStartSearch();
                }}
              />
              <Button onClick={handleStartSearch} disabled={!query.trim() || isPlaying}>
                <Search className="h-4 w-4 mr-2" />
                Buscar
              </Button>
              <Button variant="outline" onClick={handleCompare} disabled={!query.trim() || isPlaying}>
                Comparar Buscas
              </Button>
            </div>
          </div>

          {/* Avisos */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">{products.length} produtos</Badge>
            <Badge variant="secondary">Campo: {getSearchFieldLabel(field)}</Badge>
            {algorithm === 'binary' && (
              <Badge variant={isSorted ? 'default' : 'destructive'}>
                {isSorted ? 'Dados ordenados' : 'Dados não ordenados'}
              </Badge>
            )}
          </div>

          {algorithm === 'binary' && (
            <p className="text-xs text-muted-foreground flex items-center gap-2">
              <AlertCircle className="h-3.5 w-3.5" />
              Para a Busca Binária, os dados são exibidos ordenados pelo campo selecionado.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Conteúdo principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {/* Métricas em tempo real */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-card rounded-lg border">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-500">{comparisons}</div>
              <div className="text-xs text-muted-foreground">Comparações</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-yellow-500">
                {currentIndex !== -1 ? currentIndex : mid !== -1 ? mid : '—'}
              </div>
              <div className="text-xs text-muted-foreground">Índice atual</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-500">{formatTime(elapsedTime)}</div>
              <div className="text-xs text-muted-foreground">Tempo</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-500">
                {isComplete ? resultCount : '—'}
              </div>
              <div className="text-xs text-muted-foreground">Encontrados</div>
            </div>
          </div>

          {/* Visualização */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Visualização</CardTitle>
            </CardHeader>
            <CardContent>
              {products.length > 0 ? (
                <SearchVisualizer
                  products={displayProducts}
                  field={field}
                  currentIndex={currentIndex}
                  foundIndices={foundIndices}
                  discarded={discarded}
                  left={left}
                  mid={mid}
                  right={right}
                />
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  Carregando produtos...
                </p>
              )}

              {/* Legenda */}
              <div className="flex justify-center gap-4 mt-6 text-sm flex-wrap">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-card border-2 border-border" />
                  <span>Normal</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-yellow-400" />
                  <span>Analisando</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-muted/40 border-2 border-border" />
                  <span>Descartado</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 rounded bg-green-500" />
                  <span>Encontrado</span>
                </div>
                {algorithm === 'binary' && (
                  <>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-blue-400">L</span>
                      <span>Início (Left)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-yellow-400">M</span>
                      <span>Meio (Mid)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-pink-400">R</span>
                      <span>Fim (Right)</span>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Controles */}
          <Controls
            isPlaying={isPlaying}
            isComplete={isComplete}
            speed={speed}
            onPlay={play}
            onPause={pause}
            onStep={step}
            onReset={reset}
            onSpeedChange={setSpeed}
            disabled={totalSteps === 0}
          />
        </div>

        {/* Painel lateral */}
        <div className="lg:col-span-1">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">{info.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[calc(100vh-400px)] min-h-[500px] pr-4">
                <SearchInfoPanel
                  info={info}
                  currentPseudocodeLine={pseudocodeLine}
                  currentDescription={description}
                />
              </ScrollArea>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Comparação de buscas */}
      <Card ref={comparisonRef} className="scroll-mt-4">
        <CardContent className="pt-6">
          <SearchComparison
            linearComparisons={linearResult?.comparisons ?? null}
            binaryComparisons={binaryResult?.comparisons ?? null}
            linearTime={linearResult?.time ?? null}
            binaryTime={binaryResult?.time ?? null}
            binaryAvailable={binaryAvailableForCompare}
          />
        </CardContent>
      </Card>
    </div>
  );
}

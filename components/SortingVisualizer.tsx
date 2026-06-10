'use client';

import { useState, useEffect, useCallback } from 'react';
import { fetchProducts } from '@/services/api';
import { useSortingAnimation } from '@/hooks/useSortingAnimation';
import { algorithmInfos, AlgorithmName, Product, SortField } from '@/algorithms';
import { extractValues, normalizeValues, getFieldLabel } from '@/utils/helpers';
import { heapSort } from '@/algorithms/heapSort';

import { BarVisualizer } from './BarVisualizer';
import { Controls } from './Controls';
import { MetricsPanel } from './MetricsPanel';
import { AlgorithmInfoPanel } from './AlgorithmInfoPanel';
import { HeapVisualizer } from './HeapVisualizer';
import { AlgorithmSelector } from './AlgorithmSelector';
import { FieldSelector } from './FieldSelector';
import { DatasetSize } from './DatasetSize';
import { PerformanceComparison } from './PerformanceComparison';
import { SearchSection } from './SearchSection';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { RefreshCw, Loader2, Database, BarChart3, Search } from 'lucide-react';

export function SortingVisualizer() {
  const [products, setProducts] = useState<Product[]>([]);
  const [originalValues, setOriginalValues] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [algorithm, setAlgorithm] = useState<AlgorithmName>('bubble');
  const [sortField, setSortField] = useState<SortField>('price');
  const [datasetSize, setDatasetSize] = useState(10);

  // Heap sort specific state
  const [heapSteps, setHeapSteps] = useState<{ heapSize: number; heapifying: number[] }[]>([]);

  const {
    currentStep,
    totalSteps,
    currentArray,
    comparing,
    swapping,
    sorted,
    description,
    pseudocodeLine,
    comparisons,
    swaps,
    elapsedTime,
    isPlaying,
    isComplete,
    speed,
    play,
    pause,
    step,
    reset,
    setSpeed,
    startSorting,
  } = useSortingAnimation();

  const loadProducts = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchProducts('notebook', datasetSize);
      setProducts(data);
      const values = extractValues(data, sortField);
      setOriginalValues(values);
    } catch {
      setError('Erro ao carregar produtos. Usando dados mock.');
    } finally {
      setIsLoading(false);
    }
  }, [datasetSize, sortField]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const handleStartSort = useCallback(() => {
    if (originalValues.length === 0) return;
    
    if (algorithm === 'heap') {
      const result = heapSort([...originalValues]);
      setHeapSteps(result.heapSteps.map(s => ({
        heapSize: s.heapSize,
        heapifying: s.heapifying
      })));
    } else {
      setHeapSteps([]);
    }
    
    startSorting([...originalValues], algorithm);
  }, [originalValues, algorithm, startSorting]);

  const handleAlgorithmChange = useCallback((alg: AlgorithmName) => {
    setAlgorithm(alg);
    reset();
    setHeapSteps([]);
  }, [reset]);

  const handleFieldChange = useCallback((field: SortField) => {
    setSortField(field);
    const values = extractValues(products, field);
    setOriginalValues(values);
    reset();
    setHeapSteps([]);
  }, [products, reset]);

  const handleSizeChange = useCallback((size: number) => {
    setDatasetSize(size);
    reset();
    setHeapSteps([]);
  }, [reset]);

  const handleReset = useCallback(() => {
    reset();
    const values = extractValues(products, sortField);
    setOriginalValues(values);
    setHeapSteps([]);
  }, [reset, products, sortField]);

  const currentHeapStep = heapSteps[currentStep] || { heapSize: 0, heapifying: [] };
  const normalizedValues = normalizeValues(currentArray.length > 0 ? currentArray : originalValues);
  const displayValues = currentArray.length > 0 ? currentArray : originalValues;
  const info = algorithmInfos[algorithm];

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-4 max-w-7xl">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Visualizador de Algoritmos de Ordenação
          </h1>
          <p className="text-muted-foreground mt-2">
            Aprenda como funcionam os algoritmos clássicos de ordenação com dados reais do Mercado Livre
          </p>
        </header>

        <Tabs defaultValue="visualizer" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-lg mx-auto">
            <TabsTrigger value="visualizer" className="gap-2">
              <BarChart3 className="h-4 w-4" />
              Visualizador
            </TabsTrigger>
            <TabsTrigger value="comparison" className="gap-2">
              <Database className="h-4 w-4" />
              Comparação
            </TabsTrigger>
            <TabsTrigger value="search" className="gap-2">
              <Search className="h-4 w-4" />
              Busca
            </TabsTrigger>
          </TabsList>

          <TabsContent value="visualizer" className="space-y-6">
            {/* Configurações */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  Configurações
                  {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col md:flex-row items-center gap-4 justify-between">
                  <div className="flex flex-wrap items-center gap-4 justify-center">
                    <DatasetSize
                      value={datasetSize}
                      onChange={handleSizeChange}
                      disabled={isPlaying}
                    />
                    <FieldSelector
                      selected={sortField}
                      onSelect={handleFieldChange}
                      disabled={isPlaying}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={loadProducts}
                      disabled={isLoading || isPlaying}
                    >
                      <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                      Recarregar
                    </Button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {products.length} produtos
                    </Badge>
                    <Badge variant="secondary">
                      Ordenando por: {getFieldLabel(sortField)}
                    </Badge>
                  </div>
                </div>

                {error && (
                  <p className="text-sm text-yellow-500">{error}</p>
                )}

                <div>
                  <label className="text-sm font-medium mb-2 block">Algoritmo</label>
                  <AlgorithmSelector
                    selected={algorithm}
                    onSelect={handleAlgorithmChange}
                    disabled={isPlaying}
                  />
                </div>

                <div className="flex justify-center">
                  <Button
                    onClick={handleStartSort}
                    disabled={isLoading || originalValues.length === 0}
                    size="lg"
                  >
                    Iniciar {info.name}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Área principal de visualização */}
              <div className="lg:col-span-2 space-y-4">
                {/* Métricas */}
                <MetricsPanel
                  comparisons={comparisons}
                  swaps={swaps}
                  elapsedTime={elapsedTime}
                  currentStep={currentStep}
                  totalSteps={totalSteps}
                  algorithmName={info.name}
                />

                {/* Visualização das barras */}
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">Visualização</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <BarVisualizer
                      values={displayValues}
                      normalizedValues={normalizedValues}
                      comparing={comparing}
                      swapping={swapping}
                      sorted={sorted}
                      products={products}
                      sortField={sortField}
                    />
                    
                    {/* Legenda */}
                    <div className="flex justify-center gap-4 mt-4 text-sm flex-wrap">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-blue-500" />
                        <span>Normal</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-yellow-400" />
                        <span>Comparando</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-red-500" />
                        <span>Troca</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded bg-green-500" />
                        <span>Ordenado</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Heap Visualizer para Heap Sort */}
                {algorithm === 'heap' && currentArray.length > 0 && (
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">Heap Binária</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <HeapVisualizer
                        array={currentArray}
                        heapSize={currentHeapStep.heapSize}
                        comparing={comparing}
                        swapping={swapping}
                        heapifying={currentHeapStep.heapifying}
                      />
                    </CardContent>
                  </Card>
                )}

                {/* Controles */}
                <Controls
                  isPlaying={isPlaying}
                  isComplete={isComplete}
                  speed={speed}
                  onPlay={play}
                  onPause={pause}
                  onStep={step}
                  onReset={handleReset}
                  onSpeedChange={setSpeed}
                  disabled={totalSteps === 0}
                />
              </div>

              {/* Painel lateral de informações */}
              <div className="lg:col-span-1">
                <Card className="h-full">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{info.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ScrollArea className="h-[calc(100vh-400px)] min-h-[500px] pr-4">
                      <AlgorithmInfoPanel
                        info={info}
                        currentPseudocodeLine={pseudocodeLine}
                        currentDescription={description}
                      />
                    </ScrollArea>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="comparison">
            <Card>
              <CardContent className="pt-6">
                <PerformanceComparison originalArray={originalValues} speed={speed} />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="search">
            <SearchSection products={products} />
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <footer className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            Dados obtidos da{' '}
            <a 
              href="https://developers.mercadolibre.com.br/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline"
            >
              API do Mercado Livre
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}

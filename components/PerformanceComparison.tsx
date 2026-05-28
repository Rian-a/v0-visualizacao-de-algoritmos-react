'use client';

import { useState, useCallback, useRef } from 'react';
import { algorithms, algorithmInfos, AlgorithmName } from '@/algorithms';
import { formatTime } from '@/utils/helpers';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Play, Loader2, CheckCircle2 } from 'lucide-react';

interface AlgorithmState {
  algorithm: AlgorithmName;
  name: string;
  comparisons: number;
  swaps: number;
  time: number;
  complexity: string;
  status: 'idle' | 'running' | 'finished';
  progress: number;
  totalSteps: number;
}

interface PerformanceComparisonProps {
  originalArray: number[];
  speed?: number;
}

const algorithmOrder: AlgorithmName[] = ['bubble', 'selection', 'insertion', 'merge', 'quick', 'heap'];

export function PerformanceComparison({ originalArray, speed = 100 }: PerformanceComparisonProps) {
  const [algorithmStates, setAlgorithmStates] = useState<AlgorithmState[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const abortRef = useRef(false);

  const runComparison = useCallback(async () => {
    if (originalArray.length === 0) return;

    abortRef.current = false;
    setIsRunning(true);

    // Inicializar estados para todos os algoritmos
    const initialStates: AlgorithmState[] = algorithmOrder.map((alg) => ({
      algorithm: alg,
      name: algorithmInfos[alg].name,
      comparisons: 0,
      swaps: 0,
      time: 0,
      complexity: algorithmInfos[alg].averageCase,
      status: 'running',
      progress: 0,
      totalSteps: 0,
    }));
    setAlgorithmStates(initialStates);

    // Pré-calcular os steps de cada algoritmo
    const algorithmData = algorithmOrder.map((alg) => {
      const arrayCopy = [...originalArray];
      const startTime = performance.now();
      const result = algorithms[alg](arrayCopy);
      const endTime = performance.now();
      return {
        algorithm: alg,
        steps: result.steps,
        totalComparisons: result.comparisons,
        totalSwaps: result.swaps,
        totalTime: endTime - startTime,
      };
    });

    // Atualizar totalSteps
    setAlgorithmStates((prev) =>
      prev.map((state, i) => ({
        ...state,
        totalSteps: algorithmData[i].steps.length,
      }))
    );

    // Executar todos os algoritmos simultaneamente
    const runAlgorithm = async (index: number) => {
      const data = algorithmData[index];
      const totalSteps = data.steps.length;
      const startTime = performance.now();

      let comparisons = 0;
      let swaps = 0;

      for (let stepIndex = 0; stepIndex < totalSteps; stepIndex++) {
        if (abortRef.current) return;

        const step = data.steps[stepIndex];
        
        // Contar comparações e trocas incrementalmente
        if (step.comparing.length > 0) {
          comparisons++;
        }
        if (step.swapping.length > 0) {
          swaps++;
        }

        const currentTime = performance.now() - startTime;
        const progress = Math.round(((stepIndex + 1) / totalSteps) * 100);

        setAlgorithmStates((prev) =>
          prev.map((state, i) =>
            i === index
              ? {
                  ...state,
                  comparisons,
                  swaps,
                  time: currentTime,
                  progress,
                  status: stepIndex === totalSteps - 1 ? 'finished' : 'running',
                }
              : state
          )
        );

        // Delay controlado pela velocidade (mais rápido para comparação)
        const delay = Math.max(1, Math.floor(speed / 10));
        await new Promise((resolve) => setTimeout(resolve, delay));
      }

      // Atualizar com valores finais reais
      const finalTime = performance.now() - startTime;
      setAlgorithmStates((prev) =>
        prev.map((state, i) =>
          i === index
            ? {
                ...state,
                comparisons: data.totalComparisons,
                swaps: data.totalSwaps,
                time: finalTime,
                progress: 100,
                status: 'finished',
              }
            : state
        )
      );
    };

    // Executar todos os algoritmos em paralelo
    await Promise.all(algorithmOrder.map((_, index) => runAlgorithm(index)));

    setIsRunning(false);
  }, [originalArray, speed]);

  const chartData = algorithmStates.map((state) => ({
    name: state.name.replace(' Sort', ''),
    Comparações: state.comparisons,
    Trocas: state.swaps,
    'Tempo (ms)': Math.round(state.time * 100) / 100,
  }));

  // Encontrar o mais rápido (apenas entre os finalizados)
  const finishedAlgorithms = algorithmStates.filter((s) => s.status === 'finished');
  const fastest =
    finishedAlgorithms.length > 0
      ? finishedAlgorithms.reduce((a, b) => (a.time < b.time ? a : b))
      : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Comparação de Desempenho</h3>
        <Button
          onClick={runComparison}
          disabled={isRunning || originalArray.length === 0}
        >
          {isRunning ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Executando...
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" />
              Executar Todos
            </>
          )}
        </Button>
      </div>

      {originalArray.length === 0 && (
        <p className="text-sm text-muted-foreground text-center py-4">
          Carregue os dados para comparar os algoritmos.
        </p>
      )}

      {algorithmStates.length > 0 && (
        <>
          {/* Tabela comparativa com atualização em tempo real */}
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Algoritmo</TableHead>
                  <TableHead className="text-right">Comparações</TableHead>
                  <TableHead className="text-right">Trocas</TableHead>
                  <TableHead className="text-right">Tempo</TableHead>
                  <TableHead className="text-right">Progresso</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {algorithmStates.map((state) => (
                  <TableRow
                    key={state.algorithm}
                    className={`transition-colors duration-200 ${
                      state.status === 'running'
                        ? 'bg-blue-500/10'
                        : fastest?.algorithm === state.algorithm && state.status === 'finished'
                        ? 'bg-green-500/10'
                        : ''
                    }`}
                  >
                    <TableCell className="font-medium">
                      {state.name}
                      {fastest?.algorithm === state.algorithm && state.status === 'finished' && (
                        <span className="ml-2 text-xs text-green-500">Mais rápido</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-mono tabular-nums">
                      {state.comparisons.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-mono tabular-nums">
                      {state.swaps.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-mono tabular-nums">
                      {formatTime(state.time)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-16 h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full transition-all duration-100 ${
                              state.status === 'finished' ? 'bg-green-500' : 'bg-blue-500'
                            }`}
                            style={{ width: `${state.progress}%` }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground w-8 text-right">
                          {state.progress}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      {state.status === 'running' ? (
                        <span className="inline-flex items-center gap-1 text-xs text-blue-500">
                          <Loader2 className="h-3 w-3 animate-spin" />
                          Executando
                        </span>
                      ) : state.status === 'finished' ? (
                        <span className="inline-flex items-center gap-1 text-xs text-green-500">
                          <CheckCircle2 className="h-3 w-3" />
                          Finalizado
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">Aguardando</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Gráfico de barras com atualização em tempo real */}
          <div className="p-4 bg-card rounded-lg border">
            <h4 className="text-sm font-semibold mb-4">Gráfico Comparativo</h4>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Legend />
                <Bar dataKey="Comparações" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Trocas" fill="#ef4444" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfico de tempo com atualização em tempo real */}
          <div className="p-4 bg-card rounded-lg border">
            <h4 className="text-sm font-semibold mb-4">Tempo de Execução (ms)</h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--muted))" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                  stroke="hsl(var(--muted-foreground))"
                />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="Tempo (ms)" fill="#22c55e" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}

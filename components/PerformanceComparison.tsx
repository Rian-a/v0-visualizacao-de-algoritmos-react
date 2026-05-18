'use client';

import { useState, useCallback } from 'react';
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
import { Play, Loader2 } from 'lucide-react';

interface ComparisonResult {
  algorithm: AlgorithmName;
  name: string;
  comparisons: number;
  swaps: number;
  time: number;
  complexity: string;
}

interface PerformanceComparisonProps {
  originalArray: number[];
}

const algorithmOrder: AlgorithmName[] = ['bubble', 'selection', 'insertion', 'merge', 'quick', 'heap'];

export function PerformanceComparison({ originalArray }: PerformanceComparisonProps) {
  const [results, setResults] = useState<ComparisonResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const runComparison = useCallback(async () => {
    if (originalArray.length === 0) return;

    setIsRunning(true);
    setResults([]);

    const newResults: ComparisonResult[] = [];

    for (const alg of algorithmOrder) {
      const arrayCopy = [...originalArray];
      const info = algorithmInfos[alg];
      
      const startTime = performance.now();
      const result = algorithms[alg](arrayCopy);
      const endTime = performance.now();

      newResults.push({
        algorithm: alg,
        name: info.name,
        comparisons: result.comparisons,
        swaps: result.swaps,
        time: endTime - startTime,
        complexity: info.averageCase,
      });

      // Pequeno delay para atualização visual
      setResults([...newResults]);
      await new Promise(resolve => setTimeout(resolve, 50));
    }

    setIsRunning(false);
  }, [originalArray]);

  const chartData = results.map((r) => ({
    name: r.name.replace(' Sort', ''),
    Comparações: r.comparisons,
    Trocas: r.swaps,
    'Tempo (ms)': Math.round(r.time * 100) / 100,
  }));

  // Encontrar o mais rápido
  const fastest = results.length > 0 
    ? results.reduce((a, b) => a.time < b.time ? a : b)
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

      {results.length > 0 && (
        <>
          {/* Tabela comparativa */}
          <div className="rounded-lg border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Algoritmo</TableHead>
                  <TableHead className="text-right">Comparações</TableHead>
                  <TableHead className="text-right">Trocas</TableHead>
                  <TableHead className="text-right">Tempo</TableHead>
                  <TableHead className="text-right">Complexidade</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {results.map((result) => (
                  <TableRow
                    key={result.algorithm}
                    className={fastest?.algorithm === result.algorithm ? 'bg-green-500/10' : ''}
                  >
                    <TableCell className="font-medium">
                      {result.name}
                      {fastest?.algorithm === result.algorithm && (
                        <span className="ml-2 text-xs text-green-500">★ Mais rápido</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {result.comparisons.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {result.swaps.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-mono">
                      {formatTime(result.time)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-muted-foreground">
                      {result.complexity}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Gráfico de barras */}
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
                <YAxis 
                  tick={{ fontSize: 12 }}
                  stroke="hsl(var(--muted-foreground))"
                />
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

          {/* Gráfico de tempo */}
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
                <YAxis 
                  tick={{ fontSize: 12 }}
                  stroke="hsl(var(--muted-foreground))"
                />
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

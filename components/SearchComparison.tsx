'use client';

import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatTime } from '@/utils/helpers';

interface SearchComparisonProps {
  linearComparisons: number | null;
  binaryComparisons: number | null;
  linearTime: number | null;
  binaryTime: number | null;
  binaryAvailable: boolean;
}

// Calcula comparações teóricas para o gráfico de escalabilidade
function linearWorstCase(n: number): number {
  return n;
}

function binaryWorstCase(n: number): number {
  return Math.ceil(Math.log2(n + 1));
}

const SCALABILITY_SIZES = [10, 50, 100, 500, 1000];

export function SearchComparison({
  linearComparisons,
  binaryComparisons,
  linearTime,
  binaryTime,
  binaryAvailable,
}: SearchComparisonProps) {
  // Dados da tabela comparativa
  const tableData = useMemo(
    () => [
      {
        name: 'Busca Linear',
        comparisons: linearComparisons,
        time: linearTime,
        complexity: 'O(n)',
        color: 'text-blue-400',
      },
      {
        name: 'Busca Binária',
        comparisons: binaryAvailable ? binaryComparisons : null,
        time: binaryAvailable ? binaryTime : null,
        complexity: 'O(log n)',
        color: 'text-green-400',
      },
    ],
    [linearComparisons, binaryComparisons, linearTime, binaryTime, binaryAvailable]
  );

  // Dados do gráfico comparativo (resultado real da busca executada)
  const comparisonChartData = useMemo(() => {
    const data: { name: string; comparacoes: number }[] = [];
    if (linearComparisons !== null) {
      data.push({ name: 'Linear', comparacoes: linearComparisons });
    }
    if (binaryAvailable && binaryComparisons !== null) {
      data.push({ name: 'Binária', comparacoes: binaryComparisons });
    }
    return data;
  }, [linearComparisons, binaryComparisons, binaryAvailable]);

  // Dados do gráfico de escalabilidade (teórico, automático)
  const scalabilityData = useMemo(
    () =>
      SCALABILITY_SIZES.map((n) => ({
        tamanho: n,
        Linear: linearWorstCase(n),
        Binária: binaryWorstCase(n),
      })),
    []
  );

  const hasResults = linearComparisons !== null || binaryComparisons !== null;

  return (
    <div className="space-y-6">
      {/* Tabela comparativa */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Comparação de Buscas</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Resultados da execução de ambos os algoritmos sobre o mesmo valor procurado.
        </p>
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Algoritmo</TableHead>
                <TableHead className="text-right">Comparações</TableHead>
                <TableHead className="text-right">Tempo</TableHead>
                <TableHead className="text-right">Complexidade</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData.map((row) => (
                <TableRow key={row.name}>
                  <TableCell className={`font-medium ${row.color}`}>{row.name}</TableCell>
                  <TableCell className="text-right font-mono">
                    {row.comparisons !== null ? row.comparisons : '—'}
                  </TableCell>
                  <TableCell className="text-right font-mono">
                    {row.time !== null ? formatTime(row.time) : '—'}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant="outline" className="font-mono">
                      {row.complexity}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        {!binaryAvailable && (
          <p className="text-xs text-yellow-500 mt-2">
            A Busca Binária exige que os dados estejam ordenados pelo campo selecionado.
          </p>
        )}
      </div>

      {/* Gráfico comparativo da execução */}
      {hasResults && comparisonChartData.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold mb-3">Gráfico Comparativo (execução atual)</h3>
          <div className="h-[260px] w-full bg-card rounded-lg border p-4">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparisonChartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <RechartsTooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="comparacoes" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Comparações" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Gráfico de escalabilidade */}
      <div>
        <h3 className="text-lg font-semibold mb-3">Gráfico de Escalabilidade</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Crescimento do número de comparações (pior caso) conforme o tamanho da lista aumenta.
          Demonstra visualmente a diferença entre O(n) e O(log n).
        </p>
        <div className="h-[300px] w-full bg-card rounded-lg border p-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={scalabilityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="tamanho"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                label={{ value: 'Tamanho da lista', position: 'insideBottom', offset: -5, fontSize: 11 }}
              />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <RechartsTooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              <Line
                type="monotone"
                dataKey="Linear"
                stroke="#3b82f6"
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Linear O(n)"
              />
              <Line
                type="monotone"
                dataKey="Binária"
                stroke="#22c55e"
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Binária O(log n)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

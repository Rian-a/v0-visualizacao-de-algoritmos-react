'use client';

import { useMemo } from 'react';
import {
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import { Product } from '@/algorithms/types';
import { linearSearch } from '@/algorithms/linearSearch';
import { binarySearch } from '@/algorithms/binarySearch';

// Tamanhos de amostra usados para demonstrar a escalabilidade
const SAMPLE_SIZES = [10, 50, 100, 500, 1000];

// Gera um dataset sintético ordenado por preço (1..n) para executar as buscas.
function generateDataset(n: number): Product[] {
  const products: Product[] = [];
  for (let i = 1; i <= n; i++) {
    products.push({
      id: String(i),
      title: `Produto ${i}`,
      price: i,
      sold_quantity: i,
      available_quantity: i,
    });
  }
  return products;
}

interface ScalabilityRow {
  tamanho: number;
  Linear: number;
  Binária: number;
}

export function SearchScalability() {
  // Executa automaticamente as duas buscas sobre cada tamanho de amostra.
  // Buscamos o maior valor (pior caso para a Linear) para evidenciar O(n) vs O(log n).
  const data: ScalabilityRow[] = useMemo(() => {
    return SAMPLE_SIZES.map((n) => {
      const dataset = generateDataset(n);
      const target = String(n); // maior preço do dataset
      const linRes = linearSearch(dataset, 'price', target, 'exact');
      const binRes = binarySearch(dataset, 'price', target, 'exact');
      return {
        tamanho: n,
        Linear: linRes.comparisons,
        Binária: binRes.comparisons,
      };
    });
  }, []);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Escalabilidade dos Algoritmos de Busca
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-sm text-muted-foreground">
          Demonstração de como o número de comparações cresce conforme o tamanho da
          amostra aumenta. Ambos os algoritmos são executados automaticamente sobre
          datasets de diferentes tamanhos.
        </p>

        {/* Tabela de escalabilidade */}
        <div className="rounded-lg border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tamanho</TableHead>
                <TableHead className="text-right text-blue-400">Linear</TableHead>
                <TableHead className="text-right text-green-400">Binária</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((row) => (
                <TableRow key={row.tamanho}>
                  <TableCell className="font-medium">{row.tamanho.toLocaleString()}</TableCell>
                  <TableCell className="text-right font-mono tabular-nums text-blue-400">
                    {row.Linear.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right font-mono tabular-nums text-green-400">
                    {row.Binária.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Gráfico de linhas */}
        <div className="h-[320px] w-full bg-card rounded-lg border p-4">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 20, bottom: 20, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis
                dataKey="tamanho"
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                label={{
                  value: 'Tamanho da amostra',
                  position: 'insideBottom',
                  offset: -10,
                  fontSize: 11,
                  fill: 'hsl(var(--muted-foreground))',
                }}
              />
              <YAxis
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                label={{
                  value: 'Comparações',
                  angle: -90,
                  position: 'insideLeft',
                  fontSize: 11,
                  fill: 'hsl(var(--muted-foreground))',
                }}
              />
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
                name="Busca Linear O(n)"
              />
              <Line
                type="monotone"
                dataKey="Binária"
                stroke="#22c55e"
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Busca Binária O(log n)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Texto explicativo */}
        <p className="text-sm text-muted-foreground leading-relaxed bg-muted/30 border rounded-lg p-4">
          A Busca Linear cresce proporcionalmente ao número de elementos. Já a Busca
          Binária cresce muito mais lentamente porque descarta metade dos dados a cada
          comparação.
        </p>
      </CardContent>
    </Card>
  );
}

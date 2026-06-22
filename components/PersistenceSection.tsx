'use client';

import { useState } from 'react';
import { Product } from '@/algorithms/types';
import { usePersistence } from '@/hooks/usePersistence';
import { PersistenceFormat } from '@/services/persistenceService';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Database,
  HardDrive,
  Save,
  FileJson,
  FileSpreadsheet,
  Binary,
  Loader2,
  CheckCircle2,
  XCircle,
  Wifi,
  WifiOff,
  Zap,
  Clock,
  ArrowDownNarrowWide,
  ArrowUpWideNarrow,
  Search,
} from 'lucide-react';

interface PersistenceSectionProps {
  products: Product[];
  onDataLoaded: (products: Product[]) => void;
}

const SAVE_FORMATS: { format: PersistenceFormat; label: string; icon: typeof FileJson }[] = [
  { format: 'json', label: 'Salvar JSON', icon: FileJson },
  { format: 'csv', label: 'Salvar CSV', icon: FileSpreadsheet },
  { format: 'pickle', label: 'Salvar Pickle', icon: Binary },
];

export function PersistenceSection({ products, onDataLoaded }: PersistenceSectionProps) {
  const {
    origin,
    loadedCount,
    serverStatus,
    loadError,
    loadingApi,
    loadingOffline,
    loadFromApi,
    loadFromFile,
    savingFormat,
    saveFeedback,
    save,
    comparison,
    comparisonError,
    loadingComparison,
    loadComparison,
    inspection,
    inspectionError,
    loadingInspection,
    inspect,
  } = usePersistence({ products, onDataLoaded });

  const [inspectFormat, setInspectFormat] = useState<PersistenceFormat>('json');

  const handleInspectChange = (value: string) => {
    const fmt = value as PersistenceFormat;
    setInspectFormat(fmt);
    inspect(fmt);
  };

  // Métricas derivadas (Seção 7)
  const metrics = (() => {
    if (!comparison || comparison.length === 0) return null;
    const fastestSave = [...comparison].sort((a, b) => a.saveMs - b.saveMs)[0];
    const fastestLoad = [...comparison].sort((a, b) => a.loadMs - b.loadMs)[0];
    const smallest = [...comparison].sort((a, b) => a.sizeKb - b.sizeKb)[0];
    const largest = [...comparison].sort((a, b) => b.sizeKb - a.sizeKb)[0];
    return { fastestSave, fastestLoad, smallest, largest };
  })();

  return (
    <div className="space-y-6">
      {/* SEÇÃO 1 + 5 + 9 — Controle de dados / Modo offline / Integração global */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Database className="h-5 w-5" />
              Controle de Dados
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <Button onClick={loadFromApi} disabled={loadingApi || loadingOffline}>
                {loadingApi ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Database className="h-4 w-4 mr-2" />
                )}
                Carregar da API
              </Button>
              <Button
                variant="outline"
                onClick={loadFromFile}
                disabled={loadingApi || loadingOffline}
              >
                {loadingOffline ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <HardDrive className="h-4 w-4 mr-2" />
                )}
                Carregar do Arquivo (Modo Offline)
              </Button>
            </div>

            {/* Resultado do carregamento */}
            {(origin || loadedCount !== null) && !loadError && (
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="secondary">
                  {loadedCount ?? 0} registros carregados
                </Badge>
                {origin && <Badge variant="outline">Origem: {origin}</Badge>}
              </div>
            )}

            {/* SEÇÃO 8 — erro amigável de carregamento */}
            {loadError && (
              <Alert variant="destructive">
                <XCircle className="h-4 w-4" />
                <AlertTitle>Falha ao carregar</AlertTitle>
                <AlertDescription>{loadError}</AlertDescription>
              </Alert>
            )}

            <p className="text-sm text-muted-foreground">
              Os dados carregados aqui passam a ser usados automaticamente pelas abas{' '}
              <strong>Visualizador</strong>, <strong>Comparação</strong> e{' '}
              <strong>Busca</strong>.
            </p>
          </CardContent>
        </Card>

        {/* SEÇÃO 5 — Modo offline + indicador de status */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              {serverStatus === 'online' ? (
                <Wifi className="h-5 w-5 text-green-500" />
              ) : (
                <WifiOff className="h-5 w-5 text-yellow-500" />
              )}
              Status do Servidor
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Status:</span>
              {serverStatus === 'online' ? (
                <Badge className="bg-green-500/15 text-green-500 hover:bg-green-500/15 border-green-500/30">
                  Online
                </Badge>
              ) : serverStatus === 'offline' ? (
                <Badge className="bg-yellow-500/15 text-yellow-500 hover:bg-yellow-500/15 border-yellow-500/30">
                  Offline
                </Badge>
              ) : (
                <Badge variant="outline">Desconhecido</Badge>
              )}
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              O modo offline carrega os dados diretamente dos arquivos salvos pelo backend,
              sem consultar a API.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* SEÇÃO 2 — Salvar dataset */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Save className="h-5 w-5" />
            Salvar Dataset
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            {SAVE_FORMATS.map(({ format, label, icon: Icon }) => (
              <Button
                key={format}
                variant="outline"
                onClick={() => save(format)}
                disabled={savingFormat !== null || products.length === 0}
              >
                {savingFormat === format ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : (
                  <Icon className="h-4 w-4 mr-2" />
                )}
                {label}
              </Button>
            ))}
          </div>

          {products.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Carregue um dataset antes de salvar.
            </p>
          )}

          {/* Feedback de salvamento (sucesso/erro) */}
          {saveFeedback && (
            <Alert variant={saveFeedback.success ? 'default' : 'destructive'}>
              {saveFeedback.success ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : (
                <XCircle className="h-4 w-4" />
              )}
              <AlertTitle>
                {saveFeedback.success ? 'Sucesso' : 'Erro'} ({saveFeedback.format.toUpperCase()})
              </AlertTitle>
              <AlertDescription>{saveFeedback.message}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* SEÇÃO 3 + 7 — Comparação de formatos e métricas */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <CardTitle className="text-lg flex items-center gap-2">
              <HardDrive className="h-5 w-5" />
              Comparação de Formatos
            </CardTitle>
            <Button
              size="sm"
              variant="outline"
              onClick={loadComparison}
              disabled={loadingComparison}
            >
              {loadingComparison ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Zap className="h-4 w-4 mr-2" />
              )}
              Carregar Comparação
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {comparisonError && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Falha na comparação</AlertTitle>
              <AlertDescription>{comparisonError}</AlertDescription>
            </Alert>
          )}

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Formato</TableHead>
                <TableHead className="text-right">Tamanho (KB)</TableHead>
                <TableHead className="text-right">Salvar (ms)</TableHead>
                <TableHead className="text-right">Carregar (ms)</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {comparison && comparison.length > 0 ? (
                comparison.map((row) => (
                  <TableRow key={row.format}>
                    <TableCell className="font-medium">{row.format}</TableCell>
                    <TableCell className="text-right tabular-nums">{row.sizeKb}</TableCell>
                    <TableCell className="text-right tabular-nums">{row.saveMs}</TableCell>
                    <TableCell className="text-right tabular-nums">{row.loadMs}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={4} className="text-center text-muted-foreground py-6">
                    {loadingComparison
                      ? 'Carregando dados de comparação...'
                      : 'Clique em "Carregar Comparação" para obter os dados do backend.'}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

          {/* SEÇÃO 7 — cards de métricas */}
          {metrics && (
            <>
              <Separator />
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <MetricCard
                  icon={<Zap className="h-4 w-4 text-blue-500" />}
                  label="Mais rápido p/ salvar"
                  value={metrics.fastestSave.format}
                  detail={`${metrics.fastestSave.saveMs} ms`}
                />
                <MetricCard
                  icon={<Clock className="h-4 w-4 text-blue-500" />}
                  label="Mais rápido p/ carregar"
                  value={metrics.fastestLoad.format}
                  detail={`${metrics.fastestLoad.loadMs} ms`}
                />
                <MetricCard
                  icon={<ArrowDownNarrowWide className="h-4 w-4 text-green-500" />}
                  label="Menor arquivo"
                  value={metrics.smallest.format}
                  detail={`${metrics.smallest.sizeKb} KB`}
                />
                <MetricCard
                  icon={<ArrowUpWideNarrow className="h-4 w-4 text-red-500" />}
                  label="Maior arquivo"
                  value={metrics.largest.format}
                  detail={`${metrics.largest.sizeKb} KB`}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* SEÇÃO 4 — Inspeção de arquivos */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center gap-2">
            <Search className="h-5 w-5" />
            Inspeção de Arquivos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-sm font-medium">Formato:</span>
            <Select value={inspectFormat} onValueChange={handleInspectChange}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="json">JSON</SelectItem>
                <SelectItem value="csv">CSV</SelectItem>
                <SelectItem value="pickle">Pickle</SelectItem>
              </SelectContent>
            </Select>
            {loadingInspection && <Loader2 className="h-4 w-4 animate-spin" />}
          </div>

          {inspectionError && (
            <Alert variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Falha na inspeção</AlertTitle>
              <AlertDescription>{inspectionError}</AlertDescription>
            </Alert>
          )}

          <div className="rounded-md border bg-muted/40 p-4 overflow-x-auto">
            <pre className="font-mono text-xs leading-relaxed whitespace-pre text-foreground">
              {inspection
                ? inspection.content
                : 'Selecione um formato para inspecionar o conteúdo do arquivo.'}
            </pre>
          </div>
          <p className="text-xs text-muted-foreground">
            {inspection?.binary
              ? 'Formato binário: exibido como hexdump.'
              : 'Formato texto: legível por humanos.'}
          </p>
        </CardContent>
      </Card>

      {/* SEÇÃO 6 — Explicação didática */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Entendendo os Formatos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormatExplanation
              icon={<FileJson className="h-5 w-5 text-blue-500" />}
              title="JSON"
              points={[
                'Formato texto',
                'Legível por humanos',
                'Fácil de transportar',
                'Amplamente utilizado em APIs',
              ]}
            />
            <FormatExplanation
              icon={<FileSpreadsheet className="h-5 w-5 text-green-500" />}
              title="CSV"
              points={[
                'Formato texto tabular',
                'Compatível com Excel e planilhas',
                'Simples de compartilhar',
              ]}
            />
            <FormatExplanation
              icon={<Binary className="h-5 w-5 text-pink-500" />}
              title="Pickle"
              points={[
                'Formato binário do Python',
                'Geralmente menor',
                'Normalmente mais rápido para leitura e escrita',
              ]}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
  detail,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <div className="rounded-lg border bg-card p-3 flex flex-col gap-1">
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        {icon}
        <span className="truncate">{label}</span>
      </div>
      <span className="text-xl font-bold">{value}</span>
      <span className="text-xs text-muted-foreground">{detail}</span>
    </div>
  );
}

function FormatExplanation({
  icon,
  title,
  points,
}: {
  icon: React.ReactNode;
  title: string;
  points: string[];
}) {
  return (
    <div className="rounded-lg border bg-muted/30 p-4">
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <h3 className="font-semibold">{title}</h3>
      </div>
      <ul className="space-y-1.5">
        {points.map((p) => (
          <li key={p} className="flex items-start gap-2 text-sm text-muted-foreground">
            <span className="mt-1.5 h-1 w-1 rounded-full bg-foreground/40 shrink-0" />
            {p}
          </li>
        ))}
      </ul>
    </div>
  );
}

function BarChartIcon() {
  return <Database className="h-5 w-5" />;
}

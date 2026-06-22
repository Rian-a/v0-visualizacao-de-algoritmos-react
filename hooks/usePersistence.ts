'use client';

import { useCallback, useState } from 'react';
import { Product } from '@/algorithms/types';
import {
  carregarDaApi,
  carregarOffline,
  salvarDataset,
  compararFormatos,
  inspecionarArquivo,
  getFriendlyMessage,
  PersistenceError,
  PersistenceFormat,
  DataOrigin,
  ServerStatus,
  FormatComparisonRow,
  InspectResponse,
} from '@/services/persistenceService';

export interface SaveFeedback {
  format: PersistenceFormat;
  success: boolean;
  message: string;
}

interface UsePersistenceArgs {
  /** Dataset atual da aplicação, usado ao salvar. */
  products: Product[];
  /** Callback para atualizar o dataset global (Seção 9). */
  onDataLoaded?: (products: Product[]) => void;
}

/**
 * Hook que encapsula toda a lógica de persistência.
 * A UI apenas consome estados e dispara ações — sem chamadas HTTP diretas.
 */
export function usePersistence({ products, onDataLoaded }: UsePersistenceArgs) {
  // --- Carregamento ---
  const [origin, setOrigin] = useState<DataOrigin | null>(null);
  const [loadedCount, setLoadedCount] = useState<number | null>(null);
  const [serverStatus, setServerStatus] = useState<ServerStatus | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [loadingApi, setLoadingApi] = useState(false);
  const [loadingOffline, setLoadingOffline] = useState(false);

  // --- Salvamento ---
  const [savingFormat, setSavingFormat] = useState<PersistenceFormat | null>(null);
  const [saveFeedback, setSaveFeedback] = useState<SaveFeedback | null>(null);

  // --- Comparação ---
  const [comparison, setComparison] = useState<FormatComparisonRow[] | null>(null);
  const [comparisonError, setComparisonError] = useState<string | null>(null);
  const [loadingComparison, setLoadingComparison] = useState(false);

  // --- Inspeção ---
  const [inspection, setInspection] = useState<InspectResponse | null>(null);
  const [inspectionError, setInspectionError] = useState<string | null>(null);
  const [loadingInspection, setLoadingInspection] = useState(false);

  const resolveError = (err: unknown): string => {
    if (err instanceof PersistenceError) return getFriendlyMessage(err.kind);
    return 'Ocorreu um erro inesperado.';
  };

  const loadFromApi = useCallback(async () => {
    setLoadingApi(true);
    setLoadError(null);
    try {
      const res = await carregarDaApi();
      setOrigin(res.origin);
      setLoadedCount(res.count);
      setServerStatus(res.status);
      onDataLoaded?.(res.products);
    } catch (err) {
      setLoadError(resolveError(err));
      setServerStatus('offline');
    } finally {
      setLoadingApi(false);
    }
  }, [onDataLoaded]);

  const loadFromFile = useCallback(async () => {
    setLoadingOffline(true);
    setLoadError(null);
    try {
      const res = await carregarOffline();
      setOrigin(res.origin);
      setLoadedCount(res.count);
      setServerStatus(res.status);
      onDataLoaded?.(res.products);
    } catch (err) {
      setLoadError(resolveError(err));
      setServerStatus('offline');
    } finally {
      setLoadingOffline(false);
    }
  }, [onDataLoaded]);

  const save = useCallback(
    async (format: PersistenceFormat) => {
      setSavingFormat(format);
      setSaveFeedback(null);
      try {
        const res = await salvarDataset(format, products);
        setSaveFeedback({
          format,
          success: res.success,
          message: res.message || 'Arquivo salvo com sucesso',
        });
      } catch (err) {
        setSaveFeedback({ format, success: false, message: resolveError(err) });
      } finally {
        setSavingFormat(null);
      }
    },
    [products]
  );

  const loadComparison = useCallback(async () => {
    setLoadingComparison(true);
    setComparisonError(null);
    try {
      const res = await compararFormatos();
      setComparison(res.rows);
    } catch (err) {
      setComparisonError(resolveError(err));
      setComparison(null);
    } finally {
      setLoadingComparison(false);
    }
  }, []);

  const inspect = useCallback(async (format: PersistenceFormat) => {
    setLoadingInspection(true);
    setInspectionError(null);
    try {
      const res = await inspecionarArquivo(format);
      setInspection(res);
    } catch (err) {
      setInspectionError(resolveError(err));
      setInspection(null);
    } finally {
      setLoadingInspection(false);
    }
  }, []);

  return {
    // carregamento
    origin,
    loadedCount,
    serverStatus,
    loadError,
    loadingApi,
    loadingOffline,
    loadFromApi,
    loadFromFile,
    // salvamento
    savingFormat,
    saveFeedback,
    save,
    // comparação
    comparison,
    comparisonError,
    loadingComparison,
    loadComparison,
    // inspeção
    inspection,
    inspectionError,
    loadingInspection,
    inspect,
  };
}

import { Product } from '@/algorithms/types';

/**
 * Serviço de Persistência
 * --------------------------------------------------------------
 * Centraliza TODAS as chamadas HTTP ao backend Python (Flask).
 * Nenhum componente deve chamar `fetch` diretamente — sempre via
 * estas funções. O backend ainda não existe; assume-se que os
 * endpoints existirão posteriormente.
 *
 * Base URL configurável por variável de ambiente pública.
 */

const BASE_URL =
  process.env.NEXT_PUBLIC_PERSISTENCE_API_URL?.replace(/\/$/, '') ||
  'http://localhost:5000';

export type PersistenceFormat = 'json' | 'csv' | 'pickle';

export type DataOrigin =
  | 'API Mercado Livre'
  | 'Arquivo JSON'
  | 'Arquivo CSV'
  | 'Arquivo Pickle'
  | 'Desconhecida';

export type ServerStatus = 'online' | 'offline';

export interface LoadDataResponse {
  products: Product[];
  origin: DataOrigin;
  count: number;
  status: ServerStatus;
}

export interface SaveResponse {
  success: boolean;
  message: string;
  format: PersistenceFormat;
}

export interface FormatComparisonRow {
  format: 'JSON' | 'CSV' | 'Pickle';
  sizeKb: number;
  saveMs: number;
  loadMs: number;
}

export interface CompareResponse {
  rows: FormatComparisonRow[];
}

export interface InspectResponse {
  format: PersistenceFormat;
  /** Conteúdo textual (JSON/CSV) ou hexdump (Pickle) pronto para exibição. */
  content: string;
  /** Indica se o conteúdo é binário (hexdump). */
  binary: boolean;
}

/**
 * Erro amigável padronizado para a camada de UI.
 * `kind` permite que a interface escolha a mensagem adequada (Seção 8).
 */
export type PersistenceErrorKind =
  | 'not_found'
  | 'empty'
  | 'save_failed'
  | 'load_failed'
  | 'server_unavailable';

export class PersistenceError extends Error {
  kind: PersistenceErrorKind;
  constructor(kind: PersistenceErrorKind, message: string) {
    super(message);
    this.name = 'PersistenceError';
    this.kind = kind;
  }
}

const FRIENDLY_MESSAGES: Record<PersistenceErrorKind, string> = {
  not_found: 'Nenhum arquivo salvo encontrado.',
  empty: 'O arquivo está vazio.',
  save_failed: 'Erro ao salvar arquivo.',
  load_failed: 'Não foi possível carregar os dados.',
  server_unavailable: 'Servidor indisponível.',
};

export function getFriendlyMessage(kind: PersistenceErrorKind): string {
  return FRIENDLY_MESSAGES[kind];
}

/** Executa o fetch e converte falhas de rede/HTTP em PersistenceError. */
async function request<T>(
  path: string,
  init?: RequestInit,
  defaultErrorKind: PersistenceErrorKind = 'load_failed'
): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      headers: { 'Content-Type': 'application/json' },
      ...init,
    });
  } catch {
    // Falha de rede => backend indisponível
    throw new PersistenceError('server_unavailable', FRIENDLY_MESSAGES.server_unavailable);
  }

  if (response.status === 404) {
    throw new PersistenceError('not_found', FRIENDLY_MESSAGES.not_found);
  }

  if (!response.ok) {
    throw new PersistenceError(defaultErrorKind, FRIENDLY_MESSAGES[defaultErrorKind]);
  }

  try {
    return (await response.json()) as T;
  } catch {
    throw new PersistenceError('empty', FRIENDLY_MESSAGES.empty);
  }
}

/** GET /carregar — carrega dados a partir da API (Mercado Livre via backend). */
export function carregarDaApi(): Promise<LoadDataResponse> {
  return request<LoadDataResponse>('/carregar', { method: 'GET' }, 'load_failed');
}

/** GET /offline — carrega dados diretamente dos arquivos salvos no disco. */
export function carregarOffline(): Promise<LoadDataResponse> {
  return request<LoadDataResponse>('/offline', { method: 'GET' }, 'not_found');
}

/** POST /salvar/{formato} — persiste o dataset atual no formato escolhido. */
export function salvarDataset(
  format: PersistenceFormat,
  products: Product[]
): Promise<SaveResponse> {
  return request<SaveResponse>(
    `/salvar/${format}`,
    { method: 'POST', body: JSON.stringify({ products }) },
    'save_failed'
  );
}

/** GET /comparar — métricas de tamanho e tempo por formato. */
export function compararFormatos(): Promise<CompareResponse> {
  return request<CompareResponse>('/comparar', { method: 'GET' }, 'load_failed');
}

/** GET /inspecionar?formato={formato} — trecho legível ou hexdump do arquivo. */
export function inspecionarArquivo(format: PersistenceFormat): Promise<InspectResponse> {
  return request<InspectResponse>(
    `/inspecionar?formato=${format}`,
    { method: 'GET' },
    'not_found'
  );
}

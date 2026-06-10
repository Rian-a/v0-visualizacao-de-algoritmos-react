import { Product, SortField } from './types';

// Campo de busca: reutiliza os campos de ordenação e adiciona 'title'
export type SearchField = SortField | 'title';

export type SearchAlgorithmName = 'linear' | 'binary';

export type SearchMode = 'exact' | 'partial';

export interface SearchStep {
  // Índice atualmente sendo analisado (-1 quando nenhum)
  currentIndex: number;
  // Índices onde o valor foi encontrado
  foundIndices: number[];
  // Índices descartados (usado na busca binária)
  discarded: number[];
  // Ponteiros da busca binária (-1 quando não se aplica)
  left: number;
  mid: number;
  right: number;
  // Narração didática do passo atual
  description: string;
  // Linha do pseudocódigo em destaque
  pseudocodeLine: number;
  // Total de comparações acumuladas até este passo
  comparisons: number;
}

export interface SearchResult {
  steps: SearchStep[];
  comparisons: number;
  foundIndices: number[];
}

export interface SearchInfo {
  name: string;
  description: string;
  howItWorks: string;
  whenToUse: string;
  advantages: string[];
  disadvantages: string[];
  bestCase: string;
  averageCase: string;
  worstCase: string;
  complexityExplanation: string;
  pseudocode: string[];
}

// Retorna o valor de um produto para o campo informado
export function getFieldValue(product: Product, field: SearchField): number | string {
  return product[field];
}

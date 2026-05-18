export interface Product {
  id: string;
  title: string;
  price: number;
  sold_quantity: number;
  available_quantity: number;
}

export interface SortStep {
  array: number[];
  comparing: number[];
  swapping: number[];
  sorted: number[];
  description: string;
  pseudocodeLine: number;
}

export interface SortResult {
  steps: SortStep[];
  comparisons: number;
  swaps: number;
}

export interface AlgorithmInfo {
  name: string;
  description: string;
  strategy: string;
  efficient: string;
  inefficient: string;
  dataStructure: string;
  bestCase: string;
  averageCase: string;
  worstCase: string;
  spaceComplexity: string;
  complexityExplanation: string;
  pseudocode: string[];
}

export type SortField = 'price' | 'sold_quantity' | 'available_quantity';

export type AlgorithmName = 'bubble' | 'selection' | 'insertion' | 'merge' | 'quick' | 'heap';

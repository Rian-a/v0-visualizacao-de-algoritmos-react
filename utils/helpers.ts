import { Product, SortField } from '@/algorithms/types';

export function extractValues(products: Product[], field: SortField): number[] {
  return products.map(product => product[field]);
}

export function normalizeValues(values: number[], maxHeight: number = 100): number[] {
  const max = Math.max(...values);
  const min = Math.min(...values);
  const range = max - min || 1;
  
  return values.map(value => ((value - min) / range) * (maxHeight - 10) + 10);
}

export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toFixed(num % 1 === 0 ? 0 : 2);
}

export function formatTime(ms: number): string {
  if (ms < 1000) {
    return `${ms}ms`;
  }
  return `${(ms / 1000).toFixed(2)}s`;
}

export function getFieldLabel(field: SortField): string {
  const labels: Record<SortField, string> = {
    price: 'Preço',
    sold_quantity: 'Vendidos',
    available_quantity: 'Disponíveis',
  };
  return labels[field];
}

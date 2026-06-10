import { Product } from '@/algorithms/types';
import { SearchField } from '@/algorithms/searchTypes';

export function getSearchFieldLabel(field: SearchField): string {
  const labels: Record<SearchField, string> = {
    title: 'Título',
    price: 'Preço',
    sold_quantity: 'Vendidos',
    available_quantity: 'Disponíveis',
  };
  return labels[field];
}

// Ordena uma cópia dos produtos pelo campo informado (crescente).
// Usado para preparar o dataset para a Busca Binária.
export function sortProductsByField(products: Product[], field: SearchField): Product[] {
  const copy = [...products];
  copy.sort((a, b) => {
    if (field === 'title') {
      return String(a.title).toLowerCase().localeCompare(String(b.title).toLowerCase());
    }
    return (a[field] as number) - (b[field] as number);
  });
  return copy;
}

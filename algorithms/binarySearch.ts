import { Product } from './types';
import { SearchField, SearchMode, SearchResult, SearchStep, SearchInfo } from './searchTypes';

/**
 * Verifica se o dataset está ordenado de forma crescente pelo campo informado.
 * Para campo 'title' usa ordem alfabética; para numéricos, ordem numérica.
 */
export function isSortedByField(products: Product[], field: SearchField): boolean {
  for (let i = 1; i < products.length; i++) {
    if (field === 'title') {
      if (String(products[i - 1].title).toLowerCase() > String(products[i].title).toLowerCase()) {
        return false;
      }
    } else {
      if (products[i - 1][field] > products[i][field]) {
        return false;
      }
    }
  }
  return true;
}

// Compara o valor do produto com o alvo. Retorna -1, 0 ou 1.
function compare(product: Product, field: SearchField, query: string): number {
  if (field === 'title') {
    const title = String(product.title).toLowerCase().trim();
    const q = query.toLowerCase().trim();
    if (title === q) return 0;
    return title < q ? -1 : 1;
  }
  const value = product[field];
  const numericQuery = parseFloat(query);
  if (value === numericQuery) return 0;
  return value < numericQuery ? -1 : 1;
}

/**
 * Busca Binária implementada manualmente.
 * Requer que o dataset esteja ordenado pelo campo selecionado.
 * Divide o intervalo de busca pela metade a cada passo.
 */
export function binarySearch(
  products: Product[],
  field: SearchField,
  query: string,
  _mode: SearchMode
): SearchResult {
  const steps: SearchStep[] = [];
  let comparisons = 0;
  const discarded: number[] = [];

  let left = 0;
  let right = products.length - 1;

  steps.push({
    currentIndex: -1,
    foundIndices: [],
    discarded: [],
    left,
    mid: -1,
    right,
    description: `Iniciando Busca Binária por "${query}". Intervalo válido: do índice ${left} ao ${right}.`,
    pseudocodeLine: 0,
    comparisons: 0,
  });

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    steps.push({
      currentIndex: mid,
      foundIndices: [],
      discarded: [...discarded],
      left,
      mid,
      right,
      description: `Calculando posição central: meio = (${left} + ${right}) / 2 = ${mid}. Valor do meio: "${products[mid].title}".`,
      pseudocodeLine: 2,
      comparisons,
    });

    comparisons++;
    const cmp = compare(products[mid], field, query);

    if (cmp === 0) {
      steps.push({
        currentIndex: mid,
        foundIndices: [mid],
        discarded: [...discarded],
        left,
        mid,
        right,
        description: `Valor encontrado no índice ${mid}: "${products[mid].title}".`,
        pseudocodeLine: 4,
        comparisons,
      });
      return { steps, comparisons, foundIndices: [mid] };
    }

    if (cmp < 0) {
      // Valor do meio é menor que o alvo: descartar metade esquerda
      for (let i = left; i <= mid; i++) discarded.push(i);
      const newLeft = mid + 1;

      steps.push({
        currentIndex: mid,
        foundIndices: [],
        discarded: [...discarded],
        left: newLeft,
        mid,
        right,
        description: `O valor procurado é maior que o centro. Descartando a metade esquerda (índices ${left} a ${mid}).`,
        pseudocodeLine: 6,
        comparisons,
      });

      left = newLeft;
    } else {
      // Valor do meio é maior que o alvo: descartar metade direita
      for (let i = mid; i <= right; i++) discarded.push(i);
      const newRight = mid - 1;

      steps.push({
        currentIndex: mid,
        foundIndices: [],
        discarded: [...discarded],
        left,
        mid,
        right: newRight,
        description: `O valor procurado é menor que o centro. Descartando a metade direita (índices ${mid} a ${right}).`,
        pseudocodeLine: 8,
        comparisons,
      });

      right = newRight;
    }
  }

  steps.push({
    currentIndex: -1,
    foundIndices: [],
    discarded: [...discarded],
    left: -1,
    mid: -1,
    right: -1,
    description: `Busca concluída. Nenhum resultado encontrado após ${comparisons} comparações.`,
    pseudocodeLine: 9,
    comparisons,
  });

  return { steps, comparisons, foundIndices: [] };
}

export const binarySearchInfo: SearchInfo = {
  name: 'Busca Binária',
  description:
    'A Busca Binária é um algoritmo eficiente que localiza um valor em uma lista ORDENADA dividindo repetidamente o intervalo de busca pela metade.',
  howItWorks:
    'Compara o alvo com o elemento central. Se for igual, encontrou. Se o alvo for maior, descarta a metade esquerda; se menor, descarta a metade direita. Repete o processo no intervalo restante até encontrar o valor ou esgotar o intervalo.',
  whenToUse:
    'Use quando os dados JÁ estão ordenados pelo campo de busca e a lista é grande. É muito mais rápida que a busca linear para grandes volumes.',
  advantages: [
    'Extremamente rápida: O(log n)',
    'Ideal para grandes volumes de dados',
    'Número de comparações cresce muito lentamente',
  ],
  disadvantages: [
    'Exige que os dados estejam ordenados',
    'Não funciona bem com busca parcial por substring',
    'Custo de manter os dados ordenados',
  ],
  bestCase: 'O(1)',
  averageCase: 'O(log n)',
  worstCase: 'O(log n)',
  complexityExplanation:
    'No melhor caso O(1), o elemento procurado já está no centro. No caso médio e pior caso O(log n), a cada passo metade dos elementos é descartada — por isso, mesmo em listas enormes, poucas comparações são necessárias (ex.: 1000 elementos exigem no máximo ~10 comparações).',
  pseudocode: [
    'função buscaBinaria(lista, alvo):',
    '  esquerda = 0, direita = tamanho - 1',
    '  enquanto esquerda <= direita:',
    '    meio = (esquerda + direita) / 2',
    '    se lista[meio] == alvo:',
    '      retornar meio  // encontrado',
    '    se lista[meio] < alvo:',
    '      esquerda = meio + 1  // descarta esquerda',
    '    senão:',
    '      direita = meio - 1  // descarta direita',
    '  retornar -1  // não encontrado',
  ],
};

import { Product } from './types';
import { SearchField, SearchMode, SearchResult, SearchStep, SearchInfo } from './searchTypes';

// Normaliza um valor para comparação textual (case-insensitive)
function normalizeText(value: string | number): string {
  return String(value).toLowerCase().trim();
}

// Verifica se o item no índice corresponde ao valor procurado
function matches(
  product: Product,
  field: SearchField,
  query: string,
  mode: SearchMode
): boolean {
  if (field === 'title') {
    const title = normalizeText(product.title);
    const q = normalizeText(query);
    return mode === 'exact' ? title === q : title.includes(q);
  }
  // Campos numéricos: comparação exata sempre
  const fieldValue = product[field];
  const numericQuery = parseFloat(query);
  if (isNaN(numericQuery)) return false;
  return fieldValue === numericQuery;
}

/**
 * Busca Linear implementada manualmente.
 * Percorre o array do início ao fim comparando cada elemento.
 * No modo parcial, continua até o fim coletando todas as correspondências.
 * No modo exato, para na primeira correspondência.
 */
export function linearSearch(
  products: Product[],
  field: SearchField,
  query: string,
  mode: SearchMode
): SearchResult {
  const steps: SearchStep[] = [];
  const foundIndices: number[] = [];
  let comparisons = 0;

  // Passo inicial
  steps.push({
    currentIndex: -1,
    foundIndices: [],
    discarded: [],
    left: -1,
    mid: -1,
    right: -1,
    description: `Iniciando Busca Linear por "${query}". O algoritmo verificará cada elemento, um a um, desde o início.`,
    pseudocodeLine: 0,
    comparisons: 0,
  });

  for (let i = 0; i < products.length; i++) {
    comparisons++;

    // Passo: analisando o índice atual
    steps.push({
      currentIndex: i,
      foundIndices: [...foundIndices],
      discarded: [],
      left: -1,
      mid: -1,
      right: -1,
      description: `Comparando item do índice ${i}: "${products[i].title}".`,
      pseudocodeLine: 2,
      comparisons,
    });

    if (matches(products[i], field, query, mode)) {
      foundIndices.push(i);

      steps.push({
        currentIndex: i,
        foundIndices: [...foundIndices],
        discarded: [],
        left: -1,
        mid: -1,
        right: -1,
        description: `Valor encontrado no índice ${i}: "${products[i].title}".`,
        pseudocodeLine: 3,
        comparisons,
      });

      // No modo exato, para na primeira correspondência
      if (mode === 'exact') {
        steps.push({
          currentIndex: -1,
          foundIndices: [...foundIndices],
          discarded: [],
          left: -1,
          mid: -1,
          right: -1,
          description: `Busca concluída. ${foundIndices.length} resultado(s) encontrado(s) após ${comparisons} comparações.`,
          pseudocodeLine: 4,
          comparisons,
        });
        return { steps, comparisons, foundIndices };
      }
    }
  }

  // Passo final
  steps.push({
    currentIndex: -1,
    foundIndices: [...foundIndices],
    discarded: [],
    left: -1,
    mid: -1,
    right: -1,
    description:
      foundIndices.length > 0
        ? `Busca concluída. ${foundIndices.length} resultado(s) encontrado(s) após ${comparisons} comparações.`
        : `Busca concluída. Nenhum resultado encontrado após ${comparisons} comparações.`,
    pseudocodeLine: 6,
    comparisons,
  });

  return { steps, comparisons, foundIndices };
}

export const linearSearchInfo: SearchInfo = {
  name: 'Busca Linear',
  description:
    'A Busca Linear (ou sequencial) é o método mais simples de busca: percorre a lista elemento por elemento, do início ao fim, comparando cada item com o valor procurado.',
  howItWorks:
    'Começa no primeiro elemento e avança um a um. Em cada posição, compara o elemento com o valor buscado. Se forem iguais, registra a posição. No modo exato, para ao encontrar; no modo parcial, percorre tudo coletando todas as correspondências.',
  whenToUse:
    'Ideal quando os dados NÃO estão ordenados, quando a lista é pequena, ou quando você precisa encontrar todas as ocorrências de um valor (busca parcial por texto).',
  advantages: [
    'Funciona em qualquer lista, ordenada ou não',
    'Implementação extremamente simples',
    'Não exige pré-processamento dos dados',
    'Permite busca parcial por substring',
  ],
  disadvantages: [
    'Lenta para listas muito grandes',
    'No pior caso, precisa verificar todos os elementos',
    'Não aproveita ordenação dos dados',
  ],
  bestCase: 'O(1)',
  averageCase: 'O(n)',
  worstCase: 'O(n)',
  complexityExplanation:
    'No melhor caso O(1), o elemento procurado é o primeiro da lista. No caso médio e pior caso O(n), pode ser necessário percorrer todos os n elementos — o tempo cresce linearmente com o tamanho da lista.',
  pseudocode: [
    'função buscaLinear(lista, alvo):',
    '  para i de 0 até tamanho(lista) - 1:',
    '    se lista[i] == alvo:',
    '      retornar i  // encontrado',
    '      // (modo exato para aqui)',
    '  fim para',
    '  retornar -1  // não encontrado',
  ],
};

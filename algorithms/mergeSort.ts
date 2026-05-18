import { SortResult, SortStep, AlgorithmInfo } from './types';

export const mergeSortInfo: AlgorithmInfo = {
  name: 'Merge Sort',
  description: 'Algoritmo divide-and-conquer que divide o array em metades, ordena recursivamente e depois mescla.',
  strategy: 'Divide o problema em subproblemas menores, resolve cada um e combina as soluções.',
  efficient: 'Listas grandes, dados em disco, quando estabilidade é necessária.',
  inefficient: 'Quando memória é limitada (requer espaço auxiliar O(n)).',
  dataStructure: 'Array principal + Arrays auxiliares para merge',
  bestCase: 'O(n log n)',
  averageCase: 'O(n log n)',
  worstCase: 'O(n log n)',
  spaceComplexity: 'O(n)',
  complexityExplanation: 'Sempre divide o array em log n níveis e faz n comparações em cada nível de merge. Garante O(n log n) em todos os casos, mas precisa de espaço auxiliar O(n).',
  pseudocode: [
    'mergeSort(arr, esq, dir):',
    '  se esq < dir:',
    '    meio = (esq + dir) / 2',
    '    mergeSort(arr, esq, meio)',
    '    mergeSort(arr, meio+1, dir)',
    '    merge(arr, esq, meio, dir)',
    '',
    'merge(arr, esq, meio, dir):',
    '  criar arrays auxiliares L e R',
    '  copiar elementos para L e R',
    '  mesclar L e R de volta em arr'
  ]
};

export function mergeSort(arr: number[]): SortResult {
  const array = [...arr];
  const steps: SortStep[] = [];
  let comparisons = 0;
  let swaps = 0;
  const n = array.length;

  steps.push({
    array: [...array],
    comparing: [],
    swapping: [],
    sorted: [],
    description: 'Iniciando Merge Sort',
    pseudocodeLine: 0
  });

  function merge(left: number, mid: number, right: number) {
    const leftArr = array.slice(left, mid + 1);
    const rightArr = array.slice(mid + 1, right + 1);

    steps.push({
      array: [...array],
      comparing: Array.from({ length: right - left + 1 }, (_, i) => left + i),
      swapping: [],
      sorted: [],
      description: `Mesclando subarrays [${left}..${mid}] e [${mid + 1}..${right}]`,
      pseudocodeLine: 7
    });

    let i = 0, j = 0, k = left;

    while (i < leftArr.length && j < rightArr.length) {
      comparisons++;

      steps.push({
        array: [...array],
        comparing: [left + i, mid + 1 + j],
        swapping: [],
        sorted: [],
        description: `Comparando ${leftArr[i]} e ${rightArr[j]}`,
        pseudocodeLine: 10
      });

      if (leftArr[i] <= rightArr[j]) {
        array[k] = leftArr[i];
        i++;
      } else {
        array[k] = rightArr[j];
        j++;
      }
      swaps++;
      k++;

      steps.push({
        array: [...array],
        comparing: [],
        swapping: [k - 1],
        sorted: [],
        description: `Colocando ${array[k - 1]} na posição ${k - 1}`,
        pseudocodeLine: 10
      });
    }

    while (i < leftArr.length) {
      array[k] = leftArr[i];
      swaps++;

      steps.push({
        array: [...array],
        comparing: [],
        swapping: [k],
        sorted: [],
        description: `Copiando elemento restante ${leftArr[i]} para posição ${k}`,
        pseudocodeLine: 10
      });

      i++;
      k++;
    }

    while (j < rightArr.length) {
      array[k] = rightArr[j];
      swaps++;

      steps.push({
        array: [...array],
        comparing: [],
        swapping: [k],
        sorted: [],
        description: `Copiando elemento restante ${rightArr[j]} para posição ${k}`,
        pseudocodeLine: 10
      });

      j++;
      k++;
    }
  }

  function mergeSortRecursive(left: number, right: number) {
    if (left < right) {
      const mid = Math.floor((left + right) / 2);

      steps.push({
        array: [...array],
        comparing: Array.from({ length: right - left + 1 }, (_, i) => left + i),
        swapping: [],
        sorted: [],
        description: `Dividindo array [${left}..${right}] no meio (${mid})`,
        pseudocodeLine: 2
      });

      mergeSortRecursive(left, mid);
      mergeSortRecursive(mid + 1, right);
      merge(left, mid, right);
    }
  }

  mergeSortRecursive(0, n - 1);

  steps.push({
    array: [...array],
    comparing: [],
    swapping: [],
    sorted: Array.from({ length: n }, (_, i) => i),
    description: 'Ordenação concluída!',
    pseudocodeLine: 10
  });

  return { steps, comparisons, swaps };
}

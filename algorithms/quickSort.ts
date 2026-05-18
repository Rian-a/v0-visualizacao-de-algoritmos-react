import { SortResult, SortStep, AlgorithmInfo } from './types';

export const quickSortInfo: AlgorithmInfo = {
  name: 'Quick Sort',
  description: 'Algoritmo divide-and-conquer que escolhe um pivô e particiona o array em elementos menores e maiores.',
  strategy: 'Escolhe um pivô, coloca elementos menores à esquerda e maiores à direita, depois ordena recursivamente.',
  efficient: 'Listas grandes com boa distribuição. É o algoritmo mais rápido na prática para a maioria dos casos.',
  inefficient: 'Listas já ordenadas ou com muitos elementos iguais (sem otimização).',
  dataStructure: 'Array único (in-place) + pilha de recursão',
  bestCase: 'O(n log n)',
  averageCase: 'O(n log n)',
  worstCase: 'O(n²)',
  spaceComplexity: 'O(log n)',
  complexityExplanation: 'Quando o pivô divide o array uniformemente, temos log n níveis com n comparações cada. No pior caso (pivô sempre no extremo), temos n níveis, resultando em O(n²).',
  pseudocode: [
    'quickSort(arr, baixo, alto):',
    '  se baixo < alto:',
    '    pivo = particionar(arr, baixo, alto)',
    '    quickSort(arr, baixo, pivo-1)',
    '    quickSort(arr, pivo+1, alto)',
    '',
    'particionar(arr, baixo, alto):',
    '  pivo = arr[alto]',
    '  i = baixo - 1',
    '  para j de baixo até alto-1:',
    '    se arr[j] < pivo:',
    '      i++; trocar(arr[i], arr[j])',
    '  trocar(arr[i+1], arr[alto])',
    '  retornar i+1'
  ]
};

export function quickSort(arr: number[]): SortResult {
  const array = [...arr];
  const steps: SortStep[] = [];
  let comparisons = 0;
  let swaps = 0;
  const n = array.length;
  const sorted: number[] = [];

  steps.push({
    array: [...array],
    comparing: [],
    swapping: [],
    sorted: [],
    description: 'Iniciando Quick Sort',
    pseudocodeLine: 0
  });

  function partition(low: number, high: number): number {
    const pivot = array[high];

    steps.push({
      array: [...array],
      comparing: [high],
      swapping: [],
      sorted: [...sorted],
      description: `Particionando [${low}..${high}] com pivô ${pivot} (índice ${high})`,
      pseudocodeLine: 7
    });

    let i = low - 1;

    for (let j = low; j < high; j++) {
      comparisons++;

      steps.push({
        array: [...array],
        comparing: [j, high],
        swapping: [],
        sorted: [...sorted],
        description: `Comparando ${array[j]} com pivô ${pivot}`,
        pseudocodeLine: 10
      });

      if (array[j] < pivot) {
        i++;
        if (i !== j) {
          const temp = array[i];
          array[i] = array[j];
          array[j] = temp;
          swaps++;

          steps.push({
            array: [...array],
            comparing: [],
            swapping: [i, j],
            sorted: [...sorted],
            description: `Trocando ${array[j]} ↔ ${array[i]}`,
            pseudocodeLine: 11
          });
        }
      }
    }

    const temp = array[i + 1];
    array[i + 1] = array[high];
    array[high] = temp;
    if (i + 1 !== high) {
      swaps++;

      steps.push({
        array: [...array],
        comparing: [],
        swapping: [i + 1, high],
        sorted: [...sorted],
        description: `Colocando pivô ${array[i + 1]} na posição correta ${i + 1}`,
        pseudocodeLine: 12
      });
    }

    sorted.push(i + 1);

    return i + 1;
  }

  function quickSortRecursive(low: number, high: number) {
    if (low < high) {
      steps.push({
        array: [...array],
        comparing: Array.from({ length: high - low + 1 }, (_, i) => low + i),
        swapping: [],
        sorted: [...sorted],
        description: `Ordenando subarray [${low}..${high}]`,
        pseudocodeLine: 1
      });

      const pi = partition(low, high);
      quickSortRecursive(low, pi - 1);
      quickSortRecursive(pi + 1, high);
    } else if (low === high) {
      sorted.push(low);
    }
  }

  quickSortRecursive(0, n - 1);

  steps.push({
    array: [...array],
    comparing: [],
    swapping: [],
    sorted: Array.from({ length: n }, (_, i) => i),
    description: 'Ordenação concluída!',
    pseudocodeLine: 13
  });

  return { steps, comparisons, swaps };
}

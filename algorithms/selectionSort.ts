import { SortResult, SortStep, AlgorithmInfo } from './types';

export const selectionSortInfo: AlgorithmInfo = {
  name: 'Selection Sort',
  description: 'Encontra o menor elemento da parte não ordenada e o coloca na posição correta.',
  strategy: 'Seleciona o menor elemento repetidamente e o move para a posição ordenada.',
  efficient: 'Listas pequenas ou quando a troca de elementos é custosa.',
  inefficient: 'Listas grandes, pois sempre faz O(n²) comparações.',
  dataStructure: 'Array único (in-place)',
  bestCase: 'O(n²)',
  averageCase: 'O(n²)',
  worstCase: 'O(n²)',
  spaceComplexity: 'O(1)',
  complexityExplanation: 'Sempre faz n(n-1)/2 comparações independente da ordenação inicial, resultando em O(n²). O número de trocas é O(n), sendo vantajoso quando trocas são custosas.',
  pseudocode: [
    'para i de 0 até n-1:',
    '  minIdx = i',
    '  para j de i+1 até n:',
    '    se arr[j] < arr[minIdx]:',
    '      minIdx = j',
    '  trocar(arr[i], arr[minIdx])',
    'fim para'
  ]
};

export function selectionSort(arr: number[]): SortResult {
  const array = [...arr];
  const steps: SortStep[] = [];
  let comparisons = 0;
  let swaps = 0;
  const sorted: number[] = [];
  const n = array.length;

  steps.push({
    array: [...array],
    comparing: [],
    swapping: [],
    sorted: [],
    description: 'Iniciando Selection Sort',
    pseudocodeLine: 0
  });

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;

    steps.push({
      array: [...array],
      comparing: [i],
      swapping: [],
      sorted: [...sorted],
      description: `Buscando menor elemento a partir do índice ${i}`,
      pseudocodeLine: 1
    });

    for (let j = i + 1; j < n; j++) {
      comparisons++;

      steps.push({
        array: [...array],
        comparing: [minIdx, j],
        swapping: [],
        sorted: [...sorted],
        description: `Comparando ${array[minIdx]} (mínimo atual) com ${array[j]}`,
        pseudocodeLine: 3
      });

      if (array[j] < array[minIdx]) {
        minIdx = j;

        steps.push({
          array: [...array],
          comparing: [minIdx],
          swapping: [],
          sorted: [...sorted],
          description: `Novo mínimo encontrado: ${array[minIdx]} no índice ${minIdx}`,
          pseudocodeLine: 4
        });
      }
    }

    if (minIdx !== i) {
      const temp = array[i];
      array[i] = array[minIdx];
      array[minIdx] = temp;
      swaps++;

      steps.push({
        array: [...array],
        comparing: [],
        swapping: [i, minIdx],
        sorted: [...sorted],
        description: `Trocando ${array[minIdx]} ↔ ${array[i]}`,
        pseudocodeLine: 5
      });
    }

    sorted.push(i);
  }

  sorted.push(n - 1);

  steps.push({
    array: [...array],
    comparing: [],
    swapping: [],
    sorted: Array.from({ length: n }, (_, i) => i),
    description: 'Ordenação concluída!',
    pseudocodeLine: 6
  });

  return { steps, comparisons, swaps };
}

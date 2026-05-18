import { SortResult, SortStep, AlgorithmInfo } from './types';

export const bubbleSortInfo: AlgorithmInfo = {
  name: 'Bubble Sort',
  description: 'Algoritmo simples que percorre repetidamente a lista, compara elementos adjacentes e os troca se estiverem na ordem errada.',
  strategy: 'Comparação e troca de elementos adjacentes, "borbulhando" os maiores elementos para o final.',
  efficient: 'Listas pequenas ou quase ordenadas.',
  inefficient: 'Listas grandes e desordenadas.',
  dataStructure: 'Array único (in-place)',
  bestCase: 'O(n)',
  averageCase: 'O(n²)',
  worstCase: 'O(n²)',
  spaceComplexity: 'O(1)',
  complexityExplanation: 'No melhor caso (já ordenado), faz apenas n-1 comparações. Nos casos médio e pior, precisa de n² comparações pois compara cada par de elementos adjacentes múltiplas vezes.',
  pseudocode: [
    'para i de 0 até n-1:',
    '  para j de 0 até n-i-1:',
    '    se arr[j] > arr[j+1]:',
    '      trocar(arr[j], arr[j+1])',
    '  fim para',
    'fim para'
  ]
};

export function bubbleSort(arr: number[]): SortResult {
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
    description: 'Iniciando Bubble Sort',
    pseudocodeLine: 0
  });

  for (let i = 0; i < n - 1; i++) {
    let swapped = false;
    
    for (let j = 0; j < n - i - 1; j++) {
      comparisons++;
      
      steps.push({
        array: [...array],
        comparing: [j, j + 1],
        swapping: [],
        sorted: [...sorted],
        description: `Comparando índices ${j} e ${j + 1}: ${array[j]} vs ${array[j + 1]}`,
        pseudocodeLine: 2
      });

      if (array[j] > array[j + 1]) {
        // Troca
        const temp = array[j];
        array[j] = array[j + 1];
        array[j + 1] = temp;
        swaps++;
        swapped = true;

        steps.push({
          array: [...array],
          comparing: [],
          swapping: [j, j + 1],
          sorted: [...sorted],
          description: `Trocando valores: ${array[j + 1]} ↔ ${array[j]}`,
          pseudocodeLine: 3
        });
      }
    }

    sorted.unshift(n - 1 - i);

    if (!swapped) {
      // Array já está ordenado
      for (let k = 0; k < n - i - 1; k++) {
        if (!sorted.includes(k)) {
          sorted.push(k);
        }
      }
      break;
    }
  }

  // Adicionar todos os índices restantes como ordenados
  for (let i = 0; i < n; i++) {
    if (!sorted.includes(i)) {
      sorted.push(i);
    }
  }

  steps.push({
    array: [...array],
    comparing: [],
    swapping: [],
    sorted: Array.from({ length: n }, (_, i) => i),
    description: 'Ordenação concluída!',
    pseudocodeLine: 5
  });

  return { steps, comparisons, swaps };
}

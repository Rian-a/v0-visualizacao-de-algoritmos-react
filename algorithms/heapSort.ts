import { SortResult, SortStep, AlgorithmInfo } from './types';

export const heapSortInfo: AlgorithmInfo = {
  name: 'Heap Sort',
  description: 'Utiliza uma estrutura de dados heap binário para ordenar elementos de forma eficiente.',
  strategy: 'Constrói um max-heap e repetidamente extrai o elemento máximo para o final do array.',
  efficient: 'Quando se precisa de garantia O(n log n) sem usar memória extra significativa.',
  inefficient: 'Menos eficiente na prática que Quick Sort devido a mais trocas e pior localidade de cache.',
  dataStructure: 'Heap binário representado como array',
  bestCase: 'O(n log n)',
  averageCase: 'O(n log n)',
  worstCase: 'O(n log n)',
  spaceComplexity: 'O(1)',
  complexityExplanation: 'A construção do heap leva O(n) e a extração de n elementos com heapify leva O(n log n). O heap é implementado in-place, usando O(1) espaço extra.',
  pseudocode: [
    'heapSort(arr):',
    '  construirMaxHeap(arr)',
    '  para i de n-1 até 1:',
    '    trocar(arr[0], arr[i])',
    '    heapify(arr, i, 0)',
    '',
    'heapify(arr, n, i):',
    '  maior = i',
    '  esq = 2*i + 1',
    '  dir = 2*i + 2',
    '  se esq < n e arr[esq] > arr[maior]:',
    '    maior = esq',
    '  se dir < n e arr[dir] > arr[maior]:',
    '    maior = dir',
    '  se maior != i:',
    '    trocar(arr[i], arr[maior])',
    '    heapify(arr, n, maior)'
  ]
};

export interface HeapStep extends SortStep {
  heapSize: number;
  heapifying: number[];
}

export function heapSort(arr: number[]): SortResult & { heapSteps: HeapStep[] } {
  const array = [...arr];
  const steps: SortStep[] = [];
  const heapSteps: HeapStep[] = [];
  let comparisons = 0;
  let swaps = 0;
  const n = array.length;
  const sorted: number[] = [];

  function addStep(
    comparing: number[],
    swapping: number[],
    description: string,
    pseudocodeLine: number,
    heapSize: number,
    heapifying: number[] = []
  ) {
    const step: HeapStep = {
      array: [...array],
      comparing,
      swapping,
      sorted: [...sorted],
      description,
      pseudocodeLine,
      heapSize,
      heapifying
    };
    steps.push(step);
    heapSteps.push(step);
  }

  addStep([], [], 'Iniciando Heap Sort', 0, n);

  function heapify(size: number, i: number) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    addStep(
      [i],
      [],
      `Heapificando subárvore com raiz no índice ${i}`,
      6,
      size,
      [i, left < size ? left : -1, right < size ? right : -1].filter(x => x >= 0)
    );

    if (left < size) {
      comparisons++;
      addStep(
        [largest, left],
        [],
        `Comparando pai ${array[largest]} com filho esquerdo ${array[left]}`,
        10,
        size,
        [i, left, right < size ? right : -1].filter(x => x >= 0)
      );

      if (array[left] > array[largest]) {
        largest = left;
      }
    }

    if (right < size) {
      comparisons++;
      addStep(
        [largest, right],
        [],
        `Comparando ${array[largest]} com filho direito ${array[right]}`,
        12,
        size,
        [i, left, right].filter(x => x >= 0)
      );

      if (array[right] > array[largest]) {
        largest = right;
      }
    }

    if (largest !== i) {
      const temp = array[i];
      array[i] = array[largest];
      array[largest] = temp;
      swaps++;

      addStep(
        [],
        [i, largest],
        `Trocando ${array[largest]} ↔ ${array[i]}`,
        15,
        size,
        [i, largest]
      );

      heapify(size, largest);
    }
  }

  // Construir max-heap
  addStep([], [], 'Construindo Max-Heap', 1, n);

  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
    heapify(n, i);
  }

  addStep([], [], 'Max-Heap construído', 1, n);

  // Extrair elementos do heap
  for (let i = n - 1; i > 0; i--) {
    // Trocar raiz com último elemento
    const temp = array[0];
    array[0] = array[i];
    array[i] = temp;
    swaps++;

    sorted.unshift(i);

    addStep(
      [],
      [0, i],
      `Movendo máximo ${array[i]} para posição final ${i}`,
      3,
      i,
      []
    );

    heapify(i, 0);
  }

  sorted.unshift(0);

  addStep(
    [],
    [],
    'Ordenação concluída!',
    4,
    0
  );

  // Atualizar o último step com todos ordenados
  steps[steps.length - 1].sorted = Array.from({ length: n }, (_, i) => i);
  heapSteps[heapSteps.length - 1].sorted = Array.from({ length: n }, (_, i) => i);

  return { steps, comparisons, swaps, heapSteps };
}

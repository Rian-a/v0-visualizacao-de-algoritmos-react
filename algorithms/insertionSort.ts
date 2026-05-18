import { SortResult, SortStep, AlgorithmInfo } from './types';

export const insertionSortInfo: AlgorithmInfo = {
  name: 'Insertion Sort',
  description: 'Constrói a lista ordenada um elemento por vez, inserindo cada novo elemento na posição correta.',
  strategy: 'Pega cada elemento e o insere na posição correta dentro da parte já ordenada.',
  efficient: 'Listas pequenas ou quase ordenadas. Excelente para inserções em tempo real.',
  inefficient: 'Listas grandes e desordenadas.',
  dataStructure: 'Array único (in-place)',
  bestCase: 'O(n)',
  averageCase: 'O(n²)',
  worstCase: 'O(n²)',
  spaceComplexity: 'O(1)',
  complexityExplanation: 'No melhor caso (já ordenado), cada elemento é comparado apenas uma vez. No pior caso (ordem inversa), cada elemento precisa ser comparado com todos os anteriores.',
  pseudocode: [
    'para i de 1 até n:',
    '  chave = arr[i]',
    '  j = i - 1',
    '  enquanto j >= 0 e arr[j] > chave:',
    '    arr[j+1] = arr[j]',
    '    j = j - 1',
    '  arr[j+1] = chave',
    'fim para'
  ]
};

export function insertionSort(arr: number[]): SortResult {
  const array = [...arr];
  const steps: SortStep[] = [];
  let comparisons = 0;
  let swaps = 0;
  const sorted: number[] = [0];
  const n = array.length;

  steps.push({
    array: [...array],
    comparing: [],
    swapping: [],
    sorted: [0],
    description: 'Iniciando Insertion Sort - primeiro elemento já está ordenado',
    pseudocodeLine: 0
  });

  for (let i = 1; i < n; i++) {
    const key = array[i];
    let j = i - 1;

    steps.push({
      array: [...array],
      comparing: [i],
      swapping: [],
      sorted: [...sorted],
      description: `Inserindo elemento ${key} (índice ${i}) na posição correta`,
      pseudocodeLine: 1
    });

    while (j >= 0) {
      comparisons++;

      steps.push({
        array: [...array],
        comparing: [j, j + 1],
        swapping: [],
        sorted: [...sorted],
        description: `Comparando ${array[j]} com chave ${key}`,
        pseudocodeLine: 3
      });

      if (array[j] > key) {
        array[j + 1] = array[j];
        swaps++;

        steps.push({
          array: [...array],
          comparing: [],
          swapping: [j, j + 1],
          sorted: [...sorted],
          description: `Movendo ${array[j + 1]} para a direita`,
          pseudocodeLine: 4
        });

        j--;
      } else {
        break;
      }
    }

    array[j + 1] = key;

    if (j + 1 !== i) {
      steps.push({
        array: [...array],
        comparing: [],
        swapping: [j + 1],
        sorted: [...sorted],
        description: `Inserindo ${key} na posição ${j + 1}`,
        pseudocodeLine: 6
      });
    }

    sorted.push(i);
    // Atualizar sorted para refletir a ordem real
    sorted.sort((a, b) => a - b);
  }

  steps.push({
    array: [...array],
    comparing: [],
    swapping: [],
    sorted: Array.from({ length: n }, (_, i) => i),
    description: 'Ordenação concluída!',
    pseudocodeLine: 7
  });

  return { steps, comparisons, swaps };
}

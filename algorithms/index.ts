export * from './types';
export { bubbleSort, bubbleSortInfo } from './bubbleSort';
export { selectionSort, selectionSortInfo } from './selectionSort';
export { insertionSort, insertionSortInfo } from './insertionSort';
export { mergeSort, mergeSortInfo } from './mergeSort';
export { quickSort, quickSortInfo } from './quickSort';
export { heapSort, heapSortInfo } from './heapSort';

import { bubbleSort, bubbleSortInfo } from './bubbleSort';
import { selectionSort, selectionSortInfo } from './selectionSort';
import { insertionSort, insertionSortInfo } from './insertionSort';
import { mergeSort, mergeSortInfo } from './mergeSort';
import { quickSort, quickSortInfo } from './quickSort';
import { heapSort, heapSortInfo } from './heapSort';
import { AlgorithmName, AlgorithmInfo, SortResult } from './types';

export const algorithms: Record<AlgorithmName, (arr: number[]) => SortResult> = {
  bubble: bubbleSort,
  selection: selectionSort,
  insertion: insertionSort,
  merge: mergeSort,
  quick: quickSort,
  heap: heapSort,
};

export const algorithmInfos: Record<AlgorithmName, AlgorithmInfo> = {
  bubble: bubbleSortInfo,
  selection: selectionSortInfo,
  insertion: insertionSortInfo,
  merge: mergeSortInfo,
  quick: quickSortInfo,
  heap: heapSortInfo,
};

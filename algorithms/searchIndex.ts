export * from './searchTypes';
export { linearSearch, linearSearchInfo } from './linearSearch';
export { binarySearch, binarySearchInfo, isSortedByField } from './binarySearch';

import { linearSearch, linearSearchInfo } from './linearSearch';
import { binarySearch, binarySearchInfo } from './binarySearch';
import { Product } from './types';
import {
  SearchAlgorithmName,
  SearchField,
  SearchMode,
  SearchResult,
  SearchInfo,
} from './searchTypes';

export const searchAlgorithms: Record<
  SearchAlgorithmName,
  (products: Product[], field: SearchField, query: string, mode: SearchMode) => SearchResult
> = {
  linear: linearSearch,
  binary: binarySearch,
};

export const searchInfos: Record<SearchAlgorithmName, SearchInfo> = {
  linear: linearSearchInfo,
  binary: binarySearchInfo,
};

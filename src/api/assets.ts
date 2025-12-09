import { apiGet } from './client';
import type { Asset } from '../types/asset';

export const getAssets = (): Promise<Asset[]> =>
  apiGet<Asset[]>('/mock-data/assets.json');
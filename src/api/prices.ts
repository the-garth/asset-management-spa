
import { apiGet } from './client';
import type { Price } from '../types/price';
import type { TimeSeriesPricePoint } from '../types/portfolioView';

// Current snapshot prices for positions table / donut chart
export const getCurrentPrices = (): Promise<Price[]> =>
  apiGet<Price[]>('/mock-data/prices-current.json');

// Historical time-series for portfolio value chart
export const getHistoricalPrices = (): Promise<TimeSeriesPricePoint[]> =>
  apiGet<TimeSeriesPricePoint[]>('/mock-data/prices-history.json');
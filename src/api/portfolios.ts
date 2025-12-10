import { apiGet } from './client';
import type { Portfolio } from '../types/portfolio';

export const getPortfolio = (): Promise<Portfolio> =>
  apiGet<Portfolio>('/mockdata/portfolio.json');
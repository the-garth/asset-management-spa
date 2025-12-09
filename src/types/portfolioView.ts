import type { AssetType } from './asset';

export interface EnrichedPosition {
  positionId: number;
  assetId: string;
  assetName: string;
  assetType: AssetType;
  quantity: number;
  price: number;
  value: number;
  allocationPct: number; // 0..1
}

export interface AllocationItem {
  key: string;        // asset id or asset type
  label: string;      // "AAPL" or "Stocks"
  value: number;      // value in USD
  allocationPct: number; // 0..1
}

export interface PortfolioOverview {
  asOf: string;
  totalValue: number;
  positions: EnrichedPosition[];
  allocationByAsset: AllocationItem[];
  allocationByClass: AllocationItem[];
}

export interface PortfolioValuePoint {
  date: string;   // ISO date (no time) or datetime
  value: number;  // total portfolio value in USD
}

// If you model prices as time-series per asset:
export interface TimeSeriesPricePoint {
  date: string;
  asset: string;  // asset id
  price: number;
}
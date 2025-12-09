
export type AssetType = 'stock' | 'crypto' | 'fiat';

export interface Asset {
  id: string;        // uuid
  name: string;      // e.g. "AAPL", "BTC", "GBP"
  type: AssetType;  
}
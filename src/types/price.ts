export interface Price {
  id: string;
  asset: string;     // asset id (matches Asset.id)
  price: number;    
  asOf: string;      // ISO datetime string
}
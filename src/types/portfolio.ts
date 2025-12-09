export interface Position {
  id: number;        // position id
  asset: string;     // asset id (matches Asset.id)
  quantity: number;
  asOf: string;      // ISO datetime string
}

export interface Portfolio {
  id: string;
  asOf: string;      // ISO datetime string
  positions: Position[];
}
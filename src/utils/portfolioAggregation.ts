/**
 * NOTE: GenAI-assisted code
 *
 * Portions of the aggregation helpers in this file were generated with a
 * generative-AI assistant and then reviewed and modified by the author.
 * - Generated on: 2025-12-09
 * - Generated sections (example): buildEnrichedPositions, computePortfolioValueSeries
 * - Manual edits: added strong TypeScript types, edge-case guards (missing prices/assets),
 *   allocation calculation, and sorting behavior; added unit tests.
 *
 * I (author) take full responsibility for the correctness, tests and any production use.
 * Tests: see src/utils/portfolioAggregation.spec.ts
 *
 * Rationale: GenAI used to accelerate initial implementation — all logic was inspected
 * and adjusted to match project conventions and typing requirements.
 */
 
import type { Asset } from '../types/asset';
import type { Portfolio, Position } from '../types/portfolio';
import type { Price } from '../types/price';
import type {
  AllocationItem,
  EnrichedPosition,
  PortfolioOverview,
  PortfolioValuePoint,
  TimeSeriesPricePoint,
} from '../types/portfolioView';

/**
 * Build a map: assetId -> Asset
 */
function indexAssetsById(assets: Asset[]): Record<string, Asset> {
  return assets.reduce<Record<string, Asset>>((acc, asset) => {
    acc[asset.id] = asset;
    return acc;
  }, {});
}

/**
 * Build a map: assetId -> Price (latest or asOf price)
 */
function indexPricesByAsset(prices: Price[]): Record<string, Price> {
  return prices.reduce<Record<string, Price>>((acc, price) => {
    acc[price.asset] = price;
    return acc;
  }, {});
}

/**
 * Create enriched positions with asset + price info and value.
 */
export function buildEnrichedPositions(
  portfolio: Portfolio,
  assets: Asset[],
  prices: Price[],
): { positions: EnrichedPosition[]; totalValue: number } {
  const assetIndex = indexAssetsById(assets);
  const priceIndex = indexPricesByAsset(prices);

  const enriched: EnrichedPosition[] = [];

  let totalValue = 0;

  for (const pos of portfolio.positions) {
    const asset = assetIndex[pos.asset];
    const price = priceIndex[pos.asset];

    if (!asset || !price) {
      // If asset or price is missing you can choose to skip or include with 0 value.
      // For now we skip to avoid NaN.
      continue;
    }

    const value = pos.quantity * price.price;
    totalValue += value;

    enriched.push({
      positionId: pos.id,
      assetId: asset.id,
      assetName: asset.name,
      assetType: asset.type,
      quantity: pos.quantity,
      price: price.price,
      value,
      allocationPct: 0, // fill later when totalValue is known
    });
  }

  // Fill allocationPct now that we know totalValue
  const positionsWithAllocation = enriched.map((p) => ({
    ...p,
    allocationPct: totalValue > 0 ? p.value / totalValue : 0,
  }));

  return { positions: positionsWithAllocation, totalValue };
}

/**
 * Aggregate allocation by assetId (or assetName).
 */
export function aggregateByAsset(
  positions: EnrichedPosition[],
  totalValue: number,
): AllocationItem[] {
  const byAsset: Record<string, AllocationItem> = {};

  for (const pos of positions) {
    const existing = byAsset[pos.assetId];
    if (!existing) {
      byAsset[pos.assetId] = {
        key: pos.assetId,
        label: pos.assetName,
        value: pos.value,
        allocationPct: 0,
      };
    } else {
      existing.value += pos.value;
    }
  }

  const list = Object.values(byAsset).map((item) => ({
    ...item,
    allocationPct: totalValue > 0 ? item.value / totalValue : 0,
  }));

  // Sort descending by value
  return list.sort((a, b) => b.value - a.value);
}

/**
 * Aggregate allocation by asset class (type).
 */
export function aggregateByAssetClass(
  positions: EnrichedPosition[],
  totalValue: number,
): AllocationItem[] {
  const byClass: Record<string, AllocationItem> = {};

  for (const pos of positions) {
    const key = pos.assetType;
    const label =
      key === 'stock' ? 'Stocks' : key === 'crypto' ? 'Crypto' : 'Fiat';

    const existing = byClass[key];
    if (!existing) {
      byClass[key] = {
        key,
        label,
        value: pos.value,
        allocationPct: 0,
      };
    } else {
      existing.value += pos.value;
    }
  }

  const list = Object.values(byClass).map((item) => ({
    ...item,
    allocationPct: totalValue > 0 ? item.value / totalValue : 0,
  }));

  return list.sort((a, b) => b.value - a.value);
}

/**
 * High-level helper to build a PortfolioOverview for the dashboard.
 */
export function buildPortfolioOverview(
  portfolio: Portfolio,
  assets: Asset[],
  prices: Price[],
): PortfolioOverview {
  const { positions, totalValue } = buildEnrichedPositions(
    portfolio,
    assets,
    prices,
  );

  const allocationByAsset = aggregateByAsset(positions, totalValue);
  const allocationByClass = aggregateByAssetClass(positions, totalValue);

  return {
    asOf: portfolio.asOf,
    totalValue,
    positions,
    allocationByAsset,
    allocationByClass,
  };
}

/**
 * Given a static set of positions and a time-series of prices,
 * I want to compute the portfolio value for each date.
 *
 * Assumptions:
 *  - prices contain entries for relevant assets and dates
 *  - portfolio composition (positions) does not change over time
 */
export function computePortfolioValueSeries(
  positions: Position[],
  priceSeries: TimeSeriesPricePoint[],
): PortfolioValuePoint[] {
  // Group priceSeries by date
  const pricesByDate = priceSeries.reduce<
    Record<string, TimeSeriesPricePoint[]>
  >((acc, pt) => {
    if (!acc[pt.date]) acc[pt.date] = [];
    acc[pt.date].push(pt);
    return acc;
  }, {});

  const result: PortfolioValuePoint[] = [];

  for (const [date, prices] of Object.entries(pricesByDate)) {
    const pricesByAsset = prices.reduce<Record<string, number>>((acc, p) => {
      acc[p.asset] = p.price;
      return acc;
    }, {});

    let total = 0;

    for (const pos of positions) {
      const price = pricesByAsset[pos.asset];
      if (price === undefined) continue;
      total += pos.quantity * price;
    }

    result.push({ date, value: total });
  }

  // Sort result by date ascending
  result.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));

  return result;
}

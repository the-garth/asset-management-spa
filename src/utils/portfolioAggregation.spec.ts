import { describe, it, expect } from 'vitest'
import {
  buildEnrichedPositions,
  aggregateByAsset,
  aggregateByAssetClass,
  buildPortfolioOverview,
  computePortfolioValueSeries,
} from './portfolioAggregation'
import type { Asset, AssetType } from '../types/asset'
import type { Price } from '../types/price'
import type { Portfolio, Position } from '../types/portfolio'

type EnrichedPosition = {
  positionId: number
  assetId: string
  assetName: string
  assetType: AssetType
  quantity: number
  price: number
  value: number
  allocationPct: number
}
type PricePoint = { date: string; asset: string; price: number }


describe('portfolioAggregation utilities', () => {
  const assets: Asset[] = [
    { id: 'aapl', name: 'AAPL', type: 'stock' },
    { id: 'btc', name: 'BTC', type: 'crypto' },
    { id: 'gbp', name: 'GBP', type: 'fiat' },
  ]

  const prices: Price[] = [
    { id: 'p1', asset: 'aapl', price: 150, asOf: '2023-01-01T00:00:00Z' },
    { id: 'p2', asset: 'btc', price: 20000, asOf: '2023-01-01T00:00:00Z' },
    { id: 'p3', asset: 'gbp', price: 1.25, asOf: '2023-01-01T00:00:00Z' },
  ]
  

  it('buildEnrichedPositions computes values and allocationPct', () => {
    const portfolio: Portfolio = {
      id: 'pf1',
      asOf: '2023-01-01T00:00:00Z',
      positions: [
        { id: 1, asset: 'aapl', quantity: 2, asOf: '2023-01-01T00:00:00Z' },
        { id: 2, asset: 'btc', quantity: 0.1, asOf: '2023-01-01T00:00:00Z' },
      ],
    }

    const { positions, totalValue } = buildEnrichedPositions(portfolio, assets, prices)
    // expected values: aapl: 300, btc: 2000 => total 2300
    expect(totalValue).toBeCloseTo(2300)
    const aapl = positions.find((p) => p.assetId === 'aapl')!
    const btc = positions.find((p) => p.assetId === 'btc')!
    expect(aapl.value).toBeCloseTo(300)
    expect(btc.value).toBeCloseTo(2000)
    expect(aapl.allocationPct).toBeCloseTo(300 / 2300)
    expect(btc.allocationPct).toBeCloseTo(2000 / 2300)
  })

  it('skips positions with missing asset or price', () => {
    const portfolio: Portfolio = {
      id: 'pf2',
      asOf: '2023-01-02T00:00:00Z',
      positions: [
        { id: 1, asset: 'aapl', quantity: 1, asOf: '2023-01-02T00:00:00Z' },
        { id: 2, asset: 'missing', quantity: 10, asOf: '2023-01-02T00:00:00Z' },
      ],
    }

    const { positions, totalValue } = buildEnrichedPositions(portfolio, assets, prices)
    expect(positions.every((p) => p.assetId !== 'missing')).toBe(true)
    expect(totalValue).toBeCloseTo(150) // only aapl counted
  })

  it('aggregateByAsset merges positions and sorts by value desc', () => {
    // two positions for same asset
    const enriched: EnrichedPosition[] = [
      { positionId: 1, assetId: 'aapl', assetName: 'AAPL', assetType: 'stock', quantity: 1, price: 150, value: 150, allocationPct: 0 },
      { positionId: 2, assetId: 'aapl', assetName: 'AAPL', assetType: 'stock', quantity: 1, price: 150, value: 150, allocationPct: 0 },
      { positionId: 3, assetId: 'btc', assetName: 'BTC', assetType: 'crypto', quantity: 0.1, price: 20000, value: 2000, allocationPct: 0 },
    ]
    const totalValue = 2300
    const byAsset = aggregateByAsset(enriched, totalValue)
    expect(byAsset[0].key).toBe('btc') // btc highest
    const aaplItem = byAsset.find((i) => i.key === 'aapl')!
    expect(aaplItem.value).toBeCloseTo(300)
    expect(aaplItem.allocationPct).toBeCloseTo(300 / totalValue)
  })

  it('aggregateByAssetClass groups by type with friendly labels', () => {
    const enriched: EnrichedPosition[] = [
      { positionId: 1, assetId: 'aapl', assetName: 'AAPL', assetType: 'stock', quantity: 1, price: 150, value: 150, allocationPct: 0 },
      { positionId: 2, assetId: 'btc', assetName: 'BTC', assetType: 'crypto', quantity: 0.1, price: 20000, value: 2000, allocationPct: 0 },
      { positionId: 3, assetId: 'gbp', assetName: 'GBP', assetType: 'fiat', quantity: 100, price: 1.25, value: 125, allocationPct: 0 },
    ]
    const totalValue = 2275
    const byClass = aggregateByAssetClass(enriched, totalValue)
    // expect sorted: crypto, fiat, stock (by value)
    expect(byClass[0].label).toBe('Crypto')
    expect(byClass.find((c) => c.key === 'stock')!.label).toBe('Stocks')
    expect(byClass.find((c) => c.key === 'fiat')!.label).toBe('Fiat')
  })

  it('buildPortfolioOverview composes results', () => {
    const portfolio: Portfolio = {
      id: 'pf3',
      asOf: '2023-01-03T00:00:00Z',
      positions: [
        { id: 1, asset: 'aapl', quantity: 1, asOf: '2023-01-03T00:00:00Z' },
        { id: 2, asset: 'gbp', quantity: 10, asOf: '2023-01-03T00:00:00Z' },
      ],
    }

    const overview = buildPortfolioOverview(portfolio, assets, prices)
    expect(overview.asOf).toBe(portfolio.asOf)
    expect(Array.isArray(overview.positions)).toBe(true)
    expect(Array.isArray(overview.allocationByAsset)).toBe(true)
    expect(Array.isArray(overview.allocationByClass)).toBe(true)
  })

  it('computePortfolioValueSeries returns sorted series and skips missing prices', () => {
    const positions: Position[] = [
      { id: 1, asset: 'aapl', quantity: 2, asOf: '2023-01-01T00:00:00Z' },
      { id: 2, asset: 'btc', quantity: 0.1, asOf: '2023-01-01T00:00:00Z' },
    ]

    const priceSeries: PricePoint[] = [
      // date2 first to verify sort
      { date: '2023-01-02', asset: 'aapl', price: 160 },
      { date: '2023-01-01', asset: 'aapl', price: 150 },
      { date: '2023-01-01', asset: 'btc', price: 20000 },
      // 2023-01-02 missing btc -> should skip btc on that date
    ]

    const series = computePortfolioValueSeries(positions, priceSeries)
    expect(series.length).toBe(2)
    // sorted ascending by date
    expect(series[0].date).toBe('2023-01-01')
    expect(series[1].date).toBe('2023-01-02')
    // values: 2023-01-01 => 2*150 + 0.1*20000 = 2300
    expect(series[0].value).toBeCloseTo(2300)
    // 2023-01-02 => 2*160 (btc missing) = 320
    expect(series[1].value).toBeCloseTo(320)
  })
})
import React from 'react'
import { render, screen, within } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { PositionsTable } from './PositionsTable'

describe('PositionsTable', () => {
  it('shows a friendly message when there are no positions', () => {
    render(<PositionsTable positions={[]} />)
    expect(screen.getByText(/No positions to display/i)).toBeInTheDocument()
  })

  it('renders header and a row per position with formatted values', () => {
    type Position = {
      positionId: number
      assetId: string
      assetName: string
      assetType: string
      quantity: number
      price: number
      value: number
      allocationPct: number
    }

    const positions: Position[] = [
      {
        positionId: 1,
        assetId: 'aapl',
        assetName: 'AAPL',
        assetType: 'stock',
        quantity: 2,
        price: 150,
        value: 300,
        allocationPct: 0.115,
      },
      {
        positionId: 2,
        assetId: 'btc',
        assetName: 'BTC',
        assetType: 'crypto',
        quantity: 0.1,
        price: 20000,
        value: 2000,
        allocationPct: 0.885,
      },
    ]

    render(<PositionsTable positions={positions} />)

    // headers
    expect(screen.getByText(/Asset/i)).toBeInTheDocument()
    expect(screen.getByText(/Type/i)).toBeInTheDocument()
    expect(screen.getByText(/Quantity/i)).toBeInTheDocument()
    expect(screen.getByText(/Price \(USD\)/i)).toBeInTheDocument()
    expect(screen.getByText(/Value \(USD\)/i)).toBeInTheDocument()
    expect(screen.getByText(/% Allocation/i)).toBeInTheDocument()

    // rows (skip header row)
    const rows = screen.getAllByRole('row')
    // one header row + two data rows = at least 3
    expect(rows.length).toBeGreaterThanOrEqual(3)

    // check first data row contents
    const dataRows = rows.slice(1) // remove header
    const first = dataRows[0]
    expect(within(first).getByText('AAPL')).toBeInTheDocument()
    expect(within(first).getByText(/stock/i)).toBeInTheDocument()
    expect(within(first).getByText('2')).toBeInTheDocument()
    expect(within(first).getByText(/\$150/)).toBeInTheDocument()
    expect(within(first).getByText(/\$300/)).toBeInTheDocument()
    // allocation is shown as percentage with two decimals
    expect(within(first).getByText((_, node) => {
      return node?.textContent === (positions[0].allocationPct * 100).toFixed(2) + '%'
    })).toBeInTheDocument()

    // check second data row
    const second = dataRows[1]
    expect(within(second).getByText('BTC')).toBeInTheDocument()
    expect(within(second).getByText(/crypto/i)).toBeInTheDocument()
    expect(within(second).getByText('0.1')).toBeInTheDocument()
    expect(within(second).getByText(/\$20,000/)).toBeInTheDocument()
    expect(within(second).getByText(/\$2,000/)).toBeInTheDocument()
    expect(within(second).getByText((_, node) => {
      return node?.textContent === (positions[1].allocationPct * 100).toFixed(2) + '%'
    })).toBeInTheDocument()
  })
})
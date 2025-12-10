import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'

// Mock recharts to avoid ResponsiveContainer size measurement in jsdom.
// This mock renders simple DOM elements so we can assert structure.
vi.mock('recharts', () => {
  return {
    PieChart: ({ children }: { children?: React.ReactNode }) => <div data-testid="piechart">{children}</div>,
    Pie: ({ data, children }: { data?: unknown; children?: React.ReactNode }) => (
      <div data-testid="pie" data-chart-data={JSON.stringify(data)}>
        {children}
      </div>
    ),
    Cell: ({ fill }: { fill?: string }) => <div data-testid="cell" data-fill={fill} />,
    Tooltip: () => <div data-testid="tooltip" />,
    Legend: () => <div data-testid="legend" />,
    ResponsiveContainer: ({ children }: { children?: React.ReactNode }) => <div data-testid="responsive">{children}</div>,
  }
})

// import after mocking
import { PortfolioDonutChart } from './PortfolioDonutChart'
import type { AllocationItem } from '../../types/portfolioView'

describe('PortfolioDonutChart', () => {
  beforeEach(() => {
    vi.restoreAllMocks() // ensure clean slate for other tests that may stub globals
  })

  it('shows a friendly message when there is no data', () => {
    render(<PortfolioDonutChart data={[]} />)
    expect(screen.getByText(/no allocation data available/i)).toBeInTheDocument()
  })

  it('renders a pie with a Cell for each allocation item and applies colors', () => {
    const data: AllocationItem[] = [
      { key: 'aapl', label: 'AAPL', value: 300, allocationPct: 0.13 },
      { key: 'btc', label: 'BTC', value: 2000, allocationPct: 0.87 },
      { key: 'gbp', label: 'GBP', value: 125, allocationPct: 0.054 },
    ]

    render(<PortfolioDonutChart data={data} />)

    // Pie should receive the data
    const pie = screen.getByTestId('pie')
    expect(pie).toBeTruthy()
    expect(pie.getAttribute('data-chart-data')).toContain('"name":"AAPL"')

    // One mocked Cell per data entry
    const cells = screen.getAllByTestId('cell')
    expect(cells.length).toBe(data.length)

    // Colors are defined in the component; check that fills exist on the mocked cells
    // (order must match the component's COLORS array)
    const expectedColors = ['#1d4ed8', '#16a34a', '#f97316']
    cells.forEach((c, idx) => {
      expect(c.getAttribute('data-fill')).toBe(expectedColors[idx])
    })

    // Tooltip / Legend placeholders rendered by mocks
    expect(screen.getByTestId('tooltip')).toBeInTheDocument()
    expect(screen.getByTestId('legend')).toBeInTheDocument()
  })
})
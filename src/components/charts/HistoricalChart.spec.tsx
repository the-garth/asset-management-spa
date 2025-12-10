import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect, beforeEach, vi } from 'vitest'

// Mock recharts so jsdom doesn't try to measure DOM sizes / canvas etc.
// The mocks expose props via data-* attributes so tests can assert the component wiring.
vi.mock('recharts', () => {
  return {
    LineChart: ({ children, data }: { children?: React.ReactNode; data?: unknown[] }) => (
      <div data-testid="linechart" data-chart-data={JSON.stringify(data)}>
        {children}
      </div>
    ),
    Line: ({
      type,
      dataKey,
      stroke,
      dot,
      strokeWidth,
    }: {
      type?: string
      dataKey?: string | number
      stroke?: string
      dot?: boolean | React.ReactNode
      strokeWidth?: number | string
    }) => (
      <div
        data-testid="line"
        data-type={type}
        data-datakey={dataKey}
        data-stroke={stroke}
        data-dot={String(!!dot)}
        data-strokewidth={String(strokeWidth)}
      />
    ),
    XAxis: ({ dataKey }: { dataKey?: string | number }) => <div data-testid="xaxis" data-datakey={dataKey} />,
    YAxis: ({ tickFormatter }: { tickFormatter?: unknown }) => (
      <div data-testid="yaxis" data-has-tickformatter={typeof tickFormatter === 'function'} />
    ),
    Tooltip: ({ formatter, labelFormatter }: { formatter?: unknown; labelFormatter?: unknown }) => (
      <div
        data-testid="tooltip"
        data-has-formatter={typeof formatter === 'function'}
        data-has-label-formatter={typeof labelFormatter === 'function'}
      />
    ),
    CartesianGrid: () => <div data-testid="grid" />,
    ResponsiveContainer: ({ children }: { children?: React.ReactNode }) => <div data-testid="responsive">{children}</div>,
  }
})

// import after mocking
import { HistoricalChart } from './HistoricalChart'
import type { PortfolioValuePoint } from '../../types/portfolioView'

describe('HistoricalChart', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders friendly message when no data is provided', () => {
    render(<HistoricalChart data={[]} />)
    expect(screen.getByText(/no historical data available/i)).toBeInTheDocument()
  })

  it('renders chart components and passes transformed data and props', () => {
    const points: PortfolioValuePoint[] = [
      { date: '2025-01-01', value: 1000 },
      { date: '2025-01-02', value: 1200 },
    ]

    render(<HistoricalChart data={points} />)

    // LineChart should be rendered and receive the transformed dataset (contains original date fields)
    const lineChart = screen.getByTestId('linechart')
    expect(lineChart).toBeTruthy()
    // chart data should include the original date strings
    expect(lineChart.getAttribute('data-chart-data')).toContain('"date":"2025-01-01"')
    expect(lineChart.getAttribute('data-chart-data')).toContain('"date":"2025-01-02"')

    // Responsive container and grid are present
    expect(screen.getByTestId('responsive')).toBeInTheDocument()
    expect(screen.getByTestId('grid')).toBeInTheDocument()

    // Line should be configured with the expected props from the component
    const line = screen.getByTestId('line')
    expect(line.getAttribute('data-datakey')).toBe('value')
    expect(line.getAttribute('data-dot')).toBe('false')
    expect(line.getAttribute('data-strokewidth')).toBe('2')

    // YAxis and Tooltip should have formatter functions passed
    const yaxis = screen.getByTestId('yaxis')
    expect(yaxis.getAttribute('data-has-tickformatter')).toBe('true')

    const tooltip = screen.getByTestId('tooltip')
    expect(tooltip.getAttribute('data-has-formatter')).toBe('true')
    expect(tooltip.getAttribute('data-has-label-formatter')).toBe('true')
  })
})
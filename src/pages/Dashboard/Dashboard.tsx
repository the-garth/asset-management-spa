import React, { useState } from 'react'
import { useAuth } from '../../components/Providers/AuthProvider'
import { useQuery } from '@tanstack/react-query';
import { getAssets } from '../../api/assets';
import { getPortfolio } from '../../api/portfolios';
import { getCurrentPrices, getHistoricalPrices } from '../../api/prices';
import { buildPortfolioOverview, computePortfolioValueSeries } from '../../utils/portfolioAggregation';

import { Card } from '../../components/layout/Card';
import { PortfolioDonutChart } from '../../components/charts/PortfolioDonutChart';
import { HistoricalChart } from '../../components/charts/HistoricalChart';
import { PositionsTable } from '../../components/tables/PositionsTable';
import { Header } from '../../components/layout/Header';


type AllocationViewMode = 'asset' | 'class';

export const Dashboard: React.FC = () => {
  const { user } = useAuth()

  const assetsQuery = useQuery({ queryKey: ['assets'], queryFn: getAssets });
  const portfolioQuery = useQuery({ queryKey: ['portfolio'], queryFn: getPortfolio });
  const currentPricesQuery = useQuery({ queryKey: ['prices-current'], queryFn: getCurrentPrices });
  const historyQuery = useQuery({ queryKey: ['prices-history'], queryFn: getHistoricalPrices });

  const [allocationView, setAllocationView] = useState<AllocationViewMode>('class');

  const isLoading =
    assetsQuery.isLoading ||
    portfolioQuery.isLoading ||
    currentPricesQuery.isLoading ||
    historyQuery.isLoading;

  const error =
    assetsQuery.error ||
    portfolioQuery.error ||
    currentPricesQuery.error ||
    historyQuery.error;

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Oops, something went wrong.</div>;

  const overview = buildPortfolioOverview(
    portfolioQuery.data!,
    assetsQuery.data!,
    currentPricesQuery.data!,
  );

  const historicalSeries = computePortfolioValueSeries(
    portfolioQuery.data!.positions,
    historyQuery.data!,
  );
  

  return (
    <>
    {user ? <Header /> : null}
    <main className="min-h-screen bg-slate-50">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="grid gap-6 lg:grid-cols-3 w-full min-w-0">
          <Card className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold" style={{ color: 'var(--color-heading)' }}>
                Portfolio Allocation
              </h2>
              <div className="inline-flex overflow-hidden text-sm" style={{ borderColor: 'var(--color-border)' }}>
                <button
                  type="button"
                  onClick={() => setAllocationView('class')}
                  className="px-3 py-1"
                  style={
                    allocationView === 'class'
                      ? { backgroundColor: 'var(--color-brand)', color: 'white' }
                      : { backgroundColor: 'var(--color-card-bg)', color: 'var(--color-muted)' }
                  }
                >
                  By Class
                </button>
                <button
                  type="button"
                  onClick={() => setAllocationView('asset')}
                  className="px-3 py-1"
                  style={
                    allocationView === 'asset'
                      ? { backgroundColor: 'var(--color-brand)', color: 'white' }
                      : { backgroundColor: 'var(--color-card-bg)', color: 'var(--color-muted)' }
                  }
                >
                  By Asset
                </button>
              </div>
            </div>

            <div>
            <PortfolioDonutChart
              data={
                allocationView === 'class'
                  ? overview.allocationByClass
                  : overview.allocationByAsset
              }
            />
            </div>
          </Card>

          <Card>
            <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-heading)' }}>
              Portfolio Summary
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span style={{ color: 'var(--color-muted)' }}>Total value</span>
                <span className="font-semibold">
                  $
                  {overview.totalValue.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--color-muted)' }}>Positions</span>
                <span className="font-semibold ml-2" style={{ color: 'var(--color-heading)' }}>
                   {overview.positions.length}
                 </span>
              </div>
              <div className="flex justify-between">
                <span style={{ color: 'var(--color-muted)' }}>As of</span>
                 <span className="font-medium">
                  {overview.asOf && new Date(overview.asOf).toLocaleDateString()}
                 </span>
               </div>
           </div>
         </Card>
      </div>
             
      <Card>
        <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-heading)' }}>Positions</h2>
        <PositionsTable positions={overview.positions} />
      </Card>

      <Card>
        <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-heading)' }}>
          Portfolio Value Over Time
        </h2>
        <HistoricalChart data={historicalSeries} />
      </Card>
      </div>
    </main>
    </>
  )
}
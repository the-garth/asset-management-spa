import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
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


type AllocationViewMode = 'asset' | 'class';

export const Dashboard: React.FC = () => {
  const { user, signout } = useAuth()

  const nav = useNavigate()
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
  
  const handleLogout = () => {
    signout()
    nav('/login', { replace: true })
  }

  return (
    <main className="min-h-screen bg-slate-50">
      <div className="p-4 sm:p-6 space-y-6">
        <div className="grid gap-6 lg:grid-cols-3 w-full min-w-0">
          <Card className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">
                Portfolio Allocation
              </h2>
              <div className="inline-flex rounded-md border border-slate-200 overflow-hidden text-sm">
                <button
                  type="button"
                  onClick={() => setAllocationView('class')}

                  className={`px-3 py-1 ${
                    allocationView === 'class'
                      ? 'bg-brand text-white'
                      : 'bg-white text-slate-700'
                  }`}
                >
                  By Class
                </button>
                <button
                  type="button"
                  onClick={() => setAllocationView('asset')}
                  className={`px-3 py-1 ${
                    allocationView === 'asset'
                      ? 'bg-brand text-white'
                      : 'bg-white text-slate-700'
                  }`}
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
            <h2 className="text-lg font-semibold mb-4">
              Portfolio Summary
            </h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-500">Total value</span>
                <span className="font-semibold">
                  $
                  {overview.totalValue.toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Positions</span> 
                <span className="font-semibold ml-2">
                  {overview.positions.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">As of</span>
                <span className="font-medium">
                  {new Date(overview.asOf).toLocaleString()}
                </span>
              </div>
          </div>
        </Card>
      </div>
             
      <Card>
        <h2 className="text-lg font-semibold mb-4">Positions</h2>
        <PositionsTable positions={overview.positions} />
      </Card>

      <Card>
        <h2 className="text-lg font-semibold mb-4">
          Portfolio Value Over Time
        </h2>
        <HistoricalChart data={historicalSeries} />
      </Card>
      </div>
      <p>Welcome, {user?.username ?? 'unknown'}!</p>
      <button onClick={handleLogout}>Sign out</button>
    </main>
  )
}
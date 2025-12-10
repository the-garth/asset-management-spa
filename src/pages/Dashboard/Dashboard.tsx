import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../components/Providers/AuthProvider'
import { useQuery } from '@tanstack/react-query';
import { getAssets } from '../../api/assets';
import { getPortfolio } from '../../api/portfolios';
import { getCurrentPrices, getHistoricalPrices } from '../../api/prices';
import { buildPortfolioOverview, computePortfolioValueSeries } from '../../utils/portfolioAggregation';

export const Dashboard: React.FC = () => {
  const { user, signout } = useAuth()
  const nav = useNavigate()
  const assetsQuery = useQuery({ queryKey: ['assets'], queryFn: getAssets });
  const portfolioQuery = useQuery({ queryKey: ['portfolio'], queryFn: getPortfolio });
  const currentPricesQuery = useQuery({ queryKey: ['prices-current'], queryFn: getCurrentPrices });
  const historyQuery = useQuery({ queryKey: ['prices-history'], queryFn: getHistoricalPrices });

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
    <main style={{ padding: 20 }}>
      <h2>Dashboard</h2>
      <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{JSON.stringify(overview, null, 2)}</pre>
      <pre style={{ whiteSpace: 'pre-wrap', margin: 0 }}>{JSON.stringify(historicalSeries, null, 2)}</pre>
      <p>Welcome, {user?.username ?? 'unknown'}!</p>
      <button onClick={handleLogout}>Sign out</button>
    </main>
  )
}
import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from 'recharts';
import type { PortfolioValuePoint } from '../../types/portfolioView';

interface HistoricalChartProps {
  data: PortfolioValuePoint[];
}

export const HistoricalChart: React.FC<HistoricalChartProps> = ({
  data,
}) => {
  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-64 text-sm text-slate-500">
        No historical data available.
      </div>
    );
  }

  // Transform dates to something human-readable on the x-axis
  const chartData = data.map((point) => ({
    ...point,
    label: new Date(point.date).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
    }),
  }));

  return (
    <div className="w-full min-w-0 min-h-0" style={{ height: 256 }}>
      {/* explicit numeric height ensures ResponsiveContainer can measure in all environments */}
      <ResponsiveContainer width="100%" height={256} minWidth={0} minHeight={0}>
         <LineChart data={chartData} margin={{ top: 5, right: 20, left: 40, bottom: 5 }}>
           <CartesianGrid strokeDasharray="3 3" />
           <XAxis dataKey="label" />
           <YAxis
             tickFormatter={(value) =>
               `$${value.toLocaleString(undefined, {
                 maximumFractionDigits: 0,
               })}`
             }
           />
           <Tooltip
             formatter={(value: number) =>
               `$${value.toLocaleString(undefined, {
                 maximumFractionDigits: 2,
               })}`
             }
             labelFormatter={(label: string) => `Date: ${label}`}
           />
           <Line
             type="monotone"
             dataKey="value"
             stroke="var(--color-brand)"
             dot={false}
             strokeWidth={2}
           />
         </LineChart>
       </ResponsiveContainer>
     </div>
   );
};

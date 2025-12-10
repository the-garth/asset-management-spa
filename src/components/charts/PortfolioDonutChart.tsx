// src/components/charts/PortfolioDonutChart.tsx
import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { AllocationItem } from '../../types/portfolioView';

interface PortfolioDonutChartProps {
  data: AllocationItem[];
}

export const PortfolioDonutChart: React.FC<PortfolioDonutChartProps> = ({
  data,
}) => {
  const COLORS = ['#1d4ed8', '#16a34a', '#f97316', '#ec4899', '#0ea5e9', '#a855f7'];

  const chartData = data.map((item) => ({
    name: item.label,
    value: item.value,
  }));

  if (!chartData.length) {
    return (
      <div className="flex items-center justify-center h-64 text-sm text-slate-500">
        No allocation data available.
      </div>
    );
  }

  return (
    <div className="w-full h-64 min-w-0 min-h-0 portfolio-donut-chart">
      <ResponsiveContainer  width="100%" height={256} minWidth={0} minHeight={0}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            innerRadius="60%"
            outerRadius="90%"
            paddingAngle={2}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${entry.name}-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) =>
              `$${value.toLocaleString(undefined, {
                maximumFractionDigits: 2,
              })}`
            }
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

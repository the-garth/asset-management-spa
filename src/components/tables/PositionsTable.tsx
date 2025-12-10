import React from 'react';
import type { EnrichedPosition } from '../../types/portfolioView';

interface PositionsTableProps {
  positions: EnrichedPosition[];
}


export const PositionsTable: React.FC<PositionsTableProps> = ({
  positions,
}) => {
  if (!positions.length) {
    return (
      <div className="text-sm text-slate-500">
        No positions to display.
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <table className="min-w-full w-full table-fixed text-left text-sm border-collapse">
        <colgroup>
          <col style={{ width: '36%' }} />
          <col style={{ width: '12%' }} />
          <col style={{ width: '12%' }} />
          <col style={{ width: '12%' }} />
          <col style={{ width: '12%' }} />
          <col style={{ width: '16%' }} />
        </colgroup>

        <thead className="bg-slate-50">
          <tr className="border-b border-slate-200">
            <th className="px-3 py-2 font-medium text-slate-600">Asset</th>
            <th className="px-3 py-2 font-medium text-slate-600">Type</th>
            <th className="px-3 py-2 font-medium text-slate-600 text-right">Quantity</th>
            <th className="px-3 py-2 font-medium text-slate-600 text-right">Price (USD)</th>
            <th className="px-3 py-2 font-medium text-slate-600 text-right">Value (USD)</th>
            <th className="px-3 py-2 font-medium text-slate-600 text-right">% Allocation</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {positions.map((pos) => (
            <tr
              key={pos.positionId}
              className="last:border-0 hover:bg-slate-50/60"
            >
              <td className="px-3 py-2 whitespace-nowrap font-medium text-slate-800">
                {pos.assetName}
              </td>
              <td className="px-3 py-2 capitalize text-slate-600">
                {pos.assetType}
              </td>
              <td className="px-3 py-2 text-right tabular-nums">
                {pos.quantity.toLocaleString()}
              </td>
              <td className="px-3 py-2 text-right tabular-nums">
                $
                {pos.price.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}
              </td>
              <td className="px-3 py-2 text-right tabular-nums">
                $
                {pos.value.toLocaleString(undefined, {
                  maximumFractionDigits: 2,
                })}
              </td>
              <td className="px-3 py-2 text-right tabular-nums">
                {(pos.allocationPct * 100).toFixed(2)}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

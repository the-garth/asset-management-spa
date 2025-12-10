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
      <div className="text-sm" style={{ color: 'var(--color-muted)' }}>
        No positions to display.
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto" style={{ color: 'var(--color-text)' }}>
      <table className="min-w-full w-full table-fixed text-left text-sm border-collapse">
        <colgroup>
          <col style={{ width: '36%' }} />
          <col style={{ width: '12%' }} />
          <col style={{ width: '12%' }} />
          <col style={{ width: '12%' }} />
          <col style={{ width: '12%' }} />
          <col style={{ width: '16%' }} />
        </colgroup>

        <thead style={{ backgroundColor: 'transparent' }}>
          <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
            <th className="px-3 py-2 font-medium" style={{ color: 'var(--color-muted)' }}>Asset</th>
            <th className="px-3 py-2 font-medium" style={{ color: 'var(--color-muted)' }}>Type</th>
            <th className="px-3 py-2 font-medium text-right" style={{ color: 'var(--color-muted)' }}>Quantity</th>
            <th className="px-3 py-2 font-medium text-right" style={{ color: 'var(--color-muted)' }}>Price (USD)</th>
            <th className="px-3 py-2 font-medium text-right" style={{ color: 'var(--color-muted)' }}>Value (USD)</th>
            <th className="px-3 py-2 font-medium text-right" style={{ color: 'var(--color-muted)' }}>% Allocation</th>
          </tr>
        </thead>
        <tbody style={{ backgroundColor: 'transparent' }}>
          {positions.map((pos) => (
            <tr
              key={pos.positionId}
              className="last:border-0 hover:bg-slate-50/6"
              style={{ borderBottom: '1px solid rgba(0,0,0,0.03)' }}
            >
              <td className="px-3 py-2 whitespace-nowrap font-medium" style={{ color: 'var(--color-heading)' }}>
                {pos.assetName}
              </td>
              <td className="px-3 py-2 capitalize" style={{ color: 'var(--color-muted)' }}>
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

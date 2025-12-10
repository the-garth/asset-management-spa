import React from 'react';

type CardProps = React.PropsWithChildren<{ className?: string }>;

export const Card: React.FC<CardProps> = ({ className = '', children }) => (
  <div
    className={`w-full min-w-0 min-h-0 rounded-lg shadow-sm p-6 ${className}`}
    style={{
      backgroundColor: 'var(--color-card-bg)',
      border: '1px solid var(--color-border)',
      color: 'var(--color-text)',
    }}
  >
    {children}
  </div>
);
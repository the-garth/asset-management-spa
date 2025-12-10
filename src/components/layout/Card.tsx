import React from 'react';

type CardProps = React.PropsWithChildren<{ className?: string }>;

export const Card: React.FC<CardProps> = ({ className = '', children }) => (
  <div
    className={`w-full min-w-0 min-h-0 rounded-lg border border-slate-200 bg-white shadow-sm p-6 ${className}`}
  >
    {children}
  </div>
);
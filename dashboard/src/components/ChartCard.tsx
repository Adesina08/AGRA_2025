import React from 'react';

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
}

export const ChartCard: React.FC<ChartCardProps> = ({ title, children }) => (
  <div className="card h-full">
    <div className="flex items-center justify-between mb-2">
      <p className="section-title">{title}</p>
    </div>
    <div className="h-64">{children}</div>
  </div>
);

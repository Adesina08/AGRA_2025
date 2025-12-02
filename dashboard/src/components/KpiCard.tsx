import React from 'react';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  tone?: 'success' | 'warning' | 'error' | 'info';
}

const toneClasses: Record<NonNullable<KpiCardProps['tone']>, string> = {
  success: 'text-emerald-300 border-emerald-500/30',
  warning: 'text-amber-300 border-amber-500/30',
  error: 'text-rose-300 border-rose-500/30',
  info: 'text-cyan-300 border-cyan-500/30',
};

export const KpiCard: React.FC<KpiCardProps> = ({ title, value, subtitle, tone = 'info' }) => (
  <div className={`card border ${toneClasses[tone]}`}>
    <p className="text-sm text-gray-300">{title}</p>
    <p className="text-3xl font-semibold mt-2">{value}</p>
    {subtitle && <p className="text-xs text-gray-400 mt-2">{subtitle}</p>}
  </div>
);

import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: string;
  color?: 'blue' | 'green' | 'amber' | 'purple' | 'slate';
}

const colorStyles = {
  blue: 'bg-blue-50 text-blue-700 border-blue-200',
  green: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  amber: 'bg-amber-50 text-amber-700 border-amber-200',
  purple: 'bg-purple-50 text-purple-700 border-purple-200',
  slate: 'bg-slate-50 text-slate-700 border-slate-200',
};

export function StatCard({ title, value, subtitle, icon, trend, color = 'blue' }: StatCardProps) {
  return (
    <div className={`p-5 rounded-xl border bg-white shadow-sm flex flex-col justify-between transition hover:shadow-md`}>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-500">{title}</span>
        {icon && <div className={`p-2 rounded-lg border ${colorStyles[color]}`}>{icon}</div>}
      </div>
      <div className="mt-3">
        <div className="text-2xl font-bold text-slate-800">{value}</div>
        {subtitle && <p className="text-xs text-slate-500 mt-1">{subtitle}</p>}
        {trend && <p className="text-xs font-semibold text-emerald-600 mt-1">{trend}</p>}
      </div>
    </div>
  );
}

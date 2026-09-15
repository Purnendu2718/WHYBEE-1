import React from 'react';
import { AlertCircle } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description: string;
  action?: React.ReactNode;
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-slate-50 border border-dashed border-slate-300 rounded-xl my-4">
      <div className="p-3 bg-slate-100 rounded-full text-slate-400 mb-3">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h4 className="text-base font-semibold text-slate-700">{title}</h4>
      <p className="text-sm text-slate-500 max-w-sm mt-1">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

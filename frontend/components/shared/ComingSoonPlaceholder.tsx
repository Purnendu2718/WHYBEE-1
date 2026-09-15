import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Clock } from 'lucide-react';
import { Navbar } from '@/components/shared/Navbar';

interface ComingSoonPlaceholderProps {
  title: string;
  icon?: React.ReactNode;
}

export function ComingSoonPlaceholder({ title, icon }: ComingSoonPlaceholderProps) {
  return (
    <div className="space-y-6">
      <Navbar title={title} role="student" />

      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-xs flex flex-col items-center text-center max-w-xl mx-auto my-8">
        <Link
          href="/student/utilities"
          className="self-start inline-flex items-center text-xs font-semibold text-slate-500 hover:text-slate-800 mb-6 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Utilities
        </Link>

        <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl border border-blue-100 mb-4 shadow-xs">
          {icon || <Clock className="w-10 h-10" />}
        </div>

        <h2 className="text-xl font-bold text-slate-800 mb-2">{title}</h2>
        <p className="text-sm font-medium text-slate-500 max-w-sm">This feature is coming soon.</p>

        <div className="mt-8 pt-6 border-t border-slate-100 w-full flex items-center justify-center gap-3">
          <Link
            href="/student/dashboard"
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition"
          >
            Return to Dashboard
          </Link>
          <Link
            href="/student/utilities"
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg transition"
          >
            View All Utilities
          </Link>
        </div>
      </div>
    </div>
  );
}

'use client';

import React, { useEffect } from 'react';
import { AlertCircle } from 'lucide-react';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error('Admin portal error:', error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-6 text-center">
      <div className="p-4 bg-red-100 text-red-600 rounded-full mb-4">
        <AlertCircle className="w-8 h-8" />
      </div>
      <h3 className="text-lg font-bold text-slate-800">Something went wrong</h3>
      <p className="text-sm text-slate-500 max-w-md mt-1 mb-6">
        {error.message || 'An error occurred while executing an administrative query.'}
      </p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-xs rounded-lg transition"
      >
        Try Again
      </button>
    </div>
  );
}

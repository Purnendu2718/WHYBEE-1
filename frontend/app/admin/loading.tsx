import React from 'react';

export default function Loading() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-sm font-semibold text-slate-500">Loading Faculty Admin Portal...</p>
    </div>
  );
}

'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ResultRecord } from '@/lib/types';

interface ResultsBarChartProps {
  results: ResultRecord[];
}

export function ResultsBarChart({ results }: ResultsBarChartProps) {
  if (!results || results.length === 0) {
    return <div className="flex items-center justify-center h-full text-slate-400 text-sm">No exam marks available</div>;
  }

  const data = results.map((r) => ({
    subject: r.subject,
    marks: Number(r.marks),
    maxMarks: Number(r.max_marks || 100),
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} margin={{ top: 10, right: 20, left: -20, bottom: 20 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
        <XAxis dataKey="subject" tick={{ fontSize: 11, fill: '#64748b' }} interval={0} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} />
        <Tooltip
          contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '12px' }}
        />
        <Bar dataKey="marks" fill="#2563eb" radius={[6, 6, 0, 0]} name="Score" />
      </BarChart>
    </ResponsiveContainer>
  );
}

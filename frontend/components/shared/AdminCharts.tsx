'use client';

import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface AdminChartsProps {
  subjectAverages?: { subject: string; avg_marks: number }[];
  feeStatusCounts?: { paid: number; partial: number; unpaid: number };
}

const COLORS = ['#10b981', '#f59e0b', '#ef4444'];

export function AdminCharts({ subjectAverages = [], feeStatusCounts }: AdminChartsProps) {
  const pieData = feeStatusCounts ? [
    { name: 'Paid', value: feeStatusCounts.paid },
    { name: 'Partial', value: feeStatusCounts.partial },
    { name: 'Unpaid', value: feeStatusCounts.unpaid },
  ] : [];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Subject Averages Bar Chart */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <h3 className="text-base font-semibold text-slate-800 mb-1">Campus Subject Averages</h3>
        <p className="text-xs text-slate-500 mb-4">Calculated via Postgres SQL Aggregation</p>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={subjectAverages} margin={{ top: 10, right: 20, left: -20, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="subject" tick={{ fontSize: 11, fill: '#64748b' }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} />
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '12px' }} />
              <Bar dataKey="avg_marks" fill="#8b5cf6" radius={[6, 6, 0, 0]} name="Avg Score" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Fee Status Pie Chart */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <h3 className="text-base font-semibold text-slate-800 mb-1">Fee Status Distribution</h3>
        <p className="text-xs text-slate-500 mb-4">Student payment ratios</p>
        <div className="h-64 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
                label={({ name, percent }: { name?: string; percent?: number }) => `${name || ''} ${((percent || 0) * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import Link from 'next/link';
import {
  CalendarCheck,
  GraduationCap,
  CreditCard,
  FileText,
  Calendar,
  BookOpen,
  FilePlus,
  Users,
  Grid,
} from 'lucide-react';

export function QuickActionsGrid() {
  const actions = [
    { name: 'Attendance', href: '/student/attendance', icon: CalendarCheck, isReal: true, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
    { name: 'Results', href: '/student/results', icon: GraduationCap, isReal: true, color: 'text-blue-600 bg-blue-50 border-blue-200' },
    { name: 'Fees', href: '/student/fees', icon: CreditCard, isReal: true, color: 'text-amber-600 bg-amber-50 border-amber-200' },
    { name: 'Circulars', href: '/student/utilities/circulars', icon: FileText, isReal: false, color: 'text-purple-600 bg-purple-50 border-purple-200' },
    { name: 'Calendar', href: '/student/utilities/calendar', icon: Calendar, isReal: false, color: 'text-indigo-600 bg-indigo-50 border-indigo-200' },
    { name: 'Worksheet & Classwork', href: '/student/utilities/worksheets', icon: BookOpen, isReal: false, color: 'text-teal-600 bg-teal-50 border-teal-200' },
    { name: 'Assignment', href: '/student/utilities/assignments', icon: FilePlus, isReal: false, color: 'text-rose-600 bg-rose-50 border-rose-200' },
    { name: 'PTM', href: '/student/utilities/ptm', icon: Users, isReal: false, color: 'text-cyan-600 bg-cyan-50 border-cyan-200' },
    { name: 'More', href: '/student/utilities', icon: Grid, isReal: true, color: 'text-slate-700 bg-slate-100 border-slate-300' },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-xs">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold text-slate-800">Quick Actions</h3>
        <span className="text-xs font-semibold text-slate-400">Portal Navigation</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {actions.map((action) => {
          const Icon = action.icon;
          return (
            <Link
              key={action.name}
              href={action.href}
              className="group p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:shadow-md hover:border-blue-300 transition flex flex-col items-center text-center justify-between gap-2"
            >
              <div className={`p-2.5 rounded-xl border ${action.color} group-hover:scale-110 transition`}>
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-xs font-semibold text-slate-700 leading-tight group-hover:text-blue-600 transition">
                {action.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Student } from '@/lib/types';
import { UserCheck } from 'lucide-react';

interface ChildSwitcherProps {
  students: Student[];
  currentStudentId?: string;
}

export function ChildSwitcher({ students, currentStudentId }: ChildSwitcherProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  if (!students || students.length <= 1) return null;

  const handleSelect = (studentId: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('studentId', studentId);
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-lg border border-slate-200 text-sm">
      <UserCheck className="w-4 h-4 text-slate-500 ml-1" />
      <span className="text-xs font-semibold text-slate-600">Child:</span>
      <select
        className="bg-white border border-slate-300 text-slate-800 text-xs font-medium rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={currentStudentId || students[0]?.id}
        onChange={(e) => handleSelect(e.target.value)}
      >
        {students.map((s) => (
          <option key={s.id} value={s.id}>
            {s.profile?.full_name || 'Student'} ({s.roll_no})
          </option>
        ))}
      </select>
    </div>
  );
}

import React from 'react';
import { Student } from '@/lib/types';
import { Shield, Hash } from 'lucide-react';

interface StudentInfoCardProps {
  student: Student;
}

export function StudentInfoCard({ student }: StudentInfoCardProps) {
  const photoUrl = student.photo_url;
  const fullName = student.profile?.full_name || 'Student';
  const house = student.house || 'Red';
  const initials = fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  const houseColors: Record<string, string> = {
    Red: 'bg-red-100 text-red-800 border-red-200',
    Blue: 'bg-blue-100 text-blue-800 border-blue-200',
    Green: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    Yellow: 'bg-amber-100 text-amber-800 border-amber-200',
  };

  const houseBadgeClass = houseColors[house] || 'bg-slate-100 text-slate-800 border-slate-200';

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-5">
      {/* Profile Photo / Initials Fallback */}
      {photoUrl ? (
        <img
          src={photoUrl}
          alt={fullName}
          className="w-20 h-20 rounded-full object-cover border-2 border-blue-600 shadow-sm"
        />
      ) : (
        <div className="w-20 h-20 rounded-full bg-blue-600 text-white font-extrabold text-xl flex items-center justify-center border-2 border-blue-700 shadow-sm">
          {initials}
        </div>
      )}

      {/* Student Details */}
      <div className="text-center sm:text-left space-y-1.5 flex-1">
        <h2 className="text-xl font-extrabold text-slate-800 tracking-tight">{fullName}</h2>
        <p className="text-xs font-semibold text-slate-500">
          Class {student.class} — Section {student.section}
        </p>

        {/* Badges Row */}
        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-700 border border-slate-200">
            <Hash className="w-3 h-3 text-slate-400" />
            Roll No: {student.roll_no}
          </span>
          <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border ${houseBadgeClass}`}>
            <Shield className="w-3 h-3" />
            House: {house}
          </span>
        </div>
      </div>
    </div>
  );
}

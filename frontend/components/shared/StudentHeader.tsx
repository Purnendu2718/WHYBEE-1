'use client';

import React from 'react';
import Link from 'next/link';
import { BookOpen, User } from 'lucide-react';
import { Student } from '@/lib/types';

export const WELCOME_MSG = 'Welcome to CampusERP';

interface StudentHeaderProps {
  student?: Student | null;
}

export function StudentHeader({ student }: StudentHeaderProps) {
  const photoUrl = student?.photo_url;
  const fullName = student?.profile?.full_name || 'Student';
  const initials = fullName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <header className="h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-between sticky top-0 z-20 shadow-xs">
      {/* Left Logo & Welcome */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-600 rounded-lg text-white shadow-xs">
          <BookOpen className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-sm font-bold text-slate-800 leading-tight">CampusERP</h1>
          <p className="text-xs text-slate-500 font-medium">{WELCOME_MSG}</p>
        </div>
      </div>

      {/* Right Circular Avatar Button */}
      <div className="flex items-center gap-3">
        <Link
          href="/student/profile"
          className="flex items-center gap-2.5 p-1 rounded-full hover:bg-slate-100 transition border border-slate-200 group"
        >
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={fullName}
              className="w-9 h-9 rounded-full object-cover border border-blue-500 shadow-xs group-hover:scale-105 transition"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center border border-blue-500 shadow-xs">
              {initials}
            </div>
          )}
          <span className="text-xs font-semibold text-slate-700 pr-2 hidden sm:inline">{fullName}</span>
        </Link>
      </div>
    </header>
  );
}

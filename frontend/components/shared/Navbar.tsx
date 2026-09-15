import React from 'react';
import { UserRole } from '@/lib/types';
import { Bell, ShieldCheck } from 'lucide-react';

interface NavbarProps {
  title: string;
  role: UserRole;
  extraRight?: React.ReactNode;
}

export function Navbar({ title, role, extraRight }: NavbarProps) {
  return (
    <header className="h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-between sticky top-0 z-10 shadow-xs">
      <div className="flex items-center gap-3">
        <h2 className="text-lg font-bold text-slate-800 tracking-tight">{title}</h2>
      </div>

      <div className="flex items-center gap-4">
        {extraRight}

        <div className="flex items-center gap-2 text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
          <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
          <span className="capitalize">{role} Authorized</span>
        </div>

        <button className="p-2 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-blue-600 rounded-full"></span>
        </button>
      </div>
    </header>
  );
}

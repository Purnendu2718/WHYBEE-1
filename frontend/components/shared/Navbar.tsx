import React from 'react';
import { UserRole } from '@/lib/types';
import { ShieldCheck } from 'lucide-react';
import { NotificationBell } from '@/components/shared/NotificationBell';

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

        <NotificationBell />
      </div>
    </header>
  );
}

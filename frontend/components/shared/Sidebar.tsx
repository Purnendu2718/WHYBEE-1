'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserRole } from '@/lib/types';
import {
  LayoutDashboard,
  CalendarCheck,
  GraduationCap,
  CreditCard,
  User,
  Users,
  LogOut,
  BookOpen,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

interface SidebarProps {
  role: UserRole;
  userName?: string;
  userEmail?: string;
}

export function Sidebar({ role, userName, userEmail }: SidebarProps) {
  const pathname = usePathname();

  const navItems = {
    student: [
      { name: 'Dashboard', href: '/student/dashboard', icon: LayoutDashboard },
      { name: 'Attendance', href: '/student/attendance', icon: CalendarCheck },
      { name: 'Results & Marks', href: '/student/results', icon: GraduationCap },
      { name: 'Fee Payments', href: '/student/fees', icon: CreditCard },
      { name: 'My Profile', href: '/student/profile', icon: User },
    ],
    parent: [
      { name: 'Dashboard', href: '/parent/dashboard', icon: LayoutDashboard },
      { name: 'Child Attendance', href: '/parent/attendance', icon: CalendarCheck },
      { name: 'Child Results', href: '/parent/results', icon: GraduationCap },
      { name: 'Fee Tracker', href: '/parent/fees', icon: CreditCard },
      { name: 'Student Profile', href: '/parent/profile', icon: User },
    ],
    admin: [
      { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
      { name: 'Students Directory', href: '/admin/students', icon: Users },
      { name: 'Bulk Attendance', href: '/admin/attendance', icon: CalendarCheck },
      { name: 'Enter Results', href: '/admin/results', icon: GraduationCap },
      { name: 'Manage Fees', href: '/admin/fees', icon: CreditCard },
    ],
  };

  const items = navItems[role] || [];

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = `/auth/${role}`;
  };

  return (
    <aside className="w-64 bg-slate-900 text-slate-100 flex flex-col justify-between min-h-screen border-r border-slate-800">
      <div>
        {/* Logo / Header */}
        <div className="p-6 border-b border-slate-800 flex items-center gap-3">
          <div className="p-2 bg-blue-600 rounded-lg">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-white">CampusERP</h1>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-900/60 text-blue-300 capitalize border border-blue-700/50">
              {role} Portal
            </span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="p-4 space-y-1">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer User Info */}
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center justify-between mb-3 px-1">
          <div className="overflow-hidden">
            <p className="text-sm font-semibold text-slate-200 truncate">{userName || 'User'}</p>
            <p className="text-xs text-slate-400 truncate">{userEmail || ''}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-slate-800 hover:bg-red-900/40 text-slate-300 hover:text-red-300 rounded-lg text-xs font-semibold transition border border-slate-700"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}

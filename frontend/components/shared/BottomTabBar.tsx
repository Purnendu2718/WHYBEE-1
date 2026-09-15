'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Grid, User } from 'lucide-react';

export function BottomTabBar() {
  const pathname = usePathname();

  const tabs = [
    { name: 'Home', href: '/student/dashboard', icon: LayoutDashboard },
    { name: 'Utilities', href: '/student/utilities', icon: Grid },
    { name: 'Profile', href: '/student/profile', icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-slate-200 px-6 py-2 flex items-center justify-around md:hidden shadow-lg">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = pathname === tab.href || (tab.href !== '/student/dashboard' && pathname.startsWith(tab.href));
        return (
          <Link
            key={tab.href}
            href={tab.href}
            className={`flex flex-col items-center gap-1 text-xs font-semibold transition ${
              isActive ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Icon className="w-5 h-5" />
            <span>{tab.name}</span>
          </Link>
        );
      })}
    </nav>
  );
}

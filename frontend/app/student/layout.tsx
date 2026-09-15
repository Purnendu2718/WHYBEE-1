import React from 'react';
import { Sidebar } from '@/components/shared/Sidebar';
import { StudentHeader } from '@/components/shared/StudentHeader';
import { BottomTabBar } from '@/components/shared/BottomTabBar';
import { createClient } from '@/lib/supabase/server';
import { getCurrentStudent } from '@/lib/queries/students';

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: student } = await getCurrentStudent();

  let fullName = student?.profile?.full_name || 'Student User';
  let email = user?.email || '';

  return (
    <div className="flex min-h-screen bg-slate-50 pb-16 md:pb-0">
      <Sidebar role="student" userName={fullName} userEmail={email} />
      <div className="flex-1 flex flex-col min-w-0">
        <StudentHeader student={student} />
        <main className="p-4 sm:p-8 flex-1 overflow-y-auto">{children}</main>
        <BottomTabBar />
      </div>
    </div>
  );
}

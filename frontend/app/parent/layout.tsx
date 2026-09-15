import React from 'react';
import { Sidebar } from '@/components/shared/Sidebar';
import { createClient } from '@/lib/supabase/server';

export default async function ParentLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let fullName = 'Parent User';
  let email = user?.email || '';

  if (user) {
    const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', user.id).single();
    if (profile?.full_name) fullName = profile.full_name;
  }

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar role="parent" userName={fullName} userEmail={email} />
      <div className="flex-1 flex flex-col min-w-0">
        <main className="p-8 flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

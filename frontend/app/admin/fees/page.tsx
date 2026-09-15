import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { Navbar } from '@/components/shared/Navbar';
import { ManageFeesList } from '@/components/shared/ManageFeesList';
import { EmptyState } from '@/components/shared/EmptyState';

export default async function AdminFeesPage() {
  const supabase = createClient();
  const { data: fees } = await supabase
    .from('fees')
    .select('*, students:students!fees_student_id_fkey(*, profile:profiles!students_profile_id_fkey(*))')
    .order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <Navbar title="Manage Student Fees & Status" role="admin" />

      {!fees || fees.length === 0 ? (
        <EmptyState title="No Fee Records Found" description="Please run 'npm run seed' to generate initial fee records." />
      ) : (
        <ManageFeesList studentsWithFees={fees} />
      )}
    </div>
  );
}

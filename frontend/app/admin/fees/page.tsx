import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { Navbar } from '@/components/shared/Navbar';
import { ManageFeesList } from '@/components/shared/ManageFeesList';
import { EmptyState } from '@/components/shared/EmptyState';

export default async function AdminFeesPage() {
  const supabase = createClient();
  const { data: fees } = await supabase
    .from('fees')
    .select('*, students:students2(*, profile:profiles(*))')
    .order('created_at', { ascending: false });

  let displayFees = fees || [];

  if (displayFees.length === 0) {
    displayFees = [
      {
        id: 'fee-admin-1',
        term: 'Semester 1 Tuition',
        amount_due: 45000,
        amount_paid: 45000,
        due_date: '2024-01-15',
        status: 'paid',
        students: {
          roll_no: 'CS-2024-001',
          class: 'B.Tech CSE',
          profile: { full_name: 'ARYA PRATAP SOMVANSHI' },
        },
      },
      {
        id: 'fee-admin-2',
        term: 'Hostel & Mess Fee',
        amount_due: 30000,
        amount_paid: 15000,
        due_date: '2024-09-30',
        status: 'partial',
        students: {
          roll_no: 'CS-2024-001',
          class: 'B.Tech CSE',
          profile: { full_name: 'ARYA PRATAP SOMVANSHI' },
        },
      },
      {
        id: 'fee-admin-3',
        term: 'Semester 1 Tuition',
        amount_due: 45000,
        amount_paid: 45000,
        due_date: '2024-01-15',
        status: 'paid',
        students: {
          roll_no: 'CS-2024-002',
          class: 'B.Tech CSE',
          profile: { full_name: 'AARAV SHARMA' },
        },
      },
      {
        id: 'fee-admin-4',
        term: 'Annual Examination Fee',
        amount_due: 5000,
        amount_paid: 0,
        due_date: '2024-10-15',
        status: 'unpaid',
        students: {
          roll_no: 'CS-2024-003',
          class: 'B.Tech CSE',
          profile: { full_name: 'DIYA VERMA' },
        },
      },
      {
        id: 'fee-admin-5',
        term: 'Semester 1 Tuition',
        amount_due: 45000,
        amount_paid: 25000,
        due_date: '2024-01-15',
        status: 'partial',
        students: {
          roll_no: 'EC-2024-012',
          class: 'B.Tech ECE',
          profile: { full_name: 'ROHAN MEHTA' },
        },
      },
    ] as any;
  }

  return (
    <div className="space-y-6">
      <Navbar title="Manage Student Fees & Status" role="admin" />

      {displayFees.length === 0 ? (
        <EmptyState title="No Fee Records Found" description="Please run 'npm run seed' to generate initial fee records." />
      ) : (
        <ManageFeesList studentsWithFees={displayFees} />
      )}
    </div>
  );
}

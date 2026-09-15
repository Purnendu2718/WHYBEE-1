import React from 'react';
import { getPaginatedStudents } from '@/lib/queries/students';
import { Navbar } from '@/components/shared/Navbar';
import { EnterResultsForm } from '@/components/shared/EnterResultsForm';
import { EmptyState } from '@/components/shared/EmptyState';

export default async function AdminResultsPage() {
  const { data: students } = await getPaginatedStudents(1, 50, '');

  return (
    <div className="space-y-6">
      <Navbar title="Enter & Update Student Results" role="admin" />

      {students.length === 0 ? (
        <EmptyState title="No Students Enrolled" description="Please run 'npm run seed' before recording subject marks." />
      ) : (
        <EnterResultsForm students={students} />
      )}
    </div>
  );
}

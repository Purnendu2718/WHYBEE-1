import React from 'react';
import { getPaginatedStudents } from '@/lib/queries/students';
import { Navbar } from '@/components/shared/Navbar';
import { BulkAttendanceForm } from '@/components/shared/BulkAttendanceForm';
import { EmptyState } from '@/components/shared/EmptyState';

export default async function AdminAttendancePage() {
  const { data: students } = await getPaginatedStudents(1, 50, '');

  return (
    <div className="space-y-6">
      <Navbar title="Bulk Attendance Entry (Faculty)" role="admin" />

      {students.length === 0 ? (
        <EmptyState title="No Students Enrolled" description="Please run 'npm run seed' to populate students before recording attendance." />
      ) : (
        <BulkAttendanceForm students={students} />
      )}
    </div>
  );
}

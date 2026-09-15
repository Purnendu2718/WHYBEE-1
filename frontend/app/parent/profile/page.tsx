import React from 'react';
import { getLinkedStudentsForParent } from '@/lib/queries/students';
import { Navbar } from '@/components/shared/Navbar';
import { ChildSwitcher } from '@/components/shared/ChildSwitcher';
import { EmptyState } from '@/components/shared/EmptyState';
import { User, Mail, Calendar, BookOpen, Hash } from 'lucide-react';

export default async function ParentProfilePage({ searchParams }: { searchParams: { studentId?: string } }) {
  const { data: linkedStudents } = await getLinkedStudentsForParent();
  if (!linkedStudents || linkedStudents.length === 0) return <EmptyState title="No Linked Students" description="No student profiles are linked to this parent account." />;

  const selectedStudent = searchParams.studentId
    ? linkedStudents.find((s) => s.id === searchParams.studentId) || linkedStudents[0]
    : linkedStudents[0];

  return (
    <div className="space-y-6">
      <Navbar
        title="Linked Student Profile Details"
        role="parent"
        extraRight={<ChildSwitcher students={linkedStudents} currentStudentId={selectedStudent.id} />}
      />

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs max-w-3xl">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
          <div className="w-16 h-16 bg-emerald-600 text-white rounded-full flex items-center justify-center font-bold text-2xl shadow-md">
            {selectedStudent.profile?.full_name?.substring(0, 2).toUpperCase() || 'ST'}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">{selectedStudent.profile?.full_name}</h2>
            <p className="text-xs text-slate-500 font-medium">Roll Number: {selectedStudent.roll_no}</p>
            <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Child Student Profile
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-slate-400 mt-0.5" />
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase">Student Email</span>
              <p className="text-sm font-medium text-slate-800">{selectedStudent.profile?.email}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Hash className="w-5 h-5 text-slate-400 mt-0.5" />
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase">Roll Number</span>
              <p className="text-sm font-medium text-slate-800">{selectedStudent.roll_no}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <BookOpen className="w-5 h-5 text-slate-400 mt-0.5" />
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase">Class & Section</span>
              <p className="text-sm font-medium text-slate-800">{selectedStudent.class} - Section {selectedStudent.section}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-slate-400 mt-0.5" />
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase">Date of Birth</span>
              <p className="text-sm font-medium text-slate-800">{selectedStudent.dob || '15 May 2003'}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <User className="w-5 h-5 text-slate-400 mt-0.5" />
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase">Gender</span>
              <p className="text-sm font-medium text-slate-800 capitalize">{selectedStudent.gender || 'Not specified'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

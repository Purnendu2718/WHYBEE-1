import React from 'react';
import { getCurrentStudent } from '@/lib/queries/students';
import { Navbar } from '@/components/shared/Navbar';
import { EmptyState } from '@/components/shared/EmptyState';
import { User, Mail, Calendar, BookOpen, Hash, ShieldCheck } from 'lucide-react';

export default async function StudentProfilePage() {
  const { data: student } = await getCurrentStudent();
  if (!student) return <EmptyState title="Profile Not Found" description="Could not load profile details." />;

  return (
    <div className="space-y-6">
      <Navbar title="Student Profile" role="student" />

      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs max-w-3xl">
        <div className="flex items-center gap-4 pb-6 border-b border-slate-100">
          <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-2xl shadow-md">
            {student.profile?.full_name?.substring(0, 2).toUpperCase() || 'ST'}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-800">{student.profile?.full_name}</h2>
            <p className="text-xs text-slate-500 font-medium">Roll Number: {student.roll_no}</p>
            <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
              Active Student
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <div className="flex items-start gap-3">
            <Mail className="w-5 h-5 text-slate-400 mt-0.5" />
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase">Email Address</span>
              <p className="text-sm font-medium text-slate-800">{student.profile?.email}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Hash className="w-5 h-5 text-slate-400 mt-0.5" />
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase">Roll Number</span>
              <p className="text-sm font-medium text-slate-800">{student.roll_no}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <BookOpen className="w-5 h-5 text-slate-400 mt-0.5" />
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase">Class & Section</span>
              <p className="text-sm font-medium text-slate-800">{student.class} - Section {student.section}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Calendar className="w-5 h-5 text-slate-400 mt-0.5" />
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase">Date of Birth</span>
              <p className="text-sm font-medium text-slate-800">{student.dob || '15 May 2003'}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <User className="w-5 h-5 text-slate-400 mt-0.5" />
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase">Gender</span>
              <p className="text-sm font-medium text-slate-800 capitalize">{student.gender || 'Not specified'}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-slate-400 mt-0.5" />
            <div>
              <span className="text-xs font-semibold text-slate-400 uppercase">System Security</span>
              <p className="text-sm font-medium text-slate-800">Protected via RLS Policies</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

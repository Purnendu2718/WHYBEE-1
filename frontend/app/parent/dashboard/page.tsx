import React from 'react';
import { getLinkedStudentsForParent } from '@/lib/queries/students';
import { getStudentAttendance } from '@/lib/queries/attendance';
import { getStudentResults } from '@/lib/queries/results';
import { getStudentFees } from '@/lib/queries/fees';
import { StatCard } from '@/components/shared/StatCard';
import { ChartCard } from '@/components/shared/ChartCard';
import { ResultsBarChart } from '@/components/shared/ResultsBarChart';
import { ChildSwitcher } from '@/components/shared/ChildSwitcher';
import { EmptyState } from '@/components/shared/EmptyState';
import { Navbar } from '@/components/shared/Navbar';
import { CalendarCheck, GraduationCap, CreditCard, User } from 'lucide-react';

export default async function ParentDashboardPage({ searchParams }: { searchParams: { studentId?: string } }) {
  const { data: linkedStudents, error } = await getLinkedStudentsForParent();

  if (error || !linkedStudents || linkedStudents.length === 0) {
    return (
      <div className="space-y-6">
        <Navbar title="Parent Portal Dashboard" role="parent" />
        <EmptyState
          title="No Linked Student Records"
          description="Your parent account is authorized, but no student records are linked to your profile yet. Please run 'npm run seed' to populate test accounts."
        />
      </div>
    );
  }

  const selectedStudent = searchParams.studentId
    ? linkedStudents.find((s) => s.id === searchParams.studentId) || linkedStudents[0]
    : linkedStudents[0];

  const { stats: attStats } = await getStudentAttendance(selectedStudent.id);
  const { data: results } = await getStudentResults(selectedStudent.id);
  const { data: fees } = await getStudentFees(selectedStudent.id);

  const totalFeeDue = fees.reduce((acc, curr) => acc + Number(curr.amount_due), 0);
  const totalFeePaid = fees.reduce((acc, curr) => acc + Number(curr.amount_paid), 0);
  const pendingFee = totalFeeDue - totalFeePaid;

  const avgMarks = results.length > 0
    ? Math.round(results.reduce((acc, r) => acc + Number(r.marks), 0) / results.length)
    : 0;

  return (
    <div className="space-y-6">
      <Navbar
        title="Parent Monitoring Dashboard"
        role="parent"
        extraRight={<ChildSwitcher students={linkedStudents} currentStudentId={selectedStudent.id} />}
      />

      {/* Selected Child Header Card */}
      <div className="bg-emerald-700 text-white p-6 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-2.5 py-1 bg-emerald-600/60 rounded-full border border-emerald-500/30">
              Linked Child Overview
            </span>
            <span className="text-xs font-medium text-emerald-200">Class {selectedStudent.class}-{selectedStudent.section}</span>
          </div>
          <h2 className="text-2xl font-bold mt-2">{selectedStudent.profile?.full_name || 'Student'}</h2>
          <p className="text-emerald-100 text-xs mt-1">Roll No: {selectedStudent.roll_no} | Email: {selectedStudent.profile?.email}</p>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard
          title="Child Attendance Rate"
          value={`${attStats.pct}%`}
          subtitle={`${attStats.present} Present / ${attStats.total} Total Days`}
          icon={<CalendarCheck className="w-5 h-5" />}
          color={attStats.pct >= 75 ? 'green' : 'amber'}
        />

        <StatCard
          title="Subject Average Score"
          value={`${avgMarks}%`}
          subtitle={`${results.length} subjects evaluated`}
          icon={<GraduationCap className="w-5 h-5" />}
          color="blue"
        />

        <StatCard
          title="Pending Fee Due"
          value={`$${pendingFee.toLocaleString()}`}
          subtitle={pendingFee > 0 ? `Total Paid: $${totalFeePaid.toLocaleString()}` : 'No outstanding fees'}
          icon={<CreditCard className="w-5 h-5" />}
          color={pendingFee > 0 ? 'amber' : 'green'}
        />
      </div>

      {/* Chart & Quick Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartCard title="Child Academic Score Sheet" subtitle="Mid-Sem Marks vs 100">
            <ResultsBarChart results={results} />
          </ChartCard>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between shadow-xs">
          <div>
            <h3 className="text-base font-semibold text-slate-800 mb-1">Attendance Breakdown</h3>
            <p className="text-xs text-slate-500 mb-4">Read-only view for linked student</p>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm py-2 border-b border-slate-100">
                <span className="text-slate-600 font-medium">Present Days</span>
                <span className="font-bold text-emerald-600">{attStats.present} days</span>
              </div>
              <div className="flex items-center justify-between text-sm py-2 border-b border-slate-100">
                <span className="text-slate-600 font-medium">Late Days</span>
                <span className="font-bold text-amber-600">{attStats.late} days</span>
              </div>
              <div className="flex items-center justify-between text-sm py-2 border-b border-slate-100">
                <span className="text-slate-600 font-medium">Absences</span>
                <span className="font-bold text-red-600">{attStats.absent} days</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

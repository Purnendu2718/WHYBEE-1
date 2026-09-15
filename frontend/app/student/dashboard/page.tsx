import React from 'react';
import { getCurrentStudent } from '@/lib/queries/students';
import { getStudentAttendance } from '@/lib/queries/attendance';
import { getStudentResults } from '@/lib/queries/results';
import { getStudentFees } from '@/lib/queries/fees';
import { StatCard } from '@/components/shared/StatCard';
import { ChartCard } from '@/components/shared/ChartCard';
import { ResultsBarChart } from '@/components/shared/ResultsBarChart';
import { StudentInfoCard } from '@/components/shared/StudentInfoCard';
import { QuickActionsGrid } from '@/components/shared/QuickActionsGrid';
import { Navbar } from '@/components/shared/Navbar';
import { CalendarCheck, GraduationCap, CreditCard } from 'lucide-react';
import Link from 'next/link';

export default async function StudentDashboardPage() {
  const { data: student, error: studentErr } = await getCurrentStudent();

  if (studentErr || !student) {
    return (
      <div className="space-y-6">
        <Navbar title="Student Dashboard" role="student" />
        <div className="bg-amber-50 border border-amber-200 p-6 rounded-xl text-amber-800">
          <h3 className="text-base font-bold mb-1">Student Record Pending</h3>
          <p className="text-sm">
            Your auth account is active, but your student record profile is not yet seeded. If you just created this project, please run <code className="bg-amber-100 px-1.5 py-0.5 rounded font-mono text-xs">npm run seed</code> in your terminal.
          </p>
        </div>
      </div>
    );
  }

  const { stats: attStats } = await getStudentAttendance(student.id);
  const { data: results } = await getStudentResults(student.id);
  const { data: fees } = await getStudentFees(student.id);

  const totalFeeDue = fees.reduce((acc, curr) => acc + Number(curr.amount_due), 0);
  const totalFeePaid = fees.reduce((acc, curr) => acc + Number(curr.amount_paid), 0);
  const pendingFee = totalFeeDue - totalFeePaid;

  const avgMarks = results.length > 0
    ? Math.round(results.reduce((acc, r) => acc + Number(r.marks), 0) / results.length)
    : 0;

  return (
    <div className="space-y-6">
      <Navbar title={`Welcome back, ${student.profile?.full_name || 'Student'}`} role="student" />

      {/* Student Info Card */}
      <StudentInfoCard student={student} />

      {/* Quick Actions Grid */}
      <QuickActionsGrid />

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <StatCard
          title="Attendance Rate"
          value={`${attStats.pct}%`}
          subtitle={`${attStats.present} Present / ${attStats.total} Total Days`}
          icon={<CalendarCheck className="w-5 h-5" />}
          color={attStats.pct >= 75 ? 'green' : 'amber'}
        />

        <StatCard
          title="Academic Average"
          value={`${avgMarks}%`}
          subtitle={`${results.length} subjects evaluated`}
          icon={<GraduationCap className="w-5 h-5" />}
          color="blue"
        />

        <StatCard
          title="Fee Payment Status"
          value={`$${pendingFee.toLocaleString()}`}
          subtitle={pendingFee > 0 ? `Paid: $${totalFeePaid.toLocaleString()} of $${totalFeeDue.toLocaleString()}` : 'All fees fully settled'}
          icon={<CreditCard className="w-5 h-5" />}
          color={pendingFee > 0 ? 'amber' : 'green'}
        />
      </div>

      {/* Charts & Breakdown Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <ChartCard title="Subject Performance Breakdown" subtitle="Mid-Sem Marks vs 100">
            <ResultsBarChart results={results} />
          </ChartCard>
        </div>

        <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between shadow-xs">
          <div>
            <h3 className="text-base font-semibold text-slate-800 mb-1">Attendance Log</h3>
            <p className="text-xs text-slate-500 mb-4">Recent presence record</p>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm py-2 border-b border-slate-100">
                <span className="text-slate-600 font-medium">Present Days</span>
                <span className="font-bold text-emerald-600">{attStats.present} days</span>
              </div>
              <div className="flex items-center justify-between text-sm py-2 border-b border-slate-100">
                <span className="text-slate-600 font-medium">Late Arrivals</span>
                <span className="font-bold text-amber-600">{attStats.late} days</span>
              </div>
              <div className="flex items-center justify-between text-sm py-2 border-b border-slate-100">
                <span className="text-slate-600 font-medium">Absences</span>
                <span className="font-bold text-red-600">{attStats.absent} days</span>
              </div>
            </div>
          </div>

          <Link href="/student/attendance" className="w-full mt-6 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-center font-semibold text-xs rounded-lg transition block">
            View Full Attendance Calendar
          </Link>
        </div>
      </div>
    </div>
  );
}

import React from 'react';
import { getAdminDashboardMetrics } from '@/lib/queries/dashboard';
import { Navbar } from '@/components/shared/Navbar';
import { StatCard } from '@/components/shared/StatCard';
import { AdminCharts } from '@/components/shared/AdminCharts';
import { Users, CalendarCheck, DollarSign, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default async function AdminDashboardPage() {
  const { data: stats } = await getAdminDashboardMetrics();

  const totalStudents = stats?.total_students || 0;
  const attendancePct = stats?.overall_attendance_pct || 0;
  const feesCollected = stats?.total_fees_collected || 0;
  const feesPending = stats?.total_fees_pending || 0;

  return (
    <div className="space-y-6">
      <Navbar title="Institutional Overview (Admin / Faculty)" role="admin" />

      {/* Admin Action Bar */}
      <div className="bg-purple-900 text-white p-6 rounded-2xl shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-semibold px-2.5 py-1 bg-purple-800/80 rounded-full border border-purple-700/50">
            Faculty Master Control
          </span>
          <h2 className="text-2xl font-bold mt-2">College Administrative Console</h2>
          <p className="text-purple-200 text-xs mt-1">Manage enrollments, bulk attendance, mark sheets, and fee collection</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link href="/admin/students" className="px-3.5 py-2 bg-white text-purple-900 hover:bg-purple-50 font-semibold text-xs rounded-lg transition shadow-xs">
            Manage Students
          </Link>
          <Link href="/admin/attendance" className="px-3.5 py-2 bg-purple-700 hover:bg-purple-600 text-white font-semibold text-xs rounded-lg transition border border-purple-600">
            Record Attendance
          </Link>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Enrolled Students"
          value={totalStudents}
          subtitle="Active Profiles"
          icon={<Users className="w-5 h-5" />}
          color="purple"
        />
        <StatCard
          title="Campus Attendance Rate"
          value={`${attendancePct}%`}
          subtitle="30-Day Aggregate"
          icon={<CalendarCheck className="w-5 h-5" />}
          color="blue"
        />
        <StatCard
          title="Total Fees Collected"
          value={`$${feesCollected.toLocaleString()}`}
          subtitle="Settled Payments"
          icon={<DollarSign className="w-5 h-5" />}
          color="green"
        />
        <StatCard
          title="Outstanding Dues"
          value={`$${feesPending.toLocaleString()}`}
          subtitle="Pending Collection"
          icon={<AlertCircle className="w-5 h-5" />}
          color="amber"
        />
      </div>

      {/* Recharts Aggregations */}
      <AdminCharts
        subjectAverages={stats?.subject_averages || []}
        feeStatusCounts={stats?.fee_status_counts}
      />
    </div>
  );
}

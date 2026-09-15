import React from 'react';
import { getCurrentStudent } from '@/lib/queries/students';
import { getStudentAttendance } from '@/lib/queries/attendance';
import { Navbar } from '@/components/shared/Navbar';
import { StatCard } from '@/components/shared/StatCard';
import { EmptyState } from '@/components/shared/EmptyState';
import { Calendar, CheckCircle2, XCircle, Clock } from 'lucide-react';

export default async function StudentAttendancePage() {
  const { data: student } = await getCurrentStudent();
  if (!student) return <EmptyState title="Student Not Found" description="Could not load student attendance." />;

  const { data: attendance, stats } = await getStudentAttendance(student.id);

  return (
    <div className="space-y-6">
      <Navbar title="Attendance Records" role="student" />

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <StatCard title="Overall Attendance" value={`${stats.pct}%`} icon={<Calendar className="w-5 h-5" />} color="blue" />
        <StatCard title="Present Days" value={stats.present} icon={<CheckCircle2 className="w-5 h-5" />} color="green" />
        <StatCard title="Late Days" value={stats.late} icon={<Clock className="w-5 h-5" />} color="amber" />
        <StatCard title="Absent Days" value={stats.absent} icon={<XCircle className="w-5 h-5" />} color="slate" />
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800">Daily Attendance Log</h3>
          <span className="text-xs text-slate-500 font-medium">Total Entries: {attendance.length}</span>
        </div>

        {attendance.length === 0 ? (
          <EmptyState title="No Attendance Logs" description="Attendance logs have not been recorded yet." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-100 text-xs font-semibold uppercase text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Class</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {attendance.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-3.5 font-medium text-slate-800">{r.date}</td>
                    <td className="px-6 py-3.5">
                      {r.status === 'present' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3" /> Present
                        </span>
                      )}
                      {r.status === 'late' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                          <Clock className="w-3 h-3" /> Late
                        </span>
                      )}
                      {r.status === 'absent' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                          <XCircle className="w-3 h-3" /> Absent
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-3.5 text-slate-500">{student.class} - {student.section}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

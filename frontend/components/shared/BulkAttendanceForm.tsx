'use client';

import React, { useState } from 'react';
import { Student } from '@/lib/types';
import { submitBulkAttendance } from '@/lib/queries/mutations';
import { CheckCircle2, XCircle, Clock, Save } from 'lucide-react';

interface BulkAttendanceFormProps {
  students: Student[];
}

export function BulkAttendanceForm({ students }: BulkAttendanceFormProps) {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [attendanceState, setAttendanceState] = useState<Record<string, 'present' | 'absent' | 'late'>>(() => {
    const initial: Record<string, 'present' | 'absent' | 'late'> = {};
    students.forEach((s) => {
      initial[s.id] = 'present';
    });
    return initial;
  });

  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleStatusChange = (studentId: string, status: 'present' | 'absent' | 'late') => {
    setAttendanceState((prev) => ({ ...prev, [studentId]: status }));
  };

  const handleMarkAll = (status: 'present' | 'absent' | 'late') => {
    const updated: Record<string, 'present' | 'absent' | 'late'> = {};
    students.forEach((s) => {
      updated[s.id] = status;
    });
    setAttendanceState(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatusMsg(null);

    const payload = Object.entries(attendanceState).map(([student_id, status]) => ({
      student_id,
      date: selectedDate,
      status,
    }));

    const res = await submitBulkAttendance(payload);
    setSaving(false);

    if (res.success) {
      setStatusMsg({ type: 'success', text: `Successfully saved bulk attendance for ${payload.length} students on ${selectedDate}!` });
    } else {
      setStatusMsg({ type: 'error', text: res.error || 'Failed to record attendance' });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Top Options Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Attendance Date</label>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 font-medium focus:outline-none focus:border-purple-500"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1">Quick Actions</label>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => handleMarkAll('present')}
                className="px-2.5 py-1.5 bg-emerald-50 text-emerald-700 hover:bg-emerald-100 rounded text-xs font-semibold border border-emerald-200"
              >
                Mark All Present
              </button>
              <button
                type="button"
                onClick={() => handleMarkAll('absent')}
                className="px-2.5 py-1.5 bg-red-50 text-red-700 hover:bg-red-100 rounded text-xs font-semibold border border-red-200"
              >
                Mark All Absent
              </button>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm rounded-lg shadow-sm flex items-center gap-2 transition disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Saving...' : 'Submit Attendance Roll'}</span>
        </button>
      </div>

      {statusMsg && (
        <div
          className={`p-3 rounded-lg text-xs font-semibold border ${
            statusMsg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-red-50 text-red-800 border-red-200'
          }`}
        >
          {statusMsg.text}
        </div>
      )}

      {/* Attendance Grid Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-100 text-xs font-semibold uppercase text-slate-500 border-b border-slate-200">
            <tr>
              <th className="px-6 py-3">Roll No</th>
              <th className="px-6 py-3">Student Name</th>
              <th className="px-6 py-3">Class</th>
              <th className="px-6 py-3">Status Selection</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {students.map((s) => {
              const currentStatus = attendanceState[s.id] || 'present';
              return (
                <tr key={s.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-3.5 font-mono text-xs font-bold text-slate-800">{s.roll_no}</td>
                  <td className="px-6 py-3.5 font-semibold text-slate-800">{s.profile?.full_name || 'Student'}</td>
                  <td className="px-6 py-3.5 text-slate-500">{s.class} - {s.section}</td>
                  <td className="px-6 py-3.5">
                    <div className="inline-flex rounded-lg border border-slate-200 p-0.5 bg-slate-50">
                      <button
                        type="button"
                        onClick={() => handleStatusChange(s.id, 'present')}
                        className={`px-3 py-1 text-xs font-semibold rounded-md transition flex items-center gap-1 ${
                          currentStatus === 'present'
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <CheckCircle2 className="w-3 h-3" /> Present
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusChange(s.id, 'late')}
                        className={`px-3 py-1 text-xs font-semibold rounded-md transition flex items-center gap-1 ${
                          currentStatus === 'late'
                            ? 'bg-amber-500 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <Clock className="w-3 h-3" /> Late
                      </button>
                      <button
                        type="button"
                        onClick={() => handleStatusChange(s.id, 'absent')}
                        className={`px-3 py-1 text-xs font-semibold rounded-md transition flex items-center gap-1 ${
                          currentStatus === 'absent'
                            ? 'bg-red-600 text-white shadow-xs'
                            : 'text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        <XCircle className="w-3 h-3" /> Absent
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </form>
  );
}

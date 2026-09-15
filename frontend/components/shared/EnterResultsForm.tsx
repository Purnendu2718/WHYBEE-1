'use client';

import React, { useState } from 'react';
import { Student } from '@/lib/types';
import { upsertStudentResult } from '@/lib/queries/mutations';
import { Save, GraduationCap } from 'lucide-react';

interface EnterResultsFormProps {
  students: Student[];
}

export function EnterResultsForm({ students }: EnterResultsFormProps) {
  const [selectedStudentId, setSelectedStudentId] = useState<string>(students[0]?.id || '');
  const [subject, setSubject] = useState('Mathematics');
  const [term, setTerm] = useState('Mid-Sem 2024');
  const [marks, setMarks] = useState<number>(85);
  const [maxMarks, setMaxMarks] = useState<number>(100);

  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setStatusMsg(null);

    const res = await upsertStudentResult({
      student_id: selectedStudentId,
      subject,
      term,
      marks: Number(marks),
      max_marks: Number(maxMarks),
    });

    setSaving(false);

    if (res.success) {
      setStatusMsg({ type: 'success', text: `Successfully updated mark sheet for subject ${subject}!` });
    } else {
      setStatusMsg({ type: 'error', text: res.error || 'Failed to update result record' });
    }
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs max-w-2xl">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
        <div className="p-2.5 bg-purple-100 text-purple-700 rounded-lg">
          <GraduationCap className="w-6 h-6" />
        </div>
        <div>
          <h3 className="text-base font-bold text-slate-800">Enter / Update Student Marks</h3>
          <p className="text-xs text-slate-500">Subject mark sheet editor</p>
        </div>
      </div>

      {statusMsg && (
        <div
          className={`mb-6 p-3 rounded-lg text-xs font-semibold border ${
            statusMsg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-red-50 text-red-800 border-red-200'
          }`}
        >
          {statusMsg.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 mb-1">Select Student</label>
          <select
            value={selectedStudentId}
            onChange={(e) => setSelectedStudentId(e.target.value)}
            className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-purple-500 font-medium"
          >
            {students.map((s) => (
              <option key={s.id} value={s.id}>
                {s.roll_no} - {s.profile?.full_name || 'Student'} ({s.class})
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Subject Name</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-purple-500"
            >
              <option value="Mathematics">Mathematics</option>
              <option value="Reading Comprehension">Reading Comprehension</option>
              <option value="Writing Skills">Writing Skills</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Physics">Physics</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Term / Examination</label>
            <input
              type="text"
              value={term}
              onChange={(e) => setTerm(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Marks Obtained</label>
            <input
              type="number"
              min="0"
              max={maxMarks}
              value={marks}
              onChange={(e) => setMarks(Number(e.target.value))}
              required
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 font-bold focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Maximum Marks</label>
            <input
              type="number"
              min="1"
              value={maxMarks}
              onChange={(e) => setMaxMarks(Number(e.target.value))}
              required
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:border-purple-500"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving}
          className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-semibold text-sm rounded-lg shadow-sm flex items-center justify-center gap-2 transition disabled:opacity-50 mt-4"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? 'Updating Marks...' : 'Save Subject Marks'}</span>
        </button>
      </form>
    </div>
  );
}

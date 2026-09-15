import React from 'react';
import { getLinkedStudentsForParent } from '@/lib/queries/students';
import { getStudentResults } from '@/lib/queries/results';
import { Navbar } from '@/components/shared/Navbar';
import { ChartCard } from '@/components/shared/ChartCard';
import { ResultsBarChart } from '@/components/shared/ResultsBarChart';
import { ChildSwitcher } from '@/components/shared/ChildSwitcher';
import { EmptyState } from '@/components/shared/EmptyState';

export default async function ParentResultsPage({ searchParams }: { searchParams: { studentId?: string } }) {
  const { data: linkedStudents } = await getLinkedStudentsForParent();
  if (!linkedStudents || linkedStudents.length === 0) return <EmptyState title="No Linked Students" description="No student profiles are linked to this parent account." />;

  const selectedStudent = searchParams.studentId
    ? linkedStudents.find((s) => s.id === searchParams.studentId) || linkedStudents[0]
    : linkedStudents[0];

  const { data: results } = await getStudentResults(selectedStudent.id);

  return (
    <div className="space-y-6">
      <Navbar
        title={`Child Academic Results (${selectedStudent.profile?.full_name || 'Student'})`}
        role="parent"
        extraRight={<ChildSwitcher students={linkedStudents} currentStudentId={selectedStudent.id} />}
      />

      <ChartCard title="Child Subject Scores" subtitle="Mid-Sem Marks Sheet">
        <ResultsBarChart results={results} />
      </ChartCard>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <h3 className="text-sm font-bold text-slate-800">Subject Marks Table</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-100 text-xs font-semibold uppercase text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">Subject</th>
                <th className="px-6 py-3">Term</th>
                <th className="px-6 py-3">Marks Obtained</th>
                <th className="px-6 py-3">Max Marks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {results.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50 transition">
                  <td className="px-6 py-3.5 font-semibold text-slate-800">{r.subject}</td>
                  <td className="px-6 py-3.5 text-slate-500">{r.term}</td>
                  <td className="px-6 py-3.5 font-bold text-blue-600">{r.marks}</td>
                  <td className="px-6 py-3.5 text-slate-400">{r.max_marks || 100}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

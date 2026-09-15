import React from 'react';
import { getCurrentStudent } from '@/lib/queries/students';
import { getStudentResults } from '@/lib/queries/results';
import { Navbar } from '@/components/shared/Navbar';
import { ChartCard } from '@/components/shared/ChartCard';
import { ResultsBarChart } from '@/components/shared/ResultsBarChart';
import { EmptyState } from '@/components/shared/EmptyState';
import { GraduationCap, Award } from 'lucide-react';

export default async function StudentResultsPage() {
  const { data: student } = await getCurrentStudent();
  if (!student) return <EmptyState title="Student Not Found" description="Could not load examination marks." />;

  const { data: results } = await getStudentResults(student.id);

  const totalMarks = results.reduce((acc, r) => acc + Number(r.marks), 0);
  const totalMax = results.reduce((acc, r) => acc + Number(r.max_marks || 100), 0);
  const overallPct = totalMax > 0 ? Math.round((totalMarks / totalMax) * 100) : 0;

  return (
    <div className="space-y-6">
      <Navbar title="Examination Results & Marks" role="student" />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-blue-100 text-blue-700 rounded-xl">
            <GraduationCap className="w-8 h-8" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Overall Percentage</span>
            <div className="text-2xl font-bold text-slate-800">{overallPct}%</div>
            <p className="text-xs text-slate-500">{totalMarks} / {totalMax} total marks across {results.length} subjects</p>
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-4">
          <div className="p-3 bg-purple-100 text-purple-700 rounded-xl">
            <Award className="w-8 h-8" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Academic Grade Status</span>
            <div className="text-2xl font-bold text-purple-700">
              {overallPct >= 85 ? 'Grade A (Outstanding)' : overallPct >= 70 ? 'Grade B (Good)' : overallPct >= 50 ? 'Grade C (Satisfactory)' : 'Needs Improvement'}
            </div>
            <p className="text-xs text-slate-500">Term: Mid-Sem 2024</p>
          </div>
        </div>
      </div>

      <ChartCard title="Subject Performance Breakdown" subtitle="Comparison across subjects">
        <ResultsBarChart results={results} />
      </ChartCard>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 bg-slate-50">
          <h3 className="text-sm font-bold text-slate-800">Subject Grade Sheet</h3>
        </div>

        {results.length === 0 ? (
          <EmptyState title="No Results Found" description="Marks have not been uploaded for this student yet." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-100 text-xs font-semibold uppercase text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3">Subject</th>
                  <th className="px-6 py-3">Term</th>
                  <th className="px-6 py-3">Marks Obtained</th>
                  <th className="px-6 py-3">Max Marks</th>
                  <th className="px-6 py-3">Percentage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {results.map((r) => {
                  const pct = Math.round((Number(r.marks) / Number(r.max_marks || 100)) * 100);
                  return (
                    <tr key={r.id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-3.5 font-semibold text-slate-800">{r.subject}</td>
                      <td className="px-6 py-3.5 text-slate-500">{r.term}</td>
                      <td className="px-6 py-3.5 font-bold text-blue-600">{r.marks}</td>
                      <td className="px-6 py-3.5 text-slate-400">{r.max_marks || 100}</td>
                      <td className="px-6 py-3.5">
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${pct >= 75 ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-700'}`}>
                          {pct}%
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

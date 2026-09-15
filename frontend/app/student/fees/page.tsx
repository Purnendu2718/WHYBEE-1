import React from 'react';
import { getCurrentStudent } from '@/lib/queries/students';
import { getStudentFees } from '@/lib/queries/fees';
import { Navbar } from '@/components/shared/Navbar';
import { StatCard } from '@/components/shared/StatCard';
import { EmptyState } from '@/components/shared/EmptyState';
import { CreditCard, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';

export default async function StudentFeesPage() {
  const { data: student } = await getCurrentStudent();
  if (!student) return <EmptyState title="Student Not Found" description="Could not load fee records." />;

  const { data: fees } = await getStudentFees(student.id);

  const totalDue = fees.reduce((acc, f) => acc + Number(f.amount_due), 0);
  const totalPaid = fees.reduce((acc, f) => acc + Number(f.amount_paid), 0);
  const totalBalance = totalDue - totalPaid;

  return (
    <div className="space-y-6">
      <Navbar title="Fee Payment Tracker" role="student" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard title="Total Academic Dues" value={`$${totalDue.toLocaleString()}`} icon={<CreditCard className="w-5 h-5" />} color="blue" />
        <StatCard title="Total Paid" value={`$${totalPaid.toLocaleString()}`} icon={<CheckCircle2 className="w-5 h-5" />} color="green" />
        <StatCard title="Outstanding Balance" value={`$${totalBalance.toLocaleString()}`} icon={<AlertTriangle className="w-5 h-5" />} color={totalBalance > 0 ? 'amber' : 'green'} />
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800">Fee Statement & Status</h3>
          <span className="text-xs text-slate-500 font-medium">Status Tracker Only (No Gateway)</span>
        </div>

        {fees.length === 0 ? (
          <EmptyState title="No Fee Records" description="No fee records have been issued for this student." />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-100 text-xs font-semibold uppercase text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3">Term</th>
                  <th className="px-6 py-3">Amount Due</th>
                  <th className="px-6 py-3">Amount Paid</th>
                  <th className="px-6 py-3">Balance</th>
                  <th className="px-6 py-3">Due Date</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {fees.map((f) => {
                  const bal = Number(f.amount_due) - Number(f.amount_paid);
                  return (
                    <tr key={f.id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-3.5 font-semibold text-slate-800">{f.term}</td>
                      <td className="px-6 py-3.5 font-medium text-slate-700">${Number(f.amount_due).toLocaleString()}</td>
                      <td className="px-6 py-3.5 font-medium text-emerald-600">${Number(f.amount_paid).toLocaleString()}</td>
                      <td className="px-6 py-3.5 font-bold text-slate-800">${bal.toLocaleString()}</td>
                      <td className="px-6 py-3.5 text-slate-500">{f.due_date}</td>
                      <td className="px-6 py-3.5">
                        {f.status === 'paid' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                            <CheckCircle2 className="w-3 h-3" /> Paid
                          </span>
                        )}
                        {f.status === 'partial' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">
                            <Clock className="w-3 h-3" /> Partial
                          </span>
                        )}
                        {f.status === 'unpaid' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800">
                            <AlertTriangle className="w-3 h-3" /> Unpaid
                          </span>
                        )}
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

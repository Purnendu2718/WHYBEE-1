'use client';

import React, { useState } from 'react';
import { updateFeePayment } from '@/lib/queries/mutations';
import { CheckCircle2, Clock, AlertTriangle, Edit3 } from 'lucide-react';

interface ManageFeesListProps {
  studentsWithFees: any[];
}

export function ManageFeesList({ studentsWithFees }: ManageFeesListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [amountPaid, setAmountPaid] = useState<number>(0);
  const [status, setStatus] = useState<'paid' | 'partial' | 'unpaid'>('paid');
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  const startEdit = (feeItem: any) => {
    setEditingId(feeItem.id);
    setAmountPaid(Number(feeItem.amount_paid));
    setStatus(feeItem.status);
    setMsg(null);
  };

  const handleSave = async (feeId: string) => {
    setSaving(true);
    setMsg(null);
    const res = await updateFeePayment(feeId, amountPaid, status);
    setSaving(false);

    if (res.success) {
      setEditingId(null);
      setMsg('Fee record updated successfully! Reload page to see overall balance change.');
    } else {
      setMsg(res.error || 'Failed to update fee record');
    }
  };

  return (
    <div className="space-y-4">
      {msg && (
        <div className="p-3 bg-purple-50 border border-purple-200 text-purple-800 rounded-lg text-xs font-semibold">
          {msg}
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <h3 className="text-sm font-bold text-slate-800">Student Fee Management Records</h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-100 text-xs font-semibold uppercase text-slate-500 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3">Student Name</th>
                <th className="px-6 py-3">Roll No</th>
                <th className="px-6 py-3">Term</th>
                <th className="px-6 py-3">Amount Due</th>
                <th className="px-6 py-3">Amount Paid</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {studentsWithFees.map((f) => {
                const isEditing = editingId === f.id;
                return (
                  <tr key={f.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-3.5 font-semibold text-slate-800">{f.students?.profile?.full_name || 'Student'}</td>
                    <td className="px-6 py-3.5 font-mono text-xs text-slate-500">{f.students?.roll_no}</td>
                    <td className="px-6 py-3.5 text-slate-600">{f.term}</td>
                    <td className="px-6 py-3.5 font-medium text-slate-800">${Number(f.amount_due).toLocaleString()}</td>
                    <td className="px-6 py-3.5">
                      {isEditing ? (
                        <input
                          type="number"
                          value={amountPaid}
                          onChange={(e) => setAmountPaid(Number(e.target.value))}
                          className="w-24 px-2 py-1 border border-purple-400 rounded text-xs font-bold text-slate-800 focus:outline-none"
                        />
                      ) : (
                        <span className="font-bold text-emerald-600">${Number(f.amount_paid).toLocaleString()}</span>
                      )}
                    </td>
                    <td className="px-6 py-3.5">
                      {isEditing ? (
                        <select
                          value={status}
                          onChange={(e) => setStatus(e.target.value as any)}
                          className="px-2 py-1 border border-purple-400 rounded text-xs font-semibold focus:outline-none"
                        >
                          <option value="paid">Paid</option>
                          <option value="partial">Partial</option>
                          <option value="unpaid">Unpaid</option>
                        </select>
                      ) : (
                        <>
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
                        </>
                      )}
                    </td>
                    <td className="px-6 py-3.5">
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleSave(f.id)}
                            disabled={saving}
                            className="px-2.5 py-1 bg-purple-600 text-white rounded text-xs font-semibold hover:bg-purple-700"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-2.5 py-1 bg-slate-200 text-slate-700 rounded text-xs font-semibold hover:bg-slate-300"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => startEdit(f)}
                          className="px-2.5 py-1 text-xs font-semibold text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded border border-purple-200 flex items-center gap-1"
                        >
                          <Edit3 className="w-3 h-3" /> Edit Status
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

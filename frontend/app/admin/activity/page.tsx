import React from 'react';
import { createClient } from '@/lib/supabase/server';
import { Navbar } from '@/components/shared/Navbar';
import { Activity, AlertCircle } from 'lucide-react';

interface AuditEntry {
  id: string;
  actor_profile_id: string;
  action: string;
  target_table: string;
  target_id: string | null;
  details: Record<string, unknown> | null;
  created_at: string;
  actor?: { full_name: string; role: string };
}

const ACTION_STYLES: Record<string, { label: string; color: string }> = {
  mark_attendance:   { label: 'Attendance',  color: 'bg-blue-100 text-blue-700' },
  update_result:     { label: 'Results',     color: 'bg-purple-100 text-purple-700' },
  update_fee_status: { label: 'Fee Update',  color: 'bg-amber-100 text-amber-700' },
};

function formatAction(action: string) {
  return ACTION_STYLES[action] || { label: action, color: 'bg-slate-100 text-slate-600' };
}

function formatTime(ts: string) {
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(ts));
}

export default async function AdminActivityPage() {
  const supabase = createClient();

  const { data: logs, error } = await supabase
    .from('audit_log')
    .select('*, actor:profiles!audit_log_actor_profile_id_fkey(full_name, role)')
    .order('created_at', { ascending: false })
    .limit(50);

  return (
    <div className="space-y-6">
      <Navbar title="Recent Activity Log" role="admin" />

      <div className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
          <div className="p-2 bg-slate-100 rounded-lg text-slate-600">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-800">Admin Action Log</h3>
            <p className="text-xs text-slate-500">Last 50 write actions performed by faculty/admins</p>
          </div>
        </div>

        {error ? (
          <div className="flex items-center gap-3 px-6 py-8 text-sm text-red-600">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <span>Could not load audit log. Make sure the <code>audit_log</code> migration has been run in Supabase.</span>
          </div>
        ) : !logs || logs.length === 0 ? (
          <div className="py-16 text-center text-slate-400">
            <Activity className="w-8 h-8 mx-auto mb-3 text-slate-300" />
            <p className="text-sm font-medium">No activity recorded yet</p>
            <p className="text-xs mt-1">Admin writes (attendance, results, fees) will appear here in real time.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-xs font-semibold uppercase text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-6 py-3">Actor</th>
                  <th className="px-6 py-3">Action</th>
                  <th className="px-6 py-3">Table</th>
                  <th className="px-6 py-3">Details</th>
                  <th className="px-6 py-3">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(logs as AuditEntry[]).map((entry) => {
                  const { label, color } = formatAction(entry.action);
                  return (
                    <tr key={entry.id} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-3.5">
                        <p className="font-semibold text-slate-800 text-xs">
                          {(entry.actor as any)?.full_name || 'Unknown'}
                        </p>
                        <p className="text-[10px] text-slate-400 capitalize">
                          {(entry.actor as any)?.role || '—'}
                        </p>
                      </td>
                      <td className="px-6 py-3.5">
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${color}`}>
                          {label}
                        </span>
                      </td>
                      <td className="px-6 py-3.5 text-xs font-mono text-slate-500">
                        {entry.target_table}
                      </td>
                      <td className="px-6 py-3.5">
                        {entry.details ? (
                          <details className="cursor-pointer">
                            <summary className="text-[10px] text-blue-600 font-semibold">View details</summary>
                            <pre className="mt-1 text-[10px] text-slate-500 bg-slate-50 rounded p-2 max-w-xs overflow-x-auto">
                              {JSON.stringify(entry.details, null, 2)}
                            </pre>
                          </details>
                        ) : (
                          <span className="text-[10px] text-slate-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-3.5 text-xs text-slate-500 whitespace-nowrap">
                        {formatTime(entry.created_at)}
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

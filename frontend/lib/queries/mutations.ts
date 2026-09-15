import { createClient as createBrowserClient } from '@/lib/supabase/client';

// -------------------------------------------------------
// Audit log helper — inserts a row after every admin write.
// Called after successful mutations only; failures are silent
// so a log insert failure never breaks the main operation.
// -------------------------------------------------------
async function logAudit(
  action: string,
  targetTable: string,
  targetId?: string,
  details?: Record<string, unknown>
) {
  try {
    const supabase = createBrowserClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('audit_log').insert({
      actor_profile_id: user.id,
      action,
      target_table: targetTable,
      target_id: targetId || null,
      details: details || null,
    });
  } catch {
    // Intentionally silent — audit logging must never block the main operation
  }
}

// -------------------------------------------------------
// Mark bulk attendance for a date
// -------------------------------------------------------
export async function submitBulkAttendance(records: { student_id: string; date: string; status: 'present' | 'absent' | 'late' }[]) {
  try {
    const supabase = createBrowserClient();
    const { data, error } = await supabase
      .from('attendance')
      .upsert(records, { onConflict: 'student_id,date' })
      .select();

    if (error) return { success: false, error: error.message };

    // Audit: log one entry per attendance batch (summary)
    await logAudit('mark_attendance', 'attendance', undefined, {
      date: records[0]?.date,
      count: records.length,
      statuses: records.reduce<Record<string, number>>((acc, r) => {
        acc[r.status] = (acc[r.status] || 0) + 1;
        return acc;
      }, {}),
    });

    return { success: true, data, error: null };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to submit attendance' };
  }
}

// -------------------------------------------------------
// Upsert a student result / marks record
// -------------------------------------------------------
export async function upsertStudentResult(record: {
  id?: string;
  student_id: string;
  subject: string;
  term: string;
  marks: number;
  max_marks?: number;
}) {
  try {
    const supabase = createBrowserClient();
    const { data, error } = await supabase
      .from('results')
      .upsert(record)
      .select();

    if (error) return { success: false, error: error.message };

    const resultId = (data as any)?.[0]?.id;
    await logAudit('update_result', 'results', resultId, {
      student_id: record.student_id,
      subject: record.subject,
      term: record.term,
      marks: record.marks,
    });

    return { success: true, data, error: null };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update result record' };
  }
}

// -------------------------------------------------------
// Update fee payment status for a student
// -------------------------------------------------------
export async function updateFeePayment(feeId: string, amountPaid: number, status: 'paid' | 'partial' | 'unpaid') {
  try {
    const supabase = createBrowserClient();
    const { data, error } = await supabase
      .from('fees')
      .update({ amount_paid: amountPaid, status })
      .eq('id', feeId)
      .select();

    if (error) return { success: false, error: error.message };

    await logAudit('update_fee_status', 'fees', feeId, {
      amount_paid: amountPaid,
      status,
    });

    return { success: true, data, error: null };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update fee record' };
  }
}

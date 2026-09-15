import { createClient as createBrowserClient } from '@/lib/supabase/client';

export async function submitBulkAttendance(records: { student_id: string; date: string; status: 'present' | 'absent' | 'late' }[]) {
  try {
    const supabase = createBrowserClient();
    const { data, error } = await supabase
      .from('attendance')
      .upsert(records, { onConflict: 'student_id,date' })
      .select();

    if (error) return { success: false, error: error.message };
    return { success: true, data, error: null };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to submit attendance' };
  }
}

export async function upsertStudentResult(record: { id?: string; student_id: string; subject: string; term: string; marks: number; max_marks?: number }) {
  try {
    const supabase = createBrowserClient();
    const { data, error } = await supabase
      .from('results')
      .upsert(record)
      .select();

    if (error) return { success: false, error: error.message };
    return { success: true, data, error: null };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update result record' };
  }
}

export async function updateFeePayment(feeId: string, amountPaid: number, status: 'paid' | 'partial' | 'unpaid') {
  try {
    const supabase = createBrowserClient();
    const { data, error } = await supabase
      .from('fees')
      .update({ amount_paid: amountPaid, status })
      .eq('id', feeId)
      .select();

    if (error) return { success: false, error: error.message };
    return { success: true, data, error: null };
  } catch (err: any) {
    return { success: false, error: err.message || 'Failed to update fee record' };
  }
}

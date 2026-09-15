import { createClient } from '@/lib/supabase/server';
import { FeeRecord } from '@/lib/types';

export async function getStudentFees(studentId: string): Promise<{ data: FeeRecord[]; error: string | null }> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('fees')
      .select('*')
      .eq('student_id', studentId)
      .order('due_date', { ascending: true });

    if (error) return { data: [], error: error.message };
    return { data: data || [], error: null };
  } catch (err: any) {
    return { data: [], error: err.message || 'Failed to fetch fee records' };
  }
}

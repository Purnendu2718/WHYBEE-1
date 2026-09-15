import { createClient } from '@/lib/supabase/server';
import { ResultRecord } from '@/lib/types';

export async function getStudentResults(studentId: string): Promise<{ data: ResultRecord[]; error: string | null }> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('results')
      .select('*')
      .eq('student_id', studentId)
      .order('subject', { ascending: true });

    if (error) return { data: [], error: error.message };
    return { data: data || [], error: null };
  } catch (err: any) {
    return { data: [], error: err.message || 'Failed to fetch student results' };
  }
}

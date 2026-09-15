import { createClient } from '@/lib/supabase/server';
import { AttendanceRecord } from '@/lib/types';

export async function getStudentAttendance(studentId: string): Promise<{ data: AttendanceRecord[]; stats: { total: number; present: number; absent: number; late: number; pct: number }; error: string | null }> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('attendance')
      .select('*')
      .eq('student_id', studentId)
      .order('date', { ascending: false });

    if (error) {
      return { data: [], stats: { total: 0, present: 0, absent: 0, late: 0, pct: 0 }, error: error.message };
    }

    const records = data || [];
    const total = records.length;
    const present = records.filter(r => r.status === 'present').length;
    const absent = records.filter(r => r.status === 'absent').length;
    const late = records.filter(r => r.status === 'late').length;
    const pct = total > 0 ? Math.round((present / total) * 100) : 0;

    return {
      data: records,
      stats: { total, present, absent, late, pct },
      error: null
    };
  } catch (err: any) {
    return { data: [], stats: { total: 0, present: 0, absent: 0, late: 0, pct: 0 }, error: err.message };
  }
}

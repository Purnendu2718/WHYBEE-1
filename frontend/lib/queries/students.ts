import { createClient } from '@/lib/supabase/server';
import { Student } from '@/lib/types';

export async function getCurrentStudent(): Promise<{ data: Student | null; error: string | null }> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { data: null, error: 'Not authenticated' };

    const { data, error } = await supabase
      .from('students2')
      .select('*, profile:profiles(*)')
      .eq('profile_id', user.id)
      .single();

    if (error) return { data: null, error: error.message };
    return { data, error: null };
  } catch (err: any) {
    return { data: null, error: err.message || 'Failed to fetch student' };
  }
}

export async function getLinkedStudentsForParent(parentProfileId?: string): Promise<{ data: Student[]; error: string | null }> {
  try {
    const supabase = createClient();
    let targetId = parentProfileId;

    if (!targetId) {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return { data: [], error: 'Not authenticated' };
      targetId = user.id;
    }

    const { data, error } = await supabase
      .from('students2')
      .select('*, profile:profiles(*)')
      .eq('parent_profile_id', targetId);

    if (error) return { data: [], error: error.message };
    return { data: data || [], error: null };
  } catch (err: any) {
    return { data: [], error: err.message || 'Failed to fetch linked students' };
  }
}

export async function getPaginatedStudents(page = 1, limit = 10, search = ''): Promise<{ data: Student[]; total: number; error: string | null }> {
  try {
    const supabase = createClient();
    const offset = (page - 1) * limit;

    let query = supabase
      .from('students2')
      .select('*, profile:profiles(*), parent_profile:profiles(*)', { count: 'exact' });

    if (search) {
      query = query.or(`roll_no.ilike.%${search}%,class.ilike.%${search}%`);
    }

    const { data, count, error } = await query
      .order('roll_no', { ascending: true })
      .range(offset, offset + limit - 1);

    if (error) return { data: [], total: 0, error: error.message };
    return { data: data || [], total: count || 0, error: null };
  } catch (err: any) {
    return { data: [], total: 0, error: err.message || 'Failed to fetch students list' };
  }
}

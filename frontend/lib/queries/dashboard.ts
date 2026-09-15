import { createClient } from '@/lib/supabase/server';
import { AdminDashboardStats } from '@/lib/types';

export async function getAdminDashboardMetrics(): Promise<{ data: AdminDashboardStats | null; error: string | null }> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.rpc('get_admin_dashboard_stats');

    if (error) {
      // Fallback if RPC function is not installed yet
      return {
        data: {
          total_students: 0,
          overall_attendance_pct: 0,
          total_fees_collected: 0,
          total_fees_pending: 0,
          fee_status_counts: { paid: 0, partial: 0, unpaid: 0 },
          subject_averages: [],
        },
        error: error.message,
      };
    }

    return { data: data as AdminDashboardStats, error: null };
  } catch (err: any) {
    return { data: null, error: err.message || 'Failed to fetch admin stats' };
  }
}

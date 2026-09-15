export type UserRole = 'student' | 'parent' | 'admin';

export interface Profile {
  id: string;
  full_name: string;
  role: UserRole;
  email: string;
  created_at?: string;
}

export interface Student {
  id: string;
  profile_id: string;
  roll_no: string;
  class: string;
  section: string;
  dob?: string | null;
  gender?: string | null;
  parent_profile_id?: string | null;
  photo_url?: string | null;
  house?: string | null;
  created_at?: string;
  profile?: Profile;
  parent_profile?: Profile;
}

export interface AttendanceRecord {
  id: string;
  student_id: string;
  date: string;
  status: 'present' | 'absent' | 'late';
  created_at?: string;
  students?: Student;
}

export interface ResultRecord {
  id: string;
  student_id: string;
  subject: string;
  term: string;
  marks: number;
  max_marks: number;
  created_at?: string;
  students?: Student;
}

export interface FeeRecord {
  id: string;
  student_id: string;
  term: string;
  amount_due: number;
  amount_paid: number;
  due_date: string;
  status: 'paid' | 'partial' | 'unpaid';
  created_at?: string;
  students?: Student;
}

export interface AdminDashboardStats {
  total_students: number;
  overall_attendance_pct: number;
  total_fees_collected: number;
  total_fees_pending: number;
  fee_status_counts: {
    paid: number;
    partial: number;
    unpaid: number;
  };
  subject_averages: {
    subject: string;
    avg_marks: number;
  }[];
}

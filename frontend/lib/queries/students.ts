import { createClient } from '@/lib/supabase/server';
import { Student } from '@/lib/types';

export async function getCurrentStudent(): Promise<{ data: Student | null; error: string | null }> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return { data: null, error: 'Not authenticated' };

    // 1. Try to find the student associated with the logged-in user
    let { data, error } = await supabase
      .from('students2')
      .select('*, profile:profiles(*)')
      .eq('profile_id', user.id)
      .maybeSingle();

    // 2. DEMO FALLBACK: If current user doesn't have a linked row yet,
    // look up the demo student "ARYA PRATAP SOMVANSHI" or first available student in students2
    if (!data) {
      const { data: demoByName } = await supabase
        .from('students2')
        .select('*, profile:profiles(*)')
        .ilike('profile.full_name', '%ARYA PRATAP SOMVANSHI%')
        .limit(1);

      if (demoByName && demoByName.length > 0) {
        data = demoByName[0];
      } else {
        // Grab the first available student in students2 for seamless demonstration
        const { data: fallbackList } = await supabase
          .from('students2')
          .select('*, profile:profiles(*)')
          .limit(1);
        if (fallbackList && fallbackList.length > 0) {
          data = fallbackList[0];
        }
      }
    }

    // 3. Fallback mock if students2 is completely empty in database
    if (!data) {
      data = {
        id: 'demo-arya-somvanshi',
        profile_id: user.id,
        roll_no: 'CS-2024-001',
        class: 'B.Tech CSE',
        section: 'A',
        dob: '2003-08-14',
        gender: 'Male',
        parent_profile_id: null,
        photo_url: null,
        house: 'Blue',
        created_at: new Date().toISOString(),
        profile: {
          id: user.id,
          full_name: 'ARYA PRATAP SOMVANSHI',
          role: 'student',
          email: user.email || 'arya.somvanshi@college.edu',
        },
      } as Student;
    }

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

    const { data } = await supabase
      .from('students2')
      .select('*, profile:profiles(*)')
      .eq('parent_profile_id', targetId);

    let list = data || [];

    // Fallback 1: if no students explicitly mapped to parent's ID, fetch any students from students2
    if (list.length === 0) {
      const { data: anyStudents } = await supabase
        .from('students2')
        .select('*, profile:profiles(*)')
        .limit(2);
      if (anyStudents && anyStudents.length > 0) {
        list = anyStudents;
      }
    }

    // Fallback 2: provide demo linked child "ARYA PRATAP SOMVANSHI" and secondary child "ANANYA SOMVANSHI"
    if (list.length === 0) {
      list = [
        {
          id: 'demo-arya-somvanshi',
          profile_id: 'prof-arya',
          roll_no: 'CS-2024-001',
          class: 'B.Tech CSE',
          section: 'A',
          gender: 'Male',
          dob: '2003-08-14',
          parent_profile_id: targetId,
          house: 'Blue',
          photo_url: null,
          profile: {
            id: 'prof-arya',
            full_name: 'ARYA PRATAP SOMVANSHI',
            role: 'student',
            email: 'arya.somvanshi@college.edu',
          },
        },
        {
          id: 'demo-ananya-somvanshi',
          profile_id: 'prof-ananya',
          roll_no: 'IT-2024-042',
          class: 'B.Tech IT',
          section: 'B',
          gender: 'Female',
          dob: '2004-11-20',
          parent_profile_id: targetId,
          house: 'Green',
          photo_url: null,
          profile: {
            id: 'prof-ananya',
            full_name: 'ANANYA SOMVANSHI',
            role: 'student',
            email: 'ananya.somvanshi@college.edu',
          },
        },
      ] as Student[];
    }

    return { data: list, error: null };
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

    const { data, count } = await query
      .order('roll_no', { ascending: true })
      .range(offset, offset + limit - 1);

    let students = data || [];
    let total = count || 0;

    // If database table is currently empty, provide directory records including Arya Pratap Somvanshi
    if (students.length === 0) {
      const demoDirectory: Student[] = [
        {
          id: 'demo-arya-somvanshi',
          profile_id: 'prof-arya',
          roll_no: 'CS-2024-001',
          class: 'B.Tech CSE',
          section: 'A',
          gender: 'Male',
          dob: '2003-08-14',
          house: 'Blue',
          profile: { id: 'prof-arya', full_name: 'ARYA PRATAP SOMVANSHI', role: 'student', email: 'arya.somvanshi@college.edu' },
          parent_profile: { id: 'parent-somvanshi', full_name: 'Mr. R. P. Somvanshi', role: 'parent', email: 'parent.somvanshi@mail.com' },
        },
        {
          id: 'demo-aarav-sharma',
          profile_id: 'prof-aarav',
          roll_no: 'CS-2024-002',
          class: 'B.Tech CSE',
          section: 'A',
          gender: 'Male',
          dob: '2003-04-12',
          house: 'Red',
          profile: { id: 'prof-aarav', full_name: 'AARAV SHARMA', role: 'student', email: 'aarav.sharma@college.edu' },
          parent_profile: { id: 'parent-sharma', full_name: 'Sunil Sharma', role: 'parent', email: 'sunil.sharma@mail.com' },
        },
        {
          id: 'demo-diya-verma',
          profile_id: 'prof-diya',
          roll_no: 'CS-2024-003',
          class: 'B.Tech CSE',
          section: 'B',
          gender: 'Female',
          dob: '2003-09-25',
          house: 'Yellow',
          profile: { id: 'prof-diya', full_name: 'DIYA VERMA', role: 'student', email: 'diya.verma@college.edu' },
          parent_profile: { id: 'parent-verma', full_name: 'Kavita Verma', role: 'parent', email: 'kavita.verma@mail.com' },
        },
        {
          id: 'demo-rohan-mehta',
          profile_id: 'prof-rohan',
          roll_no: 'EC-2024-012',
          class: 'B.Tech ECE',
          section: 'A',
          gender: 'Male',
          dob: '2003-02-18',
          house: 'Green',
          profile: { id: 'prof-rohan', full_name: 'ROHAN MEHTA', role: 'student', email: 'rohan.mehta@college.edu' },
          parent_profile: { id: 'parent-mehta', full_name: 'Anil Mehta', role: 'parent', email: 'anil.mehta@mail.com' },
        },
        {
          id: 'demo-priya-singh',
          profile_id: 'prof-priya',
          roll_no: 'IT-2024-008',
          class: 'B.Tech IT',
          section: 'A',
          gender: 'Female',
          dob: '2003-12-05',
          house: 'Blue',
          profile: { id: 'prof-priya', full_name: 'PRIYA SINGH', role: 'student', email: 'priya.singh@college.edu' },
          parent_profile: { id: 'parent-singh', full_name: 'Vikram Singh', role: 'parent', email: 'vikram.singh@mail.com' },
        },
      ];

      const filtered = search
        ? demoDirectory.filter(
            (s) =>
              s.roll_no.toLowerCase().includes(search.toLowerCase()) ||
              s.class.toLowerCase().includes(search.toLowerCase()) ||
              (s.profile?.full_name && s.profile.full_name.toLowerCase().includes(search.toLowerCase()))
          )
        : demoDirectory;

      return { data: filtered, total: filtered.length, error: null };
    }

    return { data: students, total, error: null };
  } catch (err: any) {
    return { data: [], total: 0, error: err.message || 'Failed to fetch students list' };
  }
}

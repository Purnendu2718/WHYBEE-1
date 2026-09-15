import fs from 'fs';
import path from 'path';

// Load .env.local automatically into process.env if present
const envLocalPath = path.join(process.cwd(), '.env.local');
if (fs.existsSync(envLocalPath)) {
  const envConfig = fs.readFileSync(envLocalPath, 'utf-8');
  envConfig.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const [key, ...valueParts] = trimmed.split('=');
      if (key && valueParts.length > 0) {
        process.env[key.trim()] = valueParts.join('=').trim();
      }
    }
  });
}

import { parse } from 'csv-parse/sync';
import { createAdminClient } from '../lib/supabase/admin';

async function seedDatabase() {
  console.log('🌱 Starting database seed script...');
  const supabase = createAdminClient();

  const csvPath = path.join(process.cwd(), 'data', 'students-performance-sample.csv');
  if (!fs.existsSync(csvPath)) {
    console.error('❌ CSV file not found at:', csvPath);
    process.exit(1);
  }

  const csvContent = fs.readFileSync(csvPath, 'utf-8');
  const records = parse(csvContent, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  });

  console.log(`📊 Found ${records.length} records in CSV.`);

  // DEFAULT PASSWORDS FOR SEED USERS
  const DEFAULT_PASSWORD = 'Password123!';
  const houses = ['Red', 'Blue', 'Green', 'Yellow'];

  // 1. CREATE ADMIN USERS
  console.log('👤 Creating Admin user...');
  const { data: adminAuth, error: adminErr } = await supabase.auth.admin.createUser({
    email: 'admin@college.edu',
    password: DEFAULT_PASSWORD,
    email_confirm: true,
    user_metadata: { role: 'admin', full_name: 'Dr. Arthur Pendelton' },
  });

  if (adminErr && !adminErr.message.includes('already registered')) {
    console.error('Error creating admin:', adminErr.message);
  } else {
    const adminId = adminAuth.user?.id;
    if (adminId) {
      await supabase.from('profiles').upsert({
        id: adminId,
        full_name: 'Dr. Arthur Pendelton',
        role: 'admin',
        email: 'admin@college.edu',
      });
      console.log('✅ Admin account ready: admin@college.edu / Password123!');
    }
  }

  // 2. CREATE PARENT USERS
  console.log('👨‍👩‍👧 Creating Parent users...');
  const parentEmails = ['parent1@college.edu', 'parent2@college.edu', 'parent3@college.edu'];
  const parentNames = ['Robert Smith', 'Elena Rodriguez', 'David Chen'];
  const parentProfileIds: string[] = [];

  for (let i = 0; i < parentEmails.length; i++) {
    const { data: pAuth, error: pErr } = await supabase.auth.admin.createUser({
      email: parentEmails[i],
      password: DEFAULT_PASSWORD,
      email_confirm: true,
      user_metadata: { role: 'parent', full_name: parentNames[i] },
    });

    let pId = pAuth.user?.id;
    if (!pId) {
      const { data: existing } = await supabase.from('profiles').select('id').eq('email', parentEmails[i]).single();
      pId = existing?.id;
    }

    if (pId) {
      await supabase.from('profiles').upsert({
        id: pId,
        full_name: parentNames[i],
        role: 'parent',
        email: parentEmails[i],
      });
      parentProfileIds.push(pId);
      console.log(`✅ Parent account ready: ${parentEmails[i]} / Password123!`);
    }
  }

  // 3. CREATE STUDENT USERS & ASSOCIATED DATA
  console.log('🎓 Seed Students, Results, Attendance & Fees...');
  const classes = ['B.Tech CS', 'B.Tech IT', 'B.Tech ECE'];
  const sections = ['A', 'B'];

  for (let index = 0; index < records.length; index++) {
    const row = records[index];
    const studentEmail = `student${index + 1}@college.edu`;
    const rollNo = `CS2024${String(index + 1).padStart(3, '0')}`;
    const studentName = `Student ${index + 1}`;
    const assignedClass = classes[index % classes.length];
    const assignedSection = sections[index % sections.length];
    const assignedParentId = parentProfileIds[index % parentProfileIds.length];
    const assignedHouse = houses[index % houses.length];
    const photoUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${rollNo}`;

    // Create Auth User
    const { data: sAuth, error: sErr } = await supabase.auth.admin.createUser({
      email: studentEmail,
      password: DEFAULT_PASSWORD,
      email_confirm: true,
      user_metadata: { role: 'student', full_name: studentName },
    });

    let sProfileId = sAuth.user?.id;
    if (!sProfileId) {
      const { data: existing } = await supabase.from('profiles').select('id').eq('email', studentEmail).single();
      sProfileId = existing?.id;
    }

    if (!sProfileId) continue;

    // Upsert Profile
    await supabase.from('profiles').upsert({
      id: sProfileId,
      full_name: studentName,
      role: 'student',
      email: studentEmail,
    });

    // Upsert Student
    const { data: studentRecord, error: studentInsertErr } = await supabase
      .from('students')
      .upsert(
        {
          profile_id: sProfileId,
          roll_no: rollNo,
          class: assignedClass,
          section: assignedSection,
          gender: row.gender,
          dob: '2003-05-15',
          parent_profile_id: assignedParentId,
          house: assignedHouse,
          photo_url: photoUrl,
        },
        { onConflict: 'roll_no' }
      )
      .select()
      .single();

    if (studentInsertErr || !studentRecord) {
      console.error(`Failed to insert student ${rollNo}:`, studentInsertErr?.message);
      continue;
    }

    const studentId = studentRecord.id;

    // Insert Results from CSV
    const mathMarks = parseFloat(row['math score']) || 70;
    const readingMarks = parseFloat(row['reading score']) || 75;
    const writingMarks = parseFloat(row['writing score']) || 72;

    await supabase.from('results').delete().eq('student_id', studentId);
    await supabase.from('results').insert([
      { student_id: studentId, subject: 'Mathematics', term: 'Mid-Sem 2024', marks: mathMarks, max_marks: 100 },
      { student_id: studentId, subject: 'Reading Comprehension', term: 'Mid-Sem 2024', marks: readingMarks, max_marks: 100 },
      { student_id: studentId, subject: 'Writing Skills', term: 'Mid-Sem 2024', marks: writingMarks, max_marks: 100 },
    ]);

    // Generate Attendance Logs (Past 30 Days)
    const attendanceData = [];
    const today = new Date();
    for (let d = 30; d >= 1; d--) {
      const date = new Date(today);
      date.setDate(date.getDate() - d);
      // Skip weekends
      if (date.getDay() === 0 || date.getDay() === 6) continue;

      const dateStr = date.toISOString().split('T')[0];
      const rand = Math.random();
      const status = rand > 0.15 ? 'present' : rand > 0.05 ? 'late' : 'absent';
      attendanceData.push({ student_id: studentId, date: dateStr, status });
    }

    await supabase.from('attendance').upsert(attendanceData, { onConflict: 'student_id,date' });

    // Generate Fee Record
    const feeStatusOptions: ('paid' | 'partial' | 'unpaid')[] = ['paid', 'paid', 'partial', 'unpaid'];
    const feeStatus = feeStatusOptions[index % feeStatusOptions.length];
    const amountDue = 50000;
    const amountPaid = feeStatus === 'paid' ? 50000 : feeStatus === 'partial' ? 25000 : 0;

    await supabase.from('fees').delete().eq('student_id', studentId);
    await supabase.from('fees').insert({
      student_id: studentId,
      term: 'Fall 2024',
      amount_due: amountDue,
      amount_paid: amountPaid,
      due_date: '2024-12-15',
      status: feeStatus,
    });
  }

  console.log('🎉 Database seeding completed successfully!');
  console.log('----------------------------------------------------');
  console.log('Demo Credentials:');
  console.log('🔑 Admin:   admin@college.edu  / Password123!');
  console.log('🔑 Parent:  parent1@college.edu / Password123!');
  console.log('🔑 Student: student1@college.edu / Password123!');
  console.log('----------------------------------------------------');
}

seedDatabase().catch((err) => {
  console.error('Seed script error:', err);
  process.exit(1);
});

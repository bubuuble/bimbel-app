// FILE: app/dashboard/class/[classId]/page.tsx

import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import TeacherClassView from "../../components/TeacherClassView";
import StudentClassView from "../../components/StudentClassView";

export default async function ClassDetailPage({ params }: { params: { classId: string } }) {
  const supabase = await createClient();
  const { classId } = params;

  // 1. Otorisasi Pengguna
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return redirect('/login');
  }

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (!profile) {
    return <div>Error: Profile not found.</div>;
  }

  // 2. Ambil Info Kelas
  const { data: classInfo, error: classError } = await supabase.from('classes').select('id, name, description, teacher_id').eq('id', classId).single();
  if (classError || !classInfo) {
    notFound(); // Tampilkan halaman 404 jika kelas tidak ada
  }

  // 3. Tentukan Hak Akses Pengguna
  const isTeacherOwner = profile.role === 'GURU' && classInfo.teacher_id === user.id;
  const isAdmin = profile.role === 'ADMIN';
  const canManage = isTeacherOwner || isAdmin;

  const { data: enrollment } = await supabase.from('enrollments').select('id').eq('class_id', classId).eq('student_id', user.id).maybeSingle();
  const isEnrolledStudent = profile.role === 'SISWA' && !!enrollment;

  // Jika tidak punya hak akses, tolak
  if (!canManage && !isEnrolledStudent) {
    return (
      <div style={{ padding: '2rem' }}>
        <h1>Access Denied</h1>
        <p>You are not authorized to view this class.</p>
        <Link href="/dashboard" style={{ textDecoration: 'underline' }}>&larr; Back to Dashboard</Link>
      </div>
    );
  }

  // 4. Ambil data umum yang dibutuhkan semua peran
  const { data: materials } = await supabase.from('materials').select('*').eq('class_id', classId).order('created_at', { ascending: false });

  // 5. Siapkan komponen view berdasarkan peran
  let viewComponent;
  if (canManage) {
    // Data khusus untuk GURU/ADMIN: Ambil semua riwayat sesi absensi
    const { data: initialSessions } = await supabase
      .from('attendance_sessions')
      .select('*')
      .eq('class_id', classId)
      .order('created_at', { ascending: false });

    viewComponent = (
      <TeacherClassView 
        classInfo={classInfo} 
        materials={materials || []}
        initialSessions={initialSessions || []}
      />
    );
  } else if (isEnrolledStudent) {
    // Data khusus untuk SISWA: Cari sesi yang sedang aktif
    const now = new Date().toISOString();
    const { data: activeSession } = await supabase.from('attendance_sessions')
      .select('id, title, expires_at')
      .eq('class_id', classId)
      .gt('expires_at', now)
      .order('created_at', { ascending: false })
      .limit(1).single();

    // Cek apakah siswa sudah absen di sesi aktif ini
    let hasAttended = false;
    if (activeSession) {
      const { data: attendanceRecord } = await supabase.from('attendance_records')
        .select('id')
        .eq('session_id', activeSession.id)
        .eq('student_id', user.id)
        .maybeSingle();
      hasAttended = !!attendanceRecord;
    }

    // Ambil data submission tugas siswa
    const { data: submissions } = await supabase.from('submissions').select('id, material_id, file_url').eq('student_id', user.id);

    viewComponent = (
      <StudentClassView
        user={user}
        classInfo={classInfo}
        materials={materials || []}
        activeSession={activeSession || null}
        hasAttended={hasAttended}
        submissions={submissions || []}
      />
    );
  }

  // 6. Render Halaman
  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <Link href="/dashboard" style={{ textDecoration: 'underline', marginBottom: '1rem', display: 'block' }}>&larr; Back to Dashboard</Link>
      <header style={{ borderBottom: '1px solid #eee', paddingBottom: '1.5rem', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', marginTop: '1rem', marginBottom: '0.5rem' }}>{classInfo.name}</h1>
        <p style={{ color: '#666', margin: 0 }}>{classInfo.description}</p>
      </header>
      
      <main>
        {viewComponent}
      </main>
    </div>
  );
}
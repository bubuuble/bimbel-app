// FILE: app/dashboard/class/[classId]/page.tsx

import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle } from "@/components/ui/alert";
import TeacherClassView from "../../components/TeacherClassView";
import StudentClassView from "../../components/StudentClassView";

export default async function ClassDetailPage({ params }: { params: Promise<{ classId: string }> }) {
  const { classId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return redirect('/login');
  }

  // Ambil profil pengguna untuk menentukan peran
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (!profile) {
    return (
        <div className="p-4"><Alert variant="destructive"><AlertTitle>Profil tidak ditemukan</AlertTitle></Alert></div>
    );
  }

  // 2. Ambil Informasi Dasar Kelas
  const { data: classInfo, error: classError } = await supabase
    .from('classes')
    .select('id, name, description, teacher_id')
    .eq('id', classId)
    .single();

  // Jika kelas tidak ada, tampilkan halaman 404
  if (classError || !classInfo) {
    notFound();
  }

  // 3. Tentukan Hak Akses Pengguna Terhadap Kelas Ini
  const isTeacherOwner = profile.role === 'GURU' && classInfo.teacher_id === user.id;
  const isAdmin = profile.role === 'ADMIN';
  const canManage = isTeacherOwner || isAdmin; // Guru pemilik atau Admin bisa mengelola kelas

  const { data: enrollment } = await supabase
    .from('enrollments')
    .select('id')
    .eq('class_id', classId)
    .eq('student_id', user.id)
    .maybeSingle();
  const isEnrolledStudent = profile.role === 'SISWA' && !!enrollment;

  // Jika pengguna bukan pengelola dan juga bukan siswa terdaftar, tolak akses
  if (!canManage && !isEnrolledStudent) {
    return (
      <div className="space-y-6 sm:space-y-8">
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-red-200 bg-red-50 py-16 text-center">
          <h3 className="text-sm font-semibold text-red-600 mb-2">Akses Ditolak</h3>
          <p className="text-xs text-red-500">Anda tidak memiliki izin untuk melihat halaman ini.</p>
        </div>
      </div>
    );
  }

  // 4. Ambil Data Umum (yang dibutuhkan oleh semua peran)
  const { data: materials } = await supabase
    .from('materials')
    .select(`*, material_files ( id, file_name, file_url )`)
    .eq('class_id', classId)
    .order('created_at', { ascending: false });

  // 5. Siapkan Variabel untuk Komponen Tampilan
  let viewComponent;

  // ===================================================================
  // LOGIKA PENGAMBILAN DATA BERDASARKAN PERAN PENGGUNA
  // ===================================================================

  if (canManage) {
    // --- Data yang dibutuhkan oleh GURU / ADMIN ---

    // Ambil riwayat sesi absensi
    const { data: initialSessions } = await supabase
      .from('attendance_sessions')
      .select('*')
      .eq('class_id', classId)
      .order('created_at', { ascending: false });

    // Ambil data ujian yang ada di kelas ini
    const { data: tests } = await supabase
      .from('tests')
      .select('*')
      .eq('class_id', classId)
      .order('created_at', { ascending: false });
    
    // --- Logika untuk form "Tambah Siswa" ---
    // a. Ambil ID semua siswa yang SUDAH terdaftar
    const { data: enrolledStudentIdsData } = await supabase
        .from('enrollments')
        .select('student_id')
        .eq('class_id', classId);
    
    const enrolledStudentIds = enrolledStudentIdsData?.map(e => e.student_id) || [];

    // b. Ambil semua profil SISWA yang ID-nya TIDAK ADA di daftar terdaftar
    let availableStudentsQuery = supabase
        .from('profiles')
        .select('id, name, username')
        .eq('role', 'SISWA')
        .order('name', { ascending: true });

    if (enrolledStudentIds.length > 0) {
        availableStudentsQuery = availableStudentsQuery.not('id', 'in', `(${enrolledStudentIds.join(',')})`);
    }
  
    const { data: availableStudents } = await availableStudentsQuery;

    // Render komponen TeacherClassView dengan semua data yang relevan
    viewComponent = (
      <TeacherClassView 
        classInfo={classInfo} 
        materials={materials || []}
        initialSessions={initialSessions || []}
        tests={tests || []}
        availableStudents={availableStudents || []} // Prop baru untuk form
      />
    );

  } else if (isEnrolledStudent) {
    // --- Data yang dibutuhkan oleh SISWA ---
    
    const now = new Date().toISOString();
    
    // Sesi absensi yang sedang aktif
    const { data: activeSession } = await supabase.from('attendance_sessions').select('id, title, expires_at').eq('class_id', classId).lte('start_time', now).gte('expires_at', now).order('start_time', { ascending: false }).limit(1).maybeSingle();
    
    // Sesi absensi terjadwal berikutnya
    const { data: scheduledSession } = await supabase.from('attendance_sessions').select('id, title, start_time').eq('class_id', classId).gt('start_time', now).order('start_time', { ascending: true }).limit(1).maybeSingle();

    // Cek apakah siswa sudah absen di sesi aktif
    let hasAttended = false;
    if (activeSession) {
      const { count } = await supabase.from('attendance_records').select('*', { count: 'exact', head: true }).eq('session_id', activeSession.id).eq('student_id', user.id);
      hasAttended = (count ?? 0) > 0;
    }

    // Ambil riwayat pengumpulan tugas siswa di kelas ini
    const { data: submissions } = await supabase.from('submissions').select('id, material_id, file_url, grade, feedback').eq('student_id', user.id).eq('class_id', classId);
    
    // Ambil data ujian dan riwayat pengerjaan ujian siswa di kelas ini
    const { data: tests } = await supabase.from('tests').select('*').eq('class_id', classId).order('created_at', { ascending: false });
    const { data: testSubmissions } = await supabase.from('test_submissions').select('*').eq('student_id', user.id).eq('class_id', classId);

    // Render komponen StudentClassView dengan semua data yang relevan
    viewComponent = (
      <StudentClassView
        user={user}
        classInfo={classInfo}
        materials={materials || []}
        activeSession={activeSession || null}
        scheduledSession={scheduledSession || null}
        hasAttended={hasAttended}
        submissions={submissions || []}
        tests={tests || []}
        testSubmissions={testSubmissions || []}
      />
    );
  }

  // 6. Ambil Statistik Tambahan untuk Header Halaman
  const [{ count: materialCount }, { count: studentCount }] = await Promise.all([
    supabase.from('materials').select('*', { count: 'exact', head: true }).eq('class_id', classId),
    supabase.from('enrollments').select('*', { count: 'exact', head: true }).eq('class_id', classId)
  ]);

  // 7. Render Halaman Lengkap
  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header Halaman */}
      <div>
        <Link href="/dashboard/kelas" className="text-sm font-medium text-indigo-600 hover:text-indigo-700 inline-flex items-center gap-1.5 mb-4">
            <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Kelas
        </Link>
        
        <div className="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <Badge variant="outline" className={`mb-3 ${canManage ? 'bg-indigo-50 text-indigo-700 border-indigo-200' : 'bg-teal-50 text-teal-700 border-teal-200'}`}>
                {canManage ? 'Mode Pengajar / Admin' : 'Mode Siswa'}
            </Badge>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-800">{classInfo.name}</h1>
            <p className="text-sm text-slate-500 mt-1 max-w-xl line-clamp-2">{classInfo.description || 'Tidak ada deskripsi'}</p>
          </div>
          <div className="flex gap-8 shrink-0">
            <div className="text-center">
                <p className="text-2xl font-bold text-slate-800">{materialCount || 0}</p>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-widest mt-1">Materi</p>
            </div>
            <div className="text-center">
                <p className="text-2xl font-bold text-slate-800">{studentCount || 0}</p>
                <p className="text-xs font-medium text-slate-400 uppercase tracking-widest mt-1">Siswa</p>
            </div>
          </div>
        </div>
      </div>

      {/* Konten Utama (berdasarkan peran pengguna) */}
      {viewComponent}
    </div>
  );
}
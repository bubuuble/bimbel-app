// FILE: app/dashboard/class/[classId]/page.tsx (FINAL & DIPERBAIKI)

import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Users, BookOpen, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import TeacherClassView from "../../components/TeacherClassView";
import StudentClassView from "../../components/StudentClassView";

// [PERBAIKAN] Mengubah cara menerima params agar lebih standar
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
    return (
        <div className="p-4"><Alert variant="destructive"><AlertTitle>Profil tidak ditemukan</AlertTitle></Alert></div>
    );
  }

  // 2. Ambil Info Kelas
  const { data: classInfo, error: classError } = await supabase
    .from('classes')
    .select('id, name, description, teacher_id')
    .eq('id', classId)
    .single();

  if (classError || !classInfo) {
    notFound();
  }

  // 3. Tentukan Hak Akses Pengguna
  const isTeacherOwner = profile.role === 'GURU' && classInfo.teacher_id === user.id;
  const isAdmin = profile.role === 'ADMIN';
  const canManage = isTeacherOwner || isAdmin;

  const { data: enrollment } = await supabase
    .from('enrollments')
    .select('id')
    .eq('class_id', classId)
    .eq('student_id', user.id)
    .maybeSingle();
  const isEnrolledStudent = profile.role === 'SISWA' && !!enrollment;

  if (!canManage && !isEnrolledStudent) {
    return (
        <div className="p-4"><Alert variant="destructive"><AlertTitle>Akses Ditolak</AlertTitle></Alert></div>
    );
  }

  // 4. Ambil data umum yang dibutuhkan semua peran
  const { data: materials } = await supabase
    .from('materials')
    .select(`*, material_files ( id, file_name, file_url )`)
    .eq('class_id', classId)
    .order('created_at', { ascending: false });

  // 5. Siapkan komponen tampilan berdasarkan peran
  let viewComponent;

  if (canManage) {
    // Data spesifik untuk Guru/Admin
    const { data: initialSessions } = await supabase
      .from('attendance_sessions')
      .select('*')
      .eq('class_id', classId)
      .order('created_at', { ascending: false });

    // [PERBAIKAN] Ambil data ujian untuk kelas ini
    const { data: tests } = await supabase
      .from('tests')
      .select('*')
      .eq('class_id', classId)
      .order('created_at', { ascending: false });

    viewComponent = (
      <TeacherClassView 
        classInfo={classInfo} 
        materials={materials || []}
        initialSessions={initialSessions || []}
        tests={tests || []} // <-- Kirim data 'tests' ke komponen
      />
    );
  } else if (isEnrolledStudent) {
    const now = new Date().toISOString();
    
    // Data spesifik untuk Siswa
    const { data: activeSession } = await supabase.from('attendance_sessions').select('id, title, expires_at').eq('class_id', classId).lte('start_time', now).gte('expires_at', now).order('start_time', { ascending: false }).limit(1).maybeSingle();
    const { data: scheduledSession } = await supabase.from('attendance_sessions').select('id, title, start_time').eq('class_id', classId).gt('start_time', now).order('start_time', { ascending: true }).limit(1).maybeSingle();

    let hasAttended = false;
    if (activeSession) {
      const { count } = await supabase.from('attendance_records').select('*', { count: 'exact', head: true }).eq('session_id', activeSession.id).eq('student_id', user.id);
      hasAttended = (count ?? 0) > 0;
    }

    const { data: submissions } = await supabase.from('submissions').select('id, material_id, file_url, grade, feedback').eq('student_id', user.id).eq('class_id', classId);
    
    // [PERBAIKAN] Ambil data ujian dan data pengerjaan ujian siswa
    const { data: tests } = await supabase.from('tests').select('*').eq('class_id', classId).order('created_at', { ascending: false });
    const { data: testSubmissions } = await supabase.from('test_submissions').select('*').eq('student_id', user.id).eq('class_id', classId);

    viewComponent = (
      <StudentClassView
        user={user}
        classInfo={classInfo}
        materials={materials || []}
        activeSession={activeSession || null}
        scheduledSession={scheduledSession || null}
        hasAttended={hasAttended}
        submissions={submissions || []}
        tests={tests || []} // <-- Kirim data 'tests' ke komponen
        testSubmissions={testSubmissions || []} // <-- Kirim data 'testSubmissions'
      />
    );
  }

  // Ambil statistik tambahan untuk header
  const [{ count: materialCount }, { count: studentCount }] = await Promise.all([
    supabase.from('materials').select('*', { count: 'exact', head: true }).eq('class_id', classId),
    supabase.from('enrollments').select('*', { count: 'exact', head: true }).eq('class_id', classId)
  ]);

  // 6. Render Halaman
  return (
    <div className="container mx-auto p-4 md:p-8 space-y-8">
      <div>
        <Link href="/dashboard/kelas" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-2 mb-4">
            <ArrowLeft className="w-4 h-4" /> Kembali ke Daftar Kelas
        </Link>
        <Card>
            <CardHeader className="flex flex-col md:flex-row md:justify-between gap-4">
                <div>
                    <Badge variant={canManage ? "default" : "secondary"}>{canManage ? 'Pengajar' : 'Siswa'}</Badge>
                    <h1 className="text-3xl font-bold tracking-tight mt-2">{classInfo.name}</h1>
                    <p className="text-lg text-muted-foreground mt-1">{classInfo.description}</p>
                </div>
                <div className="flex gap-4 items-start">
                    <div className="text-center"><p className="text-2xl font-bold">{materialCount || 0}</p><p className="text-xs text-muted-foreground">Materi</p></div>
                    <div className="text-center"><p className="text-2xl font-bold">{studentCount || 0}</p><p className="text-xs text-muted-foreground">Siswa</p></div>
                </div>
            </CardHeader>
        </Card>
      </div>

      {/* Main Content */}
      {viewComponent}
    </div>
  );
}
// FILE: app/dashboard/absensi/page.tsx (DENGAN LOGIKA PAGINATION)

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import TeacherGlobalAttendanceManager from "../components/TeacherGlobalAttendanceManager";
import type { AttendanceSession } from "@/lib/types";
import Link from "next/link";

const ITEMS_PER_PAGE = 5; // Ubah sesuai selera Anda, misal 5 atau 10

type TeacherClass = { 
  id: string; 
  name: string; 
};

type SessionWithClass = AttendanceSession & {
  classes: {
    name: string;
  } | null;
};

// 'searchParams' akan otomatis diisi oleh Next.js
export default async function GlobalAbsensiPage({ searchParams }: { searchParams: { page?: string } }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect('/login');
  
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'GURU') {
    return (
        <div style={{ padding: '2rem' }}>
          <h1>Akses Ditolak</h1>
          <p>Halaman ini hanya untuk Guru.</p>
          <Link href="/dashboard">Kembali ke Dashboard</Link>
        </div>
      );
  }

  // --- LOGIKA PAGINATION DIMULAI DI SINI ---
  const currentPage = parseInt(searchParams.page || '1', 10);
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  
  // Ambil total hitungan semua sesi milik guru ini
  const { count: totalSessions } = await supabase
    .from('attendance_sessions')
    .select('*', { count: 'exact', head: true })
    .eq('teacher_id', user.id);
    
  // Hitung total halaman
  const totalPages = Math.ceil((totalSessions || 0) / ITEMS_PER_PAGE);
  // --- AKHIR LOGIKA PAGINATION ---

  // Ambil daftar kelas guru (untuk form)
  const { data: teacherClasses } = await supabase
    .from('classes')
    .select('id, name')
    .eq('teacher_id', user.id)
    .order('name', { ascending: true });

  // Ambil sesi absensi HANYA UNTUK HALAMAN SAAT INI
  const { data: initialSessions } = await supabase
    .from('attendance_sessions')
    .select('*, classes(name)')
    .eq('teacher_id', user.id)
    .order('created_at', { ascending: false })
    .range(offset, offset + ITEMS_PER_PAGE - 1) // <-- Menggunakan .range()
    .returns<SessionWithClass[]>();

  return (
    <TeacherGlobalAttendanceManager 
      teacherClasses={teacherClasses || []}
      initialSessions={initialSessions || []}
      currentPage={currentPage}
      totalPages={totalPages}
    />
  );
}
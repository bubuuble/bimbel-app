// FILE: app/dashboard/kelas/page.tsx

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import TeacherClassesView from "../components/TeacherClassesView"; // Akan kita buat
import StudentClassesView from "../components/StudentClassesView"

export default async function KelasPage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, role')
    .eq('id', user.id)
    .single();
  
  if (!profile) {
    return <div>Profile not found.</div>
  }

  if (profile.role === 'GURU') {
    return <TeacherClassesView userProfile={profile} />;
  }

  if (profile.role === 'SISWA') {
    return <StudentClassesView userProfile={profile} />;
  }
  
  // Admin atau peran lain bisa diarahkan kembali atau diberi pesan
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Akses Ditolak</h1>
      <p>Halaman ini hanya untuk Guru dan Siswa.</p>
    </div>
  );
}
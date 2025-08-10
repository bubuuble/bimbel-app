// FILE: app/dashboard/absensi/page.tsx

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import TeacherGlobalAttendanceManager from "../components/TeacherGlobalAttendanceManager";

export default async function GlobalAbsensiPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect('/login');

  // Ambil semua kelas yang dimiliki guru untuk pilihan di form
  const { data: teacherClasses } = await supabase
    .from('classes')
    .select('id, name')
    .eq('teacher_id', user.id);
  
  // Ambil semua sesi absensi yang pernah dibuat oleh guru ini
  const { data: initialSessions } = await supabase
    .from('attendance_sessions')
    .select('*, classes(name)')
    .in('class_id', teacherClasses?.map(c => c.id) || [])
    .order('created_at', { ascending: false });

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <TeacherGlobalAttendanceManager 
        teacherClasses={teacherClasses || []}
        initialSessions={initialSessions || []}
      />
    </div>
  );
}
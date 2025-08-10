// FILE: app/dashboard/attendance-report/page.tsx (KODE LENGKAP)

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import AdminAttendanceReport from "../components/AdminAttendanceReport"; // Komponen yang akan kita buat

export default async function AttendanceReportPage() {
    const supabase = await createClient();

    // Otorisasi Admin
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return redirect('/login');
    
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (profile?.role !== 'ADMIN') {
      return (
          <div style={{ padding: '2rem' }}>
            <h1>Akses Ditolak</h1>
            <p>Halaman ini hanya untuk Admin.</p>
            <Link href="/dashboard">Kembali ke Dashboard</Link>
          </div>
        );
    }
    
    // Ambil data awal
    const { data: sessions } = await supabase.rpc('get_all_attendance_sessions_for_admin');

    return (
        <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
            <h1 style={{ marginBottom: '2rem' }}>Laporan Absensi Keseluruhan</h1>
            <AdminAttendanceReport initialSessions={sessions || []} />
        </div>
    );
}
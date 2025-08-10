// FILE: app/dashboard/kehadiran/page.tsx

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";

type AttendanceHistory = {
  status: string;
  submitted_at: string;
  attendance_sessions: {
    title: string;
    classes: {
      id: string;
      name: string;
    } | null;
  } | null;
};

export default async function KehadiranPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect('/login');

  // Ambil semua catatan kehadiran siswa, di-join dengan data sesi dan kelas
  const { data: history, error } = await supabase
    .from('attendance_records')
    .select(`
      status,
      submitted_at,
      attendance_sessions (
        title,
        classes (id, name)
      )
    `)
    .eq('student_id', user.id)
    .order('submitted_at', { ascending: false })
    .returns<AttendanceHistory[]>();

  if (error) {
    return <p>Gagal memuat riwayat: {error.message}</p>;
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem' }}>Riwayat Kehadiran</h1>
      {history.length === 0 ? (
        <p>Anda belum pernah melakukan absensi.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {history.map((rec, index) => (
            <div key={index} style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong>{rec.attendance_sessions?.title || 'Sesi Tanpa Judul'}</strong>
                <br />
                <small>
                  Kelas: 
                  <Link href={`/dashboard/class/${rec.attendance_sessions?.classes?.id}`}>
                    {rec.attendance_sessions?.classes?.name || 'N/A'}
                  </Link>
                </small>
              </div>
              <div>
                <span style={{ fontWeight: 'bold', color: rec.status === 'HADIR' ? 'green' : 'orange' }}>
                  {rec.status}
                </span>
                <br />
                <small>{new Date(rec.submitted_at).toLocaleString()}</small>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
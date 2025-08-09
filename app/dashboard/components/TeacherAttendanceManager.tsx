'use client'
import { createClient } from "@/lib/supabase/client";
import { useState } from "react";
import { createAttendanceSession } from "@/lib/actions"; // Asumsi action ini ada
import { useFormStatus } from "react-dom";

// Tipe data
type Session = { id: string; session_title: string | null; created_at: string };
type ReportRow = { 
  student_name: string | null; 
  student_username: string | null;
  status: string; 
  attended_at: string | null 
};

// Tombol submit untuk form buat sesi
function SubmitButton() {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending}>{pending ? "Membuka Sesi..." : "Buka Sesi Absensi Baru"}</button>
}

export default function TeacherAttendanceManager({ classId, initialSessions }: { classId: string, initialSessions: Session[] }) {
  const supabase = createClient();
  const [sessions, setSessions] = useState(initialSessions);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [reportData, setReportData] = useState<ReportRow[]>([]);
  const [isLoadingReport, setIsLoadingReport] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fungsi untuk mengambil laporan saat sesi diklik
  const handleSessionClick = async (sessionId: string) => {
    // Jika sesi yang sama diklik, sembunyikan laporan
    if (selectedSessionId === sessionId) {
      setSelectedSessionId(null);
      setReportData([]);
      return;
    }
    
    setIsLoadingReport(true);
    setError(null);
    setSelectedSessionId(sessionId);
    
    // Panggil fungsi RPC
    const { data, error } = await supabase.rpc('get_session_attendance_report', {
      p_session_id: sessionId
    });

    if (error) {
      console.error("Error fetching report:", error);
      setError(error.message);
      setReportData([]);
    } else if (data) {
      setReportData(data);
    }
    setIsLoadingReport(false);
  };
  
  return (
    <div style={{ marginTop: '2rem' }}>
      <h2>Manajemen Absensi</h2>
      
      {/* Form untuk membuat sesi baru */}
      <form action={async (formData) => {
        await createAttendanceSession(formData);
        // Refresh daftar sesi setelah membuat yang baru
        const { data: newSessions } = await supabase.from('attendance_sessions').select('*').eq('class_id', classId).order('created_at', { ascending: false });
        if (newSessions) setSessions(newSessions);
      }}>
        <input type="hidden" name="classId" value={classId} />
        <input type="text" name="sessionTitle" placeholder="Judul Sesi (Opsional)" required style={{ padding: '8px' }}/>
        <SubmitButton />
      </form>

      {/* Daftar Sesi */}
      <div style={{ marginTop: '1rem' }}>
        <h4>Riwayat Sesi:</h4>
        {sessions.length > 0 ? sessions.map(session => (
          <div key={session.id}>
            <button onClick={() => handleSessionClick(session.id)} style={{ textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', padding: '5px', color: selectedSessionId === session.id ? 'blue' : 'inherit' }}>
              {session.session_title || `Sesi ${new Date(session.created_at).toLocaleDateString()}`} - ({new Date(session.created_at).toLocaleString()})
            </button>
          </div>
        )) : <p>Belum ada sesi yang dibuat.</p>}
      </div>
      
      {/* Laporan Absensi (hanya muncul jika sesi dipilih) */}
      {selectedSessionId && (
        <div style={{ marginTop: '1.5rem' }}>
          <h4>Laporan untuk Sesi Terpilih:</h4>
          {isLoadingReport ? <p>Memuat laporan...</p> : error ? <p style={{color: 'red'}}>Error: {error}</p> : (
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#f0f0f0' }}>
                  <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Nama</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Status</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Waktu</th>
                </tr>
              </thead>
              <tbody>
                {reportData.map(student => (
                  <tr key={student.student_username}>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{student.student_name}</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd', fontWeight: 'bold', color: student.status === 'HADIR' ? 'green' : (student.status === 'ALPHA' ? 'grey' : 'red') }}>
                      {student.status}
                    </td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                      {student.attended_at ? new Date(student.attended_at).toLocaleTimeString() : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}
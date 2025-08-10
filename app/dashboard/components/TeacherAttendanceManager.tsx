'use client'
import { createClient } from "@/lib/supabase/client";
import { useState, useRef, type FormEvent } from "react";
import { createAttendanceSession } from "@/lib/actions";
import { useFormStatus } from "react-dom";
import type { AttendanceSession } from "@/lib/types"; // Pastikan tipe ini ada

// Tipe data untuk laporan dari fungsi RPC
type ReportRow = { 
  student_name: string | null; 
  student_username: string | null;
  status: string; 
  submitted_at: string | null;
  notes: string | null;
};

// Tombol submit untuk form buat sesi, agar ada status 'loading'
function SubmitButton() {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending}>{pending ? "Membuka Sesi..." : "Buka Sesi Absensi Baru (15 Menit)"}</button>
}

export default function TeacherAttendanceManager({ classId, initialSessions }: { classId: string, initialSessions: AttendanceSession[] }) {
  const supabase = createClient();
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [reportData, setReportData] = useState<ReportRow[]>([]);
  const [isLoadingReport, setIsLoadingReport] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSessionClick = async (sessionId: string) => {
    if (selectedSessionId === sessionId) {
      setSelectedSessionId(null);
      setReportData([]);
      return;
    }
    
    setIsLoadingReport(true);
    setError(null);
    setSelectedSessionId(sessionId);
    
    // Panggil fungsi RPC yang sudah kita buat
    const { data, error } = await supabase.rpc('get_session_attendance_report', {
      p_session_id: sessionId
    });

    if (error) {
      setError(`Gagal memuat laporan: ${error.message}`);
      setReportData([]);
    } else if (data) {
      setReportData(data);
    }
    setIsLoadingReport(false);
  };
  
  // Fungsi untuk menangani submit form secara manual agar bisa direset
  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    await createAttendanceSession(formData);
    formRef.current?.reset();
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <h2>Manajemen Absensi</h2>
      
      <form ref={formRef} onSubmit={handleFormSubmit}>
        <input type="hidden" name="classId" value={classId} />
        <input type="text" name="sessionTitle" placeholder="Judul Sesi (e.g., Pertemuan 3)" required style={{ padding: '8px', marginRight: '1rem' }}/>
        <SubmitButton />
      </form>

      <div style={{ marginTop: '1.5rem' }}>
        <h4>Riwayat Sesi:</h4>
        {initialSessions.length > 0 ? initialSessions.map(session => (
          <div key={session.id}>
            <button onClick={() => handleSessionClick(session.id)} style={{ textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', padding: '5px', color: selectedSessionId === session.id ? 'blue' : 'inherit', textAlign: 'left' }}>
              <strong>{session.title}</strong><br/>
              <small>Dibuka: {new Date(session.created_at).toLocaleString()}</small>
            </button>
          </div>
        )) : <p>Belum ada sesi yang dibuat.</p>}
      </div>
      
      {selectedSessionId && (
        <div style={{ marginTop: '1.5rem' }}>
          <h4>Laporan untuk Sesi Terpilih:</h4>
          {isLoadingReport ? <p>Memuat laporan...</p> : error ? <p style={{color: 'red'}}>{error}</p> : (
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#f0f0f0' }}>
                  <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Nama</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Status</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Waktu Absen</th>
                  <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Catatan</th>
                </tr>
              </thead>
              <tbody>
                {reportData.map((student, idx) => (
                  <tr key={student.student_username || idx}>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{student.student_name} (@{student.student_username})</td>
                    <td style={{ padding: '8px', border: '1px solid #ddd', fontWeight: 'bold', color: student.status === 'HADIR' ? 'green' : (student.status === 'ALPHA' ? 'grey' : 'red') }}>
                      {student.status}
                    </td>
                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                      {student.submitted_at ? new Date(student.submitted_at).toLocaleTimeString() : '-'}
                    </td>
                     <td style={{ padding: '8px', border: '1px solid #ddd' }}>{student.notes || '-'}</td>
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
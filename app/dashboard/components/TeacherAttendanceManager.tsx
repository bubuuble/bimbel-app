'use client'
import { createClient } from "@/lib/supabase/client";
import { useState, useRef, type FormEvent } from "react";
import { createAttendanceSession, updateAttendanceSession, deleteAttendanceSession } from "@/lib/actions";
import { useFormStatus } from "react-dom";
import type { AttendanceSession } from "@/lib/types";

type ReportRow = { 
  student_name: string | null; 
  student_username: string | null;
  status: string; 
  submitted_at: string | null;
  notes: string | null;
};

function SubmitButton({ text }: { text: string }) {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending}>{pending ? "Menyimpan..." : text}</button>
}

// Komponen baru untuk mengelola satu baris sesi
function SessionRow({ session, classId, onSelect, isSelected }: { session: AttendanceSession, classId: string, onSelect: () => void, isSelected: boolean }) {
  const [isEditing, setIsEditing] = useState(false);
  // State untuk menyimpan nilai input form
  const [title, setTitle] = useState(session.title);
  
  // Format waktu agar cocok dengan input datetime-local (YYYY-MM-DDTHH:mm)
  const formatDateTimeForInput = (dateString: string) => {
    const date = new Date(dateString);
    // Mengatasi masalah timezone offset
    const timezoneOffset = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() - timezoneOffset);
    return localDate.toISOString().slice(0, 16);
  };
  const [startTime, setStartTime] = useState(formatDateTimeForInput(session.start_time));

  return (
    <div style={{ padding: '10px', border: '1px solid #ccc', marginBottom: '10px', borderRadius: '5px', backgroundColor: isSelected ? '#e7f3ff' : 'transparent' }}>
      {isEditing ? (
        <form action={async (formData) => {
          await updateAttendanceSession(formData);
          setIsEditing(false);
        }} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          
          <input type="hidden" name="sessionId" value={session.id} />
          <input type="hidden" name="classId" value={classId} />
          
          <div>
            <label style={{fontWeight: 'bold'}}>Judul Sesi</label>
            <input 
              type="text" 
              name="newTitle" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)} 
              required 
              style={{ width: '100%', padding: '8px' }}
            />
          </div>

          <div>
            <label style={{fontWeight: 'bold'}}>Waktu Mulai Baru</label>
            <input 
              type="datetime-local" 
              name="newStartTime" 
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required 
              style={{ width: '100%', padding: '8px' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
            <button type="submit">Simpan Perubahan</button>
            <button type="button" onClick={() => setIsEditing(false)}>Batal</button>
          </div>
        </form>
      ) : (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <strong onClick={onSelect} style={{ cursor: 'pointer' }}>{session.title}</strong><br/>
            <small>Dijadwalkan: {new Date(session.start_time).toLocaleString()}</small>
          </div>
          <div style={{ display: 'flex', gap: '10px' }}>
            <button onClick={() => setIsEditing(true)}>Edit</button>
            <form action={deleteAttendanceSession}>
              <input type="hidden" name="sessionId" value={session.id} />
              <input type="hidden" name="classId" value={classId} />
              <button type="submit" style={{ backgroundColor: '#ffdddd', color: 'red' }}>Hapus</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
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
    const { data, error } = await supabase.rpc('get_session_attendance_report', { p_session_id: sessionId });
    if (error) {
      setError(`Gagal memuat laporan: ${error.message}`);
      setReportData([]);
    } else {
      setReportData(data);
    }
    setIsLoadingReport(false);
  };
  
  return (
    <div style={{ marginTop: '2rem' }}>
      <h2>Manajemen Absensi</h2>
      
      {/* Form untuk membuat sesi terjadwal */}
      <form ref={formRef} action={async (formData) => {
          await createAttendanceSession(formData);
          formRef.current?.reset();
        }} style={{ border: '1px solid #ddd', padding: '1rem', marginBottom: '1.5rem' }}>
        <h4>Buat Sesi Absensi Baru</h4>
        <input type="hidden" name="classId" value={classId} />
        <div>
          <label>Judul Sesi</label><br/>
          <input type="text" name="sessionTitle" placeholder="e.g., Pertemuan 4 - Quiz" required style={{ width: '100%', padding: '8px' }}/>
        </div>
        <div style={{ marginTop: '1rem' }}>
          <label>Waktu Mulai Absensi</label><br/>
          <input type="datetime-local" name="startTime" required style={{ padding: '8px' }}/>
        </div>
        <div style={{ marginTop: '1rem' }}>
          <SubmitButton text="Jadwalkan Sesi (Aktif 15 Menit)" />
        </div>
      </form>

      {/* Riwayat Sesi */}
      <div>
        <h4>Riwayat Sesi:</h4>
        {initialSessions.length > 0 ? initialSessions.map(session => (
          <SessionRow 
            key={session.id} 
            session={session} 
            classId={classId}
            onSelect={() => handleSessionClick(session.id)}
            isSelected={selectedSessionId === session.id}
          />
        )) : <p>Belum ada sesi yang dibuat.</p>}
      </div>
      
      {/* Tampilan Laporan Detail */}
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
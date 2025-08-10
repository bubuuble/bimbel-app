// FILE: app/dashboard/components/TeacherGlobalAttendanceManager.tsx (DENGAN PAGINATION)

'use client'
import { createClient } from "@/lib/supabase/client";
import { useState, useRef } from "react";
import { createAttendanceSession } from "@/lib/actions";
import { useFormStatus } from "react-dom";
import type { AttendanceSession } from "@/lib/types";
import ExportButton from "./ExportButton";
import PaginationControls from "./PaginationControls"; // <-- Impor

type ReportRow = { 
  student_name: string | null; 
  student_username: string | null;
  status: string; 
  submitted_at: string | null;
  notes: string | null;
};
type TeacherClass = { id: string; name: string; };
type SessionWithClass = AttendanceSession & {
  classes: { name: string; } | null;
};

function SubmitButton({ text }: { text: string }) {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending}>{pending ? "Menyimpan..." : text}</button>
}

function SessionRow({ session, onSelect, isSelected }: { session: SessionWithClass, onSelect: () => void, isSelected: boolean }) {
  return (
    <div style={{ padding: '10px', border: '1px solid #ccc', marginBottom: '10px', borderRadius: '5px', backgroundColor: isSelected ? '#e7f3ff' : 'transparent', cursor: 'pointer' }} onClick={onSelect}>
      <div>
        <strong>{session.title}</strong><br/>
        <small>Kelas: {session.classes?.name || 'N/A'} | Dijadwalkan: {new Date(session.start_time).toLocaleString()}</small>
      </div>
    </div>
  );
}

// Tambahkan props currentPage dan totalPages
export default function TeacherGlobalAttendanceManager({ 
    teacherClasses, 
    initialSessions,
    currentPage,
    totalPages
}: { 
    teacherClasses: TeacherClass[], 
    initialSessions: SessionWithClass[],
    currentPage: number;
    totalPages: number;
}) {
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
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <h1>Manajemen Absensi</h1>
      
      {/* ... Form tidak berubah ... */}
      {teacherClasses.length > 0 ? (
        <form ref={formRef} action={async (formData) => {
            await createAttendanceSession(formData);
            formRef.current?.reset();
          }} style={{ border: '1px solid #ddd', padding: '1.5rem', marginBottom: '2rem', borderRadius: '8px' }}>
          <h4>Buat Sesi Absensi Baru</h4>
          <div style={{ marginBottom: '1rem' }}>
            <label>Pilih Kelas</label><br/>
            <select name="classId" required style={{ width: '100%', padding: '8px', marginTop: '5px' }}>
              {teacherClasses.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label>Judul Sesi</label><br/>
            <input type="text" name="sessionTitle" placeholder="e.g., Pertemuan 5 - Review" required style={{ width: '100%', padding: '8px', marginTop: '5px' }}/>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label>Waktu Mulai Absensi</label><br/>
            <input type="datetime-local" name="startTime" required style={{ padding: '8px', marginTop: '5px' }}/>
          </div>
          <div style={{ marginTop: '1rem' }}>
            <SubmitButton text="Jadwalkan Sesi (Aktif 15 Menit)" />
          </div>
        </form>
      ) : (
        <div style={{ border: '1px solid #ddd', padding: '1.5rem', borderRadius: '8px', backgroundColor: '#fffbe6' }}>
            <p>Anda harus membuat minimal satu kelas untuk bisa membuat sesi absensi.</p>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(300px, 1fr) 2fr', gap: '2rem' }}>
        <div>
          <h4>Riwayat Sesi:</h4>
          {initialSessions.length > 0 ? (
            <div style={{ maxHeight: '500px', overflowY: 'auto', paddingRight: '10px' }}>
                {initialSessions.map(session => (
                  <SessionRow 
                    key={session.id} 
                    session={session} 
                    onSelect={() => handleSessionClick(session.id)}
                    isSelected={selectedSessionId === session.id}
                  />
                ))}
            </div>
          ) : <p>Belum ada sesi yang dibuat.</p>}
          {/* --- RENDER KONTROL PAGINATION DI SINI --- */}
          <PaginationControls currentPage={currentPage} totalPages={totalPages} />
        </div>
        
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h4>Detail Laporan:</h4>
            {selectedSessionId && reportData.length > 0 && (
                <ExportButton sessionId={selectedSessionId} />
            )}
          </div>
          {/* ... Sisa logika laporan tidak berubah ... */}
        </div>
      </div>
    </div>
  );
}
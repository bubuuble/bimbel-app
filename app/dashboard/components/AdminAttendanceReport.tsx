// FILE: app/dashboard/components/AdminAttendanceReport.tsx (KODE LENGKAP)

'use client'
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import ExportButton from "./ExportButton";

type SessionInfo = { 
  session_id: string; 
  session_title: string | null; 
  session_created_at: string; 
  class_name: string; 
  teacher_name: string | null; 
};

type ReportRow = { 
  student_name: string | null; 
  status: string; 
};

export default function AdminAttendanceReport({ initialSessions }: { initialSessions: SessionInfo[] }) {
    const [sessions, setSessions] = useState(initialSessions);
    const [selectedSessionReport, setSelectedSessionReport] = useState<ReportRow[]>([]);
    const [isReportLoading, setIsReportLoading] = useState(false);
    const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
    const supabase = createClient();

    const handleSessionClick = async (sessionId: string) => {
        setIsReportLoading(true);
        setSelectedSessionId(sessionId);
        setSelectedSessionReport([]);
        const { data, error } = await supabase.rpc('get_session_attendance_report', { p_session_id: sessionId });
        if (error) alert(`Error loading report: ${error.message}`);
        else if (data) setSelectedSessionReport(data as ReportRow[]);
        setIsReportLoading(false);
    };

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
            <div>
              <h4>Pilih Sesi:</h4>
              <ul style={{ listStyle: 'none', padding: 0, maxHeight: '60vh', overflowY: 'auto' }}>
                {sessions.map(s => (
                  <li key={s.session_id}>
                    <button onClick={() => handleSessionClick(s.session_id)} style={{ width: '100%', textAlign: 'left', padding: '8px', border: '1px solid #ccc', marginBottom: '5px', borderRadius: '4px', cursor: 'pointer' }}>
                      {s.session_title || `Sesi ${new Date(s.session_created_at).toLocaleDateString()}`}<br/>
                      <small>Kelas: {s.class_name} | Guru: {s.teacher_name}</small>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h4>Detail Laporan:</h4>
                {selectedSessionId && selectedSessionReport.length > 0 && (
                    <ExportButton sessionId={selectedSessionId} />
                )}
              </div>
              {isReportLoading ? <p>Loading report...</p> : selectedSessionReport.length > 0 ? (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f0f0f0' }}>
                            <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Nama Siswa</th>
                            <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {selectedSessionReport.map((r, i) => (
                        <tr key={`${r.student_name}-${i}`}><td>{r.student_name}</td><td>{r.status}</td></tr>
                        ))}
                    </tbody>
                </table>
              ) : <p>Pilih sesi untuk melihat detail.</p>}
            </div>
        </div>
    );
}
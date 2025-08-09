'use client'

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";
import UserRow from './UserRow'; 
import CreateUserForm from "./CreateUserForm";

// Tipe data
type UserProfile = { id: string; name: string | null; username: string | null; email: string | null; role: 'ADMIN' | 'GURU' | 'SISWA'; };
type SessionInfo = { session_id: string; session_title: string | null; session_created_at: string; class_name: string; teacher_name: string | null; };
type ReportRow = { student_name: string | null; status: string; };

export default function AdminView() {
  const [view, setView] = useState<'users' | 'attendance'>('users');
  
  // State untuk User Management
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  
  // State untuk Attendance Report
  const [sessions, setSessions] = useState<SessionInfo[]>([]);
  const [selectedSessionReport, setSelectedSessionReport] = useState<ReportRow[]>([]);
  const [isReportLoading, setIsReportLoading] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);

      if (view === 'users') {
        const { data, error } = await supabase.rpc('get_all_users');
        if (error) setError(error.message);
        else if (data) setProfiles(data);
      } else if (view === 'attendance') {
        const { data, error } = await supabase.rpc('get_all_attendance_sessions_for_admin');
        if (error) setError(error.message);
        else if (data) setSessions(data);
      }
      setLoading(false);
    };
    fetchData();
  }, [view, supabase]);

  const handleSessionClick = async (sessionId: string) => {
    setIsReportLoading(true);
    setSelectedSessionReport([]);
    const { data, error } = await supabase.rpc('get_session_attendance_report', { p_session_id: sessionId });
    if (error) alert(`Error loading report: ${error.message}`);
    else if (data) setSelectedSessionReport(data);
    setIsReportLoading(false);
  };

  const renderContent = () => {
    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: 'red' }}>Error: {error}</p>;

    if (view === 'users') {
      return (
        <div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ backgroundColor: '#f0f0f0' }}>
                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Name</th>
                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Username</th>
                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Current Role</th>
                <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Change Role</th>
              </tr>
            </thead>
            <tbody>
              {profiles.map((profile) => (
                <UserRow key={profile.id} profile={profile} />
              ))}
            </tbody>
          </table>
          <CreateUserForm />
        </div>
      );
    }

    if (view === 'attendance') {
      return (
        <div>
          <h2>Laporan Absensi Keseluruhan</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
            <div>
              <h4>Pilih Sesi:</h4>
              <ul style={{ listStyle: 'none', padding: 0, maxHeight: '400px', overflowY: 'auto' }}>
                {sessions.map(s => (
                  <li key={s.session_id}>
                    <button onClick={() => handleSessionClick(s.session_id)} style={{ width: '100%', textAlign: 'left', padding: '8px' }}>
                      {s.session_title || `Sesi ${new Date(s.session_created_at).toLocaleDateString()}`}<br/>
                      <small>Kelas: {s.class_name} | Guru: {s.teacher_name}</small>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4>Detail Laporan:</h4>
              {isReportLoading ? <p>Loading report...</p> : selectedSessionReport.length > 0 ? (
                <table>
                  <thead><tr><th>Nama Siswa</th><th>Status</th></tr></thead>
                  <tbody>
                    {selectedSessionReport.map(r => (
                      <tr key={r.student_name}><td>{r.student_name}</td><td>{r.status}</td></tr>
                    ))}
                  </tbody>
                </table>
              ) : <p>Pilih sesi untuk melihat detail.</p>}
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <div>
      <h1 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>Admin Dashboard</h1>
      <div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem' }}>
        <button onClick={() => setView('users')} style={{ padding: '8px 12px', border: view === 'users' ? '2px solid blue' : '2px solid transparent' }}>User Management</button>
        <button onClick={() => setView('attendance')} style={{ padding: '8px 12px', border: view === 'attendance' ? '2px solid blue' : '2px solid transparent' }}>Attendance Report</button>
      </div>
      {renderContent()}
    </div>
  );
}
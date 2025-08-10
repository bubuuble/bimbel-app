// FILE: app/dashboard/components/TeacherView.tsx (KODE LENGKAP)

'use client'
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState, useCallback } from "react";
import type { UserProfile } from "@/lib/types";

type TeacherStats = {
  total_kelas: number;
  total_siswa: number;
};

export default function TeacherView({ userProfile }: { userProfile: UserProfile }) {
  const [stats, setStats] = useState<TeacherStats | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchStats = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.rpc('get_teacher_dashboard_stats');
    if (data) setStats(data);
    if (error) console.error("Error fetching teacher stats:", error);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div>
      <h1 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>Teacher Dashboard</h1>

      <div style={{ border: '1px solid #ddd', padding: '1.5rem', borderRadius: '8px' }}>
        <h2>Statistik Anda</h2>
        {stats ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', textAlign: 'center' }}>
            <div style={{ border: '1px solid #eee', padding: '1rem', borderRadius: '6px' }}>
              <h4>Total Kelas</h4>
              <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '0.5rem 0', color: '#007bff' }}>{stats.total_kelas}</p>
              <small>Kelas yang Anda ajar</small>
            </div>
            <div style={{ border: '1px solid #eee', padding: '1rem', borderRadius: '6px' }}>
              <h4>Total Siswa</h4>
              <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '0.5rem 0', color: '#28a745' }}>{stats.total_siswa}</p>
              <small>Jumlah siswa di semua kelas</small>
            </div>
          </div>
        ) : (
          <p>Gagal memuat statistik.</p>
        )}
      </div>
      
      {/* Di sini Anda bisa menambahkan shortcut lain jika perlu */}
    </div>
  );
}
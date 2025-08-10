// FILE: app/dashboard/components/AdminView.tsx (GANTI SELURUH ISI)

'use client'
import { createClient } from "@/lib/supabase/client";
import { useEffect, useState, useCallback } from "react";

type AdminStats = {
  total_users: number;
  total_siswa: number;
  total_guru: number;
};

export default function AdminView() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchStats = useCallback(async () => {
    setLoading(true);
    const { data } = await supabase.rpc('get_admin_dashboard_stats');
    if (data) setStats(data);
    setLoading(false);
  }, [supabase]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div>
      <h1 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>Admin Dashboard</h1>

      <div style={{ border: '1px solid #ddd', padding: '1.5rem', borderRadius: '8px' }}>
        <h2>Statistik Pengguna</h2>
        {stats ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', textAlign: 'center' }}>
            <div style={{ border: '1px solid #eee', padding: '1rem', borderRadius: '6px' }}>
              <h4>Total Pengguna</h4>
              <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '0.5rem 0' }}>{stats.total_users}</p>
            </div>
            <div style={{ border: '1px solid #eee', padding: '1rem', borderRadius: '6px' }}>
              <h4>Total Guru</h4>
              <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '0.5rem 0' }}>{stats.total_guru}</p>
            </div>
            <div style={{ border: '1px solid #eee', padding: '1rem', borderRadius: '6px' }}>
              <h4>Total Siswa</h4>
              <p style={{ fontSize: '2.5rem', fontWeight: 'bold', margin: '0.5rem 0' }}>{stats.total_siswa}</p>
            </div>
          </div>
        ) : <p>Memuat statistik...</p>}
      </div>
    </div>
  );
}
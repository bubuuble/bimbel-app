'use client'

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState, useCallback } from "react";
import type { UserProfile } from "@/lib/types"; // Asumsi UserProfile ada di lib/types.ts
import Link from "next/link";
// ClassCard dan logic enroll tidak perlu diubah, jadi kita bisa biarkan

// --- Tipe Data Baru ---
type StudentStats = {
  total_kehadiran: number;
  persentase_tugas: number;
  total_kelas: number;
  rata_rata_nilai: number;
};

type RecentActivity = {
  id: number;
  created_at: string;
  materials: { // materials adalah objek tunggal
    title: string;
    classes: { // classes juga objek tunggal
      name: string;
    } | null;
  } | null;
};

// ... (Komponen ClassCard yang sudah ada bisa ditaruh di sini) ...

export default function StudentView({ userProfile }: { userProfile: UserProfile }) {
  const [stats, setStats] = useState<StudentStats | null>(null);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [enrolledClasses, setEnrolledClasses] = useState<any[]>([]); // Tipe bisa disesuaikan
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchData = useCallback(async () => {
    setLoading(true);

    // Panggil RPC untuk statistik
    const { data: statsData, error: statsError } = await supabase.rpc('get_student_dashboard_stats');
    if (statsData) setStats(statsData);
    if (statsError) console.error("Error fetching stats:", statsError);

    // Ambil aktivitas terakhir (5 submission terakhir)
    const { data: activityData } = await supabase
      .from('submissions')
      .select(`
        id, 
        created_at, 
        materials!inner ( 
          title, 
          classes!inner ( name ) 
        )
      `)
      .eq('student_id', userProfile.id)
      .order('created_at', { ascending: false })
      .limit(5)
      .returns<RecentActivity[]>(); // <-- Beri tahu Supabase tipe yang kita harapkan
    if (activityData) setRecentActivities(activityData);

    // Ambil kelas yang diikuti (untuk daftar "Kelas Saya")
    const { data: enrolledClassesData } = await supabase
      .from('enrollments')
      .select(`classes ( id, name )`)
      .eq('student_id', userProfile.id);
    if (enrolledClassesData) setEnrolledClasses(enrolledClassesData);
    
    setLoading(false);
  }, [supabase, userProfile.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div>
      <h1 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>Student Dashboard</h1>

      {/* --- BAGIAN STATISTIK --- */}
      <div style={{ marginBottom: '2rem', border: '1px solid #ddd', padding: '1.5rem', borderRadius: '8px' }}>
        <h2>Statistik Kamu</h2>
        {stats ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem', textAlign: 'center' }}>
            <div>
              <h4>Kehadiran</h4>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.total_kehadiran}</p>
              <small>Total Hadir</small>
            </div>
            <div>
              <h4>Tugas</h4>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.persentase_tugas.toFixed(0)}%</p>
              <small>Selesai</small>
            </div>
            <div>
              <h4>Total Kelas</h4>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.total_kelas}</p>
              <small>Diikuti</small>
            </div>
            <div>
              <h4>Rata-rata Nilai</h4>
              <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{stats.rata_rata_nilai.toFixed(1)}</p>
              <small>Dari 100</small>
            </div>
          </div>
        ) : <p>Memuat statistik...</p>}
      </div>

      {/* --- BAGIAN AKTIVITAS --- */}
      <div style={{ marginBottom: '2rem', border: '1px solid #ddd', padding: '1.5rem', borderRadius: '8px' }}>
        <h2>Aktivitas Kamu</h2>
        {recentActivities.length > 0 ? (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {recentActivities.map(activity => (
              <li key={activity.id} style={{ borderBottom: '1px solid #eee', padding: '10px 0' }}>
                Kamu Sudah Mengerjakan <strong>{activity.materials?.title}</strong>
                <br />
                <small>Di Kelas: {activity.materials?.classes?.name || 'N/A'} | Terakhir Disubmit: {new Date(activity.created_at).toLocaleString()}</small>
              </li>
            ))}
          </ul>
        ) : (
          <p>Kamu belum mengerjakan tugas apapun.</p>
        )}
      </div>
      
      {/* --- BAGIAN KELAS SAYA (Tampilan lama, tidak diubah) --- */}
      <div style={{ marginBottom: '2rem' }}>
        <h2>Kelas Saya</h2>
        {enrolledClasses.length > 0 ? (
          <ul>
            {enrolledClasses.map((enrollment, index) => {
              const classData = enrollment.classes;
              if (!classData) return null;
              return (
                <li key={`${classData.id}-${index}`}>
                  <Link href={`/dashboard/class/${classData.id}`}>{classData.name}</Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <p>Anda belum terdaftar di kelas manapun.</p>
        )}
      </div>

      {/* Anda bisa menambahkan kembali bagian "Available Classes" di sini jika mau */}
    </div>
  );
}
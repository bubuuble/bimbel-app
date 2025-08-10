// FILE: app/dashboard/components/StudentClassesView.tsx (KODE LENGKAP & BENAR)
'use client'

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState, useCallback } from "react";
import type { UserProfile } from "@/lib/types";
import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { enrollInClass, type EnrollState } from "@/lib/actions";

// Tipe data yang sudah disesuaikan dengan ekspektasi TypeScript dan Supabase
type AvailableClass = {
  id: string;
  name: string;
  description: string | null;
  profiles: { name: string | null; } | null;
};
type EnrolledClass = {
  classes: { id: string, name: string } | null;
};

function EnrollButton() {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending}>{pending ? 'Mendaftar...' : 'Daftar Kelas'}</button>;
}

function ClassCard({ classInfo, onEnrollSuccess }: { classInfo: AvailableClass, onEnrollSuccess: () => void }) {
  const [state, formAction] = useActionState(enrollInClass, null);
  
  useEffect(() => {
    if (state?.success) { 
      alert(state.success); // Ganti dengan toast
      onEnrollSuccess(); 
    }
    if (state?.error) { 
      alert(state.error); // Ganti dengan toast
    }
  }, [state, onEnrollSuccess]);

  return (
    <div style={{ border: '1px solid #eee', padding: '1rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h3>{classInfo.name}</h3>
      <p style={{ fontSize: '0.9rem', color: '#666' }}>Guru: {classInfo.profiles?.name || 'N/A'}</p>
      <p style={{ fontSize: '0.9rem', minHeight: '40px' }}>{classInfo.description || 'Tidak ada deskripsi.'}</p>
      <form action={formAction} style={{ marginTop: '1rem' }}>
        <input type="hidden" name="classId" value={classInfo.id} />
        <EnrollButton />
      </form>
    </div>
  );
}

export default function StudentClassesView({ userProfile }: { userProfile: Pick<UserProfile, 'id'> }) {
  const [availableClasses, setAvailableClasses] = useState<AvailableClass[]>([]);
  const [enrolledClasses, setEnrolledClasses] = useState<EnrolledClass[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchData = useCallback(async () => {
    setLoading(true);
    
    // Ambil kelas yang sudah diikuti oleh siswa
    const { data: enrolledData } = await supabase
      .from('enrollments')
      .select(`classes!inner(id, name)`)
      .eq('student_id', userProfile.id)
      .returns<EnrolledClass[]>();
    
    if (enrolledData) setEnrolledClasses(enrolledData);
    const enrolledClassIds = enrolledData?.map(e => e.classes?.id).filter(Boolean) || [];

    // Ambil semua kelas yang ada untuk ditampilkan sebagai kelas yang tersedia
    const { data: allData } = await supabase
      .from('classes')
      .select(`id, name, description, profiles(name)`) // profiles!inner bisa terlalu ketat jika ada guru yg profilnya terhapus
      .returns<AvailableClass[]>();

    if (allData) {
      // Filter di sisi client untuk mendapatkan kelas yang belum di-enroll
      const available = allData.filter(c => !enrolledClassIds.includes(c.id));
      setAvailableClasses(available);
    }
    
    setLoading(false);
  }, [supabase, userProfile.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) return <p>Loading kelas...</p>;

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <h1>Kelas Saya & Pendaftaran</h1>
      
      <div style={{ marginBottom: '2rem', border: '1px solid #007bff', padding: '1.5rem', borderRadius: '8px', backgroundColor: '#f8f9fa' }}>
        <h2>Kelas yang Diikuti</h2>
        {enrolledClasses.length > 0 ? (
          <ul style={{ listStyle: 'decimal', paddingLeft: '20px' }}>
            {enrolledClasses.map((enrollment) => {
              if (!enrollment.classes) return null;
              return (
                <li key={enrollment.classes.id} style={{ marginBottom: '0.5rem' }}>
                  <Link href={`/dashboard/class/${enrollment.classes.id}`} style={{textDecoration: 'underline', color: '#007bff', fontWeight: 'bold'}}>
                    {enrollment.classes.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <p>Anda belum terdaftar di kelas manapun.</p>
        )}
      </div>

      <h2>Kelas yang Tersedia</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {availableClasses.length > 0 ? availableClasses.map(c => (
          <ClassCard key={c.id} classInfo={c} onEnrollSuccess={fetchData} />
        )) : <p>Tidak ada kelas lain yang tersedia untuk pendaftaran saat ini.</p>}
      </div>
    </div>
  );
}
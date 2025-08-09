'use client'

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState, useCallback } from "react";
import type { UserProfile } from "../page";
import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { enrollInClass, type EnrollState } from "@/lib/actions";

// --- TIPE DATA YANG DIPERBAIKI ---
// Kita akan menggunakan 'any' untuk sementara pada relasi
// untuk melewati error TypeScript yang salah.
type AvailableClass = {
  id: string;
  name: string;
  description: string | null;
  profiles: any; // Biarkan 'any' untuk fleksibilitas
};
type EnrolledClass = {
  classes: any; // Biarkan 'any' untuk fleksibilitas
};
// ---------------------------------

function ClassCard({ classInfo, onEnrollSuccess }: { classInfo: AvailableClass, onEnrollSuccess: () => void }) {
  const initialState: EnrollState = null;
  const [state, formAction] = useActionState(enrollInClass, initialState);

  useEffect(() => {
    if (state?.success) {
      alert(state.success);
      onEnrollSuccess();
    }
    if (state?.error) {
      alert(state.error);
    }
  }, [state, onEnrollSuccess]);

  function EnrollButton() {
    const { pending } = useFormStatus();
    return <button type="submit" disabled={pending}>{pending ? 'Enrolling...' : 'Enroll'}</button>;
  }

  // --- LOGIKA AKSES DATA YANG SUDAH TERBUKTI BEKERJA ---
  // Kita asumsikan 'profiles' adalah objek tunggal, karena itu yang berhasil
  const teacherName = classInfo.profiles?.name || 'N/A';
  // ---------------------------------------------------

  return (
    <div style={{ border: '1px solid #eee', padding: '1rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
      <h3>{classInfo.name}</h3>
      <p style={{ fontSize: '0.9rem', color: '#666' }}>Teacher: {teacherName}</p>
      <p style={{ fontSize: '0.9rem', minHeight: '40px' }}>{classInfo.description || ''}</p>
      <form action={formAction} style={{ marginTop: '1rem' }}>
        <input type="hidden" name="classId" value={classInfo.id} />
        <EnrollButton />
      </form>
    </div>
  );
}

export default function StudentView({ userProfile }: { userProfile: UserProfile }) {
  const [availableClasses, setAvailableClasses] = useState<AvailableClass[]>([]);
  const [enrolledClasses, setEnrolledClasses] = useState<EnrolledClass[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchData = useCallback(async () => {
    const { data: availClassesData } = await supabase.from('classes').select(`id, name, description, profiles ( name )`);
    if (availClassesData) setAvailableClasses(availClassesData);

    const { data: enrolledClassesData } = await supabase.from('enrollments').select(`classes ( id, name )`).eq('student_id', userProfile.id);
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
      
      <div style={{ marginBottom: '2rem', border: '1px solid #007bff', padding: '1.5rem', borderRadius: '8px', backgroundColor: '#f8f9fa' }}>
        <h2>Kelas Saya</h2>
        {enrolledClasses.length > 0 ? (
          <ul>
            {enrolledClasses.map((enrollment, index) => {
              // --- LOGIKA AKSES DATA YANG SUDAH TERBUKTI BEKERJA ---
              // Kita asumsikan 'classes' adalah objek tunggal
              const classData = enrollment.classes;
              if (!classData) return null;
              
              return (
                <li key={`${classData.id}-${index}`} style={{ marginBottom: '0.5rem' }}>
                  <Link href={`/dashboard/class/${classData.id}`} style={{textDecoration: 'underline', color: '#007bff', fontWeight: 'bold'}}>
                    {classData.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        ) : (
          <p>Anda belum terdaftar di kelas manapun.</p>
        )}
      </div>

      <h2>Available Classes</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
        {availableClasses.map(c => (
          <ClassCard key={c.id} classInfo={c} onEnrollSuccess={fetchData} />
        ))}
      </div>
    </div>
  );
}
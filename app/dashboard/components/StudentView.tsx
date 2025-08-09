'use client'

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState, useCallback } from "react";
import type { UserProfile } from "../page";
import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { enrollInClass, type EnrollState } from "@/lib/actions";

// Tipe data (sudah diperbaiki)
type AvailableClass = {
  id: string; name: string; description: string | null;
  profiles: { name: string | null }[] | null; 
};
type EnrolledClass = {
  classes: { id: string; name: string; }[] | null;
};

// --- KOMPONEN CLASS CARD DENGAN PROPS YANG BENAR ---
function ClassCard({ classInfo, onEnrollSuccess }: { classInfo: AvailableClass, onEnrollSuccess: () => void }) {
  const initialState: EnrollState = null;
  const [state, formAction] = useActionState(enrollInClass, initialState);

  useEffect(() => {
    if (state?.success) {
      alert(state.success);
      onEnrollSuccess(); // Panggil fungsi refresh dari induk
    }
    if (state?.error) {
      alert(state.error);
    }
  }, [state, onEnrollSuccess]);

  function EnrollButton() {
    const { pending } = useFormStatus();
    return <button type="submit" disabled={pending}>{pending ? 'Enrolling...' : 'Enroll'}</button>;
  }

  const teacherName = classInfo.profiles && classInfo.profiles.length > 0
    ? classInfo.profiles[0].name
    : 'N/A';

  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
      <h3>{classInfo.name}</h3>
      <p>Teacher: {teacherName}</p>
      <p>{classInfo.description || 'No description available.'}</p>
      <form action={formAction}>
        <input type="hidden" name="classId" value={classInfo.id} />
        <EnrollButton />
      </form>
    </div>
  );
}
// --- AKHIR KOMPONEN CLASS CARD ---


export default function StudentView({ userProfile }: { userProfile: UserProfile }) {
  const [availableClasses, setAvailableClasses] = useState<AvailableClass[]>([]);
  const [enrolledClasses, setEnrolledClasses] = useState<EnrolledClass[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchData = useCallback(async () => {
    // setLoading(true) hanya saat awal
    const { data: availClassesData } = await supabase.from('classes').select(`id, name, description, profiles ( name )`);
    if (availClassesData) setAvailableClasses(availClassesData as AvailableClass[]);

    const { data: enrolledClassesData } = await supabase.from('enrollments').select(`classes ( id, name )`).eq('student_id', userProfile.id);
    if (enrolledClassesData) setEnrolledClasses(enrolledClassesData as EnrolledClass[]);
    
    setLoading(false);
  }, [supabase, userProfile.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // useEffect untuk realtime bisa diabaikan jika pendekatan manual ini sudah cukup
  useEffect(() => {
    const channel = supabase.channel('realtime-enrollments').on('postgres_changes', { event: '*', schema: 'public', table: 'enrollments' }, (payload) => {
        console.log('Change received!', payload)
        fetchData()
    }).subscribe()
    return () => {
      supabase.removeChannel(channel);
    }
  }, [supabase, fetchData]);


  if (loading) return <p>Loading dashboard...</p>;

  return (
    <div>
      <h1 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>Student Dashboard</h1>
      
      <div style={{ marginBottom: '2rem', border: '1px solid blue', padding: '1rem', borderRadius: '8px' }}>
        <h2>Kelas Saya</h2>
        {enrolledClasses.length > 0 ? (
          <ul>
            {enrolledClasses.map((enrollment, index) => {
              const classData = enrollment.classes && enrollment.classes.length > 0 ? enrollment.classes[0] : null;
              if (!classData) return null;
              return (
                <li key={`${classData.id}-${index}`}>
                  <Link href={`/dashboard/class/${classData.id}`} style={{textDecoration: 'underline'}}>
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
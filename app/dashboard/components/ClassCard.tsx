// src/app/dashboard/siswa/ClassCard.tsx
'use client'
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { enrollInClass, type EnrollState } from '@/lib/actions'; // Pastikan path ini sesuai dengan struktur proyek Anda
import { useEffect } from "react";

// Tipe data untuk properti komponen
type ClassInfo = {
  id: string;
  name: string;
  description: string | null;
  profiles: { name: string | null } | null;
};

function EnrollButton() {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending}>{pending ? 'Enrolling...' : 'Enroll'}</button>;
}

// Ini adalah komponen untuk satu kartu kelas
export default function ClassCard({ classInfo }: { classInfo: ClassInfo }) {
  const initialState: EnrollState = null;
  const [state, formAction] = useActionState(enrollInClass, initialState);

  // Tampilkan alert saat ada hasil dari server action
  useEffect(() => {
    if (state?.success) alert(state.success);
    if (state?.error) alert(state.error);
  }, [state]);

  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
      <h3>{classInfo.name}</h3>
      {/* @ts-ignore */}
      <p>Teacher: {classInfo.profiles?.name || 'N/A'}</p>
      <p>{classInfo.description || 'No description available.'}</p>
      
      <form action={formAction}>
        <input type="hidden" name="classId" value={classInfo.id} />
        <EnrollButton />
      </form>
    </div>
  );
}
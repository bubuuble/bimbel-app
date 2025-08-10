// FILE: app/dashboard/components/TeacherClassesView.tsx

'use client'

import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useEffect, useState, useRef, useCallback } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createClass, type ClassFormState } from "@/lib/actions";
import type { UserProfile } from "@/lib/types";

type ClassData = {
  id: string;
  name: string;
  description: string | null;
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending}>{pending ? 'Creating...' : 'Create Class'}</button>;
}

export default function TeacherClassesView({ userProfile }: { userProfile: Pick<UserProfile, 'id'> }) {
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState(createClass, null);
  
  const fetchClasses = useCallback(async () => {
    const { data } = await supabase
      .from('classes')
      .select('id, name, description')
      .eq('teacher_id', userProfile.id)
      .order('created_at', { ascending: false });
    if (data) setClasses(data);
    setLoading(false);
  }, [supabase, userProfile.id]);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  useEffect(() => {
    if (state?.success) {
      alert(state.success); // Ganti dengan toast
      formRef.current?.reset();
      fetchClasses();
    }
    if (state?.error) {
      alert(state.error); // Ganti dengan toast
    }
  }, [state, fetchClasses]);
  
  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <h1>Manajemen Kelas</h1>
      
      <div style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '2rem', borderRadius: '8px' }}>
        <h3>Buat Kelas Baru</h3>
        <form ref={formRef} action={formAction}>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="className">Nama Kelas</label><br />
            <input type="text" name="className" id="className" required style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="description">Deskripsi</label><br />
            <textarea name="description" id="description" rows={3} style={{ width: '100%', padding: '8px', marginTop: '5px' }}></textarea>
          </div>
          <SubmitButton />
        </form>
      </div>

      <div>
        <h2>Kelas Anda</h2>
        {loading ? <p>Loading classes...</p> : classes.length > 0 ? (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {classes.map(c => (
              <li key={c.id} style={{ marginBottom: '0.5rem', padding: '1rem', border: '1px solid #eee' }}>
                <Link href={`/dashboard/class/${c.id}`} style={{ textDecoration: 'underline', fontWeight: 'bold' }}>
                  {c.name}
                </Link>
                <p style={{ margin: '8px 0 0', color: '#666' }}>{c.description || 'Tidak ada deskripsi'}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>Anda belum membuat kelas.</p>
        )}
      </div>
    </div>
  )
}
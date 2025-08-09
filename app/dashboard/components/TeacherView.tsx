'use client'

import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useEffect, useState, useRef, useCallback } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createClass, type ClassFormState } from "@/lib/actions";
import type { UserProfile } from "../page";

// Tipe untuk data kelas
type ClassData = {
  id: string;
  name: string;
  description: string | null;
};

// Tombol submit untuk form buat kelas
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? 'Creating...' : 'Create Class'}
    </button>
  );
}

export default function TeacherView({ userProfile }: { userProfile: UserProfile }) {
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const formRef = useRef<HTMLFormElement>(null);

  // State untuk form action
  const initialState: ClassFormState = null;
  const [state, formAction] = useActionState(createClass, initialState);
  
  // Fungsi untuk mengambil kelas, dibungkus useCallback agar stabil
  const fetchClasses = useCallback(async () => {
    const { data, error } = await supabase
      .from('classes')
      .select('id, name, description')
      .eq('teacher_id', userProfile.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching classes:", error);
    } else if (data) {
      setClasses(data);
    }
    setLoading(false);
  }, [supabase, userProfile.id]);

  // Efek untuk mengambil daftar kelas saat komponen pertama kali dimuat
  useEffect(() => {
    setLoading(true);
    fetchClasses();
  }, [fetchClasses]);

  // Efek untuk menangani hasil dari form action (saat kelas baru dibuat)
  useEffect(() => {
    if (state?.success) {
      alert(state.success);
      formRef.current?.reset();
      fetchClasses(); // Ambil ulang daftar kelas setelah berhasil
    }
    if (state?.error) {
      alert(state.error);
    }
  }, [state, fetchClasses]);
  
  return (
    <div>
      <h1 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>Teacher Dashboard</h1>
      
      {/* Form untuk membuat kelas baru */}
      <div style={{ border: '1px solid #ccc', padding: '1rem', marginBottom: '2rem', borderRadius: '8px' }}>
        <h3>Create New Class</h3>
        <form ref={formRef} action={formAction}>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="className">Class Name</label><br />
            <input type="text" name="className" id="className" required style={{ width: '100%', padding: '8px', marginTop: '5px' }} />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="description">Description</label><br />
            <textarea name="description" id="description" rows={3} style={{ width: '100%', padding: '8px', marginTop: '5px' }}></textarea>
          </div>
          <SubmitButton />
        </form>
      </div>

      {/* Daftar kelas yang sudah dibuat */}
      <div>
        <h2>Your Classes</h2>
        {loading ? (
          <p>Loading classes...</p>
        ) : classes.length > 0 ? (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {classes.map(c => (
              <li key={c.id} style={{ marginBottom: '0.5rem' }}>
                {/* Kita akan buat halaman detail kelas ini selanjutnya */}
                <Link href={`/dashboard/class/${c.id}`} style={{ textDecoration: 'underline' }}>
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>You have not created any classes yet.</p>
        )}
      </div>
    </div>
  )
}
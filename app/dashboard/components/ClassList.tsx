// src/app/dashboard/guru/ClassList.tsx
import { createClient } from "@/lib/supabase/server";
import Link from "next/link"; // Pastikan Link sudah diimpor

export default async function ClassList() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: classes, error } = await supabase
    .from('classes')
    .select('*')
    .eq('teacher_id', user.id)
    .order('created_at', { ascending: false }); // Urutkan dari yg terbaru
  
  if (error) return <p>Could not fetch classes.</p>;

  return (
    <div style={{ marginTop: '2rem' }}>
      <h3>Your Classes</h3>
      {classes.length === 0 ? (
        <p>You have not created any classes yet.</p>
      ) : (
        <ul>
          {classes.map(c => (
            <li key={c.id}>
              {/* UBAH INI: Bungkus dengan Link */}
              <Link href={`/dashboard/guru/kelas/${c.id}`} style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
                {c.name}
              </Link>
               - <span>{c.description || 'No description'}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
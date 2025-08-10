// FILE: app/dashboard/class/[classId]/task/[materialId]/page.tsx (VERSI PALING ANDAL)

import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import GradeSubmissionForm from "../../../../components/GradeSubmissionForm";

type SubmissionWithProfile = {
  id: number;
  created_at: string;
  file_url: string | null;
  text_content: string | null;
  grade: number | null;
  feedback: string | null;
  material_id: string;
  profiles: {
    name: string | null;
    username: string | null;
  } | null;
};

export default async function TaskSubmissionsPage({ params }: { params: { classId: string, materialId: string } }) {
  const supabase = await createClient();

  // 1. Dapatkan pengguna yang sedang login
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect('/login');

  // 2. Ambil data material yang diminta
  const { data: material } = await supabase
    .from('materials')
    .select(`title, class_id`) // Kita hanya butuh title dan class_id dari material
    .eq('id', params.materialId)
    .single();
  
  if (!material) notFound();

  // 3. Ambil data kelas yang terkait dengan material
  const { data: classData } = await supabase
    .from('classes')
    .select('teacher_id')
    .eq('id', material.class_id)
    .single();

  if (!classData) {
    // Ini kasus aneh jika material tidak punya kelas, tapi baik untuk ditangani
    return <div>Error: Class data for this material not found.</div>;
  }

  // 4. Lakukan Otorisasi dengan data yang sudah pasti
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  
  const isTeacherOwner = classData.teacher_id === user.id;
  const isAdmin = profile?.role === 'ADMIN';

  // --- DEBUGGING TERAKHIR ---
  console.log("--- DEBUGGING OTORISASI (METODE BARU) ---");
  console.log("User ID:", user.id);
  console.log("Teacher ID dari tabel Kelas:", classData.teacher_id);
  console.log("Apakah Guru Pemilik?", isTeacherOwner);
  console.log("-----------------------------------------");
  // -------------------------

  if (!isTeacherOwner && !isAdmin) {
    return (
      <div style={{ padding: '2rem' }}>
        <h1>Access Denied</h1>
        <p>You are not authorized to view this page.</p>
      </div>
    );
  }

  // 5. Jika otorisasi berhasil, ambil semua submissions
  const { data: submissions, error } = await supabase
    .from('submissions')
    .select(`*, profiles ( name, username )`)
    .eq('material_id', params.materialId)
    .order('created_at', { ascending: true })
    .returns<SubmissionWithProfile[]>();

  if (error) {
    return <div>Error loading submissions: {error.message}</div>;
  }

  // 6. Render Halaman
  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <Link href={`/dashboard/class/${params.classId}`} style={{ textDecoration: 'underline' }}>&larr; Kembali ke Kelas</Link>
      <h1 style={{ marginTop: '1rem' }}>Jawaban untuk Tugas: {material.title}</h1>

      {submissions.length === 0 ? (
        <p>Belum ada siswa yang mengumpulkan tugas ini.</p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '2rem' }}>
          {submissions.map(submission => (
            <div key={submission.id} style={{ border: '1px solid #ddd', padding: '1rem', borderRadius: '8px', backgroundColor: '#f9f9f9' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #eee', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
                <h3 style={{ margin: 0 }}>{submission.profiles?.name || submission.profiles?.username}</h3>
                <small>Dikumpulkan: {new Date(submission.created_at).toLocaleString()}</small>
              </div>
              
              {submission.file_url ? (
                <a href={submission.file_url} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 'bold' }}>Lihat File Jawaban</a>
              ) : (
                <p><i>Tidak ada file yang diunggah.</i></p>
              )}
              
              <GradeSubmissionForm submission={submission} classId={params.classId} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
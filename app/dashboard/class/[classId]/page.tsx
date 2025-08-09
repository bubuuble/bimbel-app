import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

// Komponen-komponen ini perlu dibuat di folder yang sesuai,
// contohnya di /app/dashboard/components/
import UploadMaterialForm from "../../components/UploadMaterialForm"; 
import AttendanceForm from "../../components/AttendanceForm";
import { deleteClass, deleteMaterial } from "@/lib/actions";

export default async function ClassDetailPage({ params }: { params: { classId: string } }) {
  const supabase = await createClient();
  const { classId } = params;

  // 1. Ambil user dan profilnya
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect('/login');

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (!profile) return <div>Error: Profile not found.</div>;

  // 2. Ambil detail kelas (semua user yang sudah login bisa melakukan ini)
  const { data: classInfo } = await supabase.from('classes').select('*').eq('id', classId).single();
  if (!classInfo) notFound(); // Tampilkan 404 jika kelasnya memang tidak ada

  // 3. Lakukan pengecekan otorisasi berdasarkan peran
  const isTeacherOwner = profile.role === 'GURU' && classInfo.teacher_id === user.id;
  const isAdmin = profile.role === 'ADMIN';
  
  // Untuk siswa, kita harus cek apakah dia terdaftar
  const { data: enrollment } = await supabase
    .from('enrollments')
    .select('id')
    .eq('class_id', classId)
    .eq('student_id', user.id)
    .maybeSingle();
  const isEnrolledStudent = profile.role === 'SISWA' && !!enrollment;

  // Jika user tidak punya hak akses sama sekali, tampilkan halaman Access Denied
  if (!isTeacherOwner && !isAdmin && !isEnrolledStudent) {
    return (
      <div style={{ padding: '2rem' }}>
        <h1>Access Denied</h1>
        <p>You are not authorized to view this class.</p>
        <Link href="/dashboard" style={{ textDecoration: 'underline' }}>&larr; Back to Dashboard</Link>
      </div>
    );
  }

  // 4. Ambil materi
  const { data: materials } = await supabase.from('materials').select('*').eq('class_id', classId).order('created_at', { ascending: false });

  // 5. Ambil data absensi (hanya jika siswa)
  let attendanceRecord = null;
  if (isEnrolledStudent) {
    const today = new Date().toISOString().slice(0, 10);
    const { data } = await supabase
      .from('attendances').select('status').eq('student_id', user.id).eq('class_id', classId).eq('date', today).maybeSingle();
    attendanceRecord = data;
  }
  
  const canManage = isTeacherOwner || isAdmin;

  return (
    <div style={{ padding: '2rem' }}>
      <Link href="/dashboard" style={{ textDecoration: 'underline' }}>&larr; Back to Dashboard</Link>
      <h1 style={{ fontSize: '2rem', marginTop: '1rem' }}>{classInfo.name}</h1>
      <p>{classInfo.description}</p>
      
      {/* Tampilan untuk GURU & ADMIN */}
      {canManage && (
        <>
          <form action={deleteClass} style={{ /* ... */ }}>
            <p><strong>Tindakan Berbahaya...</strong></p>
            <input type="hidden" name="classId" value={classId} />
            <button type="submit">Hapus Kelas Ini</button>
          </form>
          <hr />
          <UploadMaterialForm classId={classId} />
        </>
      )}

      {/* Tampilan untuk SISWA */}
      {isEnrolledStudent && (
        <>
          <hr />
          <AttendanceForm classId={classId} dbStatus={attendanceRecord?.status || null} />
        </>
      )}

      <hr style={{ margin: '2rem 0' }} />

      <h2>Uploaded Materials</h2>
      {materials && materials.length > 0 ? (
        <ul>
          {materials.map(material => (
            <li key={material.id} style={{ /* ... */ }}>
              <a href={material.file_url!} target="_blank">{material.title}</a>
              {canManage && (
                <form action={deleteMaterial}>
                  <input type="hidden" name="materialId" value={material.id} />
                  <input type="hidden" name="fileUrl" value={material.file_url || ''} />
                  <input type="hidden" name="classId" value={classId} />
                  <button type="submit">Hapus</button>
                </form>
              )}
            </li>
          ))}
        </ul>
      ) : ( <p>No materials uploaded for this class yet.</p> )}
    </div>
  );
}
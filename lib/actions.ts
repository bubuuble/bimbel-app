'use server'

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
// Import Supabase Client secara eksplisit untuk Admin Client
import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// =======================================================
// TIPE DATA UMUM & STATE
// =======================================================
export type FormState = { success?: string; error?: string; } | null;
export type ClassFormState = FormState;
export type MaterialFormState = FormState;
export type EnrollState = FormState;
export type AbsenceState = FormState;
export type StudentAttendanceState = FormState;
type Role = 'ADMIN' | 'GURU' | 'SISWA';


// =======================================================
// AKSI UNTUK ADMIN
// =======================================================
export async function updateUserRole(prevState: FormState, formData: FormData): Promise<FormState> {
  // ... (Tidak ada perubahan, kode ini sudah benar)
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'ADMIN') return { error: 'Not authorized' };
  const userIdToUpdate = formData.get('userId') as string;
  const newRole = formData.get('newRole') as Role;
  if (!userIdToUpdate || !newRole) return { error: 'Missing user ID or new role.' };
  if (userIdToUpdate === user.id) return { error: "Admin cannot change their own role via this form." };
  const { error } = await supabase.from('profiles').update({ role: newRole }).eq('id', userIdToUpdate);
  if (error) return { error: `Database error: ${error.message}` };
  revalidatePath('/dashboard');
  return { success: `User role updated to ${newRole}` };
}

export async function createUserByAdmin(prevState: FormState, formData: FormData): Promise<FormState> {
  // PERBAIKAN: Tambahkan 'await'
  const supabase = await createClient();

  // 1. Otorisasi
  const { data: { user: adminUser } } = await supabase.auth.getUser();
  if (!adminUser) return { error: 'Not authenticated.' };
  const { data: adminProfile } = await supabase.from('profiles').select('role').eq('id', adminUser.id).single();
  if (adminProfile?.role !== 'ADMIN') return { error: 'Not authorized.' };

  // 2. Ambil data form
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;
  const name = formData.get('name') as string;
  const role = formData.get('role') as Role;
  const email = `${username.toLowerCase()}@user.bimbelapp`;

  if (!username || !password || !name || !role) return { error: 'All fields are required.' };
  if (password.length < 6) return { error: 'Password must be at least 6 characters long.' };

  // 3. Buat Supabase Admin Client secara manual
  // PERBAIKAN: Gunakan createSupabaseClient dari '@supabase/supabase-js'
  const supabaseAdmin = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );

  // 4. Buat user baru
  const { data: newUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email: email,
    password: password,
    email_confirm: true,
    user_metadata: { name: name, username: username }
  });

  if (authError) return { error: `Failed to create user: ${authError.message}` };
  if (!newUser?.user) return { error: 'Failed to create user, no user data returned.' };

  // 5. Update role di profil
  const { error: profileError } = await supabaseAdmin
    .from('profiles')
    .update({ role: role })
    .eq('id', newUser.user.id);

  if (profileError) return { error: `User created in auth, but failed to set role: ${profileError.message}` };

  revalidatePath('/dashboard');
  return { success: `User '${username}' created successfully!` };
}


// =======================================================
// AKSI UNTUK GURU
// =======================================================
// ... (createClass, deleteClass, deleteMaterial tidak berubah)

/**
 * Membuat kelas baru. Hanya bisa dilakukan oleh Guru (atau Admin).
 */
export async function createClass(
  prevState: ClassFormState, 
  formData: FormData
): Promise<ClassFormState> {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'GURU' && profile?.role !== 'ADMIN') {
    return { error: 'Not authorized' };
  }

  const className = formData.get('className') as string;
  const description = formData.get('description') as string;

  if (!className) return { error: 'Class name is required.' };

  const { error } = await supabase
    .from('classes')
    .insert({
      name: className,
      description: description,
      teacher_id: user.id
    });
  
  if (error) {
    if (error.code === '23505') return { error: 'A class with this name already exists.' };
    return { error: `Database error: ${error.message}` };
  }

  revalidatePath('/dashboard');
  return { success: 'Class created successfully!' };
}

/**
 * Menghapus kelas dan semua materi terkait.
 */
export async function deleteClass(formData: FormData) {
  const classId = formData.get('classId') as string;
  if (!classId) return;

  const supabase = await createClient();
  
  // Memanggil fungsi RPC 'delete_class_as_owner' yang lebih aman
  const { error } = await supabase.rpc('delete_class_as_owner', {
    class_id_to_delete: classId
  });

  if (error) {
    console.error("RPC Error deleting class:", error);
    // Di aplikasi nyata, Anda bisa redirect dengan pesan error
    return; 
  }

  revalidatePath('/dashboard');
  redirect('/dashboard');
}


// =======================================================
// AKSI UNTUK MANAJEMEN MATERI (OLEH GURU)
// =======================================================

/**
 * Meng-upload file materi ke Storage dan menyimpan metadatanya.
 */
export async function uploadMaterial(
  prevState: MaterialFormState,
  formData: FormData
): Promise<MaterialFormState> {
  // Karena kita beralih ke Direct Upload, Server Action ini tidak lagi digunakan
  // untuk upload file, tapi kita biarkan di sini jika ingin kembali ke pola ini.
  // Kode Direct Upload ada di dalam komponen UploadMaterialForm.tsx
  return { error: 'This action is deprecated. Use client-side upload.' };
}

/**
 * Menghapus satu file materi dari Storage dan database.
 */
export async function deleteMaterial(formData: FormData) {
  const materialId = formData.get('materialId') as string;
  const fileUrl = formData.get('fileUrl') as string;
  const classId = formData.get('classId') as string;

  if (!materialId || !fileUrl || !classId) return;

  const supabase = await createClient();

  try {
    const url = new URL(fileUrl);
    const pathPrefix = `/storage/v1/object/public/materials/`;
    const filePath = decodeURIComponent(url.pathname.substring(pathPrefix.length));

    if (filePath) {
      await supabase.storage.from('materials').remove([filePath]);
    }
  } catch (e) {
    console.error("Invalid file URL, skipping storage deletion:", fileUrl);
  }

  await supabase.from('materials').delete().eq('id', materialId);

  revalidatePath(`/dashboard/class/${classId}`);
}


// =======================================================
// AKSI UNTUK SISWA
// =======================================================

/**
 * Mendaftarkan siswa ke sebuah kelas.
 */
export async function enrollInClass(
  prevState: EnrollState,
  formData: FormData
): Promise<EnrollState> {
  const classId = formData.get('classId') as string;
  if (!classId) return { error: 'Class ID is missing.' };
  
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'You must be logged in to enroll.' };

  const { data: existingEnrollment } = await supabase
    .from('enrollments')
    .select('id')
    .eq('class_id', classId)
    .eq('student_id', user.id)
    .maybeSingle();
  
  if (existingEnrollment) {
    return { error: 'You are already enrolled in this class.' };
  }

  const { error } = await supabase
    .from('enrollments')
    .insert({
      class_id: classId,
      student_id: user.id
    });

  if (error) {
    return { error: `Failed to enroll: ${error.message}` };
  }

  revalidatePath('/dashboard');
  return { success: 'Successfully enrolled in the class!' };
}

export async function createAttendanceSession(formData: FormData) {
  'use server'
  const classId = formData.get('classId') as string;
  const sessionTitle = formData.get('sessionTitle') as string;
  if (!classId) return;

  const supabase = await createClient();
  await supabase.from('attendance_sessions').insert({
    class_id: classId,
    session_title: sessionTitle || `Sesi Absensi ${new Date().toLocaleDateString()}`
  });
  // Kita tidak perlu revalidatePath lagi karena client akan refresh sendiri
}

/**
 * Melaporkan ketidakhadiran (Sakit atau Izin).
 */
export async function reportAbsence(
  prevState: AbsenceState,
  formData: FormData
): Promise<AbsenceState> {
  const classId = formData.get('classId') as string;
  const status = formData.get('status') as string;

  if (!classId || !status || (status !== 'SAKIT' && status !== 'IZIN')) {
    return { error: 'Invalid data provided.' };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'You must be logged in.' };

  const today = new Date().toISOString().slice(0, 10);

  const { error } = await supabase
    .from('attendance_records')
    .upsert({
      student_id: user.id,
      class_id: classId,
      date: today,
      status: status
    }, {
      onConflict: 'date,student_id,class_id'
    });

  if (error) {
    return { error: `Failed to report absence: ${error.message}` };
  }

  revalidatePath(`/dashboard/class/${classId}`);
  return { success: `Successfully reported as ${status} for today.` };
}


/**
 * Siswa melakukan absensi untuk sebuah sesi.
 */
export async function submitAttendance(
  prevState: StudentAttendanceState,
  formData: FormData
): Promise<StudentAttendanceState> {
  const sessionId = formData.get('sessionId') as string;
  const status = formData.get('status') as string;
  const notes = formData.get('notes') as string;

  if (!sessionId || !status) {
    return { error: 'Session ID and status are required.' };
  }
  if (!['HADIR', 'SAKIT', 'IZIN'].includes(status)) {
    return { error: 'Invalid status.' };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'You must be logged in.' };

  // Cek apakah siswa sudah absen di sesi ini
  const { data: existingRecord } = await supabase.from('attendance_records')
    .select('id').eq('session_id', sessionId).eq('student_id', user.id).maybeSingle();
  if (existingRecord) {
    return { error: 'You have already submitted attendance for this session.' };
  }

  // Masukkan catatan absensi
  const { error } = await supabase
    .from('attendance_records')
    .insert({
      session_id: sessionId,
      student_id: user.id,
      status: status,
      notes: notes || null
    });

  if (error) {
    if (error.message.includes('foreign key constraint')) {
      return { error: 'Attendance session might be closed or invalid.' };
    }
    return { error: `Failed to submit attendance: ${error.message}` };
  }

  revalidatePath(`/dashboard/class/${formData.get('classId')}`);
  return { success: `Successfully submitted attendance with status: ${status}` };
}
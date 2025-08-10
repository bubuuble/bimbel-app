'use server'

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Papa from 'papaparse'; // <-- TAMBAHKAN BARIS IMPOR INI
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
  'use server'
  const materialId = formData.get('materialId') as string;
  const fileUrl = formData.get('fileUrl') as string; // Bisa jadi string kosong atau null
  const classId = formData.get('classId') as string;

  console.log("--- [ACTION] Deleting Material ---");
  console.log("Material ID:", materialId);
  console.log("File URL:", fileUrl); // Akan menampilkan string kosong jika tidak ada file
  console.log("Class ID:", classId);

  // --- PERUBAHAN LOGIKA DI SINI ---
  // Kita hanya butuh materialId dan classId. fileUrl bersifat opsional.
  if (!materialId || !classId) {
    console.error("Missing materialId or classId for deletion.");
    return; 
  }
  // ---------------------------------

  const supabase = await createClient();

  // 1. Hapus dari Storage HANYA JIKA ADA fileUrl
  if (fileUrl) {
    try {
      const url = new URL(fileUrl);
      // Path bisa bervariasi tergantung setup bucket, path ini lebih aman
      const pathPrefix = `/storage/v1/object/public/`; 
      const storagePath = decodeURIComponent(url.pathname.substring(url.pathname.indexOf(pathPrefix) + pathPrefix.length));
      
      // Ambil nama bucket dari path
      const bucketName = storagePath.split('/')[0];
      const filePath = storagePath.substring(bucketName.length + 1);

      if (filePath) {
        console.log(`Attempting to delete from bucket '${bucketName}', path:`, filePath);
        const { error: storageError } = await supabase.storage
          .from(bucketName) // Gunakan nama bucket dinamis
          .remove([filePath]);
        
        if (storageError) {
          console.error("Storage Delete Error (akan tetap lanjut):", storageError);
        } else {
          console.log("Storage file deleted successfully.");
        }
      }
    } catch (e) {
      console.error("Invalid file URL or error parsing path, skipping storage deletion:", fileUrl, e);
    }
  } else {
    console.log("No fileUrl provided, skipping storage deletion.");
  }


  // 2. Hapus dari Database (Langkah ini selalu dijalankan)
  console.log("Attempting to delete from database table 'materials'...");
  const { error: dbError } = await supabase
    .from('materials')
    .delete()
    .eq('id', materialId);

  if (dbError) {
    console.error("DATABASE DELETE FAILED:", dbError);
    return; 
  }

  console.log("Database record deleted successfully.");

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
  const startTimeStr = formData.get('startTime') as string;

  if (!classId || !sessionTitle || !startTimeStr) return;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const startTime = new Date(startTimeStr);
  const expiresAt = new Date(startTime.getTime() + 15 * 60 * 1000);
  const sessionDate = startTime.toISOString().slice(0, 10);

  const { error } = await supabase.from('attendance_sessions').insert({
    class_id: classId,
    title: sessionTitle,
    session_date: sessionDate,
    start_time: startTime.toISOString(),
    expires_at: expiresAt.toISOString(),
    teacher_id: user.id // <<-- PASTIKAN BARIS INI ADA!
  });

  if (error) {
    console.error("Error creating attendance session:", error);
    return;
  }
  revalidatePath(`/dashboard/absensi`); // Pastikan revalidate ke halaman yang benar
}

/**
 * [BARU] Guru mengedit sesi absensi yang sudah ada.
 */
export async function updateAttendanceSession(formData: FormData) {
  'use server'
  
  const sessionId = formData.get('sessionId') as string;
  const classId = formData.get('classId') as string;
  const newTitle = formData.get('newTitle') as string;
  const newStartTimeStr = formData.get('newStartTime') as string; // Input baru
  
  if (!sessionId || !newTitle || !newStartTimeStr || !classId) {
    console.error("Data tidak lengkap untuk mengedit sesi.");
    return; // Idealnya kembalikan state error
  }

  // Hitung ulang waktu kadaluwarsa berdasarkan waktu mulai yang baru
  const newStartTime = new Date(newStartTimeStr);
  const newExpiresAt = new Date(newStartTime.getTime() + 15 * 60 * 1000);

  const supabase = await createClient();
  const { error } = await supabase.from('attendance_sessions')
    .update({ 
      title: newTitle,
      start_time: newStartTime.toISOString(),
      expires_at: newExpiresAt.toISOString(),
      session_date: newStartTime.toISOString().slice(0, 10) // Update juga tanggalnya
    })
    .eq('id', sessionId);
  
  if (error) {
    console.error("Error updating session:", error);
    return;
  }
  revalidatePath(`/dashboard/class/${classId}`);
}

export async function submitAttendance(
  prevState: StudentAttendanceState,
  formData: FormData
): Promise<StudentAttendanceState> {
  const sessionId = formData.get('sessionId') as string;
  const status = formData.get('status') as string;
  const notes = formData.get('notes') as string;
  const classId = formData.get('classId') as string; // Penting untuk revalidate

  if (!sessionId || !status || !classId) {
    return { error: 'Data tidak lengkap (session, status, atau class ID hilang).' };
  }
  if (!['HADIR', 'SAKIT', 'IZIN'].includes(status)) {
    return { error: 'Status absensi tidak valid.' };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Anda harus login untuk absen.' };

  const { error } = await supabase
    .from('attendance_records')
    .insert({
      session_id: sessionId,
      student_id: user.id,
      status: status,
      notes: notes || null,
    });

  if (error) {
    if (error.code === '23505') { // Error untuk unique constraint
      return { error: 'Anda sudah melakukan absensi untuk sesi ini.' };
    }
    return { error: `Gagal submit: Sesi mungkin sudah ditutup atau terjadi error lain. (${error.message})` };
  }

  revalidatePath(`/dashboard/class/${classId}`);
  return { success: `Absensi dengan status '${status}' berhasil direkam!` };
}

/**
 * [BARU] Guru menghapus sesi absensi.
 */
export async function deleteAttendanceSession(formData: FormData) {
  'use server'
  
  const sessionId = formData.get('sessionId') as string;
  const classId = formData.get('classId') as string;
  
  if (!sessionId || !classId) return;
  
  const supabase = await createClient();
  // RLS Policy akan memastikan hanya guru pemilik yang bisa menghapus
  const { error } = await supabase.from('attendance_sessions')
    .delete()
    .eq('id', sessionId);
  
  if (error) {
    console.error("Error deleting session:", error);
    return;
  }
  revalidatePath(`/dashboard/class/${classId}`);
}

/**
 * Guru memberikan nilai dan umpan balik untuk sebuah submission.
 */
export async function gradeSubmission(formData: FormData) {
  'use server'
  
  const submissionId = formData.get('submissionId') as string;
  const grade = formData.get('grade') as string;
  const feedback = formData.get('feedback') as string;
  const classId = formData.get('classId') as string;
  const materialId = formData.get('materialId') as string;
  
  if (!submissionId || !grade || !classId || !materialId) {
    console.error("Data tidak lengkap untuk memberi nilai.");
    return; // Idealnya kembalikan state error
  }
  
  const supabase = await createClient();

  // Otorisasi bisa ditambahkan di sini atau andalkan RLS Policy
  // Untuk saat ini, kita andalkan RLS

  const { error } = await supabase
    .from('submissions')
    .update({
      grade: parseInt(grade, 10), // Konversi grade ke angka
      feedback: feedback || null
    })
    .eq('id', submissionId);

  if (error) {
    console.error("Error grading submission:", error);
    return;
  }

  // Revalidate halaman detail tugas agar nilai baru muncul
  revalidatePath(`/dashboard/class/${classId}/task/${materialId}`);
}

export type ProfileFormState = {
  type: 'profile';
  success?: string;
  error?: string;
} | null;

export type PasswordFormState = {
  type: 'password';
  success?: string;
  error?: string;
} | null;

/**
 * Memperbarui nama dan username pengguna.
 */
export async function updateUserProfile(
  prevState: ProfileFormState,
  formData: FormData
): Promise<ProfileFormState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { type: 'profile', error: 'Not authenticated' };

  const name = formData.get('name') as string;
  const username = formData.get('username') as string;

  if (!name || !username) return { type: 'profile', error: 'Name and username are required' };

  // 1. Update di tabel 'profiles'
  const { error: profileError } = await supabase
    .from('profiles')
    .update({ name, username })
    .eq('id', user.id);
  
  if (profileError) return { type: 'profile', error: `Profile update failed: ${profileError.message}` };

  // 2. Update metadata di 'auth.users'
  const { error: authError } = await supabase.auth.updateUser({
    data: { name, username }
  });

  if (authError) return { type: 'profile', error: `Auth update failed: ${authError.message}` };

  revalidatePath('/dashboard/profile');
  return { type: 'profile', success: 'Profile updated successfully!' };
}

/**
 * Memperbarui password pengguna.
 */
export async function updateUserPassword(
  prevState: PasswordFormState,
  formData: FormData
): Promise<PasswordFormState> {
  const password = formData.get('password') as string;
  const confirmPassword = formData.get('confirmPassword') as string;

  if (!password) return { type: 'password', error: 'Password is required' };
  if (password.length < 6) return { type: 'password', error: 'Password must be at least 6 characters' };
  if (password !== confirmPassword) return { type: 'password', error: 'Passwords do not match' };

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) return { type: 'password', error: `Password update failed: ${error.message}` };

  return { type: 'password', success: 'Password updated successfully!' };
}

export async function markNotificationAsRead(notificationId: string) {
    'use server'
    if (!notificationId) return;

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return; // Pastikan user login

    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('id', notificationId)
      .eq('user_id', user.id); // Keamanan tambahan: hanya bisa update notif milik sendiri

    // Revalidate layout untuk memperbarui hitungan di lonceng notifikasi
    revalidatePath('/dashboard', 'layout');
}

export async function unenrollFromClass(formData: FormData) {
  'use server'

  const classId = formData.get('classId') as string;
  if (!classId) return;

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;
  
  // Hapus catatan pendaftaran yang cocok dengan siswa dan kelas saat ini
  const { error } = await supabase
    .from('enrollments')
    .delete()
    .eq('class_id', classId)
    .eq('student_id', user.id);

  if (error) {
    console.error("Error unenrolling from class:", error);
    // Di aplikasi nyata, kembalikan state error
    return;
  }

  revalidatePath('/dashboard/kelas');
}

export type CsvExportState = {
  csvString?: string;
  error?: string;
  fileName?: string;
} | null;

/**
 * Mengambil data laporan absensi dan mengonversinya menjadi string CSV.
 */
export async function exportAttendanceToCsv(
  prevState: CsvExportState,
  formData: FormData
): Promise<CsvExportState> {
  const sessionId = formData.get('sessionId') as string;
  if (!sessionId) {
    return { error: 'Session ID is missing.' };
  }

  const supabase = await createClient();
  
  // Panggil RPC yang sudah ada. Pastikan RPC ini memiliki SECURITY DEFINER.
  const { data: reportData, error: rpcError } = await supabase.rpc(
    'get_session_attendance_report',
    { p_session_id: sessionId }
  );

  if (rpcError) {
    return { error: `Failed to fetch report data: ${rpcError.message}` };
  }
  if (!reportData || reportData.length === 0) {
    return { error: 'No data to export for this session.' };
  }

  // Ambil judul sesi untuk nama file
  const { data: sessionInfo } = await supabase
    .from('attendance_sessions')
    .select('title')
    .eq('id', sessionId)
    .single();

  // Ubah data JSON menjadi string CSV
  const csvString = Papa.unparse(reportData, {
    header: true,
    columns: ['student_name', 'student_username', 'status', 'submitted_at', 'notes'],
  });

  const safeTitle = sessionInfo?.title.replace(/[^a-z0-9]/gi, '_').toLowerCase();
  const fileName = `laporan-absensi-${safeTitle || sessionId}.csv`;

  return { csvString, fileName };
}

export async function changeUserPasswordByAdmin(
  prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const supabase = await createClient();
  // ... (tambahkan otorisasi admin seperti di action lain) ...

  const userId = formData.get('userId') as string;
  const newPassword = formData.get('newPassword') as string;

  if (!userId || !newPassword || newPassword.length < 6) {
    return { error: 'User ID and a password of at least 6 characters are required.' };
  }

  // Gunakan Supabase Admin Client untuk mengubah password pengguna lain
  const supabaseAdmin = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );

  const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
    password: newPassword
  });

  if (error) return { error: `Failed to update password: ${error.message}` };
  
  return { success: 'Password updated successfully!' };
}

export async function deleteUserByAdmin(formData: FormData) {
  'use server'
  const userId = formData.get('userId') as string;
  if (!userId) return;

  const supabase = await createClient();
  // ... (tambahkan otorisasi admin) ...

  const supabaseAdmin = createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );

  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
  
  if (error) {
    console.error("Error deleting user:", error);
    // Idealnya kembalikan state error
    return;
  }

  revalidatePath('/dashboard/user-management'); // Revalidate halaman user management
}
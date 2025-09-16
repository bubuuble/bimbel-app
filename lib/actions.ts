'use server'

import { createClient } from "@/lib/supabase/server";
import { createClient as createSupabaseAdminClient } from '@supabase/supabase-js'; 
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import type { QuestionType } from "./types"; // <-- [PERBAIKAN 1] Import eksplisit
import Papa from 'papaparse'; // <-- TAMBAHKAN BARIS IMPOR INI
// Import Supabase Client secara eksplisit untuk Admin Client
import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers'

// =======================================================
// TIPE DATA UMUM & STATE
// =======================================================
export type FormState = { success?: string; error?: string; } | null;
export type SignUpFormState = FormState;
export type SignInFormState = FormState;
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
export async function createClass(prevState: ClassFormState, formData: FormData): Promise<ClassFormState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'GURU' && profile?.role !== 'ADMIN') {
    return { error: 'Not authorized' };
  }

  const className = formData.get('className') as string;
  const description = formData.get('description') as string;
  const sanityProductId = formData.get('sanityProductId') as string; // Ambil ID produk

  if (!className || !sanityProductId) return { error: 'Nama kelas dan tipe produk wajib diisi.' };

  const { error } = await supabase.from('classes').insert({
      name: className,
      description: description,
      teacher_id: user.id,
      sanity_product_id: sanityProductId, // Simpan ID produk
  });
  
  if (error) {
    if (error.code === '23505') return { error: 'A class with this name already exists.' };
    return { error: `Database error: ${error.message}` };
  }

  revalidatePath('/dashboard/kelas'); // Revalidate halaman daftar kelas
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

  // Ambil semua data dari form
  const name = formData.get('name') as string;
  const username = formData.get('username') as string;
  const place_of_birth = formData.get('place_of_birth') as string;
  const date_of_birth = formData.get('date_of_birth') as string;
  const religion = formData.get('religion') as string;
  const school_origin = formData.get('school_origin') as string;
  const grade = formData.get('grade') as string;
  const address = formData.get('address') as string;
  const phone_number = formData.get('phone_number') as string;
  const parent_name = formData.get('parent_name') as string;
  const parent_phone_number = formData.get('parent_phone_number') as string;

  if (!name || !username) return { type: 'profile', error: 'Nama dan username wajib diisi' };

  // Siapkan data untuk diupdate ke tabel 'profiles'
  const profileDataToUpdate = {
    name,
    username,
    place_of_birth,
    date_of_birth: date_of_birth || null, // Pastikan bisa null jika kosong
    religion,
    school_origin,
    grade,
    address,
    phone_number,
    parent_name,
    parent_phone_number
  };

  // 1. Update tabel 'profiles' dengan semua data baru
  const { error: profileError } = await supabase
    .from('profiles')
    .update(profileDataToUpdate)
    .eq('id', user.id);
  
  if (profileError) return { type: 'profile', error: `Gagal update profil: ${profileError.message}` };

  // 2. Update metadata di 'auth.users' (hanya untuk data yang relevan)
  const { error: authError } = await supabase.auth.updateUser({
    data: { name, username }
  });

  if (authError) return { type: 'profile', error: `Gagal update auth: ${authError.message}` };

  revalidatePath('/dashboard/profile');
  return { type: 'profile', success: 'Profil berhasil diperbarui!' };
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
  const supabase = await createClient(); // Gunakan helper untuk otorisasi
  
  // Otorisasi: Pastikan yang memanggil adalah admin
  const { data: { user: adminUser } } = await supabase.auth.getUser();
  if (!adminUser) return { error: 'Not authenticated.' };
  const { data: adminProfile } = await supabase.from('profiles').select('role').eq('id', adminUser.id).single();
  if (adminProfile?.role !== 'ADMIN') return { error: 'Not authorized.' };

  const userId = formData.get('userId') as string;
  const newPassword = formData.get('newPassword') as string;

  if (!userId || !newPassword || newPassword.length < 6) {
    return { error: 'User ID dan password minimal 6 karakter wajib diisi.' };
  }

  // [PERBAIKAN 2] - Buat Admin Client menggunakan fungsi yang diimpor dengan alias
  const supabaseAdmin = createSupabaseAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );

  const { error } = await supabaseAdmin.auth.admin.updateUserById(userId, {
    password: newPassword
  });

  if (error) return { error: `Gagal mengubah password: ${error.message}` };
  
  return { success: 'Password berhasil diubah!' };
}

export async function deleteUserByAdmin(formData: FormData): Promise<FormState> {
  const supabase = await createClient(); // Gunakan helper untuk otorisasi
  
  // Otorisasi: Pastikan yang memanggil adalah admin
  const { data: { user: adminUser } } = await supabase.auth.getUser();
  if (!adminUser) return { error: 'Not authenticated.' };
  const { data: adminProfile } = await supabase.from('profiles').select('role').eq('id', adminUser.id).single();
  if (adminProfile?.role !== 'ADMIN') return { error: 'Not authorized.' };

  const userId = formData.get('userId') as string;
  if (!userId) return { error: "User ID is missing." };
  if (userId === adminUser.id) return { error: "Admin tidak bisa menghapus akunnya sendiri." };

  // [PERBAIKAN 3] - Buat Admin Client menggunakan fungsi yang diimpor dengan alias
  const supabaseAdmin = createSupabaseAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_KEY!
  );

  const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
  
  if (error) {
    console.error("Error deleting user:", error);
    return { error: `Gagal menghapus pengguna: ${error.message}` };
  }

  revalidatePath('/dashboard/user-management');
  return { success: "Pengguna berhasil dihapus." };
}

export async function signUp(
  prevState: SignUpFormState,
  formData: FormData
): Promise<SignUpFormState> {
  // --- [PERBAIKAN UTAMA DI SINI] --- Tambahkan 'await'
  const supabase = await createClient();

  const name = formData.get('name') as string;
  const username = formData.get('username') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!name || !username || !email || !password) {
    return { error: 'Semua field wajib diisi.' };
  }
  if (password.length < 6) {
    return { error: 'Password minimal harus 6 karakter.' };
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        username,
      },
    },
  });

  if (error) {
    console.error('Sign up error:', error);
    if (error.message.includes('unique constraint') || error.message.includes('already exists')) {
        return { error: 'Username atau email ini sudah terdaftar. Silakan gunakan yang lain.' };
    }
    return { error: `Gagal mendaftar: ${error.message}` };
  }

  return { success: 'Pendaftaran berhasil! Anda akan diarahkan ke halaman login.' };
}

/**
 * Melakukan login menggunakan username.
 */
export async function signInWithUsername(
  prevState: SignInFormState,
  formData: FormData
): Promise<SignInFormState> {
  const username = formData.get('username') as string;
  const password = formData.get('password') as string;

  if (!username || !password) {
    return { error: 'Username dan password wajib diisi.' };
  }
  
  const supabase = await createClient();

  // Langkah 1: Cari email asli berdasarkan username
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('email')
    .eq('username', username.trim())
    .single();

  if (profileError || !profile || !profile.email) {
    console.error('Profile not found or email missing for username:', username, profileError);
    return { error: 'Username atau password salah.' };
  }
  
  // Langkah 2: Lakukan login menggunakan email yang ditemukan
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: profile.email,
    password,
  });

  if (signInError) {
    return { error: 'Username atau password salah.' };
  }

  // Langkah 3: Jika berhasil, redirect
  revalidatePath('/', 'layout');
  redirect('/dashboard');
}

export async function exportOrdersToCsv(
  prevState: CsvExportState, // Gunakan kembali tipe CsvExportState
  formData: FormData
): Promise<CsvExportState> {
  const supabase = await createClient();
  
  // Otorisasi: Pastikan hanya admin yang bisa mengekspor
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated.' };
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'ADMIN') return { error: 'Not authorized.' };

  // Ambil semua data pesanan dengan join ke profil
  const { data: orders, error } = await supabase
    .from('payments')
    .select(`*, profiles ( name, username, email )`)
    .order('created_at', { ascending: false });

  if (error || !orders || orders.length === 0) {
    return { error: 'No order data to export or failed to fetch.' };
  }

  // Ubah struktur data agar lebih ramah CSV
  const flattenedData = orders.map(order => ({
    order_id: order.midtrans_order_id,
    user_name: order.profiles?.name,
    user_username: order.profiles?.username,
    user_email: order.profiles?.email,
    product_name: order.product_name,
    amount: order.amount,
    status: order.status,
    order_date: new Date(order.created_at).toISOString(),
  }));

  const csvString = Papa.unparse(flattenedData, { header: true });
  const fileName = `laporan-pesanan-${new Date().toISOString().split('T')[0]}.csv`;

  return { csvString, fileName };
}

export async function getUserProfileById(userId: string) {
  'use server'
  const supabase = await createClient();

  // 1. Otorisasi: Pastikan yang memanggil adalah admin
  const { data: { user: adminUser } } = await supabase.auth.getUser();
  if (!adminUser) throw new Error('Not authenticated');
  
  const { data: adminProfile } = await supabase.from('profiles').select('role').eq('id', adminUser.id).single();
  if (adminProfile?.role !== 'ADMIN') throw new Error('Not authorized');

  // 2. Ambil data profil lengkap dari pengguna yang diminta
  const { data: userProfile, error } = await supabase
    .from('profiles')
    .select('*') // Ambil semua kolom
    .eq('id', userId)
    .single();

  if (error) throw new Error(`Failed to fetch profile: ${error.message}`);
  
  return userProfile;
}

/**
 * [GURU] Membuat ujian baru dan me-redirect ke halaman editor soal.
 * [PERBAIKAN] Menggunakan FormData sebagai input.
 */
export async function createTest(formData: FormData): Promise<{ error?: string }> {
  'use server'
  const classId = formData.get('classId') as string;
  const title = formData.get('title') as string;
  const duration = parseInt(formData.get('duration') as string, 10);

  // --- [DEBUG 1] --- Tambahkan console.log untuk melihat data yang masuk
  console.log("Mencoba membuat ujian dengan data:", { classId, title, duration });

  if (!classId || !title || isNaN(duration)) {
    return { error: 'Data tidak lengkap.' };
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };
  
  const { data: classCheck } = await supabase.from('classes').select('teacher_id').eq('id', classId).single();
  if (!classCheck || classCheck.teacher_id !== user.id) {
    return { error: 'Not authorized to create a test in this class.'};
  }

  // [PERBAIKAN UTAMA] Tambahkan 'teacher_id: user.id' ke dalam objek insert
  const { data, error } = await supabase
    .from('tests')
    .insert({ 
        class_id: classId, 
        title, 
        duration_minutes: duration, 
        teacher_id: user.id // <-- INI YANG PENTING
    })
    .select('id')
    .single();

  // --- [DEBUG 2] --- Cek apakah ada error dari Supabase
  if (error) {
    console.error("Error dari Supabase saat insert ujian:", error);
    return { error: `Gagal membuat ujian: ${error.message}` };
  }

  console.log("Ujian berhasil dibuat dengan ID:", data.id);
  
  revalidatePath(`/dashboard/ujian`); // Revalidate halaman utama ujian juga
  revalidatePath(`/dashboard/class/${classId}`);
  redirect(`/dashboard/class/${classId}/ujian/${data.id}/edit`);
}



// Aksi ini akan sangat kompleks, menangani semua jenis soal.
// Disarankan menerima satu objek besar berisi detail soal.
/**
 * [GURU] Menambahkan soal baru ke dalam sebuah ujian.
 * Saat ini mendukung tipe 'MULTIPLE_CHOICE'.
 */
export async function addQuestionToTest(
  prevState: any,
  formData: FormData
): Promise<{ error?: string; newQuestion?: any }> {
  'use server'
  console.log("--- [Server Action] addQuestionToTest Dimulai ---");
  
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    console.log("--- [Server Action] Gagal: Tidak terautentikasi ---");
    return { error: 'Not authenticated' };
  }

  try {
    const testId = formData.get('testId') as string;
    const questionText = formData.get('questionText') as string;
    const type = formData.get('type') as QuestionType;
    const marks = parseInt(formData.get('marks') as string, 10);
    console.log("--- [Server Action] Data Form Diterima:", { testId, questionText, type, marks });

    if (!testId || !questionText || !type || isNaN(marks)) {
      console.log("--- [Server Action] Gagal: Data soal utama tidak lengkap. ---");
      return { error: 'Data soal utama tidak lengkap.' };
    }

    console.log("--- [Server Action] Menyimpan soal utama ke DB... ---");
    const { data: newQuestion, error: questionError } = await supabase.from('questions').insert({ test_id: testId, question_text: questionText, type, marks }).select('id').single();
    if (questionError) throw questionError;
    const questionId = newQuestion.id;
    console.log("--- [Server Action] Soal utama berhasil disimpan dengan ID:", questionId);

    switch (type) {
        case 'MULTIPLE_CHOICE':
            const optionsJson = formData.get('options') as string;
            console.log("--- [Server Action] JSON Pilihan Ganda:", optionsJson);
            const options = JSON.parse(optionsJson);

            // Validasi penting: pastikan ada setidaknya satu jawaban benar
            if (!options.some((opt: any) => opt.is_correct)) {
                return { error: 'Pilih setidaknya satu jawaban yang benar.' };
            }

            const optionsToInsert = options.map((opt: any) => ({ question_id: questionId, option_text: opt.option_text, is_correct: opt.is_correct }));
            console.log("--- [Server Action] Menyimpan pilihan ganda ke DB... ---");
            const { error: optionsError } = await supabase.from('multiple_choice_options').insert(optionsToInsert);
            if (optionsError) throw optionsError;
            console.log("--- [Server Action] Pilihan ganda berhasil disimpan. ---");
            break;

        case 'TRUE_FALSE':
            const statementsJson = formData.get('statements') as string;
            const statements = JSON.parse(statementsJson);
            const statementsToInsert = statements.map((stmt: any) => ({ question_id: questionId, statement_text: stmt.statement_text, is_true: stmt.is_true }));
            const { error: tfError } = await supabase.from('true_false_statements').insert(statementsToInsert);
            if (tfError) throw tfError;
            break;
            
        case 'MATCHING':
            const promptsJson = formData.get('prompts') as string;
            const matchOptionsJson = formData.get('matchOptions') as string;
            const pairsJson = formData.get('pairs') as string;
            
            const prompts = JSON.parse(promptsJson);
            const matchOptions = JSON.parse(matchOptionsJson);
            const pairs = JSON.parse(pairsJson);

            // Insert prompts and get their new IDs
            const promptsToInsert = prompts.map((p: any) => ({ question_id: questionId, prompt_text: p.text }));
            const { data: insertedPrompts, error: pError } = await supabase.from('matching_prompts').insert(promptsToInsert).select();
            if (pError) throw pError;

            // Insert options and get their new IDs
            const optionsToInsertMatching = matchOptions.map((o: any) => ({ question_id: questionId, option_text: o.text }));
            const { data: insertedOptions, error: oError } = await supabase.from('matching_options').insert(optionsToInsertMatching).select();
            if (oError) throw oError;

            // Create a map for easy ID lookup
            const promptMap = new Map(insertedPrompts.map(p => [p.prompt_text, p.id]));
            const optionMap = new Map(insertedOptions.map(o => [o.option_text, o.id]));

            // Prepare the correct pairs using the new IDs
            const pairsToInsert = pairs.map((pair: any) => ({
                question_id: questionId,
                prompt_id: promptMap.get(pair.prompt_text),
                option_id: optionMap.get(pair.option_text)
            })).filter((p: { prompt_id: string | undefined, option_id: string | undefined }) => 
                    p.prompt_id && p.option_id
                );

            const { error: pairError } = await supabase.from('matching_correct_pairs').insert(pairsToInsert);
            if (pairError) throw pairError;
            break;
    }
    
    // 3. Ambil kembali data soal yang baru dibuat beserta relasinya
    console.log("--- [Server Action] Mengambil data soal lengkap... ---");
    const { data: finalNewQuestion, error: finalError } = await supabase
    .from('questions')
    .select(`
        *,
        multiple_choice_options(*),
        true_false_statements(*),
        matching_prompts(*),
        matching_options(*),
        matching_correct_pairs(*)
    `)
    .eq('id', questionId)
    .single();

if (finalError) throw finalError;

console.log("--- [Server Action] Berhasil! Revalidating path... ---");
revalidatePath(`/dashboard/class/.*/ujian/${testId}/edit`, 'page');
return { newQuestion: finalNewQuestion };

  } catch (err: any) {
    console.error("--- [Server Action] TERJADI ERROR:", err);
    return { error: `Gagal menyimpan soal: ${err.message}` };
  }
}

export async function updateQuestion(
  prevState: any,
  formData: FormData
): Promise<{ error?: string; updatedQuestion?: any }> {
  'use server'

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };

  try {
    const questionId = formData.get('questionId') as string;
    const questionText = formData.get('questionText') as string;
    const marks = parseInt(formData.get('marks') as string, 10);
    const type = formData.get('type') as QuestionType;

    // TODO: Validasi kepemilikan soal oleh guru

    switch (type) {
      case 'MULTIPLE_CHOICE':
        const optionsJson = formData.get('options') as string;
        const { error: mcError } = await supabase.rpc('update_multiple_choice_question', {
            p_question_id: questionId, p_question_text: questionText, p_marks: marks, p_options: JSON.parse(optionsJson)
        });
        if (mcError) throw mcError;
        break;

      case 'TRUE_FALSE':
        const statementsJson = formData.get('statements') as string;
        const { error: tfError } = await supabase.rpc('update_true_false_question', {
            p_question_id: questionId, p_question_text: questionText, p_marks: marks, p_statements: JSON.parse(statementsJson)
        });
        if (tfError) throw tfError;
        break;

      case 'MATCHING':
        const promptsJson = formData.get('prompts') as string;
        const matchOptionsJson = formData.get('matchOptions') as string;
        const pairsJson = formData.get('pairs') as string;
        const { error: matchError } = await supabase.rpc('update_matching_question', {
            p_question_id: questionId, p_question_text: questionText, p_marks: marks, 
            p_prompts: JSON.parse(promptsJson), p_options: JSON.parse(matchOptionsJson), p_pairs: JSON.parse(pairsJson)
        });
        if (matchError) throw matchError;
        break;
    }

    const { data: updatedQuestion } = await supabase
    .from('questions')
    .select(`
        *,
        multiple_choice_options(*),
        true_false_statements(*),
        matching_prompts(*),
        matching_options(*),
        matching_correct_pairs(*)
    `)
    .eq('id', questionId)
    .single();

revalidatePath(`/dashboard/class/.*`, 'layout');
return { updatedQuestion };

  } catch (err: any) {
    console.error("Error updating question:", err);
    return { error: `Gagal memperbarui soal: ${err.message}` };
  }
}

export async function deleteQuestion(
    formData: FormData
): Promise<{ error?: string; success?: boolean }> {
    'use server'

    const questionId = formData.get('questionId') as string;
    if (!questionId) return { error: 'ID Soal tidak ditemukan.' };
    
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { error: 'Not authenticated' };

    try {
        // [PERBAIKAN] Melakukan validasi dengan 2 query yang lebih sederhana dan type-safe

        // 1. Dapatkan test_id dari soal yang mau dihapus
        const { data: question, error: qError } = await supabase
            .from('questions')
            .select('test_id')
            .eq('id', questionId)
            .single();

        if (qError || !question) throw new Error('Soal tidak ditemukan atau gagal mengambil data soal.');

        // 2. Dapatkan teacher_id dari ujian yang terkait
        const { data: test, error: tError } = await supabase
            .from('tests')
            .select('teacher_id')
            .eq('id', question.test_id)
            .single();

        if (tError || !test || test.teacher_id !== user.id) {
            return { error: 'Anda tidak berhak menghapus soal ini.' };
        }
        
        // 3. Jika validasi lolos, hapus soal.
        const { error: deleteError } = await supabase
            .from('questions')
            .delete()
            .eq('id', questionId);
        
        if (deleteError) throw deleteError;

        revalidatePath(`/dashboard/class/.*`, 'layout');
        return { success: true };

    } catch(err: any) {
        return { error: `Gagal menghapus soal: ${err.message}` };
    }
}

// =======================================================
// AKSI UNTUK PENGERJAAN UJIAN (OLEH SISWA)
// =======================================================

/**
 * [SISWA] Memulai atau melanjutkan ujian.
 * [PERBAIKAN] Tipe return dibuat konsisten.
 */
export async function startTest(testId: string): Promise<{ submissionId: string | null; error: string | null }> {
  'use server'
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { submissionId: null, error: 'Not authenticated' };

  const { data: existingSubmission } = await supabase
    .from('test_submissions')
    .select('id')
    .eq('test_id', testId)
    .eq('student_id', user.id)
    .maybeSingle();
  
  if (existingSubmission) {
    return { submissionId: existingSubmission.id, error: null };
  }

  const { data: newSubmission, error } = await supabase
    .from('test_submissions')
    .insert({ test_id: testId, student_id: user.id, status: 'IN_PROGRESS' })
    .select('id')
    .single();

  if (error) {
    return { submissionId: null, error: `Gagal memulai ujian: ${error.message}` };
  }
  
  return { submissionId: newSubmission.id, error: null };
}

export async function submitAnswer(submissionId: string, questionId: string, answerData: any) {
    'use server'
    const supabase = await createClient();

    // Gunakan upsert: jika siswa ganti jawaban, record-nya akan di-update
    const { error } = await supabase
        .from('student_answers')
        .upsert({
            submission_id: submissionId,
            question_id: questionId,
            answer_data: answerData,
        }, { onConflict: 'submission_id,question_id' }); // Kunci unik
        
    if (error) throw new Error(error.message);
}

export async function finishTest(submissionId: string) {
    'use server'
    const supabase = await createClient();
    // Panggil RPC Function untuk menilai
    const { data, error } = await supabase.rpc('grade_test_submission', {
        submission_id_param: submissionId
    });

    if (error) {
        console.error("Error grading submission:", error);
        throw new Error("Failed to grade the test.");
    }
    
    revalidatePath('/dashboard/kelas'); // atau halaman hasil
    return { finalScore: data };
}
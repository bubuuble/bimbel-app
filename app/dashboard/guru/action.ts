'use server'

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

// Tipe data untuk form pembuatan kelas
export type ClassFormState = {
  success?: string;
  error?: string;
} | null;

// Tipe data untuk form upload materi
export type MaterialFormState = { 
  success?: string; 
  error?: string 
} | null;


// ====================================================================
// AKSI UNTUK MANAJEMEN KELAS
// ====================================================================

/**
 * Membuat kelas baru untuk guru yang sedang login.
 */
export async function createClass(
  prevState: ClassFormState, 
  formData: FormData
): Promise<ClassFormState> {
  // ... (kode ini tidak berubah, sudah benar)
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Not authenticated' };
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'GURU' && profile?.role !== 'ADMIN') return { error: 'Not authorized' };
  const className = formData.get('className') as string;
  const description = formData.get('description') as string;
  if (!className) return { error: 'Class name is required.' };
  const { error } = await supabase
    .from('classes')
    .insert({ name: className, description: description, teacher_id: user.id });
  if (error) {
    if (error.code === '23505') return { error: 'A class with this name already exists.' };
    return { error: `Database error: ${error.message}` };
  }
  revalidatePath('/dashboard/guru');
  return { success: 'Class created successfully!' };
}

/**
 * Menghapus kelas, termasuk semua materi di storage dan data terkait di database.
 * VERSI LENGKAP DENGAN DEBUGGING.
 */
export async function deleteClass(formData: FormData) {
  const classId = formData.get('classId') as string;
  console.log(`[ACTION] Attempting to delete class with ID: ${classId}`);
  if (!classId) {
    console.error("[ACTION] Aborted: Class ID is missing.");
    return;
  }

  const supabase = await createClient();

  // 1. Hapus semua file di folder storage
  console.log(`[ACTION] Listing files in storage for folder: ${classId}`);
  const { data: files, error: listError } = await supabase
    .storage
    .from('materials')
    .list(classId);

  if (listError) {
    console.error("[ACTION] Error listing files in storage:", listError);
  }

  if (files && files.length > 0) {
    const filePaths = files.map(file => `${classId}/${file.name}`);
    console.log(`[ACTION] Found ${files.length} files to delete:`, filePaths);
    const { error: removeError } = await supabase.storage.from('materials').remove(filePaths);
    if (removeError) {
      console.error("[ACTION] Error removing files from storage:", removeError);
    } else {
      console.log("[ACTION] Successfully removed files from storage.");
    }
  } else {
    console.log("[ACTION] No files found in storage for this class.");
  }

  // 2. Hapus data kelas dari database
  console.log(`[ACTION] Attempting to delete row from 'classes' table...`);
  const { error: deleteError } = await supabase
    .from('classes')
    .delete()
    .eq('id', classId);

  if (deleteError) {
    console.error("[ACTION] FATAL: Error deleting class from database:", deleteError);
    return; // Hentikan eksekusi jika DB gagal dihapus
  }

  console.log("[ACTION] Successfully deleted class from database.");

  // 3. Revalidate dan redirect
  revalidatePath('/dashboard/guru');
  redirect('/dashboard/guru');
}


// ====================================================================
// AKSI UNTUK MANAJEMEN MATERI (DI DALAM KELAS)
// ====================================================================

/**
 * Meng-upload file materi ke Supabase Storage dan menyimpan metadatanya.
 */
export async function uploadMaterial(
  prevState: MaterialFormState,
  formData: FormData
): Promise<MaterialFormState> {
  // ... (kode ini tidak berubah, sudah benar)
  const supabase = await createClient();
  const classId = formData.get('classId') as string;
  const file = formData.get('materialFile') as File;
  const title = formData.get('title') as string;
  if (!file || file.size === 0 || !classId || !title) {
    return { error: 'Title and file are required.' };
  }
  const sanitizedFileName = file.name.replace(/\s+/g, '_');
  const filePath = `${classId}/${Date.now()}_${sanitizedFileName}`;
  const { error: uploadError } = await supabase.storage.from('materials').upload(filePath, file);
  if (uploadError) return { error: `Storage error: ${uploadError.message}` };
  const { data: { publicUrl } } = supabase.storage.from('materials').getPublicUrl(filePath);
  const { error: dbError } = await supabase.from('materials').insert({
    title: title, file_url: publicUrl, file_type: file.type, class_id: classId
  });
  if (dbError) return { error: `Database error: ${dbError.message}` };
  revalidatePath(`/dashboard/guru/kelas/${classId}`);
  return { success: 'Material uploaded successfully!' };
}

/**
 * Menghapus satu file materi dari Storage dan metadatanya dari database.
 */
export async function deleteMaterial(formData: FormData) {
  const materialId = formData.get('materialId') as string;
  const fileUrl = formData.get('fileUrl') as string;
  const classId = formData.get('classId') as string;

  if (!materialId || !fileUrl || !classId) {
    console.error("Missing data for material deletion.");
    return; 
  }

  const supabase = await createClient();

  const pathPrefix = `materials/`;
  const filePath = fileUrl.substring(fileUrl.indexOf(pathPrefix) + pathPrefix.length);

  await supabase.storage.from('materials').remove([filePath]);
  await supabase.from('materials').delete().eq('id', materialId);

  revalidatePath(`/dashboard/guru/kelas/${classId}`);
}
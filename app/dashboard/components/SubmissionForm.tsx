// FILE: app/dashboard/components/SubmissionForm.tsx (KODE LENGKAP & BENAR)

'use client'
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

// Tipe Props yang sudah diperbaiki untuk menerima data yang benar
type Props = {
  materialId: string;
  studentId: string;
  classId: string;
  existingSubmission: { 
    id: number,            // Tipe diubah ke number agar cocok
    file_url: string | null  // Tipe diubah agar bisa menerima null
  } | null;
}

export default function SubmissionForm({ materialId, studentId, classId, existingSubmission }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // File hanya wajib jika ini adalah submit pertama kali atau submit ulang
    if (!file) {
      alert("Please select a file to upload.");
      return;
    }

    setIsUploading(true);
    setError(null);

    const filePath = `submissions/${classId}/${materialId}/${studentId}/${file.name.replace(/\s+/g, '_')}`;

    try {
      const { error: uploadError } = await supabase.storage.from('submissions').upload(filePath, file, { upsert: true });
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('submissions').getPublicUrl(filePath);

      let dbError;
      if (existingSubmission) {
        // Jika sudah ada, lakukan UPDATE
        const { error } = await supabase
          .from('submissions')
          .update({ file_url: publicUrl })
          .eq('id', existingSubmission.id);
        dbError = error;
      } else {
        // Jika belum ada, lakukan INSERT
        const { error } = await supabase
          .from('submissions')
          .insert({
            material_id: materialId,
            student_id: studentId,
            class_id: classId,
            file_url: publicUrl
          });
        dbError = error;
      }
      
      if (dbError) throw dbError;
      
      alert('Jawaban berhasil di-submit!');
      router.refresh();

    } catch (err: any) {
      setError(err.message);
      if (err.details) setError(`${err.message} (${err.details})`);
    } finally {
      setIsUploading(false);
    }
  };

  if (existingSubmission) {
    return (
      <div style={{ marginTop: '0.5rem', padding: '0.5rem', backgroundColor: '#e9f7ef' }}>
        <p>
          Anda sudah mengumpulkan tugas ini. 
          {/* Tambahkan pengecekan null untuk file_url sebelum merender link */}
          {existingSubmission.file_url && (
            <a href={existingSubmission.file_url} target="_blank" rel="noopener noreferrer" style={{textDecoration: 'underline', marginLeft: '5px'}}>
              Lihat jawaban Anda
            </a>
          )}
        </p>
        <details>
          <summary>Submit Ulang?</summary>
          <form onSubmit={handleSubmit} style={{ marginTop: '0.5rem' }}>
            <input type="file" onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} required />
            <button type="submit" disabled={isUploading}>{isUploading ? 'Uploading...' : 'Submit Ulang Jawaban'}</button>
            {error && <p style={{color: 'red'}}>{error}</p>}
          </form>
        </details>
      </div>
    );
  }
  
  return (
    <form onSubmit={handleSubmit} style={{ marginTop: '0.5rem' }}>
      <label>Upload Jawaban Anda:</label><br/>
      <input type="file" onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} required />
      <button type="submit" disabled={isUploading}>{isUploading ? 'Uploading...' : 'Submit'}</button>
      {error && <p style={{color: 'red'}}>{error}</p>}
    </form>
  );
}
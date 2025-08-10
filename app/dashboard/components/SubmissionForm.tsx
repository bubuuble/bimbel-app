'use client'
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

type Props = {
  materialId: string;
  studentId: string;
  classId: string;
  existingSubmission: { id: string, file_url: string } | null;
}

export default function SubmissionForm({ materialId, studentId, classId, existingSubmission }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();
  const router = useRouter();

  
  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) return;

    setIsUploading(true);
    setError(null);

    const filePath = `submissions/${classId}/${materialId}/${studentId}/${file.name.replace(/\s+/g, '_')}`;

    try {
      const { error: uploadError } = await supabase.storage.from('submissions').upload(filePath, file, { upsert: true });
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('submissions').getPublicUrl(filePath);

      // --- PERUBAHAN LOGIKA DI SINI ---
      let dbError;
      if (existingSubmission) {
        // Jika sudah ada, lakukan UPDATE
        const { error } = await supabase
          .from('submissions')
          .update({ file_url: publicUrl, submitted_at: new Date().toISOString() }) // Perbarui juga waktu submit
          .eq('id', existingSubmission.id);
        dbError = error;
      } else {
        // Jika belum ada, lakukan INSERT
        const { error } = await supabase
          .from('submissions')
          .insert({
            material_id: materialId,
            student_id: studentId,
            class_id: classId, // Kolom ini ada di skema Anda, penting untuk disertakan!
            file_url: publicUrl
          });
        dbError = error;
      }
      // ---------------------------------
      
      if (dbError) throw dbError;
      
      alert('Jawaban berhasil di-submit!');
      router.refresh();

    } catch (err: any) {
      setError(err.message);
      // Tambahkan detail error dari Supabase jika ada
      if (err.details) setError(`${err.message} (${err.details})`);
    } finally {
      setIsUploading(false);
    }
  };

  if (existingSubmission) {
    return (
      <div style={{ marginTop: '0.5rem', padding: '0.5rem', backgroundColor: '#e9f7ef' }}>
        <p>Anda sudah mengumpulkan tugas ini. <a href={existingSubmission.file_url} target="_blank" rel="noopener noreferrer" style={{textDecoration: 'underline'}}>Lihat jawaban Anda</a>.</p>
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
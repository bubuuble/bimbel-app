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

      const { error: dbError } = await supabase.from('submissions').upsert({
        material_id: materialId,
        student_id: studentId,
        file_url: publicUrl
      }, { onConflict: 'material_id,student_id' });
      
      if (dbError) throw dbError;
      
      alert('Jawaban berhasil di-submit!');
      router.refresh();

    } catch (err: any) {
      setError(err.message);
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
// FILE: app/dashboard/components/UploadMaterialForm.tsx (KODE LENGKAP)

'use client'

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";

export default function UploadMaterialForm({ classId }: { classId: string }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isTask, setIsTask] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const supabase = createClient();
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsUploading(true);
    setError(null);

    // Validasi
    if (!isTask && !file) {
      setError('File is required for regular materials.');
      setIsUploading(false);
      return;
    }
    if (!title) {
        setError('Material Title is required.');
        setIsUploading(false);
        return;
    }

    try {
      // --- PERUBAHAN UTAMA DI SINI ---
      // Konversi string dari input datetime-local ke objek Date,
      // lalu ke string ISO (UTC) sebelum mengirim ke database.
      const deadlineValue = isTask && deadline ? new Date(deadline).toISOString() : null;
      // ---------------------------------
      
      let fileUrl = null;
      let fileType = null;

      // Upload file hanya jika ada
      if (file) {
        const sanitizedFileName = file.name.replace(/\s+/g, '_');
        const filePath = `${classId}/${Date.now()}_${sanitizedFileName}`;
        
        const { error: uploadError } = await supabase.storage.from('materials').upload(filePath, file);
        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage.from('materials').getPublicUrl(filePath);
        fileUrl = publicUrl;
        fileType = file.type;
      }
      
      const { error: dbError } = await supabase
        .from('materials')
        .insert({
          title: title,
          description: description || null,
          file_url: fileUrl,
          file_type: fileType,
          class_id: classId,
          is_task: isTask,
          deadline: deadlineValue, // Kirim nilai yang sudah dikonversi ke UTC
        });
      if (dbError) throw dbError;

      alert('Material/Task created successfully!');
      router.refresh(); 
      
      // Reset form
      (event.target as HTMLFormElement).reset();
      setTitle('');
      setDescription('');
      setFile(null);
      setIsTask(false);
      setDeadline('');

    } catch (err: any) {
      console.error("Process failed:", err);
      setError(`Failed: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div style={{ border: '1px solid #ccc', padding: '1rem', borderRadius: '8px' }}>
      <h3>Create New Material / Task</h3>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="title">Title (e.g., "Bab 1 PDF" or "Tugas Video Esai")</label><br />
          <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required style={{ width: '100%', padding: '8px' }} />
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="description">Description (Opsional)</label><br />
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows={3} style={{ width: '100%', padding: '8px' }} />
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="materialFile">File (Opsional jika ini adalah tugas)</label><br />
          <input type="file" id="materialFile" onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} />
        </div>

        <div style={{ marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#f0f0f0' }}>
          <input type="checkbox" name="isTask" id="isTask" checked={isTask} onChange={(e) => setIsTask(e.target.checked)} />
          <label htmlFor="isTask" style={{ marginLeft: '8px', fontWeight: 'bold' }}>Ini adalah Tugas (memerlukan jawaban siswa)</label>
        </div>
        
        {isTask && (
          <div style={{ marginBottom: '1rem', paddingLeft: '20px' }}>
            <label htmlFor="deadline">Deadline (Opsional)</label><br />
            <input type="datetime-local" name="deadline" id="deadline" value={deadline} onChange={(e) => setDeadline(e.target.value)} style={{ padding: '8px' }}/>
          </div>
        )}
        
        <button type="submit" disabled={isUploading}>
          {isUploading ? 'Saving...' : 'Save Material/Task'}
        </button>
        {error && <p style={{ color: 'red', marginTop: '1rem' }}>{error}</p>}
      </form>
    </div>
  );
}
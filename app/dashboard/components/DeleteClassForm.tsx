// FILE: app/dashboard/components/DeleteClassForm.tsx

'use client' 

import { deleteClass } from "@/lib/actions";

export default function DeleteClassForm({ classId }: { classId: string }) {
  
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    // Tampilkan dialog konfirmasi
    const userConfirmed = confirm('Anda yakin ingin menghapus kelas ini beserta semua materinya? Tindakan ini tidak dapat diurungkan.');

    // Jika pengguna membatalkan, hentikan pengiriman form
    if (!userConfirmed) {
      event.preventDefault();
    }
  };

  return (
    <form action={deleteClass} onSubmit={handleSubmit}>
      <p>Tindakan ini akan menghapus kelas, semua materi, dan data absensi terkait.</p>
      <input type="hidden" name="classId" value={classId} />
      <button 
        type="submit" 
        style={{ backgroundColor: '#dc3545', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }}
      >
        Hapus Kelas Ini
      </button>
    </form>
  );
}
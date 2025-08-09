'use client'

import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";
import { reportAbsence, type AbsenceState } from "@/lib/actions";

function SubmitButton({ status }: { status: 'SAKIT' | 'IZIN' }) {
  const { pending } = useFormStatus();
  return <button type="submit" name="status" value={status} disabled={pending}>{pending ? '...' : status}</button>;
}

type Props = {
  classId: string;
  dbStatus: string | null; // Status dari database ('SAKIT' atau 'IZIN')
};

export default function AttendanceForm({ classId, dbStatus }: Props) {
  const initialState: AbsenceState = null;
  const [state, formAction] = useActionState(reportAbsence, initialState);
  
  // State HANYA untuk UI, untuk status 'HADIR'
  const [uiStatus, setUiStatus] = useState<string | null>(null);

  useEffect(() => {
    if (state?.success) alert(state.success);
    if (state?.error) alert(state.error);
  }, [state]);

  // Tentukan status final yang akan ditampilkan
  const finalStatus = dbStatus || uiStatus;

  // Jika sudah ada status, tampilkan pesan
  if (finalStatus) {
    return (
      <div style={{ marginTop: '2rem' }}>
        <h3>Absensi Hari Ini</h3>
        <p>Status Anda hari ini: <strong>{finalStatus}</strong>. Terima kasih!</p>
      </div>
    );
  }

  // Jika belum ada status, tampilkan pilihan
  return (
    <div style={{ marginTop: '2rem' }}>
      <h3>Absensi Hari Ini</h3>
      <p>Silakan konfirmasi kehadiran Anda untuk hari ini. Jika tidak ada laporan, Anda dianggap <strong>TIDAK HADIR</strong>.</p>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        
        {/* Tombol HADIR */}
        <button 
          onClick={() => setUiStatus('HADIR')} 
          style={{ backgroundColor: 'green', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }}
        >
          Hadir
        </button>

        {/* Form untuk SAKIT dan IZIN */}
        <form action={formAction} style={{ display: 'flex', gap: '1rem' }}>
          <input type="hidden" name="classId" value={classId} />
          <SubmitButton status="SAKIT" />
          <SubmitButton status="IZIN" />
        </form>
      </div>
    </div>
  );
}
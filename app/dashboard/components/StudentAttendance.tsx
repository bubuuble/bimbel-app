'use client'

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { submitAttendance, type StudentAttendanceState } from "@/lib/actions";
import { useEffect, useState } from "react";

function SubmitButton({ status, text }: { status: string, text: string }) {
  const { pending } = useFormStatus();
  return <button type="submit" name="status" value={status} disabled={pending}>{pending ? '...' : text}</button>;
}

// Tipe ini harus cocok dengan data yang dikirim dari page.tsx
type Session = { id: string; title: string | null; expires_at: string };
type Props = {
  classId: string;
  activeSession: Session | null;
  hasAttended: boolean;
};

export default function StudentAttendance({ classId, activeSession, hasAttended }: Props) {
  const initialState: StudentAttendanceState = null;
  const [state, formAction] = useActionState(submitAttendance, initialState);
  const [showNotes, setShowNotes] = useState(false);

  useEffect(() => {
    if (state?.success) alert(state.success);
    if (state?.error) alert(state.error);
  }, [state]);

  if (hasAttended) {
    return (
      <div style={{ marginTop: '2rem', padding: '1rem', backgroundColor: '#e9f7ef', borderRadius: '8px' }}>
        <h3>Absensi</h3>
        <p><strong>Terima kasih, Anda sudah melakukan absensi untuk sesi ini.</strong></p>
      </div>
    );
  }

  if (!activeSession) {
    return (
      <div style={{ marginTop: '2rem' }}>
        <h3>Absensi</h3>
        <p>Tidak ada sesi absensi yang sedang dibuka oleh guru saat ini.</p>
      </div>
    );
  }

  return (
    <div style={{ marginTop: '2rem', padding: '1.5rem', border: '2px solid #007bff', borderRadius: '8px' }}>
      <h3>Sesi Absensi Dibuka!</h3>
      <p><strong>{activeSession.title}</strong></p>
      <p>Sesi akan ditutup pada: {new Date(activeSession.expires_at).toLocaleTimeString()}</p>
      <form action={formAction}>
        <input type="hidden" name="sessionId" value={activeSession.id} />
        <input type="hidden" name="classId" value={classId} />
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginTop: '1rem' }}>
          <SubmitButton status="HADIR" text="Hadir" />
          <button type="button" onClick={() => setShowNotes(!showNotes)}>
            Izin / Sakit
          </button>
        </div>

        {showNotes && (
          <div style={{ marginTop: '1rem', borderTop: '1px solid #ccc', paddingTop: '1rem' }}>
            <label>Keterangan (opsional):</label>
            <textarea name="notes" placeholder="Tuliskan keterangan izin atau sakit..." style={{ width: '100%', minHeight: '80px', marginTop: '0.5rem' }} />
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
              <SubmitButton status="IZIN" text="Kirim Izin" />
              <SubmitButton status="SAKIT" text="Kirim Sakit" />
            </div>
          </div>
        )}
        {state?.error && <p style={{color: 'red', marginTop: '1rem'}}>{state.error}</p>}
      </form>
    </div>
  );
}
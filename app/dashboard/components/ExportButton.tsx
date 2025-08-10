// FILE: app/dashboard/components/ExportButton.tsx (BUAT FILE BARU)

'use client'

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { exportAttendanceToCsv, type CsvExportState } from "@/lib/actions";

function Submit() {
    const { pending } = useFormStatus();
    return <button type="submit" disabled={pending}>{pending ? 'Mengekspor...' : 'Ekspor ke CSV'}</button>
}

export default function ExportButton({ sessionId }: { sessionId: string }) {
  const initialState: CsvExportState = null;
  const [state, formAction] = useActionState(exportAttendanceToCsv, initialState);
  
  useEffect(() => {
    if (state?.error) {
      alert(state.error); // Ganti dengan toast
    }
    if (state?.csvString && state.fileName) {
      // Buat Blob dari string CSV
      const blob = new Blob([state.csvString], { type: 'text/csv;charset=utf-8;' });
      // Buat URL sementara untuk Blob
      const url = URL.createObjectURL(blob);
      // Buat link tersembunyi, klik, lalu hapus
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', state.fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  }, [state]);

  return (
    <form action={formAction}>
      <input type="hidden" name="sessionId" value={sessionId} />
      <Submit />
    </form>
  )
}
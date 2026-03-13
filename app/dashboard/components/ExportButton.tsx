// FILE: app/dashboard/components/ExportButton.tsx

'use client'

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { exportAttendanceToCsv, type CsvExportState } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Download, Loader2 } from "lucide-react";
import { toast } from "sonner";

function SubmitButton() {
  const { pending } = useFormStatus();
  
  return (
    <Button type="submit" disabled={pending} size="sm" className="h-9 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-all shadow-sm">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Mengekspor...
        </>
      ) : (
        <>
          <Download className="mr-2 h-4 w-4" />
          Ekspor ke CSV
        </>
      )}
    </Button>
  );
}

export default function ExportButton({ sessionId }: { sessionId: string }) {
  const initialState: CsvExportState = null;
  const [state, formAction] = useActionState(exportAttendanceToCsv, initialState);
  
  useEffect(() => {
    if (state?.error) {
      toast.error("Error", {
        description: state.error,
      });
    }
    
    if (state?.csvString && state.fileName) {
      const blob = new Blob([state.csvString], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', state.fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast.success("Data berhasil diekspor ke CSV");
    }
  }, [state]);

  return (
    <form action={formAction}>
      <input type="hidden" name="sessionId" value={sessionId} />
      <SubmitButton />
    </form>
  );
}

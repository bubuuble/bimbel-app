// FILE BARU: app/dashboard/components/DeleteTestButton.tsx

'use client'

import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { deleteTest } from "@/lib/actions";

export default function DeleteTestButton({ testId, classId }: { testId: string; classId: string }) {
  const { pending } = useFormStatus();

  return (
    <form
      action={async (formData) => {
        if (confirm("Anda yakin ingin menghapus ujian ini beserta semua soal di dalamnya? Tindakan ini tidak bisa dibatalkan.")) {
          await deleteTest(formData);
        }
      }}
    >
      <input type="hidden" name="testId" value={testId} />
      <input type="hidden" name="classId" value={classId} />
      <Button 
        type="submit" 
        variant="ghost" 
        size="sm" 
        disabled={pending}
        className="text-rose-600 hover:text-rose-700 hover:bg-rose-50 font-semibold"
      >
        {pending ? "Menghapus..." : "Hapus Ujian"}
      </Button>
    </form>
  );
}
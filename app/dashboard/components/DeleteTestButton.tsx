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
      <Button type="submit" variant="destructive" size="sm" disabled={pending}>
        {pending ? "Menghapus..." : "Hapus Ujian Ini"}
      </Button>
    </form>
  );
}
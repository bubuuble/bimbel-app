'use client'

import { createTest } from "@/lib/actions";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner"; // Kita akan gunakan toast untuk feedback

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
      <Button 
        type="submit" 
        disabled={pending} 
        className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all shadow-sm hover:shadow-md mt-4"
      >
        {pending ? <span className="animate-pulse">Membuat...</span> : 'Buat & Lanjut Tambah Soal'}
      </Button>
    )
}

export default function CreateTestForm({ classId }: { classId: string }) {
    
    // [PERBAIKAN UTAMA DI SINI]
    // Buat fungsi async 'action' untuk membungkus server action
    const action = async (formData: FormData) => {
        // Panggil server action dan tunggu hasilnya
        const result = await createTest(null, formData);
        
        // Jika server action mengembalikan error, tampilkan
        if (result?.error) {
            toast.error("Gagal Membuat Ujian", {
                description: result.error,
            });
        }
        // Redirect sudah ditangani di dalam server action jika sukses, 
        // jadi kita tidak perlu melakukan apa-apa lagi di sini.
    };

    return (
        <form action={action} className="space-y-4">
            <input type="hidden" name="classId" value={classId} />
            <div className="space-y-1.5">
                <Label htmlFor="title" className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Judul Ujian</Label>
                <Input id="title" name="title" placeholder="Contoh: Ujian Tengah Semester Gasal" required className="h-11 rounded-xl border-slate-200 focus:border-indigo-400 focus:ring-indigo-400" />
            </div>
            
            {/* [PERUBAHAN] Tambahkan dua input baru */}
            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                    <Label htmlFor="duration" className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Durasi (menit)</Label>
                    <Input id="duration" name="duration" type="number" placeholder="Contoh: 120" required className="h-11 rounded-xl border-slate-200 focus:border-indigo-400 focus:ring-indigo-400" />
                </div>
                <div className="space-y-1.5">
                    <Label htmlFor="total_questions" className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Jumlah Soal</Label>
                    <Input id="total_questions" name="total_questions" type="number" placeholder="Contoh: 20" required className="h-11 rounded-xl border-slate-200 focus:border-indigo-400 focus:ring-indigo-400" />
                </div>
            </div>

            <SubmitButton />
        </form>
    );
}
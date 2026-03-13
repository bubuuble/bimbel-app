// FILE: app/dashboard/components/QuickAttendanceForm.tsx
'use client'
import { createAttendanceSession } from "@/lib/actions";
import { useFormStatus } from "react-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CalendarPlus } from "lucide-react";
import { toast } from "sonner"; // Asumsi Anda akan menggunakan sonner

type TeacherClass = { id: string; name: string };

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
      <Button 
        type="submit" 
        disabled={pending}
        className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all"
      >
        {pending ? <span className="animate-pulse">Membuka...</span> : "Buka Absensi Sekarang (15 Menit)"}
      </Button>
    )
}

export default function QuickAttendanceForm({ classes }: { classes: TeacherClass[] }) {
    
    // Fungsi ini akan membungkus server action untuk memberikan umpan balik
    const formAction = async (formData: FormData) => {
        // Set waktu mulai menjadi "sekarang"
        const now = new Date();
        const timezoneOffset = now.getTimezoneOffset() * 60000;
        const localDate = new Date(now.getTime() - timezoneOffset);
        formData.append('startTime', localDate.toISOString().slice(0, 16));

        // Panggil server action
        await createAttendanceSession(formData);
        toast.success("Sesi absensi baru berhasil dibuka!");
        // Anda bisa menambahkan reset form di sini jika diperlukan
    };

    if (classes.length === 0) {
        return null; // Jangan tampilkan form jika guru tidak punya kelas
    }
    
    return (
        <div className="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-slate-50 bg-slate-50/30">
                <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
                    <CalendarPlus className="h-5 w-5 text-indigo-500" />
                    <span>Absensi Cepat</span>
                </h2>
            </div>
            <div className="p-5 sm:p-6">
                <form action={formAction} className="space-y-4">
                    <div className="space-y-1.5">
                        <label htmlFor="quick-classId" className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Pilih Kelas</label>
                        <Select name="classId" required>
                            <SelectTrigger id="quick-classId" className="h-11 rounded-xl border-slate-200">
                                <SelectValue placeholder="Pilih kelas untuk absensi..." />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl">
                                {classes.map(c => <SelectItem key={c.id} value={c.id} className="rounded-lg cursor-pointer">{c.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div className="space-y-1.5">
                        <label htmlFor="quick-sessionTitle" className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Judul Sesi (Otomatis)</label>
                        <Input 
                          id="quick-sessionTitle" 
                          name="sessionTitle" 
                          required 
                          defaultValue={`Absensi Cepat - ${new Date().toLocaleDateString('id-ID')}`} 
                          className="h-11 rounded-xl border-slate-200 focus:border-indigo-400 focus:ring-indigo-400"
                        />
                    </div>
                    <div className="pt-2">
                      <SubmitButton />
                    </div>
                </form>
            </div>
        </div>
    );
}
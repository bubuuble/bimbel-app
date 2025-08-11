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
    return <Button type="submit" disabled={pending}>{pending ? "Membuka..." : "Buka Absensi Sekarang (15 Menit)"}</Button>
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
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <CalendarPlus className="h-5 w-5" />
                    <span>Absensi Cepat</span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <form action={formAction} className="space-y-4">
                    <div>
                        <label htmlFor="quick-classId" className="text-sm font-medium">Pilih Kelas</label>
                        <Select name="classId" required>
                            <SelectTrigger id="quick-classId">
                                <SelectValue placeholder="Pilih kelas untuk absensi..." />
                            </SelectTrigger>
                            <SelectContent>
                                {classes.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <label htmlFor="quick-sessionTitle" className="text-sm font-medium">Judul Sesi (Otomatis)</label>
                        <Input id="quick-sessionTitle" name="sessionTitle" required defaultValue={`Absensi Cepat - ${new Date().toLocaleDateString('id-ID')}`} />
                    </div>
                    <SubmitButton />
                </form>
            </CardContent>
        </Card>
    );
}
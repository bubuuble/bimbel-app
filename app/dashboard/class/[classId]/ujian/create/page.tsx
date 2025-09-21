// FILE: app/dashboard/class/[classId]/ujian/create/page.tsx

'use client'

import { createTest } from "@/lib/actions";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useEffect, useRef, use } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

function SubmitButton() {
    const { pending } = useFormStatus();
    return <Button type="submit" disabled={pending} className="w-full">{pending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin"/>Membuat...</> : 'Buat & Lanjut Tambah Soal'}</Button>;
}

export default function CreateTestPage({ params }: { params: Promise<{ classId: string }> }) {
    const { classId } = use(params);
    const formRef = useRef<HTMLFormElement>(null);
    const [state, formAction] = useActionState(createTest, null);

    useEffect(() => {
        if (state?.error) {
            toast.error("Gagal Membuat Ujian", {
                description: state.error,
            });
        }
    }, [state]);
    
    return (
        // [PERBAIKAN] Gunakan 'space-y-6' untuk jarak dan hapus container flex
        <div className="space-y-6">
            <Link href={`/dashboard/class/${classId}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-4 h-4" />
                Kembali ke Kelas
            </Link>

            {/* Gunakan Card untuk membungkus form agar konsisten */}
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>Buat Ujian Baru</CardTitle>
                    <CardDescription>
                        Masukkan detail dasar untuk ujian. Anda akan diarahkan untuk menambah soal setelah ini.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form ref={formRef} action={formAction} className="space-y-4">
                        <input type="hidden" name="classId" value={classId} />
                        <div className="space-y-2">
                            <Label htmlFor="title">Judul Ujian</Label>
                            <Input id="title" name="title" placeholder="Contoh: Ujian Tengah Semester Gasal" required />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="duration">Durasi (menit)</Label>
                                <Input id="duration" name="duration" type="number" placeholder="Contoh: 120" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="total_questions">Jumlah Soal</Label>
                                <Input id="total_questions" name="total_questions" type="number" placeholder="Contoh: 20" required />
                            </div>
                        </div>
                        <SubmitButton />
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
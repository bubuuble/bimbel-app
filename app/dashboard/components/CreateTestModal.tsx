'use client'

import { useRef } from 'react';
import { useFormStatus } from 'react-dom';
import { createTest } from '@/lib/actions';
import { toast } from 'sonner';

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';

type TeacherClass = { id: string; name: string; };

type Props = {
    isOpen: boolean;
    onClose: () => void;
    teacherClasses: TeacherClass[];
}

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full">
            {pending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Membuat...</> : 'Lanjut & Tambah Soal'}
        </Button>
    );
}

export default function CreateTestModal({ isOpen, onClose, teacherClasses }: Props) {
    const formRef = useRef<HTMLFormElement>(null);

    const action = async (formData: FormData) => {
        const result = await createTest(formData);
        if (result?.error) {
            toast.error("Gagal Membuat Ujian", { description: result.error });
        } else {
            // Jika berhasil, redirect akan terjadi di server action
            // Kita bisa tutup modal dan reset form sebagai fallback
            onClose();
            formRef.current?.reset();
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Buat Ujian Tryout Baru</DialogTitle>
                    <DialogDescription>
                        Isi detail dasar ujian. Anda akan diarahkan untuk menambah soal setelah ini.
                    </DialogDescription>
                </DialogHeader>
                <form ref={formRef} action={action} className="space-y-4 pt-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Judul Ujian</Label>
                        <Input id="title" name="title" placeholder="Contoh: Tryout UTBK 2025 - Sesi 1" required />
                    </div>
                    
                    <div className="space-y-2">
                        <Label htmlFor="classId">Pilih Kelas</Label>
                        <Select name="classId" required>
                            <SelectTrigger><SelectValue placeholder="Pilih kelas untuk ujian ini..." /></SelectTrigger>
                            <SelectContent>
                                {teacherClasses.map(c => (
                                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="duration">Durasi (dalam menit)</Label>
                        <Input id="duration" name="duration" type="number" placeholder="Contoh: 120" required />
                    </div>
                    <DialogFooter>
                        <SubmitButton />
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
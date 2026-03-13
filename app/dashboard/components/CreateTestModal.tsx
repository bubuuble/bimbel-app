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
        <Button 
          type="submit" 
          disabled={pending} 
          className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all shadow-sm hover:shadow-md"
        >
            {pending ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Membuat...</> : 'Lanjut & Tambah Soal'}
        </Button>
    );
}

export default function CreateTestModal({ isOpen, onClose, teacherClasses }: Props) {
    const formRef = useRef<HTMLFormElement>(null);

    const action = async (formData: FormData) => {
        const result = await createTest(null, formData);
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
            <DialogContent className="sm:max-w-md bg-white rounded-2xl border-slate-100 p-0 overflow-hidden shadow-xl">
                <div className="p-6 border-b border-slate-50 bg-indigo-50/30">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                                <Loader2 className="h-4 w-4" /> {/* Placeholder icon */}
                            </div>
                            Buat Ujian Tryout Baru
                        </DialogTitle>
                        <DialogDescription className="text-slate-500 font-medium">
                            Isi detail dasar ujian. Anda akan diarahkan untuk menambah soal setelah ini.
                        </DialogDescription>
                    </DialogHeader>
                </div>
                
                <form ref={formRef} action={action} className="p-6 space-y-5">
                    <div className="space-y-1.5">
                        <Label htmlFor="title" className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Judul Ujian <span className="text-rose-500">*</span></Label>
                        <Input id="title" name="title" placeholder="Contoh: Tryout UTBK 2025 - Sesi 1" required className="h-11 rounded-xl border-slate-200 focus:border-indigo-400 focus:ring-indigo-400" />
                    </div>
                    
                    <div className="space-y-1.5">
                        <Label htmlFor="classId" className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Pilih Kelas <span className="text-rose-500">*</span></Label>
                        <Select name="classId" required>
                            <SelectTrigger className="h-11 rounded-xl border-slate-200 focus:border-indigo-400 focus:ring-indigo-400">
                                <SelectValue placeholder="Pilih kelas untuk ujian ini..." />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-slate-200 shadow-xl">
                                {teacherClasses.map(c => (
                                    <SelectItem key={c.id} value={c.id} className="rounded-lg cursor-pointer my-0.5 focus:bg-indigo-50 focus:text-indigo-900">{c.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="duration" className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Durasi (dalam menit) <span className="text-rose-500">*</span></Label>
                        <Input id="duration" name="duration" type="number" placeholder="Contoh: 120" required className="h-11 rounded-xl border-slate-200 focus:border-indigo-400 focus:ring-indigo-400" />
                    </div>
                    
                    <div className="pt-2">
                        <SubmitButton />
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
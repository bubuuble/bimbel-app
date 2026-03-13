// FILE: app/dashboard/components/ChangePasswordModal.tsx
'use client'

import { useEffect, useRef, useActionState } from 'react'; // <-- [PERBAIKAN] Impor dari 'react'
import { useFormStatus } from 'react-dom';
import { changeUserPasswordByAdmin, type FormState } from '@/lib/actions';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

type UserProfileSummary = { 
    id: string; 
    name: string | null; 
    username: string | null; 
};

interface ChangePasswordModalProps {
  user: UserProfileSummary | null;
  isOpen: boolean;
  onClose: () => void;
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-11 font-semibold">
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {pending ? 'Menyimpan...' : 'Simpan Password Baru'}
    </Button>
  );
}

export default function ChangePasswordModal({ user, isOpen, onClose }: ChangePasswordModalProps) {
  const [state, formAction] = useActionState(changeUserPasswordByAdmin, null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      toast.success(state.success);
      formRef.current?.reset();
      onClose();
    }
    if (state?.error) {
      toast.error("Gagal", { description: state.error });
    }
  }, [state, onClose]);

  if (!user) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* --- [PERBAIKAN UTAMA DI SINI] --- */}
      <DialogContent className="sm:max-w-md p-0 overflow-hidden border-0 rounded-2xl shadow-xl">
        <div className="bg-slate-50 border-b border-slate-100 p-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-100 text-indigo-600 mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </div>
          <DialogTitle className="text-xl font-bold text-slate-800">Ubah Password</DialogTitle>
          <DialogDescription className="text-sm text-slate-500 mt-1">
            Masukkan password baru untuk <span className="font-semibold text-slate-700">{user.name || user.username}</span>. Mereka akan logout dan perlu login kembali.
          </DialogDescription>
        </div>
        <form ref={formRef} action={formAction} className="p-6 space-y-4">
          <input type="hidden" name="userId" value={user.id} />
          <div className="space-y-1.5">
            <Label htmlFor="newPassword" className="text-xs font-medium text-slate-600">Password Baru</Label>
            <Input 
              id="newPassword"
              name="newPassword"
              type="password"
              required
              placeholder="Minimal 6 karakter"
              className="rounded-xl border-slate-200 text-sm focus:border-indigo-400 focus:ring-indigo-400 h-10"
            />
          </div>
          <SubmitButton />
        </form>
      </DialogContent>
    </Dialog>
  );
}
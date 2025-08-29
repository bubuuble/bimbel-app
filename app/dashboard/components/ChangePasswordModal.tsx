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
    <Button type="submit" disabled={pending} className="w-full">
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Ubah Password untuk {user.name || user.username}</DialogTitle>
          <DialogDescription>
            Masukkan password baru untuk pengguna ini. Mereka akan logout dan perlu login kembali.
          </DialogDescription>
        </DialogHeader>
        <form ref={formRef} action={formAction} className="space-y-4 pt-4">
          <input type="hidden" name="userId" value={user.id} />
          <div className="space-y-2">
            <Label htmlFor="newPassword">Password Baru</Label>
            <Input 
              id="newPassword"
              name="newPassword"
              type="password"
              required
              placeholder="Minimal 6 karakter"
            />
          </div>
          <SubmitButton />
        </form>
      </DialogContent>
    </Dialog>
  );
}
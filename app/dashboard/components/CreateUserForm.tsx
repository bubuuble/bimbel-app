'use client'
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createUserByAdmin, type FormState } from "@/lib/actions";
import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { toast } from "sonner";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl h-11 font-semibold">
      {pending ? "Menyimpan..." : "Tambah Pengguna"}
    </Button>
  );
}

export default function CreateUserForm() {
  const initialState: FormState = null;
  const [state, formAction] = useActionState(createUserByAdmin, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      toast.success(state.success);
      formRef.current?.reset();
    }
    if (state?.error) {
      toast.error(state.error);
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-1.5">
        <Label htmlFor="name" className="text-xs font-medium text-slate-600">Nama Lengkap</Label>
        <Input type="text" name="name" id="name" required className="rounded-xl border-slate-200 text-sm focus:border-indigo-400 focus:ring-indigo-400 h-10" />
        </div>
        <div className="space-y-1.5">
        <Label htmlFor="username" className="text-xs font-medium text-slate-600">Username</Label>
        <Input type="text" name="username" id="username" required className="rounded-xl border-slate-200 text-sm focus:border-indigo-400 focus:ring-indigo-400 h-10" />
        </div>
        <div className="space-y-1.5">
        <Label htmlFor="password" className="text-xs font-medium text-slate-600">Password Sementara</Label>
        <Input type="password" name="password" id="password" required className="rounded-xl border-slate-200 text-sm focus:border-indigo-400 focus:ring-indigo-400 h-10" />
        </div>
        <div className="space-y-1.5">
        <Label htmlFor="role" className="text-xs font-medium text-slate-600">Peran Pengguna</Label>
        <Select name="role" required>
            <SelectTrigger className="rounded-xl border-slate-200 text-sm focus:border-indigo-400 focus:ring-indigo-400 h-10">
            <SelectValue placeholder="Pilih peran dari daftar" />
            </SelectTrigger>
            <SelectContent>
            <SelectItem value="SISWA">Siswa</SelectItem>
            <SelectItem value="GURU">Guru</SelectItem>
            <SelectItem value="ADMIN">Admin</SelectItem>
            </SelectContent>
        </Select>
        </div>
        <div className="md:col-span-2">
            <SubmitButton />
        </div>
        {state?.error && (
        <div className="md:col-span-2 mt-2">
            <Alert variant="destructive" className="rounded-xl bg-rose-50 border-rose-200 text-rose-700">
                <AlertDescription className="text-sm font-medium">{state.error}</AlertDescription>
            </Alert>
        </div>
        )}
    </form>
  );
}

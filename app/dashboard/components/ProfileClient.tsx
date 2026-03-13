'use client'

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { updateUserProfile, updateUserPassword, type ProfileFormState, type PasswordFormState } from "@/lib/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User, Lock, Save } from "lucide-react";
import { toast } from "sonner";

type UserData = {
  email?: string;
  name?: string | null;
  username?: string | null;
  place_of_birth?: string | null;
  date_of_birth?: string | null;
  religion?: string | null;
  school_origin?: string | null;
  grade?: string | null;
  address?: string | null;
  phone_number?: string | null;
  parent_name?: string | null;
  parent_phone_number?: string | null;
};

function SubmitButton({ text, colorClass = "bg-indigo-600 hover:bg-indigo-700" }: { text: string; colorClass?: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={`inline-flex items-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white transition-colors disabled:opacity-60 ${colorClass}`}
    >
      <Save className="h-4 w-4" />
      {pending ? 'Menyimpan...' : text}
    </button>
  );
}

function FormSection({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 px-6 py-4 border-b border-slate-50">
        <Icon className="h-4 w-4 text-indigo-500" />
        <h2 className="text-sm font-semibold text-slate-700">{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  );
}

export default function ProfileClient({ user }: { user: UserData }) {
  const [profileState, updateProfileAction] = useActionState(updateUserProfile, null);
  const [passwordState, updatePasswordAction] = useActionState(updateUserPassword, null);
  const passwordFormRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (profileState?.success) toast.success(profileState.success);
    if (profileState?.error) toast.error(profileState.error);
  }, [profileState]);

  useEffect(() => {
    if (passwordState?.success) { toast.success(passwordState.success); passwordFormRef.current?.reset(); }
    if (passwordState?.error) toast.error(passwordState.error);
  }, [passwordState]);

  const inputClass = "rounded-xl border-slate-200 text-sm focus:border-indigo-400 focus:ring-indigo-400";
  const labelClass = "text-xs font-medium text-slate-600";

  return (
    <div className="space-y-5">
      {/* Personal info */}
      <FormSection title="Informasi Pribadi" icon={User}>
        <form action={updateProfileAction} className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="space-y-1.5">
            <Label htmlFor="name" className={labelClass}>Nama Lengkap (sesuai Akte)</Label>
            <Input id="name" name="name" defaultValue={user.name || ''} required className={inputClass} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="username" className={labelClass}>Username</Label>
            <Input id="username" name="username" defaultValue={user.username || ''} required className={inputClass} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email" className={labelClass}>Email</Label>
            <Input id="email" type="email" value={user.email || ''} disabled className={`${inputClass} bg-slate-50 text-slate-400`} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="phone_number" className={labelClass}>No. Telepon / HP</Label>
            <Input id="phone_number" name="phone_number" type="tel" defaultValue={user.phone_number || ''} className={inputClass} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="place_of_birth" className={labelClass}>Tempat Lahir</Label>
            <Input id="place_of_birth" name="place_of_birth" defaultValue={user.place_of_birth || ''} className={inputClass} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="date_of_birth" className={labelClass}>Tanggal Lahir</Label>
            <Input id="date_of_birth" name="date_of_birth" type="date" defaultValue={user.date_of_birth || ''} className={inputClass} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="religion" className={labelClass}>Agama</Label>
            <Input id="religion" name="religion" defaultValue={user.religion || ''} className={inputClass} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="school_origin" className={labelClass}>Asal Sekolah</Label>
            <Input id="school_origin" name="school_origin" defaultValue={user.school_origin || ''} className={inputClass} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="grade" className={labelClass}>Kelas</Label>
            <Input id="grade" name="grade" defaultValue={user.grade || ''} placeholder="Contoh: 12" className={inputClass} />
          </div>
          <div className="space-y-1.5 md:col-span-2">
            <Label htmlFor="address" className={labelClass}>Alamat Rumah</Label>
            <Textarea id="address" name="address" defaultValue={user.address || ''} rows={3} className={inputClass} />
          </div>

          {/* Parent section */}
          <div className="md:col-span-2 border-t border-slate-100 pt-5">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-widest mb-4">Data Orang Tua / Wali</p>
            <div className="grid md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <Label htmlFor="parent_name" className={labelClass}>Nama Orang Tua / Wali</Label>
                <Input id="parent_name" name="parent_name" defaultValue={user.parent_name || ''} className={inputClass} />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="parent_phone_number" className={labelClass}>No. Telepon Orang Tua / Wali</Label>
                <Input id="parent_phone_number" name="parent_phone_number" type="tel" defaultValue={user.parent_phone_number || ''} className={inputClass} />
              </div>
            </div>
          </div>

          <div className="md:col-span-2 flex items-center gap-3">
            <SubmitButton text="Simpan Profil" />
            {profileState?.error && <Alert variant="destructive" className="flex-1"><AlertDescription>{profileState.error}</AlertDescription></Alert>}
          </div>
        </form>
      </FormSection>

      {/* Password */}
      <FormSection title="Ubah Password" icon={Lock}>
        <form ref={passwordFormRef} action={updatePasswordAction} className="space-y-4 max-w-sm">
          <div className="space-y-1.5">
            <Label htmlFor="password" className={labelClass}>Password Baru</Label>
            <Input id="password" name="password" type="password" required className={inputClass} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="confirmPassword" className={labelClass}>Konfirmasi Password Baru</Label>
            <Input id="confirmPassword" name="confirmPassword" type="password" required className={inputClass} />
          </div>
          <div className="flex items-center gap-3">
            <SubmitButton text="Update Password" colorClass="bg-slate-700 hover:bg-slate-800" />
            {passwordState?.error && <Alert variant="destructive" className="flex-1"><AlertDescription>{passwordState.error}</AlertDescription></Alert>}
          </div>
        </form>
      </FormSection>
    </div>
  );
}
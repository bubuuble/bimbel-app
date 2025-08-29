// FILE: app/dashboard/components/ProfileClient.tsx
'use client'

import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { updateUserProfile, updateUserPassword, type ProfileFormState, type PasswordFormState } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea"; // Impor Textarea
import { toast } from "sonner";

// [PERBAIKAN] - Definisikan tipe untuk semua data pengguna
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

function SubmitButton({ text }: { text: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'Menyimpan...' : text}
    </Button>
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
    if (passwordState?.success) {
      toast.success(passwordState.success);
      passwordFormRef.current?.reset();
    }
    if (passwordState?.error) toast.error(passwordState.error);
  }, [passwordState]);

  return (
    <div className="space-y-6">
      {/* Form untuk Update Profil */}
      <Card>
        <CardHeader>
          <CardTitle>Informasi Pribadi</CardTitle>
          <CardDescription>
            Lengkapi data diri Anda. Data ini bersifat rahasia dan hanya dapat dilihat oleh Anda.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={updateProfileAction} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Kolom Kiri */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nama Lengkap (sesuai Akte)</Label>
                <Input id="name" name="name" defaultValue={user.name || ''} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" name="username" defaultValue={user.username || ''} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={user.email || ''} disabled className="bg-muted" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="place_of_birth">Tempat Lahir</Label>
                <Input id="place_of_birth" name="place_of_birth" defaultValue={user.place_of_birth || ''} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="date_of_birth">Tanggal Lahir</Label>
                <Input id="date_of_birth" name="date_of_birth" type="date" defaultValue={user.date_of_birth || ''} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="religion">Agama</Label>
                <Input id="religion" name="religion" defaultValue={user.religion || ''} />
              </div>
            </div>

            {/* Kolom Kanan */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="school_origin">Asal Sekolah</Label>
                <Input id="school_origin" name="school_origin" defaultValue={user.school_origin || ''} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="grade">Kelas</Label>
                <Input id="grade" name="grade" defaultValue={user.grade || ''} placeholder="Contoh: 12" />
              </div>
               <div className="space-y-2">
                <Label htmlFor="phone_number">No. Telepon / HP</Label>
                <Input id="phone_number" name="phone_number" type="tel" defaultValue={user.phone_number || ''} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Alamat Rumah</Label>
                <Textarea id="address" name="address" defaultValue={user.address || ''} rows={4} />
              </div>
            </div>

            {/* Bagian Orang Tua (Full Width) */}
            <div className="md:col-span-2 grid md:grid-cols-2 gap-6 border-t pt-6">
               <div className="space-y-2">
                <Label htmlFor="parent_name">Nama Orang Tua / Wali</Label>
                <Input id="parent_name" name="parent_name" defaultValue={user.parent_name || ''} />
              </div>
               <div className="space-y-2">
                <Label htmlFor="parent_phone_number">No. Telepon Orang Tua / Wali</Label>
                <Input id="parent_phone_number" name="parent_phone_number" type="tel" defaultValue={user.parent_phone_number || ''} />
              </div>
            </div>
            
            {/* Tombol Submit (Full Width) */}
            <div className="md:col-span-2">
              <SubmitButton text="Simpan Perubahan Profil" />
              {profileState?.error && <Alert variant="destructive" className="mt-4"><AlertDescription>{profileState.error}</AlertDescription></Alert>}
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Form untuk Ubah Password */}
      <Card>
        <CardHeader>
          <CardTitle>Ubah Password</CardTitle>
          <CardDescription>
            Perbarui password Anda untuk keamanan akun.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form ref={passwordFormRef} action={updatePasswordAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password Baru</Label>
              <Input id="password" name="password" type="password" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Konfirmasi Password Baru</Label>
              <Input id="confirmPassword" name="confirmPassword" type="password" required />
            </div>
            <SubmitButton text="Update Password" />
            {passwordState?.error && <Alert variant="destructive" className="mt-4"><AlertDescription>{passwordState.error}</AlertDescription></Alert>}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
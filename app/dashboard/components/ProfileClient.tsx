// FILE: app/dashboard/profile/ProfileClient.tsx

'use client'
import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { updateUserProfile, updateUserPassword, type ProfileFormState, type PasswordFormState } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

// Definisikan tipe untuk data pengguna
type UserData = {
  email?: string;
  name?: string | null;
  username?: string | null;
};

function SubmitButton({ text }: { text: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'Saving...' : text}
    </Button>
  );
}

export default function ProfileClient({ user }: { user: UserData }) {
  // State untuk form profil
  const [profileState, updateProfileAction] = useActionState(updateUserProfile, null);
  const profileFormRef = useRef<HTMLFormElement>(null);

  // State untuk form password
  const [passwordState, updatePasswordAction] = useActionState(updateUserPassword, null);
  const passwordFormRef = useRef<HTMLFormElement>(null);

  // Efek untuk menampilkan notifikasi
  useEffect(() => {
    if (profileState?.success) {
      toast.success(profileState.success);
    }
    if (profileState?.error) {
      toast.error(profileState.error);
    }
  }, [profileState]);

  useEffect(() => {
    if (passwordState?.success) {
      toast.success(passwordState.success);
      passwordFormRef.current?.reset();
    }
    if (passwordState?.error) {
      toast.error(passwordState.error);
    }
  }, [passwordState]);

  return (
    <div className="space-y-6">
      {/* Form untuk Update Profil */}
      <Card>
        <CardHeader>
          <CardTitle>Informasi Profil</CardTitle>
          <CardDescription>
            Update informasi profil Anda di sini
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form ref={profileFormRef} action={updateProfileAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email"
                type="email" 
                value={user.email || ''} 
                disabled 
                className="bg-muted"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Nama Lengkap</Label>
              <Input 
                type="text" 
                id="name" 
                name="name" 
                defaultValue={user.name || ''} 
                required 
                placeholder="Masukkan nama lengkap"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input 
                type="text" 
                id="username" 
                name="username" 
                defaultValue={user.username || ''} 
                required 
                placeholder="Masukkan username"
              />
            </div>
            <SubmitButton text="Update Profile" />
            {profileState?.error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{profileState.error}</AlertDescription>
              </Alert>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Form untuk Update Password */}
      <Card>
        <CardHeader>
          <CardTitle>Ubah Password</CardTitle>
          <CardDescription>
            Perbarui password Anda untuk keamanan akun
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form ref={passwordFormRef} action={updatePasswordAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password Baru</Label>
              <Input 
                type="password" 
                id="password" 
                name="password" 
                required 
                placeholder="Masukkan password baru"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Konfirmasi Password Baru</Label>
              <Input 
                type="password" 
                id="confirmPassword" 
                name="confirmPassword" 
                required 
                placeholder="Konfirmasi password baru"
              />
            </div>
            <SubmitButton text="Update Password" />
            {passwordState?.error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{passwordState.error}</AlertDescription>
              </Alert>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

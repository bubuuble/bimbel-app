// FILE: app/dashboard/profile/ProfileClient.tsx

'use client'
import { useActionState, useEffect, useRef } from "react";
import { useFormStatus } from "react-dom";
import { updateUserProfile, updateUserPassword, type ProfileFormState, type PasswordFormState } from "@/lib/actions";

// Definisikan tipe untuk data pengguna
type UserData = {
  email?: string;
  name?: string | null;
  username?: string | null;
};

function SubmitButton({ text }: { text: string }) {
  const { pending } = useFormStatus();
  return <button type="submit" disabled={pending}>{pending ? 'Saving...' : text}</button>;
}

export default function ProfileClient({ user }: { user: UserData }) {
  // State untuk form profil
  const [profileState, updateProfileAction] = useActionState(updateUserProfile, null);
  const profileFormRef = useRef<HTMLFormElement>(null);

  // State untuk form password
  const [passwordState, updatePasswordAction] = useActionState(updateUserPassword, null);
  const passwordFormRef = useRef<HTMLFormElement>(null);

  // Efek untuk menampilkan notifikasi (ganti dengan toast jika sudah ada)
  useEffect(() => {
    if (profileState?.success) {
      alert(profileState.success);
    }
    if (profileState?.error) {
      alert(profileState.error);
    }
  }, [profileState]);

  useEffect(() => {
    if (passwordState?.success) {
      alert(passwordState.success);
      passwordFormRef.current?.reset();
    }
    if (passwordState?.error) {
      alert(passwordState.error);
    }
  }, [passwordState]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Form untuk Update Profil */}
      <div style={{ border: '1px solid #ddd', padding: '1.5rem', borderRadius: '8px' }}>
        <h3>Informasi Profil</h3>
        <form ref={profileFormRef} action={updateProfileAction}>
          <div style={{ marginBottom: '1rem' }}>
            <label>Email</label><br />
            <input type="email" value={user.email || ''} disabled style={{ width: '100%', padding: '8px', backgroundColor: '#f4f4f4' }} />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="name">Nama Lengkap</label><br />
            <input type="text" id="name" name="name" defaultValue={user.name || ''} required style={{ width: '100%', padding: '8px' }} />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="username">Username</label><br />
            <input type="text" id="username" name="username" defaultValue={user.username || ''} required style={{ width: '100%', padding: '8px' }} />
          </div>
          <SubmitButton text="Update Profile" />
          {profileState?.error && <p style={{ color: 'red', marginTop: '1rem' }}>{profileState.error}</p>}
        </form>
      </div>

      {/* Form untuk Update Password */}
      <div style={{ border: '1px solid #ddd', padding: '1.5rem', borderRadius: '8px' }}>
        <h3>Ubah Password</h3>
        <form ref={passwordFormRef} action={updatePasswordAction}>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="password">Password Baru</label><br />
            <input type="password" id="password" name="password" required style={{ width: '100%', padding: '8px' }} />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label htmlFor="confirmPassword">Konfirmasi Password Baru</label><br />
            <input type="password" id="confirmPassword" name="confirmPassword" required style={{ width: '100%', padding: '8px' }} />
          </div>
          <SubmitButton text="Update Password" />
          {passwordState?.error && <p style={{ color: 'red', marginTop: '1rem' }}>{passwordState.error}</p>}
        </form>
      </div>
    </div>
  );
}
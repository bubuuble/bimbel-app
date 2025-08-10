// FILE: app/dashboard/components/UserManagementClient.tsx (KODE LENGKAP)

'use client'

import { useState } from "react";
import CreateUserForm from "./CreateUserForm";
import { updateUserRole, changeUserPasswordByAdmin, deleteUserByAdmin, type FormState } from "@/lib/actions";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";

type UserProfile = { 
  id: string; 
  name: string | null; 
  username: string | null; 
  email: string | null; 
  role: 'ADMIN' | 'GURU' | 'SISWA'; 
};

// Komponen terpisah untuk setiap baris pengguna agar lebih terorganisir
function UserRow({ profile }: { profile: UserProfile }) {
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [passwordState, changePasswordAction] = useActionState(changeUserPasswordByAdmin, null);

    // Untuk form ganti role
    const [roleState, changeRoleAction] = useActionState(updateUserRole, null);
    const { pending: isSavingRole } = useFormStatus();

    const handleDelete = async () => {
        if (confirm(`Anda yakin ingin menghapus pengguna "${profile.name || profile.username}"? Tindakan ini tidak dapat diurungkan.`)) {
            const formData = new FormData();
            formData.append('userId', profile.id);
            await deleteUserByAdmin(formData);
        }
    };
    
    return (
        <tr style={{ borderBottom: '1px solid #eee' }}>
            <td style={{ padding: '12px' }}>{profile.name}</td>
            <td style={{ padding: '12px' }}>{profile.username}</td>
            <td style={{ padding: '12px' }}>{profile.role}</td>
            <td style={{ padding: '12px' }}>
                <form action={changeRoleAction} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <input type="hidden" name="userId" value={profile.id} />
                    <select name="newRole" defaultValue={profile.role} disabled={profile.role === 'ADMIN'}>
                        <option value="SISWA">Siswa</option>
                        <option value="GURU">Guru</option>
                        <option value="ADMIN">Admin</option>
                    </select>
                    {profile.role !== 'ADMIN' && <button type="submit" disabled={isSavingRole}>{isSavingRole ? '...' : 'Save'}</button>}
                    {roleState?.success && <span style={{ color: 'green', fontSize: '12px' }}>{roleState.success}</span>}
                    {roleState?.error && <span style={{ color: 'red', fontSize: '12px' }}>{roleState.error}</span>}
                </form>
            </td>
            <td style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {isChangingPassword ? (
                    <form action={changePasswordAction}>
                        <input type="hidden" name="userId" value={profile.id} />
                        <input type="password" name="newPassword" placeholder="Password Baru" required />
                        <button type="submit">Simpan Pass</button>
                        <button type="button" onClick={() => setIsChangingPassword(false)}>Batal</button>
                        {passwordState?.success && <p style={{ color: 'green' }}>{passwordState.success}</p>}
                        {passwordState?.error && <p style={{ color: 'red' }}>{passwordState.error}</p>}
                    </form>
                ) : (
                    <button onClick={() => setIsChangingPassword(true)} disabled={profile.role === 'ADMIN'}>Ubah Password</button>
                )}
                <button onClick={handleDelete} disabled={profile.role === 'ADMIN'} style={{ backgroundColor: '#ffdddd', color: 'red' }}>Hapus User</button>
            </td>
        </tr>
    );
}


export default function UserManagementClient({ initialProfiles }: { initialProfiles: UserProfile[] }) {
    const [profiles, setProfiles] = useState(initialProfiles);

    return (
        <div>
            <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '800px' }}>
                    <thead>
                    <tr style={{ backgroundColor: '#f0f0f0', borderBottom: '2px solid #ddd' }}>
                        <th style={{ padding: '12px', textAlign: 'left' }}>Nama</th>
                        <th style={{ padding: '12px', textAlign: 'left' }}>Username</th>
                        <th style={{ padding: '12px', textAlign: 'left' }}>Peran Saat Ini</th>
                        <th style={{ padding: '12px', textAlign: 'left' }}>Ubah Peran</th>
                        <th style={{ padding: '12px', textAlign: 'left' }}>Tindakan</th>
                    </tr>
                    </thead>
                    <tbody>
                    {profiles.map((profile) => (
                        <UserRow key={profile.id} profile={profile} />
                    ))}
                    </tbody>
                </table>
            </div>
            
            {/* Form Create User dipindah ke bawah tabel */}
            <div style={{ marginTop: '3rem' }}>
                <CreateUserForm />
            </div>
        </div>
    );
}
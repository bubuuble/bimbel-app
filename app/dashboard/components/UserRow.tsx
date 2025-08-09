// src/app/dashboard/components/UserRow.tsx
'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { updateUserRole, type FormState } from '@/lib/actions' // <-- Impor dari lokasi baru

// Tipe data untuk props
type UserProfile = {
  id: string;
  name: string | null;
  username: string | null;
  email: string | null;
  role: 'ADMIN' | 'GURU' | 'SISWA';
};

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <button type="submit" disabled={pending} style={{ marginLeft: '10px' }}>
      {pending ? 'Saving...' : 'Save'}
    </button>
  )
}

export default function UserRow({ profile }: { profile: UserProfile }) {
  const initialState: FormState = null;
  const [state, formAction] = useActionState(updateUserRole, initialState)

  // Admin tidak bisa mengubah rolenya sendiri di sini
  const isSelf = profile.role === 'ADMIN';

  return (
    <tr key={profile.id}>
      <td style={{ padding: '12px', border: '1px solid #ddd' }}>{profile.name}</td>
      <td style={{ padding: '12px', border: '1px solid #ddd' }}>{profile.username}</td>
      <td style={{ padding: '12px', border: '1px solid #ddd' }}>{profile.role}</td>
      <td style={{ padding: '12px', border: '1px solid #ddd' }}>
        <form action={formAction}>
          <input type="hidden" name="userId" value={profile.id} />
          
          <select 
            name="newRole" 
            defaultValue={profile.role} 
            disabled={isSelf}
          >
            <option value="SISWA">Siswa</option>
            <option value="GURU">Guru</option>
            <option value="ADMIN">Admin</option>
          </select>
          
          {!isSelf && <SubmitButton />}

          {state?.error && <p style={{ color: 'red', fontSize: '12px', margin: '4px 0 0' }}>{state.error}</p>}
          {state?.success && <p style={{ color: 'green', fontSize: '12px', margin: '4px 0 0' }}>{state.success}</p>}
        </form>
      </td>
    </tr>
  )
}
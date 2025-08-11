// src/app/dashboard/components/UserRow.tsx
'use client'

import { useActionState } from 'react'
import { useFormStatus } from 'react-dom'
import { updateUserRole, type FormState } from '@/lib/actions'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { TableCell, TableRow } from '@/components/ui/table'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

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
    <Button type="submit" disabled={pending} size="sm" className="ml-2">
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Saving...
        </>
      ) : (
        'Save'
      )}
    </Button>
  )
}

export default function UserRow({ profile }: { profile: UserProfile }) {
  const initialState: FormState = null;
  const [state, formAction] = useActionState(updateUserRole, initialState)

  // Admin tidak bisa mengubah rolenya sendiri di sini
  const isSelf = profile.role === 'ADMIN';

  return (
    <TableRow>
      <TableCell>{profile.name}</TableCell>
      <TableCell>{profile.username}</TableCell>
      <TableCell>
        <span className="inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-blue-100 text-blue-800">
          {profile.role}
        </span>
      </TableCell>
      <TableCell>
        <form action={formAction} className="flex items-center gap-2">
          <input type="hidden" name="userId" value={profile.id} />
          
          <Select name="newRole" defaultValue={profile.role} disabled={isSelf}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="SISWA">Siswa</SelectItem>
              <SelectItem value="GURU">Guru</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
            </SelectContent>
          </Select>
          
          {!isSelf && <SubmitButton />}
        </form>

        {state?.error && (
          <Alert variant="destructive" className="mt-2">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{state.error}</AlertDescription>
          </Alert>
        )}
        {state?.success && (
          <Alert className="mt-2 border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">{state.success}</AlertDescription>
          </Alert>
        )}
      </TableCell>
    </TableRow>
  )
}
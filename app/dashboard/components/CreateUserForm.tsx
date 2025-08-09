'use client'
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createUserByAdmin, type FormState } from "@/lib/actions";
import { useEffect, useRef } from "react";

function SubmitButton() {
    const { pending } = useFormStatus();
    return <button type="submit" disabled={pending}>{pending ? "Creating..." : "Create User"}</button>;
}

export default function CreateUserForm() {
  const initialState: FormState = null;
  const [state, formAction] = useActionState(createUserByAdmin, initialState);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state?.success) {
      alert(state.success);
      formRef.current?.reset();
    }
    if (state?.error) {
      alert(state.error);
    }
  }, [state]);

  return (
    <div style={{marginTop: '2rem', border: '1px solid #ccc', padding: '1rem', borderRadius: '8px'}}>
      <h3>Create New User</h3>
      <form ref={formRef} action={formAction} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label htmlFor="name">Full Name</label><br />
          <input type="text" name="name" id="name" required style={{ width: '100%', padding: '8px' }}/>
        </div>
        <div>
          <label htmlFor="username">Username</label><br />
          <input type="text" name="username" id="username" required style={{ width: '100%', padding: '8px' }}/>
        </div>
        <div>
          <label htmlFor="password">Password</label><br />
          <input type="password" name="password" id="password" required style={{ width: '100%', padding: '8px' }}/>
        </div>
        <div>
          <label htmlFor="role">Role</label><br />
          <select name="role" id="role" required style={{ width: '100%', padding: '8px' }}>
            <option value="SISWA">Siswa</option>
            <option value="GURU">Guru</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
        <SubmitButton />
        {state?.error && <p style={{ color: 'red' }}>{state.error}</p>}
      </form>
    </div>
  )
}
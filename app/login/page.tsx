// src/app/login/page.tsx (MODIFIED FOR USERNAME)
'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()
  const supabase = createClient()

  // Gunakan domain palsu yang SAMA dengan di halaman register
  const PLACEHOLDER_DOMAIN = 'user.bimbelapp'

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault()

    // Buat ulang email palsu dari username yang dimasukkan user
    const email = `${username.toLowerCase()}@${PLACEHOLDER_DOMAIN}`

    const { error } = await supabase.auth.signInWithPassword({
      email, // Gunakan email palsu ini untuk login
      password,
    })

    if (error) {
      alert('Login failed: Invalid username or password.')
    } else {
      router.push('/dashboard') // Arahkan ke dashboard setelah login
      router.refresh()
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h1>Login</h1>
      <form onSubmit={handleLogin}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="username">Username</label>
          <input
            id="username" type="text" value={username} onChange={(e) => setUsername(e.target.value)} required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="password">Password</label>
          <input
            id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '4px' }}>
          Login
        </button>
      </form>
    </div>
  )
}
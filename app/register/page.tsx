// src/app/register/page.tsx (MODIFIED FOR USERNAME)
'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function RegisterPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const router = useRouter()
  const supabase = createClient()
  
  // Ini adalah "trik" kita. Kita buat domain palsu.
  const PLACEHOLDER_DOMAIN = 'user.bimbelapp'

  const handleSignUp = async (event: React.FormEvent) => {
    event.preventDefault()
    
    // Membuat email palsu dari username. Supabase tetap butuh ini.
    const fakeEmail = `${username.toLowerCase()}@${PLACEHOLDER_DOMAIN}`

    const { data, error } = await supabase.auth.signUp({
      email: fakeEmail, // Kita kirim email palsu
      password,
      options: {
        data: {
          name: name,
          username: username, // Kita kirim nama dan username asli sebagai metadata
        },
      },
    })

    if (error) {
      if (error.message.includes('User already registered')) {
        alert('Username already taken. Please choose another one.')
      } else {
        alert('Error signing up: ' + error.message)
      }
    } else {
      alert('Registration successful! You can now log in.')
      router.push('/login')
    }
  }

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
      <h1>Register</h1>
      <form onSubmit={handleSignUp}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="name">Full Name</label>
          <input
            id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required
            style={{ width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>
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
        <button type="submit" style={{ width: '100%', padding: '10px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}>
          Register
        </button>
      </form>
    </div>
  )
}
// src/components/Header.tsx
'use client'

import { createClient } from "@/lib/supabase/client"
import { User } from "@supabase/supabase-js"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function Header() {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
    }

    fetchUser()

    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', borderBottom: '1px solid #eaeaea' }}>
      <Link href="/" style={{ fontWeight: 'bold', textDecoration: 'none', color: 'black' }}>
        BimbelApp
      </Link>
      <nav>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <Link href="/login">Login</Link>
            <Link href="/register">Register</Link>
          </div>
      </nav>
    </header>
  )
}
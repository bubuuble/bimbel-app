'use client'

import { useActionState, useState, useEffect } from 'react'
import { useFormStatus } from 'react-dom'
import Link from 'next/link'
import Image from 'next/image'
import { resetPassword, type ResetPasswordFormState } from '@/lib/actions'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Eye, EyeOff, CheckCircle2, ArrowLeft } from 'lucide-react'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full h-11 rounded-lg font-semibold text-sm bg-blue-600 hover:bg-blue-700 transition-colors"
    >
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {pending ? 'Menyimpan...' : 'Simpan Password Baru'}
    </Button>
  )
}

export default function ResetPasswordPage() {
  const [state, formAction] = useActionState<ResetPasswordFormState, FormData>(resetPassword, null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isValidSession, setIsValidSession] = useState<boolean | null>(null)

  useEffect(() => {
    // Check if user has a valid recovery session
    const supabase = createClient()
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setIsValidSession(!!session)
    }
    checkSession()

    // Listen for auth events (PASSWORD_RECOVERY event sets the session)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsValidSession(true)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  if (isValidSession === null) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-rose-100 to-amber-100">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (isValidSession === false) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 via-rose-100 to-amber-100 p-4">
        <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8 max-w-sm w-full text-center space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Link Tidak Valid</h2>
          <p className="text-gray-500 text-sm">
            Link reset password ini sudah tidak valid atau sudah kadaluarsa. Silakan kirim ulang permintaan reset password.
          </p>
          <Link
            href="/forgot-password"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold text-sm bg-blue-600 text-white hover:bg-blue-700 transition-colors"
          >
            Kirim Ulang Link
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-gradient-to-br from-blue-100 via-rose-100 to-amber-100 relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-white/40 pointer-events-none" />
      <div className="absolute top-40 left-1/3 w-56 h-56 rounded-full bg-rose-200/30 pointer-events-none" />
      <div className="absolute -bottom-16 left-1/2 w-80 h-80 rounded-full bg-amber-200/30 pointer-events-none" />

      {/* Left: Branding panel */}
      <div className="hidden lg:flex flex-col justify-center bg-transparent p-12 relative">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <Image src="/image/logo/logo1.png" alt="Bimbel Master" width={40} height={40} className="rounded-xl object-contain" />
            <span className="font-bold text-xl text-blue-900">BIMBEL <span className="text-secondary">MASTER</span></span>
          </div>
          <h1 className="text-4xl font-bold leading-tight mb-4 text-blue-950">
            Buat Password
            <br />
            <span className="text-rose-500">Baru Anda</span>
          </h1>
          <p className="text-blue-800/70 text-lg leading-relaxed">
            Masukkan password baru yang kuat dan mudah Anda ingat.
            Pastikan minimal 6 karakter.
          </p>
        </div>
      </div>

      {/* Right: Form panel */}
      <div className="flex flex-col items-center justify-center p-8 bg-transparent">
        <div className="w-full max-w-sm">
          <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 p-8">
            {/* Mobile logo */}
            <div className="flex lg:hidden items-center gap-2 mb-8 justify-center">
              <Image src="/image/logo/logo1.png" alt="Bimbel Master" width={36} height={36} className="rounded-xl object-contain" />
              <span className="font-bold text-lg text-gray-900">BIMBEL MASTER</span>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Password Baru</h2>
              <p className="text-gray-500 mt-1 text-sm">Masukkan password baru Anda</p>
            </div>

            {state?.success ? (
              <div className="space-y-6">
                <div className="flex flex-col items-center text-center gap-3 py-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900">Password Diperbarui!</h3>
                  <p className="text-gray-500 text-sm">{state.success}</p>
                </div>
                <Link
                  href="/login"
                  className="flex items-center justify-center gap-2 w-full h-11 rounded-lg font-semibold text-sm bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  Masuk dengan Password Baru
                </Link>
              </div>
            ) : (
              <form action={formAction} className="space-y-5">
                {state?.error && (
                  <Alert variant="destructive" className="rounded-lg">
                    <AlertDescription className="text-sm">{state.error}</AlertDescription>
                  </Alert>
                )}

                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password Baru</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Minimal 6 karakter"
                      className="h-11 rounded-lg border-blue-300 pr-10 focus:border-blue-500 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Konfirmasi Password</Label>
                  <div className="relative">
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirm ? 'text' : 'password'}
                      required
                      placeholder="Ulangi password baru"
                      className="h-11 rounded-lg border-blue-300 pr-10 focus:border-blue-500 focus:ring-blue-500"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm(!showConfirm)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      tabIndex={-1}
                    >
                      {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <SubmitButton />
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

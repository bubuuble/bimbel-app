'use client'

import { useActionState, useEffect, useState } from 'react'
import { useFormStatus } from 'react-dom'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signUp, type SignUpFormState } from '@/lib/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import Image from 'next/image'
import { Loader2, Eye, EyeOff, CheckCircle2 } from 'lucide-react'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full h-11 rounded-lg font-semibold text-sm bg-blue-600 hover:bg-blue-700 transition-colors"
    >
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {pending ? 'Mendaftarkan...' : 'Buat Akun'}
    </Button>
  )
}

const benefits = [
  'Akses ratusan materi pelajaran',
  'Latihan soal & tryout online',
  'Progress tracking personal',
  'Konsultasi langsung dengan tutor',
]

export default function RegisterPage() {
  const [state, formAction] = useActionState<SignUpFormState, FormData>(signUp, null)
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (state?.success) {
      router.push('/login')
    }
  }, [state, router])

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-gradient-to-br from-blue-100 via-rose-100 to-amber-100 relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-white/40 pointer-events-none" />
      <div className="absolute top-1/2 -left-16 w-56 h-56 rounded-full bg-rose-200/30 pointer-events-none" />
      <div className="absolute -bottom-20 right-1/3 w-72 h-72 rounded-full bg-amber-200/30 pointer-events-none" />
      <div className="absolute top-1/4 left-1/2 w-64 h-64 rounded-full bg-blue-200/30 pointer-events-none" />
      <div className="absolute -bottom-10 left-10 w-56 h-56 rounded-full bg-white/40 pointer-events-none" />

      {/* Left: Branding panel */}
      <div className="hidden lg:flex flex-col justify-between bg-transparent p-12 relative">

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <Image src="/image/logo/logo1.png" alt="Bimbel Master" width={40} height={40} className="rounded-xl object-contain" />
            <span className="font-bold text-xl text-blue-900">BIMBEL <span className="text-secondary">MASTER</span></span>
          </div>
          <h1 className="text-4xl font-bold leading-tight mb-4 text-blue-950">
            Mulai Perjalanan
            <br />
            <span className="text-rose-500">Belajar Anda</span>
          </h1>
          <p className="text-blue-800/70 text-lg leading-relaxed">
            Bergabunglah dengan ribuan siswa yang telah meningkatkan
            prestasi akademik mereka bersama Bimbel Master.
          </p>
        </div>

        <div className="relative z-10 space-y-3">
          <p className="text-blue-800/50 text-sm font-medium uppercase tracking-wider mb-4">Yang Anda dapatkan</p>
          {benefits.map((b) => (
            <div key={b} className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4 text-white" />
              </div>
              <span className="text-sm text-blue-900">{b}</span>
            </div>
          ))}
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
              <h2 className="text-2xl font-bold text-gray-900">Buat Akun Baru</h2>
              <p className="text-gray-500 mt-1 text-sm">Isi data di bawah dan mulai belajar hari ini</p>
            </div>

            <form action={formAction} className="space-y-4">
              {state?.error && (
                <Alert variant="destructive" className="rounded-lg">
                  <AlertDescription className="text-sm">{state.error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-sm font-medium text-gray-700">Nama Lengkap</Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  defaultValue={state?.name || ''}
                  placeholder="Nama Lengkap Anda"
                  className="h-11 rounded-lg border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="username" className="text-sm font-medium text-gray-700">Username</Label>
                <Input
                  id="username"
                  name="username"
                  type="text"
                  required
                  defaultValue={state?.username || ''}
                  placeholder="Username"
                  className="h-11 rounded-lg border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  defaultValue={state?.email || ''}
                  placeholder="email@example.com"
                  className="h-11 rounded-lg border-blue-300 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
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

              <SubmitButton />
            </form>

            <p className="mt-6 text-center text-sm text-gray-500">
              Sudah punya akun?{' '}
              <Link href="/login" className="font-semibold text-blue-600 hover:text-blue-700">
                Masuk di sini
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
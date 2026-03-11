'use client'

import { useActionState, useState } from 'react'
import { useFormStatus } from 'react-dom'
import Link from 'next/link'
import Image from 'next/image'
import { signInWithUsername, type SignInFormState } from '@/lib/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Eye, EyeOff, BookOpen, Users, Award } from 'lucide-react'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full h-11 rounded-lg font-semibold text-sm bg-blue-600 hover:bg-blue-700 transition-colors"
    >
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {pending ? 'Memproses...' : 'Masuk ke Dashboard'}
    </Button>
  )
}

const features = [
  { icon: BookOpen, label: 'Materi Lengkap', desc: 'Kurikulum terstruktur & up-to-date' },
  { icon: Users, label: 'Kelas Interaktif', desc: 'Belajar bersama tutor berpengalaman' },
  { icon: Award, label: 'Sertifikasi', desc: 'Raih prestasi dan sertifikat resmi' },
]

export default function LoginPage() {
  const [state, formAction] = useActionState<SignInFormState, FormData>(signInWithUsername, null)
  const [showPassword, setShowPassword] = useState(false)

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-gradient-to-br from-blue-100 via-rose-100 to-amber-100 relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-white/40 pointer-events-none" />
      <div className="absolute top-40 left-1/3 w-56 h-56 rounded-full bg-rose-200/30 pointer-events-none" />
      <div className="absolute -bottom-16 left-1/2 w-80 h-80 rounded-full bg-amber-200/30 pointer-events-none" />
      <div className="absolute top-1/4 -right-20 w-72 h-72 rounded-full bg-blue-200/30 pointer-events-none" />
      <div className="absolute -bottom-10 right-10 w-56 h-56 rounded-full bg-white/40 pointer-events-none" />

      {/* Left: Branding panel */}
      <div className="hidden lg:flex flex-col justify-between bg-transparent p-12 relative">

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <Image src="/image/logo/logo1.png" alt="Bimbel Master" width={40} height={40} className="rounded-xl object-contain" />
            <span className="font-bold text-xl text-blue-900">Bimbel <span className="text-secondary">Master</span></span>
          </div>
          <h1 className="text-4xl font-bold leading-tight mb-4 text-blue-950">
            Wujudkan Prestasi
            <br />
            <span className="text-rose-500">Bersama Kami</span>
          </h1>
          <p className="text-blue-800/70 text-lg leading-relaxed">
            Platform bimbingan belajar terpercaya untuk membantu
            kamu meraih nilai terbaik dan masuk universitas impian.
          </p>
        </div>

        <div className="relative z-10 space-y-4">
          {features.map(({ icon: Icon, label, desc }) => (
            <div key={label} className="flex items-center gap-4 bg-white/50 rounded-xl p-4 backdrop-blur-sm border border-white/60">
              <div className="w-10 h-10 rounded-lg bg-blue-600 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="font-semibold text-sm text-blue-900">{label}</p>
                <p className="text-blue-700/60 text-xs">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: Form panel */}
      <div className="flex flex-col items-center justify-center p-8 bg-transparent">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-8 justify-center">
            <Image src="/image/logo/logo1.png" alt="Bimbel Master" width={36} height={36} className="rounded-xl object-contain" />
            <span className="font-bold text-lg text-gray-900">Bimbel Master</span>
          </div>

          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Selamat Datang Kembali</h2>
            <p className="text-gray-500 mt-1 text-sm">Masuk ke akun Anda untuk melanjutkan</p>
          </div>

          <form action={formAction} className="space-y-5">
            {state?.error && (
              <Alert variant="destructive" className="rounded-lg">
                <AlertDescription className="text-sm">{state.error}</AlertDescription>
              </Alert>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="username" className="text-sm font-medium text-gray-700">Username</Label>
              <Input
                id="username"
                name="username"
                type="text"
                required
                placeholder="Masukkan username Anda"
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
                  placeholder="Masukkan password Anda"
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
            Belum punya akun?{' '}
            <Link href="/register" className="font-semibold text-blue-600 hover:text-blue-700">
              Daftar di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
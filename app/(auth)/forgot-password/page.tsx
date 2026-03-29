'use client'

import { useActionState, useState } from 'react'
import { useFormStatus } from 'react-dom'
import Link from 'next/link'
import Image from 'next/image'
import { requestPasswordReset, type ForgotPasswordFormState } from '@/lib/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, ArrowLeft, Mail, CheckCircle2 } from 'lucide-react'

function SubmitButton() {
  const { pending } = useFormStatus()
  return (
    <Button
      type="submit"
      disabled={pending}
      className="w-full h-11 rounded-lg font-semibold text-sm bg-blue-600 hover:bg-blue-700 transition-colors"
    >
      {pending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Mail className="mr-2 h-4 w-4" />}
      {pending ? 'Mengirim...' : 'Kirim Link Reset'}
    </Button>
  )
}

export default function ForgotPasswordPage() {
  const [state, formAction] = useActionState<ForgotPasswordFormState, FormData>(requestPasswordReset, null)

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-gradient-to-br from-blue-100 via-rose-100 to-amber-100 relative overflow-hidden">
      {/* Decorative circles */}
      <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-white/40 pointer-events-none" />
      <div className="absolute top-40 left-1/3 w-56 h-56 rounded-full bg-rose-200/30 pointer-events-none" />
      <div className="absolute -bottom-16 left-1/2 w-80 h-80 rounded-full bg-amber-200/30 pointer-events-none" />
      <div className="absolute top-1/4 -right-20 w-72 h-72 rounded-full bg-blue-200/30 pointer-events-none" />
      <div className="absolute -bottom-10 right-10 w-56 h-56 rounded-full bg-white/40 pointer-events-none" />

      {/* Left: Branding panel */}
      <div className="hidden lg:flex flex-col justify-center bg-transparent p-12 relative">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <Image src="/image/logo/logo1.png" alt="Bimbel Master" width={40} height={40} className="rounded-xl object-contain" />
            <span className="font-bold text-xl text-blue-900">BIMBEL <span className="text-secondary">MASTER</span></span>
          </div>
          <h1 className="text-4xl font-bold leading-tight mb-4 text-blue-950">
            Lupa Password?
            <br />
            <span className="text-rose-500">Kami Bantu!</span>
          </h1>
          <p className="text-blue-800/70 text-lg leading-relaxed">
            Jangan khawatir, kami akan mengirimkan link untuk mereset
            password Anda melalui email yang terdaftar.
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
              <h2 className="text-2xl font-bold text-gray-900">Reset Password</h2>
              <p className="text-gray-500 mt-1 text-sm">Masukkan email Anda untuk menerima link reset password</p>
            </div>

            {state?.success ? (
              <div className="space-y-6">
                <div className="flex flex-col items-center text-center gap-3 py-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                  </div>
                  <h3 className="font-bold text-lg text-gray-900">Link Terkirim!</h3>
                  <p className="text-gray-500 text-sm">{state.success}</p>
                </div>
                <Link
                  href="/login"
                  className="flex items-center justify-center gap-2 w-full h-11 rounded-lg font-semibold text-sm border-2 border-blue-600/30 text-blue-600 hover:bg-blue-50 transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Kembali ke Login
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

                <SubmitButton />
              </form>
            )}

            <p className="mt-6 text-center text-sm text-gray-500">
              Ingat password Anda?{' '}
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

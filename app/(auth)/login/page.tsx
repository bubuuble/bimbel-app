'use client'

import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const PLACEHOLDER_DOMAIN = 'user.bimbelapp'

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault()
    setIsLoading(true)
    setError('')

    const email = `${username.toLowerCase()}@${PLACEHOLDER_DOMAIN}`

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError('Login failed: Invalid username or password.')
    } else {
      router.push('/dashboard')
      router.refresh()
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" 
         style={{background: 'linear-gradient(135deg, rgba(0,75,173,0.08) 0%, rgba(209,51,19,0.08) 100%)'}}>
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 rounded-full blur-3xl animate-pulse" 
             style={{backgroundColor: 'rgba(0,75,173,0.1)'}} />
        <div className="absolute bottom-20 right-10 w-40 h-40 rounded-full blur-3xl animate-pulse" 
             style={{backgroundColor: 'rgba(209,51,19,0.1)', animationDelay: '1s'}} />
        <div className="absolute top-1/2 left-1/3 w-24 h-24 rounded-full blur-2xl animate-pulse" 
             style={{backgroundColor: 'rgba(0,75,173,0.05)', animationDelay: '2s'}} />
      </div>

      <Card className="w-full max-w-md shadow-2xl border-2 bg-white/95 backdrop-blur-sm relative z-10" 
            style={{borderColor: 'rgba(0,75,173,0.15)'}}>
        <CardHeader className="text-center space-y-4 pb-6">
          {/* Enhanced Logo Section */}
          <div className="mb-6 relative">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-4 relative" 
                 style={{background: 'linear-gradient(135deg, rgb(0,75,173) 0%, rgb(209,51,19) 100%)'}}>
                <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center overflow-hidden">
                <img 
                  src="image/logo/logo1.png" 
                  alt="Bimbel Master Logo" 
                  className="w-full h-full object-cover"
                />
                </div>
              {/* Floating accent dots */}
              <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full animate-pulse" 
                   style={{backgroundColor: 'rgb(209,51,19)'}} />
            </div>
            <h1 className="text-3xl font-bold" style={{color: 'rgb(0,75,173)'}}>
              Bimbel Master
            </h1>
            <div className="w-16 h-0.5 mx-auto mt-2" 
                 style={{background: 'linear-gradient(to right, rgb(0,75,173), rgb(209,51,19))'}} />
          </div>
          
          <div className="space-y-2">
            <CardTitle className="text-2xl font-semibold" style={{color: 'rgb(0,75,173)'}}>
              Selamat Datang Kembali
            </CardTitle>
            <CardDescription className="text-base" style={{color: 'rgb(0,75,173)', opacity: 0.7}}>
              Masuk ke akun Anda untuk mengakses dashboard pembelajaran
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <Alert variant="destructive" className="border-2" 
                     style={{borderColor: 'rgb(209,51,19)', backgroundColor: 'rgba(209,51,19,0.05)'}}>
                <AlertDescription style={{color: 'rgb(209,51,19)'}}>
                  {error}
                </AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-3">
              <Label htmlFor="username" className="text-sm font-medium" 
                     style={{color: 'rgb(0,75,173)'}}>
                Username
              </Label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                disabled={isLoading}
                placeholder="Masukkan username Anda"
                className="w-full h-12 border-2 rounded-xl focus:ring-2 transition-all duration-300 focus:border-blue-500"
                style={{borderColor: 'rgba(0,75,173,0.2)'}}
              />
            </div>
            
            <div className="space-y-3">
              <Label htmlFor="password" className="text-sm font-medium" 
                     style={{color: 'rgb(0,75,173)'}}>
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                placeholder="Masukkan password Anda"
                className="w-full h-12 border-2 rounded-xl focus:ring-2 transition-all duration-300 focus:border-blue-500"
                style={{borderColor: 'rgba(0,75,173,0.2)'}}
              />
            </div>
            
            <Button type="submit" 
                    disabled={isLoading}
                    className="w-full h-12 rounded-xl font-semibold text-base border-2 hover:shadow-lg transition-all duration-300 hover:scale-[1.02] relative overflow-hidden group"
                    style={{
                      background: 'linear-gradient(135deg, rgb(209,51,19) 0%, rgb(189,46,17) 100%)',
                      borderColor: 'rgb(209,51,19)',
                      color: 'white'
                    }}>
              {/* Button background animation */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isLoading && <Loader2 className="h-5 w-5 animate-spin" />}
                {isLoading ? 'Memproses...' : 'Masuk ke Dashboard'}
              </span>
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

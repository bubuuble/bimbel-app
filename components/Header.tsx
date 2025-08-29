// FILE: components/Header.tsx (REVISED)

'use client'

import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image"; // Untuk logo
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X } from "lucide-react";

// Komponen kecil untuk link navigasi agar bisa aktif
function NavLink({ href, children, onClick }: { href: string, children: React.ReactNode, onClick?: () => void }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link 
      href={href} 
      onClick={onClick}
      className={`font-medium transition-all duration-300 relative px-3 py-2 rounded-lg group ${
        isActive 
          ? 'font-semibold' 
          : 'hover:bg-white/60'
      }`}
      style={{
        color: isActive ? 'rgb(209,51,19)' : 'rgb(0,75,173)',
      }}
    >
      <span className="relative z-10">{children}</span>
      {/* Active indicator */}
      <div 
        className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 rounded-full transition-all duration-300 ${
          isActive ? 'w-full opacity-100' : 'w-0 opacity-0 group-hover:w-3/4 group-hover:opacity-100'
        }`}
        style={{backgroundColor: 'rgb(209,51,19)'}}
      />
      {/* Hover background */}
      <div 
        className="absolute inset-0 rounded-lg transition-all duration-300 opacity-0 group-hover:opacity-100"
        style={{backgroundColor: 'rgba(0,75,173,0.05)'}}
      />
    </Link>
  );
}

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
  const fetchUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  }
  fetchUser();
  
  const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
    setUser(session?.user ?? null);
  });

  return () => {
    authListener.subscription.unsubscribe();
  };
  }, [supabase]);

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
  };

  return (
  <header className="sticky top-0 z-50 border-b-2 shadow-lg backdrop-blur-md" 
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(0,75,173,0.02) 100%)',
            borderColor: 'rgba(0,75,173,0.1)'
          }}>
    <div className="container mx-auto px-3 sm:px-4 lg:px-6 h-16 sm:h-18 lg:h-20 flex items-center">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 group">
        <div className="relative">
          <Image 
            src="/image/logo/logo.png" 
            alt="Bimbel Master Logo" 
            width={120} 
            height={120} 
            className="w-20 h-auto sm:w-24 lg:w-32 rounded-lg transition-transform duration-300 group-hover:scale-105 shadow-sm"
          />
          {/* Brand accent */}
          <div className="absolute -top-1 -right-1 w-2 h-2 sm:w-3 sm:h-3 rounded-full animate-pulse" 
               style={{backgroundColor: 'rgb(209,51,19)'}} />
        </div>
      </Link>

      {/* Desktop Navigation */}
      <nav className="hidden lg:flex items-center gap-2 flex-1 justify-center">
        <NavLink href="/">Beranda</NavLink>
        <NavLink href="/product">Produk</NavLink>
        <NavLink href="/testimoni">Testimoni</NavLink>
        <NavLink href="/blog">Blog</NavLink>
        <NavLink href="/about">Tentang Kami</NavLink>
      </nav>

      {/* Desktop Action Buttons */}
      <div className="hidden sm:flex items-center gap-2 lg:gap-3">
        {user ? (
          <Button asChild 
                  className="font-medium px-3 py-2 sm:px-4 lg:px-6 text-xs sm:text-sm lg:text-base rounded-xl border-2 hover:shadow-lg transition-all duration-300 hover:scale-105"
                  style={{
                    backgroundColor: 'rgb(0,75,173)', 
                    borderColor: 'rgb(0,75,173)', 
                    color: 'white'
                  }}>
            <Link href="/dashboard">Dashboard</Link>
          </Button>
        ) : (
          <>
            <Button asChild 
                    variant="outline"
                    className="font-medium px-3 py-2 sm:px-4 lg:px-6 text-xs sm:text-sm lg:text-base rounded-xl border-2 hover:shadow-lg transition-all duration-300 hover:scale-105"
                    style={{
                      backgroundColor: 'transparent', 
                      borderColor: 'rgb(0,75,173)', 
                      color: 'rgb(0,75,173)'
                    }}>
              <Link href="/login">Masuk</Link>
            </Button>
            <Button asChild 
                    className="font-medium px-3 py-2 sm:px-4 lg:px-6 text-xs sm:text-sm lg:text-base rounded-xl border-2 hover:shadow-lg transition-all duration-300 hover:scale-105"
                    style={{
                      backgroundColor: 'rgb(209,51,19)', 
                      borderColor: 'rgb(209,51,19)', 
                      color: 'white'
                    }}>
              <Link href="/register">Daftar</Link>
            </Button>
          </>
        )}
      </div>

      {/* Mobile Menu Button */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetTrigger asChild className="sm:hidden ml-auto">
          <Button variant="ghost" size="sm" className="p-2">
            <Menu className="h-5 w-5" style={{color: 'rgb(0,75,173)'}} />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-80 sm:w-96">
          <div className="flex flex-col h-full">
            {/* Mobile Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-2">
                <Image 
                  src="/image/logo/logo.png" 
                  alt="Bimbel Master Logo" 
                  width={80} 
                  height={80} 
                  className="w-16 h-auto rounded-lg"
                />
                <span className="font-semibold text-lg" style={{color: 'rgb(0,75,173)'}}>
                  Bimbel Master
                </span>
              </div>
            </div>

            {/* Mobile Navigation */}
            <nav className="flex-1 p-4">
              <div className="space-y-3">
                <NavLink href="/" onClick={handleMobileMenuClose}>
                  <div className="block py-3 px-4 rounded-lg text-base font-medium">
                    Beranda
                  </div>
                </NavLink>
                <NavLink href="/product" onClick={handleMobileMenuClose}>
                  <div className="block py-3 px-4 rounded-lg text-base font-medium">
                    Produk
                  </div>
                </NavLink>
                <NavLink href="/testimoni" onClick={handleMobileMenuClose}>
                  <div className="block py-3 px-4 rounded-lg text-base font-medium">
                    Testimoni
                  </div>
                </NavLink>
                <NavLink href="/blog" onClick={handleMobileMenuClose}>
                  <div className="block py-3 px-4 rounded-lg text-base font-medium">
                    Blog
                  </div>
                </NavLink>
                <NavLink href="/about" onClick={handleMobileMenuClose}>
                  <div className="block py-3 px-4 rounded-lg text-base font-medium">
                    Tentang Kami
                  </div>
                </NavLink>
              </div>
            </nav>

            {/* Mobile Action Buttons */}
            <div className="p-4 border-t space-y-3">
              {user ? (
                <Button asChild 
                        className="w-full font-medium py-3 rounded-xl border-2 hover:shadow-lg transition-all duration-300"
                        style={{
                          backgroundColor: 'rgb(0,75,173)', 
                          borderColor: 'rgb(0,75,173)', 
                          color: 'white'
                        }}>
                  <Link href="/dashboard" onClick={handleMobileMenuClose}>Dashboard</Link>
                </Button>
              ) : (
                <>
                  <Button asChild 
                          variant="outline"
                          className="w-full font-medium py-3 rounded-xl border-2 hover:shadow-lg transition-all duration-300"
                          style={{
                            backgroundColor: 'transparent', 
                            borderColor: 'rgb(0,75,173)', 
                            color: 'rgb(0,75,173)'
                          }}>
                    <Link href="/login" onClick={handleMobileMenuClose}>Masuk</Link>
                  </Button>
                  <Button asChild 
                          className="w-full font-medium py-3 rounded-xl border-2 hover:shadow-lg transition-all duration-300"
                          style={{
                            backgroundColor: 'rgb(209,51,19)', 
                            borderColor: 'rgb(209,51,19)', 
                            color: 'white'
                          }}>
                    <Link href="/register" onClick={handleMobileMenuClose}>Daftar</Link>
                  </Button>
                </>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  </header>
  );
}
// FILE: components/Header.tsx (REVISED)

'use client'

import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image"; // Untuk logo
import { Button } from "@/components/ui/button";

// Komponen kecil untuk link navigasi agar bisa aktif
function NavLink({ href, children }: { href: string, children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link 
      href={href} 
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

  return (
  <header className="sticky top-0 z-50 border-b-2 shadow-lg backdrop-blur-md" 
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(0,75,173,0.02) 100%)',
            borderColor: 'rgba(0,75,173,0.1)'
          }}>
    <div className="container mx-auto px-6 h-20 flex items-center">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 group">
        <div className="relative">
          <Image 
            src="/image/logo/logo.png" 
            alt="Bimbel Master Logo" 
            width={200} 
            height={200} 
            className="rounded-lg transition-transform duration-300 group-hover:scale-105 shadow-sm"
          />
          {/* Brand accent */}
          <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full animate-pulse" 
               style={{backgroundColor: 'rgb(209,51,19)'}} />
        </div>
      </Link>

      {/* Navigasi Tengah */}
      <nav className="hidden md:flex items-center gap-2 flex-1 justify-center">
        <NavLink href="/">Beranda</NavLink>
        <NavLink href="/product">Produk</NavLink>
        <NavLink href="/testimoni">Testimoni</NavLink>
        <NavLink href="/blog">Blog</NavLink>
        <NavLink href="/about">Tentang Kami</NavLink>
      </nav>

      {/* Tombol Aksi Kanan */}
      <div className="flex items-center gap-3">
        {user ? (
          <Button asChild 
                  className="font-medium px-6 py-2 rounded-xl border-2 hover:shadow-lg transition-all duration-300 hover:scale-105"
                  style={{
                    backgroundColor: 'rgb(0,75,173)', 
                    borderColor: 'rgb(0,75,173)', 
                    color: 'white'
                  }}>
            <Link href="/dashboard">Dashboard</Link>
          </Button>
        ) : (
          <div className="flex items-center gap-2">
            <Button asChild 
                    className="font-medium px-6 py-2 rounded-xl border-2 hover:shadow-lg transition-all duration-300 hover:scale-105"
                    style={{
                      backgroundColor: 'rgb(209,51,19)', 
                      borderColor: 'rgb(209,51,19)', 
                      color: 'white'
                    }}>
              <Link href="/login">Masuk</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  </header>
  );
}
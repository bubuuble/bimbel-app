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
      className={`text-gray-600 hover:text-blue-600 transition-colors relative after:content-[''] after:absolute after:left-0 after:bottom-[-4px] after:w-full after:h-[2px] after:bg-blue-600 after:transition-transform after:duration-300 ${isActive ? 'after:scale-x-100 font-semibold text-blue-600' : 'after:scale-x-0'} hover:after:scale-x-100`}
    >
      {children}
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
  <header className="bg-white/80 backdrop-blur-md sticky top-0 z-50 border-b border-gray-200">
    <div className="container mx-auto px-6 h-20 flex items-center">
    {/* Logo */}
    <Link href="/" className="flex items-center gap-2">
      {/* Ganti dengan logo Anda jika ada, misal /logo.svg */}
      <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
        BM
      </div>
      <span className="font-bold text-xl text-gray-900">Bimbel Master</span>
    </Link>

    {/* Navigasi Tengah */}
    <nav className="hidden md:flex items-center gap-8 flex-1 justify-center">
      <NavLink href="/">Beranda</NavLink>
      <NavLink href="/product">Produk</NavLink>
      <NavLink href="/testimoni">Testimoni</NavLink>
      <NavLink href="/blog">Blog</NavLink>
      <NavLink href="/tentang-kami">Tentang Kami</NavLink>
    </nav>

    {/* Tombol Aksi Kanan */}
    <div className="flex items-center gap-3">
      {user ? (
        <Button asChild>
          <Link href="/dashboard">Dashboard</Link>
        </Button>
      ) : (
        <Button asChild>
          <Link href="/login">Masuk</Link>
        </Button>
      )}
    </div>
    </div>
  </header>
  );
}
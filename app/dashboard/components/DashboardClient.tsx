"use client"

// FILE: app/dashboard/components/DashboardClient.tsx (SEKARANG MENJADI LAYOUT)
import type { UserProfile } from "@/lib/types"; // Asumsi UserProfile ada di lib/types.ts
import Link from "next/link";
import { usePathname } from 'next/navigation';

// Komponen kecil untuk item menu agar bisa aktif sesuai path
function NavLink({ href, children }: { href: string, children: React.ReactNode }) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <li>
      <Link href={href} style={{
        display: 'block',
        padding: '10px 15px',
        borderRadius: '6px',
        textDecoration: 'none',
        color: isActive ? 'white' : 'black',
        backgroundColor: isActive ? '#007bff' : 'transparent'
      }}>
        {children}
      </Link>
    </li>
  );
}


export default function DashboardLayoutClient({ userProfile, children }: { userProfile: UserProfile, children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>

      {/* --- SIDEBAR --- */}
      <aside style={{ width: '250px', backgroundColor: '#ffffff', padding: '1.5rem', borderRight: '1px solid #dee2e6' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 'bold' }}>BimbelApp</h2>
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <p style={{ fontWeight: 'bold' }}>
            {userProfile.name || userProfile.username}
          </p>
          <p style={{
            padding: '4px 8px', backgroundColor: '#e9ecef',
            borderRadius: '4px', display: 'inline-block', fontSize: '0.9rem'
          }}>
            Peran: {userProfile.role}
          </p>
        </div>

        <nav>
          <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <NavLink href="/dashboard">Dashboard</NavLink>
            {/* Tampilkan menu berdasarkan peran */}
            {userProfile.role === 'SISWA' && <NavLink href="/dashboard/kehadiran">Kehadiran</NavLink>}
            {/* Tambahkan menu lain di sini */}
            <NavLink href="/dashboard/profile">Profil Saya</NavLink>
          </ul>
        </nav>
      </aside>

      {/* --- KONTEN UTAMA --- */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
          {children} {/* <-- Di sini konten halaman (page.tsx) akan dirender */}
        </main>
      </div>

    </div>
  );
}
// FILE: app/dashboard/components/DashboardLayoutClient.tsx (REVISED)

'use client'

import type { UserProfile } from "@/lib/types";
import Link from "next/link";
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from "@/lib/supabase/client";

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
        color: isActive ? 'white' : '#333',
        backgroundColor: isActive ? '#007bff' : 'transparent',
        transition: 'background-color 0.2s'
      }}>
        {children}
      </Link>
    </li>
  );
}

export default function DashboardLayoutClient({ userProfile }: { userProfile: UserProfile }) {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
      <aside style={{ 
        width: '250px', 
        backgroundColor: '#ffffff', 
        padding: '1.5rem', 
        borderRight: '1px solid #dee2e6', 
        display: 'flex', 
        flexDirection: 'column' 
      }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', fontWeight: 'bold' }}>BimbelApp</h2>
        <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
          <p style={{ fontWeight: 'bold' }}>Hello, {userProfile.name || userProfile.username}</p>
          <p style={{
            padding: '4px 8px', backgroundColor: '#e9ecef',
            borderRadius: '4px', display: 'inline-block', fontSize: '0.9rem'
          }}>
            Peran: {userProfile.role}
          </p>
        </div>

        {/* --- PERUBAHAN DI SINI --- */}
        <nav>
  <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
    <NavLink href="/dashboard">Dashboard</NavLink>
    
    {/* MENU ADMIN BARU */}
    {userProfile.role === 'ADMIN' && (
      <>
        <NavLink href="/dashboard/user-management">User Management</NavLink>
        <NavLink href="/dashboard/attendance-report">Attendance Report</NavLink>
      </>
    )}
    
    {/* MENU GURU & SISWA */}
    {(userProfile.role === 'GURU' || userProfile.role === 'SISWA') && (
      <NavLink href="/dashboard/kelas">Kelas Saya</NavLink>
    )}
    {userProfile.role === 'GURU' && (
      <NavLink href="/dashboard/absensi">Manajemen Absensi</NavLink>
    )}
    {userProfile.role === 'SISWA' && (
      <NavLink href="/dashboard/kehadiran">Kehadiran</NavLink>
    )}
    <NavLink href="/dashboard/profile">Profil Saya</NavLink>
  </ul>
</nav>
        {/* --- AKHIR PERUBAHAN --- */}
      </aside>
  );
}
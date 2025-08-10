// FILE: app/dashboard/layout.tsx (REVISED)

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardLayoutClient from "./components/DashboardClient";
import NotificationBell from "./components/NotificationBell"; // <-- Impor di sini

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, name, username, role')
    .eq('id', user.id)
    .single();
  
  if (!profile) {
    return (
      <div>
        <h1>Error</h1>
        <p>User profile not found. Please contact support.</p>
      </div>
    );
  }

  // --- LOGIKA BARU DI SINI ---
  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      <DashboardLayoutClient userProfile={profile} />

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Header sekarang lebih simpel */}
        <header style={{ padding: '1rem 2rem', backgroundColor: '#ffffff', borderBottom: '1px solid #dee2e6', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            {profile.role === 'SISWA' && <NotificationBell />}
            {/* Menggunakan user.email sebagai fallback jika username belum di-set */}
          </div>
        </header>

        <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
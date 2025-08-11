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
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden min-h-[calc(100vh-3rem)]">
        <div className="flex h-full">
          <DashboardLayoutClient userProfile={profile} />

          <div className="flex-1 flex flex-col">
            {/* Header sekarang lebih simpel */}
            <header className="p-6 bg-white border-b border-gray-200 flex justify-between items-center">
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {profile.role === 'ADMIN' ? 'Panel Admin' :
                   profile.role === 'GURU' ? 'Dashboard Guru' : 'Portal Siswa'}
                </h1>
                <p className="text-sm text-gray-600">Selamat datang, {profile.name}</p>
              </div>
              <div className="flex items-center gap-4">
                {profile.role === 'SISWA' && <NotificationBell />}
              </div>
            </header>

            <main className="flex-1 p-8 overflow-y-auto bg-gradient-to-br from-gray-50 to-white">
              <div className="max-w-6xl mx-auto">
                {children}
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
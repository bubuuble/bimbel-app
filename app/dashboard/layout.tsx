// FILE: app/dashboard/layout.tsx (REVISED)

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardLayoutClient from "./components/DashboardClient";
import DashboardHeader from "./components/DashboardHeader";
import { LanguageProvider } from "@/lib/LanguageContext";

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
    <LanguageProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-blue-50 p-6">
        <div className="max-w-7xl mx-auto bg-white rounded-3xl shadow-xl overflow-hidden min-h-[calc(100vh-3rem)]">
          <div className="flex h-full">
            <DashboardLayoutClient userProfile={profile} />

            <div className="flex-1 flex flex-col">
              <DashboardHeader userRole={profile.role} userName={profile.name} />

              <main className="flex-1 p-8 overflow-y-auto bg-gradient-to-br from-gray-50 to-white">
                <div className="max-w-6xl mx-auto">
                  {children}
                </div>
              </main>
            </div>
          </div>
        </div>
      </div>
    </LanguageProvider>
  );
}
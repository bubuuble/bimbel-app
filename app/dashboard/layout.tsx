// FILE: app/dashboard/layout.tsx

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardLayoutClient from "./components/DashboardClient"; // Ganti nama impor

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return redirect('/login');
  }

  // Ambil profil pengguna sekali di sini, di layout
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

  // Kirim profil ke komponen layout client, yang akan membungkus {children}
  return (
    <DashboardLayoutClient userProfile={profile}>
      {children}
    </DashboardLayoutClient>
  );
}
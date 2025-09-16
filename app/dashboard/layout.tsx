// FILE: app/dashboard/layout.tsx [VERSI BARU]

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardLayoutRenderer from "./components/DashboardLayoutRenderer"; // Impor komponen baru
import { UserProfile } from "@/lib/types";

// Layout ini tetap menjadi Server Component untuk mengambil data
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return redirect('/login');
  }

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('id, name, username, role, email')
    .eq('id', user.id)
    .single();
  
  if (error || !profile) {
    console.error("Dashboard layout profile error:", error);
    return (
      <div>
        <h1>Error</h1>
        <p>User profile not found. Please contact support.</p>
      </div>
    );
  }

  // Sekarang, Server Component ini hanya merender Client Component
  // dan meneruskan data (profile) serta halaman (children) kepadanya.
  return (
    <DashboardLayoutRenderer userProfile={profile as UserProfile}>
      {children}
    </DashboardLayoutRenderer>
  );
}
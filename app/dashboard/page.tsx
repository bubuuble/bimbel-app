// src/app/dashboard/page.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import DashboardClient from "./components/DashboardClient"; // Akan kita buat

// Definisikan tipe data untuk profil agar bisa digunakan di tempat lain
export type UserProfile = {
  id: string;
  name: string | null;
  username: string | null;
  role: 'ADMIN' | 'GURU' | 'SISWA';
};

export default async function DashboardPage() {
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

  // Kirim data profil ke komponen client
  return <DashboardClient userProfile={profile} />;
}
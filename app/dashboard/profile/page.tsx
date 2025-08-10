// FILE: app/dashboard/profile/page.tsx

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import ProfileClient from "../components/ProfileClient"; // Komponen yang akan kita buat

export default async function ProfilePage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return redirect('/login');
  }

  // Ambil data profil dari tabel 'profiles'
  const { data: profile } = await supabase
    .from('profiles')
    .select('name, username')
    .eq('id', user.id)
    .single();

  // Gabungkan data dari auth dan profiles
  const userData = {
    email: user.email,
    name: profile?.name,
    username: profile?.username,
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '700px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '2rem' }}>Profil Saya</h1>
      <ProfileClient user={userData} />
    </div>
  );
}
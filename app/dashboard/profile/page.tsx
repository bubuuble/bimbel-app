// FILE: app/dashboard/profile/page.tsx
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ProfileClient from "../components/ProfileClient";

export default async function ProfilePage() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return redirect('/login');
  }

  // [PERUBAIKAN] - Ambil SEMUA kolom yang dibutuhkan dari tabel 'profiles'
  const { data: profile, error } = await supabase
    .from('profiles')
    .select(`
      name, 
      username,
      place_of_birth,
      date_of_birth,
      religion,
      school_origin,
      grade,
      address,
      phone_number,
      parent_name,
      parent_phone_number
    `)
    .eq('id', user.id)
    .single();

  if (error) {
    console.error("Profile fetch error:", error);
    // Tambahkan penanganan error jika profil tidak ditemukan
    return (
      <div className="container mx-auto p-6">
        <p>Error: Gagal memuat data profil. Silakan coba lagi nanti.</p>
      </div>
    );
  }

  // Gabungkan data dari auth dan profiles
  const userData = {
    email: user.email,
    name: profile?.name,
    username: profile?.username,
    place_of_birth: profile?.place_of_birth,
    date_of_birth: profile?.date_of_birth,
    religion: profile?.religion,
    school_origin: profile?.school_origin,
    grade: profile?.grade,
    address: profile?.address,
    phone_number: profile?.phone_number,
    parent_name: profile?.parent_name,
    parent_phone_number: profile?.parent_phone_number,
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-500 via-violet-500 to-purple-400 p-6 sm:p-8 text-white shadow-lg">
        <div className="relative z-10">
          <p className="text-indigo-100 text-sm font-medium mb-1">Pengaturan</p>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Profil Saya</h1>
          <p className="text-indigo-100 mt-1 text-sm">Kelola informasi pribadi, kontak, dan pengaturan akun Anda.</p>
        </div>
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 pointer-events-none" />
      </div>

      <ProfileClient user={userData} />
    </div>
  );
}
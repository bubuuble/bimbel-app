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
    <div className="container mx-auto max-w-4xl p-0 md:p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Profil Saya</CardTitle>
        </CardHeader>
        <CardContent>
          {/* Kirim semua data ke komponen klien */}
          <ProfileClient user={userData} />
        </CardContent>
      </Card>
    </div>
  );
}
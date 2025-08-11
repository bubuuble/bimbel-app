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
    <div className="container mx-auto max-w-2xl p-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Profil Saya</CardTitle>
        </CardHeader>
        <CardContent>
          <ProfileClient user={userData} />
        </CardContent>
      </Card>
    </div>
  );
}
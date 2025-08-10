// FILE: app/dashboard/page.tsx (DISEDERHANAKAN)

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

// Impor komponen view berdasarkan peran
import AdminView from "./components/AdminView";
import TeacherView from "./components/TeacherView";
import StudentView from "./components/StudentView";

export default async function DashboardPage() {
  const supabase = await createClient();

  // Kita hanya perlu mengambil user dan profil untuk menentukan view mana yang akan dirender.
  // Layout sudah menangani redirect jika tidak login.
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user!.id).single();

  if (!profile) {
    return <div>Profile not found.</div>
  }

  // Pilih konten yang akan dirender berdasarkan peran
  const renderContent = () => {
    switch (profile.role) {
      case 'ADMIN':
        return <AdminView />;
      case 'GURU':
        return <TeacherView userProfile={profile} />;
      case 'SISWA':
        return <StudentView userProfile={profile} />;
      default:
        return <div>Error: Invalid user role.</div>;
    }
  };

  return (
    <div>
      {/* Konten akan dirender di sini, di dalam layout */}
      {renderContent()}
    </div>
  );
}
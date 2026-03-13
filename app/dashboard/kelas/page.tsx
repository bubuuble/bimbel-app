// FILE: app/dashboard/kelas/page.tsx

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import TeacherClassesView from "../components/TeacherClassesView";
import StudentClassesView from "../components/StudentClassesView";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";

type UserRole = 'GURU' | 'SISWA' | 'ADMIN';

interface UserProfile {
  id: string;
  role: UserRole;
}

async function getAuthenticatedUser() {
  const supabase = await createClient();
  
  const { data: { user }, error } = await supabase.auth.getUser();
  
  if (error || !user) {
    redirect('/login');
  }
  
  return user;
}

async function getUserProfile(userId: string): Promise<UserProfile | null> {
  const supabase = await createClient();
  
  const { data: profile, error } = await supabase
    .from('profiles')
    .select('id, role')
    .eq('id', userId)
    .single();
    
  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
  
  return profile;
}

function AccessDeniedCard() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-red-200 bg-red-50 py-16 text-center">
      <h3 className="text-sm font-semibold text-red-600 mb-2">Akses Ditolak</h3>
      <Alert className="max-w-md bg-white">
        <AlertDescription className="text-sm text-slate-600">
          Halaman ini hanya tersedia untuk Guru dan Siswa.
        </AlertDescription>
      </Alert>
    </div>
  );
}

function ProfileNotFoundCard() {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-amber-200 bg-amber-50 py-16 text-center">
      <h3 className="text-sm font-semibold text-amber-600 mb-2">Profil Tidak Ditemukan</h3>
      <Alert className="max-w-md bg-white">
        <AlertDescription className="text-sm text-slate-600">
          Silakan hubungi administrator untuk mengatur profil Anda.
        </AlertDescription>
      </Alert>
    </div>
  );
}

function ClassesPageSkeleton() {
  return (
    <div className="space-y-4 sm:space-y-6">
      <Skeleton className="h-6 sm:h-8 w-36 sm:w-48" />
      <div className="grid gap-3 sm:gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24 sm:h-32 w-full" />
        ))}
      </div>
    </div>
  );
}

async function ClassesContent() {
  const user = await getAuthenticatedUser();
  const profile = await getUserProfile(user.id);

  if (!profile) return <ProfileNotFoundCard />;

  switch (profile.role) {
    case 'GURU':
      return <TeacherClassesView userProfile={profile} />;
    case 'SISWA':
      // Halaman ini sekarang akan mengambil lebih banyak data untuk siswa
      return <StudentClassesView userProfile={profile} />;
    default:
      return <AccessDeniedCard />;
  }
}

export default function KelasPage() {
  return (
    <Suspense fallback={<ClassesPageSkeleton />}>
      <ClassesContent />
    </Suspense>
  );
}
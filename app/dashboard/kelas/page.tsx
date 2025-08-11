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
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-destructive">
            Akses Ditolak
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription>
              Halaman ini hanya tersedia untuk Guru dan Siswa.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}

function ProfileNotFoundCard() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-destructive">
            Profil Tidak Ditemukan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertDescription>
              Silakan hubungi administrator untuk mengatur profil Anda.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  );
}

function ClassesPageSkeleton() {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <Skeleton className="h-8 w-48" />
      <div className="grid gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-32 w-full" />
        ))}
      </div>
    </div>
  );
}

async function ClassesContent() {
  const user = await getAuthenticatedUser();
  const profile = await getUserProfile(user.id);

  if (!profile) {
    return <ProfileNotFoundCard />;
  }

  switch (profile.role) {
    case 'GURU':
      return <TeacherClassesView userProfile={profile} />;
    case 'SISWA':
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
// FILE: app/dashboard/absensi/page.tsx

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import TeacherGlobalAttendanceManager from "../components/TeacherGlobalAttendanceManager";
import type { AttendanceSession } from "@/lib/types";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

const ITEMS_PER_PAGE = 5;

type TeacherClass = { 
  id: string; 
  name: string; 
};

type SessionWithClass = AttendanceSession & {
  classes: {
    name: string;
  } | null;
};

export default async function GlobalAbsensiPage({ searchParams }: { searchParams: { page?: string } }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect('/login');
  
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'GURU') {
    return (
      <div className="container mx-auto py-8">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <CardTitle className="text-red-600">Akses Ditolak</CardTitle>
            <CardDescription>
              Halaman ini hanya untuk Guru.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <Button asChild>
              <Link href="/dashboard">Kembali ke Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const currentPage = parseInt(searchParams.page || '1', 10);
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;
  
  const { count: totalSessions } = await supabase
    .from('attendance_sessions')
    .select('*', { count: 'exact', head: true })
    .eq('teacher_id', user.id);
    
  const totalPages = Math.ceil((totalSessions || 0) / ITEMS_PER_PAGE);

  const { data: teacherClasses } = await supabase
    .from('classes')
    .select('id, name')
    .eq('teacher_id', user.id)
    .order('name', { ascending: true });

  const { data: initialSessions } = await supabase
    .from('attendance_sessions')
    .select('*, classes(name)')
    .eq('teacher_id', user.id)
    .order('created_at', { ascending: false })
    .range(offset, offset + ITEMS_PER_PAGE - 1)
    .returns<SessionWithClass[]>();

  return (
    <div className="container mx-auto py-6">
      <TeacherGlobalAttendanceManager 
        teacherClasses={teacherClasses || []}
        initialSessions={initialSessions || []}
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </div>
  );
}
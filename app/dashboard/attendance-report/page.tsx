import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import AdminAttendanceReport from "../components/AdminAttendanceReport";

export default async function AttendanceReportPage() {
  const supabase = await createClient();

  // Otorisasi Admin
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect('/login');
  
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profile?.role !== 'ADMIN') {
    return (
      <div className="container mx-auto p-6 max-w-md">
        <Card>
          <CardHeader className="text-center">
            <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <CardTitle className="text-red-600">Akses Ditolak</CardTitle>
            <CardDescription>
              Halaman ini hanya untuk Admin.
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
  
  // Ambil data awal
  const { data: sessions } = await supabase.rpc('get_all_attendance_sessions_for_admin');

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Laporan Absensi Keseluruhan</h1>
        <p className="text-muted-foreground mt-2">
          Kelola dan lihat laporan absensi semua siswa
        </p>
      </div>
      <AdminAttendanceReport initialSessions={sessions || []} />
    </div>
  );
}
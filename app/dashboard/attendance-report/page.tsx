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
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-red-200 bg-red-50 py-16 text-center">
        <div className="mx-auto mb-4 w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
          <AlertCircle className="w-6 h-6 text-red-600" />
        </div>
        <h3 className="text-sm font-semibold text-red-600">Akses Ditolak</h3>
        <p className="text-xs text-red-500 mt-1 mb-6">Halaman ini hanya untuk Admin.</p>
        <Button asChild className="rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold">
          <Link href="/dashboard">Kembali ke Dashboard</Link>
        </Button>
      </div>
    );
  }
  
  // Ambil data awal
  const { data: sessions } = await supabase.rpc('get_all_attendance_sessions_for_admin');

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-600 via-slate-500 to-indigo-400 p-6 sm:p-8 text-white shadow-lg">
        <div className="relative z-10">
          <p className="text-slate-200 text-sm font-medium mb-1">Admin</p>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Laporan Absensi</h1>
          <p className="text-slate-200 mt-1 text-sm">Kelola dan lihat laporan absensi semua siswa di satu tempat.</p>
        </div>
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 pointer-events-none" />
      </div>

      <AdminAttendanceReport initialSessions={sessions || []} />
    </div>
  );
}
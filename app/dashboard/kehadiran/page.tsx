// FILE: app/dashboard/kehadiran/page.tsx (KODE LENGKAP & BENAR)

import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, GraduationCap } from "lucide-react";
import AttendanceFilter from "../components/AttendanceFilter";

type AttendanceHistory = {
  status: string;
  submitted_at: string; // <<< PERBAIKAN NAMA KOLOM
  attendance_sessions: {
    title: string;
    classes: {
      id: string;
      name: string;
    } | null;
  } | null;
};

type ClassOption = {
  id: string;
  name: string;
}

type EnrolledClassResult = {
  classes: {
    id: string;
    name: string;
  }
}

// searchParams akan berisi filter dari URL, contoh: ?class_id=...
export default async function KehadiranPage({ searchParams }: { searchParams: Promise<{ class_id?: string }> }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect('/login');

  const { class_id } = await searchParams;
  const selectedClassId = class_id;

  // 1. Ambil daftar kelas yang diikuti siswa untuk dropdown filter
    const { data: enrolledClassesData } = await supabase
    .from('enrollments')
    .select('classes!inner(id, name)')
    .eq('student_id', user.id)
    .returns<EnrolledClassResult[]>(); // <-- Beri tahu Supabase tipe yang diharapkan

  const classOptions: ClassOption[] = enrolledClassesData?.map(enrollment => enrollment.classes) || [];

  // 2. Bangun query untuk riwayat kehadiran
  let query = supabase
    .from('attendance_records')
    .select(`
      status,
      submitted_at,
      attendance_sessions (
        title,
        classes (id, name)
      )
    `)
    .eq('student_id', user.id)
    .order('submitted_at', { ascending: false });

  // 3. Terapkan filter jika ada
  if (selectedClassId) {
    // Filter berdasarkan class_id di dalam tabel relasi 'attendance_sessions'
    query = query.eq('attendance_sessions.class_id', selectedClassId);
  }

  // 4. Eksekusi query
  const { data: history, error } = await query.returns<AttendanceHistory[]>();

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <Card className="border-red-200">
          <CardContent className="p-6">
            <p className="text-red-600">Gagal memuat riwayat: {error.message}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-cyan-500 via-teal-500 to-indigo-400 p-6 sm:p-8 text-white shadow-lg">
        <div className="relative z-10">
          <p className="text-cyan-100 text-sm font-medium mb-1">Siswa</p>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Riwayat Kehadiran</h1>
          <p className="text-cyan-100 mt-1 text-sm">Lihat catatan kehadiran Anda di semua sesi pembelajaran.</p>
        </div>
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 pointer-events-none" />
      </div>

      {/* Render Komponen Filter */}
      <AttendanceFilter classes={classOptions} selectedClassId={selectedClassId} />

      {history.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-100 mb-4">
            <CalendarDays className="h-6 w-6 text-cyan-500" />
          </div>
          <p className="text-sm font-medium text-slate-500">
            {selectedClassId ? 'Tidak ada riwayat kehadiran di kelas ini' : 'Anda belum pernah melakukan absensi'}
          </p>
          <p className="text-xs text-slate-400 mt-1">
            {selectedClassId ? 'Coba pilih kelas lain atau reset filter.' : 'Mulai bergabung dengan sesi pembelajaran untuk melihat riwayat.'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((rec, index) => (
            <div key={index} className="rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
              <div className="p-5 sm:p-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <h3 className="font-semibold text-lg">
                      {rec.attendance_sessions?.title || 'Sesi Tanpa Judul'}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <GraduationCap className="h-4 w-4" />
                      <span>Kelas:</span>
                      <Link 
                        href={`/dashboard/class/${rec.attendance_sessions?.classes?.id}`}
                        className="text-primary hover:underline font-medium"
                      >
                        {rec.attendance_sessions?.classes?.name || 'N/A'}
                      </Link>
                    </div>
                  </div>
                  
                  <div className="text-right space-y-2">
                    <div>
                      <Badge 
                        variant="outline"
                        className={rec.status === 'HADIR' ? 'bg-teal-50 text-teal-700 border-teal-200' : 'bg-amber-50 text-amber-700 border-amber-200'}
                      >
                        {rec.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground justify-end">
                      <CalendarDays className="h-3 w-3" />
                      {/* <<< PERBAIKAN NAMA KOLOM */}
                      {new Date(rec.submitted_at).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
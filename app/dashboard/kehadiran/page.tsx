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
export default async function KehadiranPage({ searchParams }: { searchParams: { class_id?: string } }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect('/login');

  const selectedClassId = searchParams.class_id;

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
    <div className="container mx-auto px-4 py-8 max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Riwayat Kehadiran</h1>
        <p className="text-muted-foreground mt-2">
          Lihat dan filter catatan kehadiran Anda di semua sesi pembelajaran.
        </p>
      </div>

      {/* Render Komponen Filter */}
      <AttendanceFilter classes={classOptions} selectedClassId={selectedClassId} />

      {/* Tampilkan Hasil */}
      {history.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <CalendarDays className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-muted-foreground">
              {selectedClassId ? 'Tidak ada riwayat kehadiran di kelas ini' : 'Anda belum pernah melakukan absensi'}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {selectedClassId ? 'Coba pilih kelas lain atau reset filter.' : 'Mulai bergabung dengan sesi pembelajaran untuk melihat riwayat.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {history.map((rec, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
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
                        variant={rec.status === 'HADIR' ? 'default' : 'secondary'}
                        className={rec.status === 'HADIR' ? 'bg-green-100 text-green-800 hover:bg-green-200' : ''}
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
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
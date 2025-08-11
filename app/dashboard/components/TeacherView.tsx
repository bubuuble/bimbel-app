// FILE: app/dashboard/components/TeacherView.tsx (GANTI SELURUH ISI)

import type { UserProfile } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, GraduationCap, ClipboardCheck, Edit } from "lucide-react";
import QuickAttendanceForm from "./QuickAttendanceForm"; // Komponen baru
import TasksToGradeList from "./TasksToGradeList"; // Komponen baru
import { createClient } from "@/lib/supabase/server"; // Gunakan server client untuk ambil data awal
import { Suspense } from "react";

// Tipe untuk statistik baru
type TeacherStats = {
  total_kelas: number;
  total_siswa: number;
  total_tugas: number;
  perlu_dinilai: number;
};

// Komponen untuk menampilkan statistik, dipanggil dari server
async function TeacherStatsCards() {
    const supabase = await createClient();
    const { data: stats, error } = await supabase.rpc('get_teacher_dashboard_stats');
    if (error || !stats) return <p className="text-red-500">Gagal memuat statistik.</p>;

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Kelas</CardTitle>
                    <GraduationCap className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-blue-600">{stats.total_kelas}</div>
                    <CardDescription>Kelas yang Anda ajar</CardDescription>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Siswa</CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-green-600">{stats.total_siswa}</div>
                    <CardDescription>Siswa unik di semua kelas</CardDescription>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Total Tugas</CardTitle>
                    <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{stats.total_tugas}</div>
                    <CardDescription>Tugas yang telah diberikan</CardDescription>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">Perlu Dinilai</CardTitle>
                    <Edit className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold text-orange-600">{stats.perlu_dinilai}</div>
                    <CardDescription>Jawaban menunggu penilaian</CardDescription>
                </CardContent>
            </Card>
        </div>
    );
}

// Komponen utama TeacherView, sekarang adalah Server Component
export default async function TeacherView({ userProfile }: { userProfile: UserProfile }) {
    const supabase = await createClient();
    const { data: teacherClasses } = await supabase.from('classes').select('id, name').eq('teacher_id', userProfile.id);

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Teacher Dashboard</h1>
                <p className="text-muted-foreground">
                    Welcome back, {userProfile.name}! Here's your teaching overview.
                </p>
            </div>

            <Suspense fallback={<Skeleton className="h-64" />}>
                <TeacherStatsCards />
            </Suspense>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <QuickAttendanceForm classes={teacherClasses || []} />
                <Suspense fallback={<Skeleton className="h-64" />}>
                    <TasksToGradeList />
                </Suspense>
            </div>
        </div>
    );
}
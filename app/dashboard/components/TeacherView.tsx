// FILE: app/dashboard/components/TeacherView.tsx (GANTI SELURUH ISI)

import type { UserProfile } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import QuickAttendanceForm from "./QuickAttendanceForm"; // Komponen baru
import TasksToGradeList from "./TasksToGradeList"; // Komponen baru
import TeacherStatsCardsClient from "./TeacherStatsCardsClient";
import TeacherHeaderClient from "./TeacherHeaderClient";
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
    
    return <TeacherStatsCardsClient stats={stats} error={!!error} />;
}

// Komponen utama TeacherView, sekarang adalah Server Component
export default async function TeacherView({ userProfile }: { userProfile: UserProfile }) {
    const supabase = await createClient();
    const { data: teacherClasses } = await supabase.from('classes').select('id, name').eq('teacher_id', userProfile.id);

    return (
        <div className="space-y-6 sm:space-y-8">
            <TeacherHeaderClient userName={userProfile.name || 'User'} />

            <Suspense fallback={<Skeleton className="h-48 sm:h-64" />}>
                <TeacherStatsCards />
            </Suspense>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
                <QuickAttendanceForm classes={teacherClasses || []} />
                <Suspense fallback={<Skeleton className="h-48 sm:h-64" />}>
                    <TasksToGradeList />
                </Suspense>
            </div>
        </div>
    );
}
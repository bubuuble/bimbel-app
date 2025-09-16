'use client'

import { useState, useEffect } from "react"; // <-- Impor hook
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton"; // <-- Impor Skeleton
import { Users, GraduationCap, ClipboardCheck, Edit } from "lucide-react";
import { useLanguage } from "@/lib/LanguageContext";

type TeacherStats = {
  total_kelas: number;
  total_siswa: number;
  total_tugas: number;
  perlu_dinilai: number;
};

interface TeacherStatsCardsClientProps {
  stats: TeacherStats | null;
  error?: boolean;
}

// Komponen skeleton untuk placeholder saat loading atau sebelum hydration
function StatsSkeleton() {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
                <Card key={i}>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-4 w-4 rounded-full" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="h-8 w-12 mt-1" />
                        <Skeleton className="h-3 w-32 mt-2" />
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}


export default function TeacherStatsCardsClient({ stats, error }: TeacherStatsCardsClientProps) {
  const { t } = useLanguage();
  // [PERBAIKAN] State untuk melacak apakah komponen sudah 'mounted' di client
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // Efek ini hanya berjalan di sisi client, setelah render awal
    setIsMounted(true);
  }, []);

  if (error || !stats) {
    return <p className="text-red-500">Gagal memuat statistik guru.</p>;
  }

  // Jika belum mounted, tampilkan skeleton agar cocok dengan render server
  if (!isMounted) {
    return <StatsSkeleton />;
  }

  // Setelah mounted, baru render konten yang sudah diterjemahkan
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">{t('teacher.stats.totalClasses')}</CardTitle>
          <GraduationCap className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-blue-600">{stats.total_kelas}</div>
          <CardDescription>{t('teacher.stats.classesYouTeach')}</CardDescription>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">{t('teacher.stats.totalStudents')}</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">{stats.total_siswa}</div>
          <CardDescription>{t('teacher.stats.uniqueStudents')}</CardDescription>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">{t('teacher.stats.totalTasks')}</CardTitle>
          <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.total_tugas}</div>
          <CardDescription>{t('teacher.stats.tasksGiven')}</CardDescription>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">{t('teacher.stats.needGrading')}</CardTitle>
          <Edit className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-orange-600">{stats.perlu_dinilai}</div>
          <CardDescription>{t('teacher.stats.awaitingGrade')}</CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}
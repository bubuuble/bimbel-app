'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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

export default function TeacherStatsCardsClient({ stats, error }: TeacherStatsCardsClientProps) {
  const { t } = useLanguage();
  
  if (error || !stats) {
    return <p className="text-red-500">{t('teacher.stats.error')}</p>;
  }

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

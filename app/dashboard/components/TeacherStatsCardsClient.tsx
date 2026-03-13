'use client'

import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
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

const getCards = (stats: TeacherStats | null, labels: Record<string, string>) => [
  {
    label: labels.totalClasses,
    sub: labels.classesYouTeach,
    value: stats?.total_kelas ?? 0,
    icon: GraduationCap,
    gradient: "from-indigo-400 to-blue-500",
  },
  {
    label: labels.totalStudents,
    sub: labels.uniqueStudents,
    value: stats?.total_siswa ?? 0,
    icon: Users,
    gradient: "from-teal-400 to-emerald-500",
  },
  {
    label: labels.totalTasks,
    sub: labels.tasksGiven,
    value: stats?.total_tugas ?? 0,
    icon: ClipboardCheck,
    gradient: "from-violet-400 to-purple-500",
  },
  {
    label: labels.needGrading,
    sub: labels.awaitingGrade,
    value: stats?.perlu_dinilai ?? 0,
    icon: Edit,
    gradient: "from-amber-400 to-orange-500",
  },
];

export default function TeacherStatsCardsClient({ stats, error }: TeacherStatsCardsClientProps) {
  const { t } = useLanguage();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => { setIsMounted(true); }, []);

  if (error || !stats) {
    return <p className="text-red-500 text-sm">Gagal memuat statistik guru.</p>;
  }

  const labels = {
    totalClasses: t('teacher.stats.totalClasses'),
    classesYouTeach: t('teacher.stats.classesYouTeach'),
    totalStudents: t('teacher.stats.totalStudents'),
    uniqueStudents: t('teacher.stats.uniqueStudents'),
    totalTasks: t('teacher.stats.totalTasks'),
    tasksGiven: t('teacher.stats.tasksGiven'),
    needGrading: t('teacher.stats.needGrading'),
    awaitingGrade: t('teacher.stats.awaitingGrade'),
  };

  const cards = getCards(stats, labels);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="rounded-2xl bg-white border border-slate-100 p-5 shadow-sm hover:shadow-md transition-all duration-200 hover:-translate-y-0.5"
          >
            <div className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${card.gradient} text-white shadow-sm`}>
              <Icon className="h-5 w-5" />
            </div>
            {!isMounted ? (
              <>
                <Skeleton className="h-7 w-12 mb-1" />
                <Skeleton className="h-3 w-20" />
              </>
            ) : (
              <>
                <p className="text-2xl font-bold text-slate-800 tabular-nums">
                  {card.value.toLocaleString('id-ID')}
                </p>
                <p className="text-xs text-slate-500 mt-0.5 font-medium">{card.label}</p>
                <p className="text-[11px] text-slate-300 mt-0.5">{card.sub}</p>
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}
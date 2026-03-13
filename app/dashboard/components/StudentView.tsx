'use client'

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState, useCallback } from "react";
import type { UserProfile } from "@/lib/types";
import Link from "next/link";
import { BookOpen, Calendar, Target, TrendingUp, Clock, Award, ArrowRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/lib/LanguageContext";

type StudentStats = {
  total_kehadiran: number;
  persentase_tugas: number;
  total_kelas: number;
  rata_rata_nilai: number;
};

type RecentActivity = {
  id: number;
  created_at: string;
  materials: {
    title: string;
    classes: { name: string } | null;
  } | null;
};

const statCards = (stats: StudentStats | null) => [
  {
    label: "Kehadiran",
    value: stats?.total_kehadiran ?? 0,
    unit: "sesi",
    sub: "Total hadir",
    icon: Calendar,
    gradient: "from-indigo-400 to-blue-500",
  },
  {
    label: "Tugas",
    value: `${(stats?.persentase_tugas ?? 0).toFixed(0)}%`,
    unit: "",
    sub: "Diselesaikan",
    icon: Target,
    gradient: "from-teal-400 to-emerald-500",
  },
  {
    label: "Kelas",
    value: stats?.total_kelas ?? 0,
    unit: "kelas",
    sub: "Terdaftar",
    icon: BookOpen,
    gradient: "from-violet-400 to-purple-500",
  },
  {
    label: "Rata-rata Nilai",
    value: (stats?.rata_rata_nilai ?? 0).toFixed(1),
    unit: "/100",
    sub: "Nilai Rata-rata",
    icon: Award,
    gradient: "from-amber-400 to-orange-500",
  },
];

export default function StudentView({ userProfile }: { userProfile: UserProfile }) {
  const [stats, setStats] = useState<StudentStats | null>(null);
  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [enrolledClasses, setEnrolledClasses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();
  const supabase = createClient();

  const fetchData = useCallback(async () => {
    setLoading(true);

    const { data: statsData } = await supabase.rpc('get_student_dashboard_stats');
    if (statsData) setStats(statsData);

    const { data: activityData } = await supabase
      .from('submissions')
      .select(`id, created_at, materials!inner ( title, classes!inner ( name ) )`)
      .eq('student_id', userProfile.id)
      .order('created_at', { ascending: false })
      .limit(5)
      .returns<RecentActivity[]>();
    if (activityData) setRecentActivities(activityData);

    const { data: enrolledClassesData } = await supabase
      .from('enrollments')
      .select(`classes ( id, name )`)
      .eq('student_id', userProfile.id);
    if (enrolledClassesData) setEnrolledClasses(enrolledClassesData);

    setLoading(false);
  }, [supabase, userProfile.id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const cards = statCards(stats);

  const classColors = [
    'from-indigo-400 to-blue-500',
    'from-teal-400 to-emerald-500',
    'from-violet-400 to-purple-500',
    'from-rose-400 to-pink-500',
    'from-amber-400 to-orange-500',
  ];

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-500 via-blue-500 to-teal-400 p-6 sm:p-8 text-white shadow-lg">
        <div className="relative z-10">
          <p className="text-indigo-100 text-sm font-medium mb-1">Dashboard Siswa</p>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {t('student.welcome')}, {userProfile.name || 'Siswa'}! 🎓
          </h1>
          <p className="text-indigo-200 mt-1 text-sm">{t('student.overview')}</p>
        </div>
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute right-12 bottom-0 h-20 w-20 rounded-full bg-white/5 pointer-events-none" />
      </div>

      {/* Stat Cards */}
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
              {loading ? (
                <>
                  <Skeleton className="h-7 w-16 mb-1" />
                  <Skeleton className="h-3 w-20" />
                </>
              ) : (
                <>
                  <p className="text-2xl font-bold text-slate-800 tabular-nums">
                    {card.value}
                    {card.unit && <span className="text-sm font-medium text-slate-400 ml-0.5">{card.unit}</span>}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">{card.sub}</p>
                </>
              )}
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Activities */}
        <div className="xl:col-span-2 rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-50">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-indigo-500" />
              <h2 className="text-sm font-semibold text-slate-700">{t('student.recentActivity')}</h2>
            </div>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                    <div className="flex-1 space-y-1.5">
                      <Skeleton className="h-4 w-48" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </div>
                ))}
              </div>
            ) : recentActivities.length > 0 ? (
              <div className="relative">
                {/* Timeline connector */}
                <div className="absolute left-4 top-4 bottom-0 w-px bg-slate-100" />
                <div className="space-y-5">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="flex items-start gap-4 relative">
                      <div className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 border-2 border-white shadow-sm">
                        <Clock className="h-3.5 w-3.5 text-indigo-500" />
                      </div>
                      <div className="flex-1 min-w-0 pt-0.5">
                        <p className="text-sm font-medium text-slate-700">
                          Tugas dikumpul:{' '}
                          <span className="text-indigo-600">{activity.materials?.title}</span>
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="inline-flex items-center rounded-md bg-indigo-50 px-2 py-0.5 text-[10px] font-semibold text-indigo-600">
                            {activity.materials?.classes?.name || 'N/A'}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            {new Date(activity.created_at).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 mb-4">
                  <Clock className="h-6 w-6 text-slate-400" />
                </div>
                <p className="text-sm font-medium text-slate-500">{t('student.noActivity')}</p>
                <p className="text-xs text-slate-400 mt-1">{t('student.startLearning')}</p>
              </div>
            )}
          </div>
        </div>

        {/* My Classes */}
        <div className="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-50">
            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-teal-500" />
              <h2 className="text-sm font-semibold text-slate-700">{t('student.myClasses')}</h2>
            </div>
            <Link
              href="/dashboard/kelas"
              className="flex items-center gap-1 text-xs text-indigo-500 hover:text-indigo-700 font-medium transition-colors"
            >
              Lihat semua <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
          <div className="p-4">
            {loading ? (
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-14 w-full rounded-xl" />)}
              </div>
            ) : enrolledClasses.length > 0 ? (
              <div className="space-y-2">
                {enrolledClasses.map((enrollment, index) => {
                  const classData = enrollment.classes;
                  if (!classData) return null;
                  const grad = classColors[index % classColors.length];
                  return (
                    <Link
                      key={`${classData.id}-${index}`}
                      href={`/dashboard/class/${classData.id}`}
                      className="group flex items-center gap-3 rounded-xl p-3 hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100"
                    >
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${grad} text-white text-sm font-bold shadow-sm`}>
                        {classData.name.charAt(0).toUpperCase()}
                      </div>
                      <span className="flex-1 text-sm font-medium text-slate-700 truncate group-hover:text-indigo-600 transition-colors">
                        {classData.name}
                      </span>
                      <ArrowRight className="h-3.5 w-3.5 text-slate-300 group-hover:text-indigo-400 transition-colors shrink-0" />
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 mb-4">
                  <BookOpen className="h-6 w-6 text-slate-400" />
                </div>
                <p className="text-sm font-medium text-slate-500">Belum ada kelas</p>
                <Link
                  href="/dashboard/kelas"
                  className="mt-3 inline-flex items-center gap-1 rounded-lg bg-indigo-600 px-4 py-2 text-xs font-semibold text-white hover:bg-indigo-700 transition-colors"
                >
                  Cari Kelas <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
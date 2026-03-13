'use client'

import { useLanguage } from "@/lib/LanguageContext";

interface TeacherHeaderClientProps {
  userName: string;
}

export default function TeacherHeaderClient({ userName }: TeacherHeaderClientProps) {
  const { t } = useLanguage();

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 p-6 sm:p-8 text-white shadow-lg">
      <div className="relative z-10">
        <p className="text-violet-200 text-sm font-medium mb-1">Dashboard Guru</p>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">{t('teacher.dashboard')}</h1>
        <p className="text-violet-200 mt-1 text-sm">
          {t('teacher.welcome')}, {userName}! {t('teacher.overview')}
        </p>
      </div>
      <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 pointer-events-none" />
      <div className="absolute right-10 bottom-0 h-20 w-20 rounded-full bg-white/5 pointer-events-none" />
    </div>
  );
}

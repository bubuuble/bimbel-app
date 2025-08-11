'use client'

import { useLanguage } from "@/lib/LanguageContext";

interface TeacherHeaderClientProps {
  userName: string;
}

export default function TeacherHeaderClient({ userName }: TeacherHeaderClientProps) {
  const { t } = useLanguage();

  return (
    <div>
      <h1 className="text-3xl font-bold tracking-tight">{t('teacher.dashboard')}</h1>
      <p className="text-muted-foreground">
        {t('teacher.welcome')}, {userName}! {t('teacher.overview')}
      </p>
    </div>
  );
}

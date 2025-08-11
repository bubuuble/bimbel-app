'use client'

import { useLanguage } from "@/lib/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";
import NotificationBell from "./NotificationBell";

interface DashboardHeaderProps {
  userRole: string;
  userName: string;
}

export default function DashboardHeader({ userRole, userName }: DashboardHeaderProps) {
  const { t } = useLanguage();

  const getRoleTitle = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return t('dashboard.admin');
      case 'GURU':
        return t('dashboard.teacher');
      case 'SISWA':
        return t('dashboard.student');
      default:
        return 'Dashboard';
    }
  };

  return (
    <header className="p-6 bg-white border-b border-gray-200 flex justify-between items-center">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">
          {getRoleTitle(userRole)}
        </h1>
        <p className="text-sm text-gray-600">{t('dashboard.welcome')}, {userName}</p>
      </div>
      <div className="flex items-center gap-4">
        <LanguageSwitcher />
        {userRole === 'SISWA' && <NotificationBell />}
      </div>
    </header>
  );
}

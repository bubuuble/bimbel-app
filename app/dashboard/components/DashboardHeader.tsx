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
    <header className="p-3 sm:p-4 lg:p-6 bg-white border-b border-gray-200 flex justify-between items-center">
      <div className="min-w-0 flex-1">
        <h1 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
          {getRoleTitle(userRole)}
        </h1>
        <p className="text-xs sm:text-sm text-gray-600 truncate">
          {t('dashboard.welcome')}, {userName}
        </p>
      </div>
      <div className="flex items-center gap-2 sm:gap-4 ml-4">
        <LanguageSwitcher />
        {userRole === 'SISWA' && <NotificationBell />}
      </div>
    </header>
  );
}

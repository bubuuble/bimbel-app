'use client'

import { useState, useEffect } from "react";
import { useLanguage } from "@/lib/LanguageContext";
import LanguageSwitcher from "./LanguageSwitcher";
import NotificationBell from "./NotificationBell";

interface DashboardHeaderProps {
  userRole: string;
  userName: string;
}

export default function DashboardHeader({ userRole, userName }: DashboardHeaderProps) {
  const { t } = useLanguage();

  const [timeData, setTimeData] = useState({ greeting: 'Selamat Datang', dateStr: '' });

  useEffect(() => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const hour = now.getHours();
    const greeting =
      hour < 11 ? 'Selamat Pagi' :
      hour < 15 ? 'Selamat Siang' :
      hour < 18 ? 'Selamat Sore' : 'Selamat Malam';
      
    setTimeData({ greeting, dateStr });
  }, []);

  const getRoleTitle = (role: string) => {
    switch (role) {
      case 'ADMIN': return t('dashboard.admin');
      case 'GURU': return t('dashboard.teacher');
      case 'SISWA': return t('dashboard.student');
      default: return 'Dashboard';
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-slate-100 bg-white/80 backdrop-blur-md px-4 sm:px-6 lg:px-8">
      {/* Left: greeting */}
      <div className="min-w-0 flex-1 pl-12 lg:pl-0">
        <h1 className="text-base font-semibold text-slate-800 truncate">
          {timeData.greeting}, <span className="text-indigo-600">{userName}</span> 👋
        </h1>
        <p className="text-xs text-slate-400 truncate hidden sm:block">{timeData.dateStr}</p>
      </div>

      {/* Right: actions */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <LanguageSwitcher />
        {userRole === 'SISWA' && <NotificationBell />}
      </div>
    </header>
  );
}

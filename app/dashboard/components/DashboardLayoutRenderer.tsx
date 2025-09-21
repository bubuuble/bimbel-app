// FILE: app/dashboard/components/DashboardLayoutRenderer.tsx

'use client'

import { usePathname } from 'next/navigation';
import type { UserProfile } from "@/lib/types";
import { LanguageProvider } from "@/lib/LanguageContext";
import DashboardLayoutClient from "./DashboardClient";
import DashboardHeader from "./DashboardHeader";

export default function DashboardLayoutRenderer({
  children,
  userProfile
}: {
  children: React.ReactNode;
  userProfile: UserProfile;
}) {
  const pathname = usePathname();

  // --- [PERBAIKAN UTAMA DI SINI] ---
  // Ganti `startsWith` menjadi `includes`.
  // Ini akan mendeteksi '/ujian/' di mana pun dalam URL.
  const isSpecialUjianPage = pathname.includes('/ujian/');

  // Jika URL mengandung '/ujian/', render layout minimalis tanpa dashboard.
  if (isSpecialUjianPage) {
    return (
      <LanguageProvider>
        {children}
      </LanguageProvider>
    );
  }

  // Jika tidak, render layout dashboard lengkap.
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-blue-50 p-2 sm:p-4 lg:p-6">
        <div className="max-w-7xl mx-auto bg-white rounded-lg sm:rounded-2xl lg:rounded-3xl shadow-xl overflow-hidden min-h-[calc(100vh-1rem)] sm:min-h-[calc(100vh-2rem)] lg:min-h-[calc(100vh-3rem)]">
          <div className="flex flex-col lg:flex-row h-full">
            <DashboardLayoutClient userProfile={userProfile} />
            <div className="flex-1 flex flex-col">
              <DashboardHeader userRole={userProfile.role} userName={userProfile.name || ''} />
              <main className="flex-1 p-3 sm:p-6 lg:p-8 overflow-y-auto bg-gradient-to-br from-gray-50 to-white">
                <div className="max-w-6xl mx-auto">
                  {children}
                </div>
              </main>
            </div>
          </div>
        </div>
      </div>
    </LanguageProvider>
  );
}
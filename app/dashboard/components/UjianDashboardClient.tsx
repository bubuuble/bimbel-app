'use client'

import { useState } from 'react';
import type { Test } from '@/lib/types';
import Link from 'next/link';
import { ClipboardList, Plus, Eye, Play, Timer, BookOpen } from 'lucide-react';
import CreateTestModal from './CreateTestModal';
import { Badge } from '@/components/ui/badge';

type TestWithClass = Test & {
  classes: { name: string } | null;
};

type TeacherClass = { id: string; name: string; };

interface Props {
  initialTests: TestWithClass[];
  userRole: 'GURU' | 'SISWA' | 'ADMIN';
  teacherClasses: TeacherClass[];
}

const testColors = [
  'from-amber-400 to-orange-500',
  'from-rose-400 to-pink-500',
  'from-indigo-400 to-blue-500',
  'from-teal-400 to-emerald-500',
  'from-violet-400 to-purple-500',
];

export default function UjianDashboardClient({ initialTests, userRole, teacherClasses }: Props) {
  const [tests] = useState(initialTests);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="space-y-6 sm:space-y-8">
        {/* Banner */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-400 p-6 sm:p-8 text-white shadow-lg">
          <div className="relative z-10 flex items-start justify-between">
            <div>
              <p className="text-amber-100 text-sm font-medium mb-1">
                {userRole === 'GURU' ? 'Guru' : 'Siswa'}
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-3">
                <ClipboardList className="h-7 w-7" /> Ujian Tryout
              </h1>
              <p className="text-amber-100 mt-1 text-sm">
                {userRole === 'GURU' ? 'Kelola semua ujian yang telah Anda buat.' : 'Daftar ujian yang tersedia untuk Anda.'}
              </p>
            </div>
            {userRole === 'GURU' && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="flex items-center gap-2 rounded-xl bg-white/20 border border-white/30 backdrop-blur-sm px-4 py-2 text-sm font-semibold text-white hover:bg-white/30 transition-colors shrink-0 mt-1"
              >
                <Plus className="h-4 w-4" /> Buat Ujian
              </button>
            )}
          </div>
          <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 pointer-events-none" />
        </div>

        {/* Test grid */}
        {tests.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-amber-100 mb-4">
              <ClipboardList className="h-6 w-6 text-amber-400" />
            </div>
            <p className="text-sm font-medium text-slate-500">Tidak ada ujian</p>
            <p className="text-xs text-slate-400 mt-1">
              {userRole === 'GURU' ? 'Buat ujian pertama Anda.' : 'Belum ada ujian yang tersedia.'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tests.map((test, i) => {
              const grad = testColors[i % testColors.length];
              return (
                <div key={test.id} className="group rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden hover:-translate-y-0.5">
                  <div className={`h-1.5 w-full bg-gradient-to-r ${grad}`} />
                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${grad} text-white shadow-sm`}>
                        <ClipboardList className="h-4 w-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-800 truncate">{test.title}</p>
                        <p className="text-xs text-slate-400 mt-0.5 truncate">
                          <BookOpen className="h-3 w-3 inline mr-1" />
                          {test.classes?.name || 'Kelas tidak diketahui'}
                        </p>
                      </div>
                    </div>
                    <div className="mb-4">
                      <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                        <Timer className="h-3 w-3" /> {test.duration_minutes} Menit
                      </span>
                    </div>
                    {userRole === 'GURU' ? (
                      <Link
                        href={`/dashboard/class/${test.class_id}/ujian/${test.id}/edit`}
                        className="flex items-center justify-center gap-1.5 w-full rounded-xl border border-amber-200 bg-amber-50 py-2 text-xs font-semibold text-amber-700 hover:bg-amber-100 transition-colors"
                      >
                        <Eye className="h-3.5 w-3.5" /> Kelola Soal
                      </Link>
                    ) : (
                      <Link
                        href={`/dashboard/class/${test.class_id}/ujian/${test.id}/start`}
                        className="flex items-center justify-center gap-1.5 w-full rounded-xl bg-amber-500 py-2 text-xs font-semibold text-white hover:bg-amber-600 transition-colors"
                      >
                        <Play className="h-3.5 w-3.5" /> Mulai Ujian
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <CreateTestModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        teacherClasses={teacherClasses}
      />
    </>
  );
}
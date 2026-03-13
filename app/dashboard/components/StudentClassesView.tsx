'use client'

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState, useCallback } from "react";
import type { UserProfile } from "@/lib/types";
import Link from "next/link";
import { BookOpen, ArrowRight, GraduationCap } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type EnrolledClass = {
  classes: {
    id: string;
    name: string;
    description: string | null;
    profiles: { name: string | null; } | null;
  } | null;
};

const classColors = [
  'from-indigo-400 to-blue-500',
  'from-teal-400 to-emerald-500',
  'from-violet-400 to-purple-500',
  'from-rose-400 to-pink-500',
  'from-amber-400 to-orange-500',
];

export default function StudentClassesView({ userProfile }: { userProfile: Pick<UserProfile, 'id'> }) {
  const [enrolledClasses, setEnrolledClasses] = useState<EnrolledClass[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchData = useCallback(async () => {
    setLoading(true);
    const { data: enrolledData, error } = await supabase
      .from('enrollments')
      .select(`classes!inner ( id, name, description, profiles:teacher_id ( name ) )`)
      .eq('student_id', userProfile.id)
      .order('name', { referencedTable: 'classes', ascending: true })
      .returns<EnrolledClass[]>();
    if (!error) setEnrolledClasses(enrolledData || []);
    setLoading(false);
  }, [supabase, userProfile.id]);

  useEffect(() => { fetchData(); }, [fetchData]);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-500 via-blue-500 to-teal-400 p-6 sm:p-8 text-white shadow-lg">
        <div className="relative z-10">
          <p className="text-indigo-100 text-sm font-medium mb-1">Siswa</p>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-3">
            <BookOpen className="h-7 w-7" /> Kelas Saya
          </h1>
          <p className="text-indigo-200 mt-1 text-sm">Semua kelas yang Anda ikuti.</p>
        </div>
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 pointer-events-none" />
      </div>

      {/* Class grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-indigo-500" />
            <h2 className="text-sm font-semibold text-slate-700">Kelas yang Anda Ikuti</h2>
          </div>
          {!loading && (
            <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-semibold text-indigo-600">
              {enrolledClasses.length} kelas
            </span>
          )}
        </div>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-40 w-full rounded-2xl" />)}
          </div>
        ) : enrolledClasses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {enrolledClasses.map(({ classes }, i) => classes && (
              <div key={classes.id} className="group rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden hover:-translate-y-0.5">
                <div className={`h-1.5 w-full bg-gradient-to-r ${classColors[i % classColors.length]}`} />
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${classColors[i % classColors.length]} text-white text-sm font-bold shadow-sm`}>
                      {classes.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{classes.name}</p>
                      <p className="text-xs text-slate-400 mt-0.5">Oleh: {classes.profiles?.name || 'N/A'}</p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                    {classes.description || 'Tidak ada deskripsi.'}
                  </p>
                  <Link
                    href={`/dashboard/class/${classes.id}`}
                    className="flex items-center justify-center gap-1.5 w-full rounded-xl bg-indigo-600 py-2 text-xs font-semibold text-white hover:bg-indigo-700 transition-colors"
                  >
                    Masuk Kelas <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 mb-4">
              <BookOpen className="h-6 w-6 text-indigo-400" />
            </div>
            <p className="text-sm font-medium text-slate-500">Belum Ada Kelas</p>
            <p className="text-xs text-slate-400 mt-1">Anda belum ditambahkan ke kelas manapun oleh guru.</p>
          </div>
        )}
      </div>
    </div>
  );
}
// FILE: app/dashboard/class/[classId]/ujian/[testId]/hasil/page.tsx

import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import TeacherTestResultsView from "@/app/dashboard/components/TeacherTestResultsView";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function TestResultsPageForTeacher({ 
  params 
}: { 
  params: { classId: string; testId: string } 
}) {
  const { classId, testId } = params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect('/login');

  // 1. Ambil info ujian & verifikasi kepemilikan guru
  const { data: testInfo, error: testError } = await supabase
    .from('tests')
    .select('id, title, teacher_id')
    .eq('id', testId)
    .single();

  if (testError || !testInfo || testInfo.teacher_id !== user.id) {
    return (
      <div className="p-4">
        <p className="text-destructive">Anda tidak berhak melihat hasil ini.</p>
      </div>
    );
  }

  // 2. Ambil semua pengerjaan ujian untuk tes ini, beserta profil siswa
  const { data: submissions } = await supabase
    .from('test_submissions')
    .select('*, tests(title), profiles(name, username)')
    .eq('test_id', testId)
    .order('total_score', { ascending: false, nullsFirst: false });

  // 3. Cek apakah ujian ini memiliki soal tipe ESAI
  const { count: essayCount } = await supabase
    .from('questions')
    .select('*', { count: 'exact', head: true })
    .eq('test_id', testId)
    .eq('type', 'ESSAY');

  const testInfoForView = {
    id: testId,
    title: testInfo.title,
    has_essays: (essayCount ?? 0) > 0
  };

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-6">
      <Link href={`/dashboard/class/${classId}`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Kembali ke Halaman Kelas
      </Link>
      <h1 className="text-3xl font-bold">Hasil Ujian: {testInfo.title}</h1>
      <TeacherTestResultsView
        submissions={submissions || []}
        testInfo={testInfoForView}
      />
    </div>
  );
}
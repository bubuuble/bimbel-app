// FILE: app/dashboard/class/[classId]/ujian/[testId]/start/page.tsx

import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import TestStartInterface from "@/app/dashboard/components/TestStartInterface";

export default async function TestStartPage({ 
  params 
}: { 
  params: { classId: string; testId: string } 
}) {
  const { classId, testId } = params; // Sekarang ini valid
  const supabase = await createClient();
  
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/login'); // Redirect ke halaman login yang benar

  // [PERBAIKAN 2] Ambil 'id' dan 'name' dari tabel classes
  const { data: testInfo } = await supabase
    .from('tests')
    .select(`
      *,
      classes(id, name) 
    `)
    .eq('id', testId)
    .single();
    
  if (!testInfo) notFound();

  // Check if student is enrolled in this class
  const { data: enrollment } = await supabase
    .from('enrollments')
    .select('id')
    .eq('class_id', classId)
    .eq('student_id', user.id)
    .maybeSingle(); // Menggunakan maybeSingle lebih aman di sini
    
  if (!enrollment) {
    return (
      <div className="container py-8">
        <div className="max-w-md mx-auto text-center space-y-4">
          <h1 className="text-2xl font-bold text-destructive">Akses Ditolak</h1>
          <p>Anda tidak terdaftar di kelas ini.</p>
        </div>
      </div>
    );
  }

  // Check if student has already started or completed this test
  const { data: existingSubmission } = await supabase
    .from('test_submissions')
    .select('*')
    .eq('test_id', testId)
    .eq('student_id', user.id)
    .maybeSingle();

  return (
    <TestStartInterface
      testInfo={testInfo}
      // [PERBAIKAN 3] Hapus prop 'classId' yang tidak lagi dibutuhkan
      existingSubmission={existingSubmission}
    />
  );
}
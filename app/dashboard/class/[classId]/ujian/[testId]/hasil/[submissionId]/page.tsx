// FILE: app/dashboard/class/[classId]/ujian/[testId]/hasil/[submissionId]/page.tsx

import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import TeacherSubmissionReview from "@/app/dashboard/components/TeacherSubmissionReview";
import TestResultInterface from "@/app/dashboard/components/TestResultInterface";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function SubmissionReviewPage({ 
  params 
}: { 
  params: { classId: string; testId: string; submissionId: string } 
}) {
  const { classId, testId, submissionId } = params;
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect('/login');

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();

  // [PERBAIKAN 1] Ambil juga 'class_id' dari submission
  const { data: submission, error } = await supabase
    .from('test_submissions')
    .select('*, class_id, student_id, tests(title, teacher_id), profiles(name, username)')
    .eq('id', submissionId)
    .single();
    
  if (error || !submission) {
    notFound();
  }

  const isTeacherOwner = profile?.role === 'GURU' && submission.tests?.teacher_id === user.id;
  const isStudentOwner = profile?.role === 'SISWA' && submission.student_id === user.id;

  if (!isTeacherOwner && !isStudentOwner) {
    return (
        <div className="container mx-auto p-8 text-center">
            <h1 className="text-2xl font-bold text-destructive">Akses Ditolak</h1>
            <p className="text-muted-foreground">Anda tidak berhak melihat hasil ini.</p>
        </div>
    );
  }

  const { data: questions } = await supabase
    .from('questions')
    .select('*, multiple_choice_options(*), true_false_statements(*), matching_prompts(*), matching_options(*), matching_correct_pairs(*), essay_answer:essay_answers(*)')
    .eq('test_id', testId)
    .order('sort_order', { ascending: true });

  const { data: studentAnswers } = await supabase
    .from('student_answers')
    .select('*')
    .eq('submission_id', submissionId);


  // 4. Render komponen yang sesuai berdasarkan peran
  if (isTeacherOwner) {
    return (
      <div className="container mx-auto p-4 md:p-8 space-y-6">
          <Link 
              href={`/dashboard/class/${classId}/ujian/${testId}/hasil`}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Daftar Hasil
          </Link>
          <TeacherSubmissionReview
              submission={submission}
              questions={questions || []}
              studentAnswers={studentAnswers || []}
          />
      </div>
    );
  }

  if (isStudentOwner) {
    return (
        // [PERBAIKAN 2] Kirim `classId` yang didapat dari submission ke komponen client
        <TestResultInterface
            submission={submission}
            questions={questions || []}
            studentAnswers={studentAnswers || []}
            classId={submission.class_id} 
        />
    );
  }

  notFound();
}
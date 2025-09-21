// FILE: app/dashboard/class/[classId]/ujian/[testId]/hasil/grade-essays/page.tsx

import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import EssayGradingInterface from "@/app/dashboard/components/EssayGradingInterface";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

// [PERBAIKAN 1] Ubah cara menerima props untuk meng-await params
export default async function GradeAllEssaysPage(props: { params: Promise<{ classId: string; testId: string; }> }) {
  const { classId, testId } = await props.params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect('/login');

  const { data: testInfo } = await supabase.from('tests').select('title, points_per_question').eq('id', testId).single();

  // [PERBAIKAN 2] Hapus `points_per_question` dari select() karena tidak ada di tabel `questions`
  const { data: baseEssayQuestions, error: questionsError } = await supabase
    .from('questions')
    .select('id, question_text') // Hanya ambil data yang pasti ada
    .eq('test_id', testId)
    .eq('type', 'ESSAY');

  if (questionsError) {
    console.error("Error Query Soal:", questionsError.message);
    // Tampilkan pesan error yang lebih informatif jika query gagal
    return <div>Gagal memuat soal esai: {questionsError.message}</div>;
  }
  
  if (!baseEssayQuestions || baseEssayQuestions.length === 0) {
    return (
        <div className="container mx-auto p-8 text-center">
            <h1 className="text-2xl font-bold">Tidak Ada Soal Esai</h1>
            <p className="text-muted-foreground">Ujian ini tidak memiliki soal tipe esai untuk dinilai.</p>
            <Button asChild variant="outline" className="mt-4">
                <Link href={`/dashboard/class/${classId}/ujian/${testId}/hasil`}>
                    Kembali ke Hasil
                </Link>
            </Button>
        </div>
    )
  }

  const essayQuestionIds = baseEssayQuestions.map(q => q.id);

  // Gabungkan info poin dari testInfo ke setiap soal
  const essayQuestionsWithPoints = baseEssayQuestions.map(q => ({
    ...q,
    points_per_question: testInfo?.points_per_question // Ambil dari info ujian
  }));

  // Ambil kunci jawaban secara TERPISAH
  const { data: answerKeys } = await supabase
    .from('essay_answers')
    .select('question_id, answer_key')
    .in('question_id', essayQuestionIds);
  
  const answerKeyMap = new Map(answerKeys?.map(ak => [ak.question_id, ak.answer_key]));

  // Gabungkan soal dengan kunci jawabannya
  const essayQuestions = essayQuestionsWithPoints.map(question => ({
    ...question,
    essay_answers: [{ answer_key: answerKeyMap.get(question.id) }]
  }));

  // 4. Ambil semua submission yang terkait dengan ujian ini, LENGKAP dengan profil siswa
  const { data: submissions } = await supabase.from('test_submissions').select('id, profiles(name, username)').eq('test_id', testId);
  const submissionIds = submissions?.map(s => s.id) || [];
  
  let studentAnswers = [];
  if (submissionIds.length > 0) {
      const { data } = await supabase
        .from('student_answers')
        .select('*, test_submissions!inner(id, test_id, profiles(name, username))')
        .in('submission_id', submissionIds)
        .in('question_id', essayQuestionIds);
      studentAnswers = data || [];
  }

  
  if (!submissions || submissions.length === 0) {
    console.log("   -> Tidak ada siswa yang submit, menampilkan UI tanpa jawaban.");
    // Jika tidak ada siswa yang submit, tetap tampilkan soalnya tapi tanpa jawaban
     return (
        <div className="container mx-auto p-4 md:p-8 space-y-6">
          <Link href={`/dashboard/class/${classId}/ujian/${testId}/hasil`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" /> Kembali ke Daftar Hasil
          </Link>
          <div className="text-center">
            <h1 className="text-3xl font-bold">Penilaian Esai</h1>
            <p className="text-lg text-muted-foreground">{testInfo?.title}</p>
          </div>
          <EssayGradingInterface 
            essayQuestions={essayQuestions}
            studentAnswers={[]}
          />
        </div>
      );
  }

  // 5. Ambil semua jawaban esai dari semua submission tersebut
  const submissionProfileMap = new Map(submissions.map(s => [s.id, s.profiles]));

  const { data: answersData, error: answersError } = await supabase
    .from('student_answers')
    .select('*')
    .in('submission_id', submissionIds)
    .in('question_id', essayQuestionIds);

  // --- START: DEBUGGING LOGS ---
  console.log("4. Hasil Query Jawaban Siswa (answersData):", JSON.stringify(answersData, null, 2));
  if (answersError) console.error("   - Error Query Jawaban Siswa:", answersError.message);
  // --- END: DEBUGGING LOGS ---

  // 6. Gabungkan data profil ke setiap jawaban secara manual di server
  const studentAnswersWithProfiles = (answersData || []).map(answer => ({
    ...answer,
    test_submissions: { profiles: submissionProfileMap.get(answer.submission_id) }
  }));

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-6">
      <Link href={`/dashboard/class/${classId}/ujian/${testId}/hasil`} className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Kembali ke Daftar Hasil
      </Link>
      <div className="text-center">
        <h1 className="text-3xl font-bold">Penilaian Esai</h1>
        <p className="text-lg text-muted-foreground">{testInfo?.title}</p>
      </div>
      <EssayGradingInterface 
        essayQuestions={essayQuestions}
        studentAnswers={studentAnswers}
      />
    </div>
  );
}
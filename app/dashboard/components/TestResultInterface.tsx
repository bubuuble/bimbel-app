// FILE: app/dashboard/components/TestResultInterface.tsx
'use client'

import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, ArrowRight, Minus, FileText } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import dynamic from 'next/dynamic';

// Gunakan dynamic import untuk renderer HTML agar aman
const SafeHTMLRenderer = dynamic(() => import('./SafeHTMLRenderer'), { 
    ssr: false,
    loading: () => <div className="animate-pulse bg-gray-200 h-4 w-1/2 rounded-md"></div>
});

type Props = {
  submission: any;
  questions: any[];
  studentAnswers: any[];
  classId: string;
};

export default function TestResultInterface({ submission, questions, studentAnswers, classId }: Props) {
  const studentAnswerMap = new Map(studentAnswers.map(a => [a.question_id, a]));

  const renderAnswerContent = (question: any) => {
    const studentAns = studentAnswerMap.get(question.id);

    if (!studentAns) {
        return (
            <div className="p-3 border rounded-md bg-gray-50 text-muted-foreground text-sm flex items-center gap-2 italic">
                <Minus className="h-4 w-4" />
                <span>-- Anda tidak menjawab soal ini.</span>
            </div>
        );
    }
    
    // Logika lengkap untuk merender semua tipe soal
    switch (question.type) {
        case 'MULTIPLE_CHOICE':
            const correctOptions = question.multiple_choice_options.filter((opt: any) => opt.is_correct).map((opt: any) => opt.id);
            const studentChoices = Array.isArray(studentAns.answer_data) ? studentAns.answer_data : [studentAns.answer_data];

            return (
                <div className="space-y-2">
                    {question.multiple_choice_options.map((option: any) => {
                        const isStudentChoice = studentChoices.includes(option.id);
                        const isCorrectChoice = correctOptions.includes(option.id);
                        return (
                            <div key={option.id} className={cn(
                                "flex items-start gap-3 p-3 border rounded-md text-sm",
                                isCorrectChoice && "bg-green-100 border-green-300 text-green-800 font-semibold",
                                isStudentChoice && !isCorrectChoice && "bg-red-100 border-red-300 text-red-800 line-through"
                            )}>
                                {isCorrectChoice ? <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0"/> : (isStudentChoice ? <XCircle className="h-5 w-5 text-red-600 flex-shrink-0"/> : <div className="w-5 h-5 flex-shrink-0"/>)}
                                <SafeHTMLRenderer html={option.option_text} className="prose-sm" />
                            </div>
                        );
                    })}
                </div>
            );

      case 'TRUE_FALSE':
        return (
            <div className="space-y-3">
                {question.true_false_statements.map((statement: any, index: number) => {
                    const studentChoice = studentAns.answer_data?.[statement.id];
                    const correctChoice = statement.is_true;
                    const studentChoiceBool = studentChoice === 'true';
                    const isCorrect = studentChoiceBool === correctChoice;

                    return (
                        <div key={statement.id} className="p-3 border rounded-md space-y-2">
                            <div className="flex items-start gap-2">
                                <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded mt-1">{index + 1}</span>
                                <SafeHTMLRenderer html={statement.statement_text} className="prose-sm font-semibold" />
                            </div>
                            <div className={cn("p-2 rounded-md text-sm ml-8", isCorrect ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800")}>
                                Jawaban Anda: <span className="font-bold">{studentChoice ? (studentChoiceBool ? 'BENAR' : 'SALAH') : 'Tidak Dijawab'}</span>
                            </div>
                            {!isCorrect && 
                                <div className="p-2 rounded-md text-sm ml-8 bg-green-100 text-green-800">
                                    Kunci Jawaban: <span className="font-bold">{correctChoice ? 'BENAR' : 'SALAH'}</span>
                                </div>
                            }
                        </div>
                    );
                })}
            </div>
        );

      case 'MATCHING':
        // Buat Map untuk mencari kunci jawaban dengan cepat
        const correctPairsMap = new Map(question.matching_correct_pairs.map((p: any) => [p.prompt_id, p.option_id]));
        
        return (
            <div className="space-y-3">
                {question.matching_prompts.map((prompt: any, index: number) => {
                    // Ambil data yang relevan
                    const studentChoiceOptionId = studentAns.answer_data?.[prompt.id];
                    const correctChoiceOptionId = correctPairsMap.get(prompt.id);
                    const isCorrect = studentChoiceOptionId === correctChoiceOptionId;

                    // Cari teks dari pilihan siswa dan pilihan yang benar
                    const studentChoiceOption = question.matching_options.find((o: any) => o.id === studentChoiceOptionId);
                    const correctChoiceOption = question.matching_options.find((o: any) => o.id === correctChoiceOptionId);

                    return(
                        <div key={prompt.id} className="p-3 border rounded-md space-y-2">
                           {/* Tampilkan Prompt (Pertanyaan) */}
                           <div className="flex items-start gap-2">
                                <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded mt-1">{index + 1}</span>
                                <SafeHTMLRenderer html={prompt.prompt_text} className="prose-sm font-semibold"/>
                           </div>

                           {/* Tampilkan Jawaban Siswa (dengan highlight yang benar) */}
                           <div className={cn(
                               "p-2 rounded-md text-sm ml-8", 
                               isCorrect ? "bg-green-100 text-green-800" : "bg-green-100 text-green-800"
                            )}>
                             Jawaban Anda: 
                             <div className="font-bold inline-block ml-1">
                                <SafeHTMLRenderer html={studentChoiceOption?.option_text || 'Tidak Dijawab'} />
                             </div>
                           </div>

                           {/* Tampilkan Kunci Jawaban (hanya jika salah) */}
                           {!isCorrect && 
                                <div className="p-2 rounded-md text-sm ml-8 bg-green-100 text-green-800">
                                    Kunci Jawaban: 
                                    <div className="font-bold inline-block ml-1">
                                       <SafeHTMLRenderer html={correctChoiceOption?.option_text || '-'} />
                                    </div>
                                </div>
                           }
                        </div>
                    )
                })}
            </div>
        );

      case 'ESSAY':
        return (
          <div className="space-y-3">
            <div className="p-3 border rounded-md bg-gray-50">
                <p className="text-xs font-semibold text-muted-foreground mb-1">Jawaban Anda:</p>
                <p className="whitespace-pre-wrap text-sm">{studentAns.answer_data}</p>
            </div>
            {/* This div will now correctly display the answer key */}
            <div className="p-3 border rounded-md bg-green-50">
                <p className="text-xs font-semibold text-green-800 mb-1">Kunci Jawaban (Referensi):</p>
                <SafeHTMLRenderer html={question.essay_answer?.[0]?.answer_key} className="prose-sm" />
            </div>
          </div>
        );
      
      default:
        return (
            <div className="p-3 border rounded-md bg-gray-50 text-muted-foreground text-sm flex items-center gap-2 italic">
                <Minus className="h-4 w-4" />
                <span>-- Pembahasan untuk tipe soal ini belum tersedia.</span>
            </div>
        );
    }
  }

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="max-w-4xl mx-auto space-y-6 sm:space-y-8">
        {/* --- Card Skor Utama (Desain Baru) --- */}
        <div className="rounded-2xl overflow-hidden bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 text-white shadow-lg relative">
          <div className="absolute inset-0 bg-white/10 mix-blend-overlay"></div>
          <div className="relative z-10 p-8 sm:p-12 flex flex-col items-center justify-center text-center space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white backdrop-blur-md mb-2">
              <FileText className="w-4 h-4" />
              <span className="text-sm font-medium tracking-wide">Hasil Ujian</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight mb-4">{submission.tests.title}</h1>
            <div className="bg-white/10 p-6 sm:p-8 rounded-3xl backdrop-blur-md border border-white/20 w-full max-w-sm mt-4">
              <p className="text-base sm:text-lg font-medium text-white/80 uppercase tracking-widest mb-2">Skor Akhir Anda</p>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-7xl sm:text-8xl font-black tracking-tighter">{submission.total_score ?? 0}</span>
                <span className="text-xl sm:text-2xl font-bold text-white/60">/100</span>
              </div>
            </div>
          </div>
        </div>

        {/* --- Pembahasan Soal --- */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
             <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                 <CheckCircle className="h-5 w-5" />
             </div>
             <h2 className="text-2xl font-bold text-slate-800">Pembahasan Soal</h2>
          </div>
          
          <div className="grid gap-6">
            {questions.map((q, index) => {
              const studentAns = studentAnswerMap.get(q.id);
              
              // --- [MAIN FIX HERE for the status BADGE] ---
              const getStatusBadge = () => {
                if (!studentAns) {
                    return <Badge variant="secondary" className="rounded-lg h-7 px-3 bg-slate-100 text-slate-600 border-none">Tidak Dijawab</Badge>;
                }
                if (q.type === 'ESSAY') {
                    // For essays, show "Dinilai" and the score awarded
                    return (
                        <Badge className="rounded-lg h-7 px-3 bg-indigo-100 text-indigo-700 border-none font-semibold">
                           Dinilai: {studentAns.score_awarded ?? 0} poin
                        </Badge>
                    );
                }
                // For other types, use the is_correct flag
                if (studentAns.is_correct === true) {
                    return <Badge className="rounded-lg h-7 px-3 bg-teal-100 text-teal-700 border-none font-semibold">Benar</Badge>;
                }
                return <Badge variant="destructive" className="rounded-lg h-7 px-3 bg-rose-100 text-rose-700 border-none font-semibold">Salah</Badge>;
              };

              return (
                <div key={q.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                  <div className="p-5 sm:p-6 border-b border-slate-50 bg-slate-50/50 flex flex-wrap justify-between items-center gap-4">
                    <p className="font-bold text-lg text-slate-800">Soal #{index + 1}</p>
                    {getStatusBadge()}
                  </div>
                  <div className="p-5 sm:p-6 space-y-6">
                    <div className="prose prose-slate max-w-none text-slate-800 leading-relaxed text-base">
                        <SafeHTMLRenderer html={q.question_text} />
                    </div>
                    {renderAnswerContent(q)}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        
        {/* Tombol Kembali (Desain Baru) */}
        <div className="text-center pt-4 pb-12">
            <Button asChild size="lg" className="h-14 rounded-full bg-slate-900 hover:bg-black text-white px-8 font-semibold shadow-md hover:shadow-lg transition-all">
                <Link href={`/dashboard/class/${classId}`}>
                    Kembali ke Kelas <ArrowRight className="h-5 w-5 ml-2" />
                </Link>
            </Button>
        </div>
      </div>
    </div>
  );
}
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
    <div className="min-h-screen bg-gray-100 p-4 sm:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* --- Card Skor Utama (Desain Baru) --- */}
        <Card className="shadow-lg overflow-hidden border-0 bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
          <CardHeader className="text-center p-6">
            <p className="text-sm font-medium text-blue-200">Hasil Ujian</p>
            <CardTitle className="text-3xl sm:text-4xl font-bold">{submission.tests.title}</CardTitle>
          </CardHeader>
          <CardContent className="text-center p-6">
            <CardDescription className="text-base text-blue-100">Skor Akhir Anda</CardDescription>
            <p className="text-6xl sm:text-7xl font-bold tracking-tighter">{submission.total_score ?? 0}</p>
            <p className="text-blue-200">dari 100 poin</p>
          </CardContent>
        </Card>

        {/* --- Pembahasan Soal --- */}
        <div>
          <h2 className="text-2xl font-bold mb-4">Pembahasan Soal</h2>
          <div className="space-y-4">
            {questions.map((q, index) => {
              const studentAns = studentAnswerMap.get(q.id);
              
              // --- [MAIN FIX HERE for the status BADGE] ---
              const getStatusBadge = () => {
                if (!studentAns) {
                    return <Badge variant="secondary">Tidak Dijawab</Badge>;
                }
                if (q.type === 'ESSAY') {
                    // For essays, show "Dinilai" and the score awarded
                    return (
                        <Badge className="bg-blue-100 text-blue-800 border border-blue-200">
                           Dinilai: {studentAns.score_awarded ?? 0} poin
                        </Badge>
                    );
                }
                // For other types, use the is_correct flag
                if (studentAns.is_correct === true) {
                    return <Badge className="bg-green-100 text-green-800 border border-green-200">Benar</Badge>;
                }
                return <Badge variant="destructive">Salah</Badge>;
              };

              return (
                <Card key={q.id} className="shadow-sm bg-white">
                  <CardHeader>
                    <div className="flex justify-between items-center">
                      <p className="font-semibold text-lg text-gray-800">Soal #{index + 1}</p>
                      {getStatusBadge()}
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="p-4 bg-gray-50 rounded-md border text-gray-700">
                        <SafeHTMLRenderer html={q.question_text} className="prose prose-sm max-w-none"/>
                    </div>
                    {renderAnswerContent(q)}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
        
        {/* Tombol Kembali (Desain Baru) */}
        <div className="text-center py-4">
            <Button asChild size="lg" className="bg-gray-800 hover:bg-black text-white rounded-full px-8">
                <Link href={`/dashboard/class/${classId}`}>
                    <ArrowRight className="h-4 w-4 mr-2" />
                    Kembali ke Kelas
                </Link>
            </Button>
        </div>
      </div>
    </div>
  );
}
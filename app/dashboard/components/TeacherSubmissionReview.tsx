// FILE: app/dashboard/components/TeacherSubmissionReview.tsx
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, X, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import dynamic from 'next/dynamic';
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Gunakan dynamic import untuk renderer HTML agar aman
const SafeHTMLRenderer = dynamic(() => import('./SafeHTMLRenderer'), { 
    ssr: false,
    loading: () => <div className="animate-pulse bg-gray-200 h-4 w-1/2 rounded-md"></div>
});

type Props = {
  submission: any;
  questions: any[];
  studentAnswers: any[];
};

export default function TeacherSubmissionReview({ submission, questions, studentAnswers }: Props) {  const studentAnswerMap = new Map(studentAnswers.map(a => [a.question_id, a]));

  const renderAnswerDetails = (question: any) => {
    const studentAns = studentAnswerMap.get(question.id);

    if (!studentAns) {
        return (
            <div className="p-3 border rounded-md bg-gray-50 text-muted-foreground text-sm flex items-center gap-2">
                <Minus className="h-4 w-4" />
                <span>Siswa tidak menjawab soal ini.</span>
            </div>
        )
    }

    switch (question.type) {
      case 'MULTIPLE_CHOICE':
        return question.multiple_choice_options.map((option: any) => {
          const isStudentChoice = studentAns.answer_data === option.id;
          const isCorrectChoice = option.is_correct;
          return (
            <div key={option.id} className={cn(
                "flex items-start gap-3 p-3 border rounded-md text-sm",
                isCorrectChoice && "bg-green-50 border-green-200 text-green-900 font-medium",
                isStudentChoice && !isCorrectChoice && "bg-red-50 border-red-200 text-red-900"
            )}>
              {isStudentChoice ? 
                (isCorrectChoice ? <Check className="h-5 w-5 text-green-600 flex-shrink-0"/> : <X className="h-5 w-5 text-red-600 flex-shrink-0"/>) 
                : (isCorrectChoice ? <Check className="h-5 w-5 text-green-600 flex-shrink-0"/> : <div className="w-5 h-5 flex-shrink-0"/>)
              }
              <SafeHTMLRenderer html={option.option_text} className="prose-sm max-w-none" />
            </div>
          )
        });
      
      case 'ESSAY':
        return (
          <div className="space-y-3">
            <div className="p-3 border rounded-md bg-gray-50">
                <p className="text-xs font-semibold text-muted-foreground mb-1">Jawaban Siswa:</p>
                <p className="whitespace-pre-wrap">{studentAns.answer_data}</p>
            </div>
            <div className="p-3 border rounded-md bg-green-50">
                <p className="text-xs font-semibold text-green-800 mb-1">Kunci Jawaban:</p>
                <SafeHTMLRenderer html={question.essay_answer?.[0]?.answer_key} className="prose-sm" />
            </div>
          </div>
        );

      case 'TRUE_FALSE':
         return question.true_false_statements.map((statement: any) => {
            const studentChoice = studentAns.answer_data?.[statement.id];
            const correctChoice = statement.is_true;
            const studentChoiceBool = studentChoice === 'true';
            
            return (
                <div key={statement.id} className="space-y-2 p-3 border rounded-md">
                    <SafeHTMLRenderer html={statement.statement_text} className="prose-sm" />
                    <div className="flex items-center gap-4 text-sm">
                        <p>Jawaban Siswa: <span className={cn("font-bold", studentChoiceBool === correctChoice ? "text-green-700" : "text-red-700")}>{studentChoice ? (studentChoiceBool ? 'Benar' : 'Salah') : 'Tidak Dijawab'}</span></p>
                        <p className="text-green-700">Kunci: <span className="font-bold">{correctChoice ? 'Benar' : 'Salah'}</span></p>
                    </div>
                </div>
            )
         });

      case 'MATCHING':
        const correctPairsMap = new Map(question.matching_correct_pairs.map((p: any) => [p.prompt_id, p.option_id]));
        
        return (
            <div className="space-y-3">
                {question.matching_prompts.map((prompt: any) => {
                    const studentChoiceOptionId = studentAns.answer_data?.[prompt.id];
                    const correctChoiceOptionId = correctPairsMap.get(prompt.id);
                    // --- [PERBAIKAN UTAMA DI SINI] ---
                    const isCorrect = studentChoiceOptionId === correctChoiceOptionId;

                    const studentChoiceOption = question.matching_options.find((o: any) => o.id === studentChoiceOptionId);
                    const correctChoiceOption = question.matching_options.find((o: any) => o.id === correctChoiceOptionId);

                    return(
                        // Gunakan `isCorrect` untuk menentukan warna background
                        <div key={prompt.id} className={cn("p-3 border rounded-md space-y-2", isCorrect ? "bg-green-50" : "bg-red-50")}>
                            <SafeHTMLRenderer html={prompt.prompt_text} className="prose-sm font-semibold"/>
                            <p className="text-sm">Jawaban Anda: <span className="font-medium">{studentChoiceOption?.option_text || 'Tidak Dijawab'}</span></p>
                            {/* Hanya tampilkan kunci jawaban jika jawaban siswa salah */}
                            {!isCorrect && (
                                <p className="text-sm font-medium text-green-800">
                                    Kunci Jawaban: {correctChoiceOption?.option_text || '-'}
                                </p>
                            )}
                        </div>
                    )
                })}
            </div>
        );

      default:
        return <p className="text-sm text-muted-foreground">Tampilan untuk tipe soal ini belum tersedia.</p>;
    }
  }

  return (
        <div className="space-y-6">
            <Card>
                <CardHeader className="flex flex-row justify-between items-center">
                    <div>
                        <CardTitle>Detail Jawaban: {submission.profiles.name}</CardTitle>
                        <CardDescription>Ujian: {submission.tests.title} | Skor: <span className="font-bold text-blue-600 text-lg">{submission.total_score}</span></CardDescription>
                    </div>
                </CardHeader>
            </Card>
        
        {questions.map((q, index) => {
            const studentAns = studentAnswerMap.get(q.id);
            return (
                <Card key={q.id}>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle className="text-lg">Soal #{index + 1}</CardTitle>
                            {studentAns?.is_correct === true && <Badge className="bg-green-600 hover:bg-green-600 text-white">Benar</Badge>}
                            {studentAns?.is_correct === false && <Badge variant="destructive">Salah</Badge>}
                            {!studentAns && <Badge variant="secondary">Tidak Dijawab</Badge>}
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <SafeHTMLRenderer html={q.question_text} className="p-4 bg-gray-50 rounded-md border prose prose-sm max-w-none"/>
                        <div className="space-y-2">
                           <p className="text-sm font-semibold text-gray-600">Jawaban:</p>
                           {renderAnswerDetails(q)}
                        </div>
                    </CardContent>
                </Card>
            )
        })}
    </div>
  );
}
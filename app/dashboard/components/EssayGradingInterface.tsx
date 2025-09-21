// FILE: app/dashboard/components/EssayGradingInterface.tsx
'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { gradeEssayAnswer } from "@/lib/actions";
import { useFormStatus } from "react-dom";
import { useEffect, useActionState, useState } from "react";
import { toast } from "sonner";
import { Loader2, ChevronDown, Check } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import dynamic from 'next/dynamic';

const SafeHTMLRenderer = dynamic(() => import('./SafeHTMLRenderer'), { ssr: false });

function SubmitButton() {
    const { pending } = useFormStatus();
    return <Button type="submit" size="sm" disabled={pending}>{pending ? <Loader2 className="h-4 w-4 animate-spin"/> : 'Simpan Nilai'}</Button>;
}

function GradeForm({ answer }: { answer: any }) {
    const [state, formAction] = useActionState(gradeEssayAnswer, null);
    // --- [PERBAIKAN UTAMA DI SINI] ---
    // 1. Buat state lokal untuk nilai skor
    const [score, setScore] = useState(answer.score_awarded ?? '');

    useEffect(() => {
        // 2. Sinkronkan state jika prop dari server berubah
        setScore(answer.score_awarded ?? '');
    }, [answer.score_awarded]);

    useEffect(() => {
        if (state?.success) {
            toast.success(`Nilai untuk ${answer.test_submissions.profiles.name} berhasil disimpan!`);
            // Tidak perlu refresh manual, revalidatePath dari server action akan menangani
        }
        if (state?.error) toast.error("Gagal", { description: state.error });
    }, [state, answer.test_submissions.profiles.name]);

    return (
        <form action={formAction} className="space-y-3">
            <div className="whitespace-pre-wrap p-3 rounded text-sm bg-white border">
                {answer.answer_data}
            </div>
            <div className="flex items-end gap-4 pt-3 border-t">
                <div className="flex-grow space-y-1">
                    <Label htmlFor={`score-${answer.id}`} className="text-xs">
                        Beri Skor (Maks: {Math.round(answer.question.points_per_question ?? 20)})
                    </Label>
                    <Input 
                        id={`score-${answer.id}`}
                        name="score"
                        type="number"
                        placeholder="Skor"
                        min="0"
                        max={Math.round(answer.question.points_per_question ?? 20)}
                        // 3. Gunakan `value` dan `onChange` untuk controlled component
                        value={score}
                        onChange={(e) => setScore(e.target.value)}
                        required
                    />
                    <input type="hidden" name="answerId" value={answer.id} />
                    <input type="hidden" name="submissionId" value={answer.submission_id} />
                </div>
                <SubmitButton />
            </div>
        </form>
    );
}

function QuestionGradingCard({ question, answers }: { question: any, answers: any[] }) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-lg">Soal: <SafeHTMLRenderer html={question.question_text} className="inline font-normal" /></CardTitle>
                <CardDescription className="pt-2">
                    <strong>Kunci Jawaban:</strong> <SafeHTMLRenderer html={question.essay_answers[0]?.answer_key} className="inline" />
                </CardDescription>
            </CardHeader>
            <CardContent>
                <h4 className="font-semibold text-muted-foreground mb-4">Jawaban Siswa:</h4>
                <div className="space-y-4">
                    {answers.length > 0 ? (
                        answers.map(answer => (
                            <Collapsible key={answer.id} defaultOpen>
                                <CollapsibleTrigger asChild>
                                    <div className="flex justify-between items-center p-3 border rounded-lg bg-gray-50 hover:bg-gray-100 cursor-pointer transition-colors w-full">
                                        <p className="font-bold text-sm">
                                            {answer.test_submissions.profiles.name} 
                                            <span className="text-muted-foreground font-normal ml-1">(@{answer.test_submissions.profiles.username})</span>
                                        </p>
                                        <div className="flex items-center gap-2">
                                            {answer.score_awarded !== null && (
                                                <div className="flex items-center gap-1 text-xs text-green-600 font-semibold">
                                                    <Check className="h-3 w-3" /> Dinilai: {answer.score_awarded}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CollapsibleTrigger>
                                <CollapsibleContent className="p-4 border border-t-0 rounded-b-lg">
                                    <GradeForm answer={{ ...answer, question: question }} />
                                </CollapsibleContent>
                            </Collapsible>
                        ))
                    ) : (
                        <p className="text-muted-foreground text-sm italic">Belum ada siswa yang menjawab soal ini.</p>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

export default function EssayGradingInterface({ essayQuestions, studentAnswers }: { essayQuestions: any[], studentAnswers: any[] }) {
    const answersByQuestion = studentAnswers.reduce((acc, answer) => {
        const qId = answer.question_id;
        if (!acc[qId]) acc[qId] = [];
        acc[qId].push(answer);
        return acc;
    }, {} as { [key: string]: any[] });

    return (
        <div className="space-y-8">
            {essayQuestions.map(question => (
                <QuestionGradingCard 
                    key={question.id}
                    question={question}
                    answers={answersByQuestion[question.id] || []}
                />
            ))}
        </div>
    );
}
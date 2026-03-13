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
    return <Button type="submit" size="sm" disabled={pending} className="h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all shadow-sm px-6 w-full sm:w-auto">{pending ? <Loader2 className="h-4 w-4 animate-spin"/> : 'Simpan Nilai'}</Button>;
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
        <form action={formAction} className="space-y-4">
            <div className="whitespace-pre-wrap p-4 rounded-xl text-base text-slate-700 bg-slate-50 border border-slate-100">
                {answer.answer_data}
            </div>
            <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 pt-4 border-t border-slate-100">
                <div className="flex-grow space-y-1.5 w-full">
                    <Label htmlFor={`score-${answer.id}`} className="text-xs font-semibold text-slate-600 uppercase tracking-widest pl-1">
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
                        className="h-11 rounded-xl border-slate-200 focus-visible:ring-indigo-500"
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
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-slate-50 bg-slate-50/50">
                <h3 className="text-lg font-bold text-slate-800">Soal: <SafeHTMLRenderer html={question.question_text} className="inline font-normal text-slate-700" /></h3>
                <div className="mt-4 text-sm text-slate-600 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                    <strong className="text-slate-800">Kunci Jawaban:</strong> 
                    <div className="mt-2 prose prose-sm max-w-none text-slate-600">
                        <SafeHTMLRenderer html={question.essay_answers[0]?.answer_key} />
                    </div>
                </div>
            </div>
            <div className="p-5 sm:p-6">
                <h4 className="font-semibold text-slate-500 text-sm uppercase tracking-widest mb-4">Jawaban Siswa</h4>
                <div className="space-y-3">
                    {answers.length > 0 ? (
                        answers.map(answer => (
                            <Collapsible key={answer.id} defaultOpen>
                                <CollapsibleTrigger asChild>
                                    <div className="flex justify-between items-center p-4 border border-slate-200 rounded-xl bg-slate-50 hover:bg-slate-100 hover:border-indigo-200 cursor-pointer transition-all w-full group">
                                        <p className="font-bold text-slate-800 group-hover:text-indigo-700 transition-colors">
                                            {answer.test_submissions.profiles.name} 
                                            <span className="text-slate-500 font-normal ml-1">(@{answer.test_submissions.profiles.username})</span>
                                        </p>
                                        <div className="flex items-center gap-2">
                                            {answer.score_awarded !== null && (
                                                <div className="flex items-center gap-1.5 text-xs text-indigo-700 font-semibold bg-indigo-100 px-2.5 py-1 rounded-md">
                                                    <Check className="h-3.5 w-3.5" /> Dinilai: {answer.score_awarded}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </CollapsibleTrigger>
                                <CollapsibleContent className="p-5 border border-slate-200 border-t-0 rounded-b-xl -mt-2 bg-white pt-6">
                                    <GradeForm answer={{ ...answer, question: question }} />
                                </CollapsibleContent>
                            </Collapsible>
                        ))
                    ) : (
                        <p className="text-slate-500 text-sm italic py-4 text-center bg-slate-50 rounded-xl">Belum ada siswa yang menjawab soal ini.</p>
                    )}
                </div>
            </div>
        </div>
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
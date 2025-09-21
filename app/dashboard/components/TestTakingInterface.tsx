// FILE: app/dashboard/components/TestTakingInterface.tsx

'use client'

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { submitAnswer, finishTest } from "@/lib/actions";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

import dynamic from 'next/dynamic';
import { Checkbox } from '@/components/ui/checkbox';
const SafeHTMLRenderer = dynamic(() => import('./SafeHTMLRenderer'), {
  ssr: false,
  // Tampilkan placeholder sederhana saat komponen sedang dimuat di client
  loading: () => <div className="prose prose-sm max-w-none">Loading content...</div>
});

type TestTakingProps = {
  testData: any;
  submission: any;
  existingAnswers: any[];
  classId: string;
};

export default function TestTakingInterface({ testData, submission, existingAnswers, classId }: TestTakingProps) {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: any }>({});
  const [timeRemaining, setTimeRemaining] = useState(testData.duration_minutes * 60);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const questions = testData.questions || [];
  const currentQuestion = questions[currentQuestionIndex];
  const testId = testData.id;

  // Effect to load existing answers when the component mounts
  useEffect(() => {
    const answerMap: { [key: string]: any } = {};
    existingAnswers.forEach(answer => {
      answerMap[answer.question_id] = answer.answer_data;
    });
    setAnswers(answerMap);
  }, [existingAnswers]);

  const handleAutoSubmit = useCallback(async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    toast.info("Waktu habis! Jawaban Anda sedang disubmit...");
    try {
      await finishTest(submission.id);
      
      // [PERBAIKAN] Arahkan ke URL yang benar
      router.push(`/dashboard/class/${classId}/ujian/${testId}/hasil/${submission.id}`);

    } catch (error) {
      toast.error('Gagal mengakhiri ujian secara otomatis.');
    }
  }, [submission.id, classId, testId, router, isSubmitting]);

  // Effect to manage the countdown timer
  useEffect(() => {
    const startTime = new Date(submission.started_at).getTime();
    const durationMs = testData.duration_minutes * 60 * 1000;
    const endTime = startTime + durationMs;
    
    const updateTimer = () => {
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((endTime - now) / 1000));
      setTimeRemaining(remaining);
      if (remaining <= 0) {
        handleAutoSubmit();
      }
    };
    
    updateTimer(); // Initial call
    const timerInterval = setInterval(updateTimer, 1000);

    return () => clearInterval(timerInterval);
  }, [submission.started_at, testData.duration_minutes, handleAutoSubmit]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerChange = useCallback(async (questionId: string, answerData: any) => {
    setAnswers(prev => ({ ...prev, [questionId]: answerData }));
    try {
      await submitAnswer(submission.id, questionId, answerData);
    } catch (error) {
      toast.error('Gagal menyimpan jawaban');
    }
  }, [submission.id]);

  const handleManualSubmit = async () => {
    setIsSubmitting(true);
    try {
      await finishTest(submission.id);
      toast.success('Ujian berhasil diselesaikan!');
      
// --- [PERBAIKAN] Arahkan ke URL yang benar juga di sini ---
      router.push(`/dashboard/class/${classId}/ujian/${testId}/hasil/${submission.id}`);

    } catch (error: any) {
      toast.error('Gagal menyelesaikan ujian.', { description: error.message });
      setIsSubmitting(false);
    }
  };

  const renderAnswerOptions = () => {
    if (!currentQuestion) return <p>Memuat soal...</p>;
    
    const questionAnswer = answers[currentQuestion.id];

    switch (currentQuestion.type) {
      case 'MULTIPLE_CHOICE':
        // --- [PERBAIKAN UTAMA DI SINI] ---
        const isMultiSelect = (currentQuestion.multiple_choice_options || []).filter((opt: any) => opt.is_correct).length > 1;

        if (isMultiSelect) {
          // Render sebagai Checkbox jika ada > 1 jawaban benar
          return (
            <div className="space-y-4">
              {currentQuestion.multiple_choice_options?.map((option: any, index: number) => {
                const currentSelection = (questionAnswer || []) as string[];
                const isChecked = currentSelection.includes(option.id);

                return (
                  <div key={option.id} className="flex items-start space-x-3 p-3 border rounded hover:bg-muted/50">
                    <Checkbox
                      id={`option-${option.id}`}
                      checked={isChecked}
                      onCheckedChange={(checked) => {
                        const newSelection = checked
                          ? [...currentSelection, option.id]
                          : currentSelection.filter(id => id !== option.id);
                        handleAnswerChange(currentQuestion.id, newSelection);
                      }}
                      className="mt-1"
                    />
                    <Label htmlFor={`option-${option.id}`} className="cursor-pointer flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm bg-muted px-2 py-1 rounded">{String.fromCharCode(65 + index)}</span>
                        <SafeHTMLRenderer html={option.option_text} className="prose prose-sm max-w-none" />
                      </div>
                    </Label>
                  </div>
                );
              })}
            </div>
          );
        } else {
          // Render sebagai RadioGroup (logika lama) jika hanya 1 jawaban benar
          return (
            <RadioGroup 
              value={questionAnswer || ''} 
              onValueChange={(value) => handleAnswerChange(currentQuestion.id, value)}
            >
              {currentQuestion.multiple_choice_options?.map((option: any, index: number) => (
                <div key={option.id} className="flex items-start space-x-3 p-3 border rounded hover:bg-muted/50">
                  <RadioGroupItem value={option.id} id={`option-${option.id}`} className="mt-1" />
                  <Label htmlFor={`option-${option.id}`} className="cursor-pointer flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm bg-muted px-2 py-1 rounded">{String.fromCharCode(65 + index)}</span>
                      <SafeHTMLRenderer html={option.option_text} className="prose prose-sm max-w-none" />
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>
          );
        }

      case 'TRUE_FALSE':
        return (
          <div className="space-y-4">
            {currentQuestion.true_false_statements?.map((statement: any, index: number) => (
              <div key={statement.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-start gap-2">
                  <span className="font-mono text-sm bg-muted px-2 py-1 rounded flex-shrink-0">
                    {index + 1}
                  </span>
                  <SafeHTMLRenderer
                    html={statement.statement_text}
                    className="prose prose-sm max-w-none flex-1"
                  />
                </div>
                <RadioGroup
                  value={questionAnswer?.[statement.id] || ''}
                  onValueChange={(value) => {
                    const newAnswer = { ...questionAnswer, [statement.id]: value };
                    handleAnswerChange(currentQuestion.id, newAnswer);
                  }}
                >
                  <div className="flex gap-6 mt-2">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="true" id={`${statement.id}-true`} />
                      <Label htmlFor={`${statement.id}-true`}>Benar</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="false" id={`${statement.id}-false`} />
                      <Label htmlFor={`${statement.id}-false`}>Salah</Label>
                    </div>
                  </div>
                </RadioGroup>
              </div>
            ))}
          </div>
        );

      case 'ESSAY':
        return (
          <div className="space-y-4">
            <Textarea
              value={questionAnswer || ''}
              onChange={(e) => handleAnswerChange(currentQuestion.id, e.target.value)}
              placeholder="Tulis jawaban Anda di sini..."
              className="min-h-[200px]"
            />
            <p className="text-sm text-muted-foreground">
              Tip: Berikan penjelasan yang lengkap dan terstruktur
            </p>
          </div>
        );

      case 'MATCHING':
        return (
          <div className="space-y-6">
            {/* Bagian ini menampilkan kedua kolom sebagai referensi */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <h4 className="font-medium">Kolom A (Prompts)</h4>
                <div className="space-y-2">
                  {currentQuestion.matching_prompts?.map((prompt: any, index: number) => (
                    <div key={prompt.id} className="p-3 bg-blue-50 border rounded flex items-start gap-2">
                      <span className="font-mono text-sm bg-white px-2 py-1 rounded mt-1 flex-shrink-0">{index + 1}</span>
                      <SafeHTMLRenderer html={prompt.prompt_text} className="prose prose-sm max-w-none" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Kolom B (Options)</h4>
                <div className="space-y-2">
                  {currentQuestion.matching_options?.map((option: any, index: number) => (
                    <div key={option.id} className="p-3 bg-gray-50 border rounded flex items-start gap-2">
                      <span className="font-mono text-sm bg-white px-2 py-1 rounded mt-1 flex-shrink-0">{String.fromCharCode(65 + index)}</span>
                      <SafeHTMLRenderer html={option.option_text} className="prose prose-sm max-w-none" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* --- [PERBAIKAN UTAMA DI SINI] --- */}
            {/* Bagian ini untuk menjawab, dengan layout yang jauh lebih baik */}
            <div className="space-y-4 pt-4 border-t">
              <h4 className="font-medium text-lg">Pilih Pasangan:</h4>
              {currentQuestion.matching_prompts?.map((prompt: any, index: number) => (
                <div key={prompt.id} className="border rounded-lg overflow-hidden">
                  {/* Prompt di sebelah kiri */}
                  <div className="p-4 bg-gray-50">
                    <div className="flex items-start gap-3">
                      <span className="font-mono text-sm bg-white px-2 py-1 rounded mt-1">{index + 1}</span>
                      <SafeHTMLRenderer html={prompt.prompt_text} className="prose prose-sm max-w-none font-semibold" />
                    </div>
                  </div>

                  {/* Pilihan Jawaban di sebelah kanan */}
                  <div className="p-4">
                    <RadioGroup
                      value={questionAnswer?.[prompt.id] || ''}
                      onValueChange={(value) => {
                        const newAnswer = { ...questionAnswer, [prompt.id]: value };
                        handleAnswerChange(currentQuestion.id, newAnswer);
                      }}
                      className="grid grid-cols-1 sm:grid-cols-2 gap-3"
                    >
                      {currentQuestion.matching_options?.map((option: any, optIndex: number) => (
                        <div key={option.id} className="flex items-center">
                          <RadioGroupItem value={option.id} id={`${prompt.id}-${option.id}`} />
                          <Label htmlFor={`${prompt.id}-${option.id}`} className="font-normal cursor-pointer flex-1 ml-2 p-2 rounded-md hover:bg-muted has-[:checked]:bg-blue-50">
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-xs">{String.fromCharCode(65 + optIndex)}</span>
                              <SafeHTMLRenderer html={option.option_text} className="prose-sm" />
                            </div>
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return <p>Tipe soal ini belum didukung.</p>;
    }
  };

  if (!currentQuestion) {
    return <div className="text-center p-8">Tidak ada soal tersedia</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6 h-[calc(100vh-4rem)]">
        {/* Main Content Area */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold">{testData.title}</h1>
          </div>
          <Card className="flex-grow flex flex-col">
            <CardContent className="p-6 flex-grow flex flex-col space-y-4">
              <div className="border bg-background rounded-lg p-4 flex-grow">
                <h2 className="text-sm font-semibold mb-2 text-muted-foreground">Test Question</h2>
                <SafeHTMLRenderer
                  html={currentQuestion?.question_text || 'Question content will appear here'}
                  className="prose max-w-none"
                />
              </div>
              <div className="border bg-background rounded-lg p-4">
                <h3 className="text-sm font-semibold mb-4 text-muted-foreground">Test Answer</h3>
                {renderAnswerOptions()}
              </div>
            </CardContent>
            <div className="flex justify-between p-4 border-t bg-gray-50 rounded-b-lg">
              <Button variant="outline" onClick={() => setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1))} disabled={currentQuestionIndex === 0}>
                <ChevronLeft className="h-4 w-4 mr-2" /> Previous
              </Button>
              <Button variant="default" className="bg-slate-800 hover:bg-slate-900" onClick={() => setCurrentQuestionIndex(Math.min(questions.length - 1, currentQuestionIndex + 1))} disabled={currentQuestionIndex === questions.length - 1}>
                Next <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Clock className={cn("w-4 h-4", timeRemaining < 300 ? "text-red-500" : "text-green-600")} />
                <div className="text-sm text-muted-foreground">Time</div>
              </div>
              <div className={cn("text-3xl font-bold tracking-tighter", timeRemaining < 300 ? "text-red-500" : "text-green-600")}>
                {formatTime(timeRemaining)}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button className="w-full bg-green-600 hover:bg-green-700" size="lg" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader><AlertDialogTitle>Confirm Submission</AlertDialogTitle><AlertDialogDescription>Are you sure you want to finish this test?</AlertDialogDescription></AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleManualSubmit}>Yes, Submit</AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
          <Card className="flex-grow">
            <CardHeader className="p-4"><CardTitle className="text-base">Questions Number</CardTitle></CardHeader>
            <CardContent className="p-4 grid grid-cols-5 gap-2">
              {questions.map((q: any, index: number) => (
                <Button
                  key={q.id}
                  variant={currentQuestionIndex === index ? "default" : "outline"}
                  size="icon"
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={cn(
                    "h-8 w-8 rounded-full",
                    answers[q.id] !== undefined && currentQuestionIndex !== index && "bg-green-100 border-green-300 text-green-800 hover:bg-green-200",
                    currentQuestionIndex === index && "bg-blue-600 text-white"
                  )}
                >
                  {index + 1}
                </Button>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

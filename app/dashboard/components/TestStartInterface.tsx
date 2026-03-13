// FILE: app/dashboard/components/TestStartInterface.tsx
'use client'

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AlertCircle, Clock, FileQuestion, CheckCircle, Play, RotateCcw, ArrowLeft, Info, ListChecks } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { startTest } from "@/lib/actions";
import { toast } from "sonner";
import Link from "next/link";

type TestInfo = {
  id: string;
  title: string;
  description?: string | null;
  duration_minutes: number;
  total_questions: number;
  classes: { name: string, id: string };
};

type ExistingSubmission = {
    id: string;
    status: string;
    started_at: string;
    completed_at?: string;
    total_score?: number;
} | null;

interface TestStartInterfaceProps {
  testInfo: TestInfo;
  existingSubmission: ExistingSubmission;
}

export default function TestStartInterface({ testInfo, existingSubmission }: TestStartInterfaceProps) {
  const [isStarting, setIsStarting] = useState(false);
  const router = useRouter();
  
  // URL untuk redirect setelah startTest berhasil
  const takeTestUrl = `/ujian/take/${existingSubmission?.id || 'new'}`;

  const handleStartOrContinue = async () => {
    setIsStarting(true);
    
    const classId = testInfo.classes.id;
    const testId = testInfo.id;

    if (existingSubmission && existingSubmission.status === 'IN_PROGRESS') {
      // Gunakan URL yang lengkap dan benar
      router.push(`/dashboard/class/${classId}/ujian/${testId}/take/${existingSubmission.id}`);
      return;
    }

    try {
      const result = await startTest(testInfo.id);
      
      if (result.error) {
        toast.error("Gagal memulai ujian", { description: result.error });
        setIsStarting(false);
        return;
      }

      if (result.submissionId) {
        // Gunakan URL yang lengkap dan benar
        router.push(`/dashboard/class/${classId}/ujian/${testId}/take/${result.submissionId}`);
      }
    } catch (error) {
      toast.error("Terjadi kesalahan yang tidak diketahui saat memulai ujian.");
      setIsStarting(false);
    }
  };

  const getActionComponent = () => {
    if (existingSubmission?.status === 'COMPLETED') {
    const classId = testInfo.classes.id;
      const testId = testInfo.id;
      const submissionId = existingSubmission.id;
      return (
        <div className="space-y-4">
          <Alert variant="default" className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-700" />
              <AlertTitle className="text-green-800">Ujian Telah Selesai</AlertTitle>
              <AlertDescription className="text-green-700">
                Anda telah menyelesaikan ujian ini dengan skor akhir <strong>{existingSubmission.total_score ?? 0}</strong>.
              </AlertDescription>
          </Alert>
          <Button size="lg" className="w-full" asChild>
              {/* URL lengkap dan benar sesuai struktur folder */}
              <Link href={`/dashboard/class/${classId}/ujian/${testId}/hasil/${submissionId}`}>Lihat Pembahasan</Link>
          </Button>
        </div>
      );  
    }

    const isInProgress = existingSubmission?.status === 'IN_PROGRESS';

    return (
       <div className="space-y-4">
        {isInProgress ? (
            <Alert variant="default" className="bg-blue-50 border-blue-200">
                <RotateCcw className="h-4 w-4 text-blue-700" />
                <AlertTitle className="text-blue-800">Ujian Sedang Berlangsung</AlertTitle>
                <AlertDescription className="text-blue-700">
                    Anda dapat melanjutkan pengerjaan ujian dari sesi sebelumnya.
                </AlertDescription>
            </Alert>
        ) : (
             <Alert>
                <Info className="h-4 w-4" />
                <AlertTitle>Siap Memulai?</AlertTitle>
                <AlertDescription>
                    Pastikan Anda memiliki koneksi yang stabil sebelum memulai ujian.
                </AlertDescription>
            </Alert>
        )}
        <Button 
            size="lg" 
            onClick={handleStartOrContinue}
            disabled={isStarting}
            className="w-full h-12 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all shadow-sm shadow-indigo-200"
        >
            {isInProgress ? <RotateCcw className="w-5 h-5 mr-2" /> : <Play className="w-5 h-5 mr-2" />}
            {isStarting ? 'Memuat...' : (isInProgress ? 'Lanjutkan Ujian' : 'Mulai Ujian Sekarang')}
        </Button>
       </div>
    );
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header dan Tombol Kembali */}
      <div className="flex items-center">
          <Button variant="ghost" size="sm" asChild className="text-slate-500 hover:text-slate-800 hover:bg-slate-100/50 rounded-xl">
              <Link href={`/dashboard/class/${testInfo.classes.id}`} className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Kembali ke Kelas
              </Link>
          </Button>
      </div>

        {/* Layout Utama */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Kolom Kiri: Info & Instruksi */}
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-6 sm:p-8">
                        <h2 className="text-2xl sm:text-3xl font-bold text-slate-800 tracking-tight">{testInfo.title}</h2>
                        <p className="text-slate-500 mt-2">{testInfo.description || `Ujian untuk kelas ${testInfo.classes.name}.`}</p>
                    
                        <Separator className="my-6" />
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Durasi</p>
                                <p className="text-xl font-semibold flex items-center justify-center gap-2">
                                    <Clock className="w-5 h-5 text-blue-500" />
                                    {testInfo.duration_minutes} Menit
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Jumlah Soal</p>
                                <p className="text-xl font-semibold flex items-center justify-center gap-2">
                                    <FileQuestion className="w-5 h-5 text-green-500" />
                                    {testInfo.total_questions} Soal
                                </p>
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm text-muted-foreground">Total Poin</p>
                                <p className="text-xl font-semibold flex items-center justify-center gap-2">
                                    <CheckCircle className="w-5 h-5 text-purple-500" />
                                    100 Poin
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                    <div className="p-6 sm:p-8 border-b border-slate-50 bg-indigo-50/30">
                        <h3 className="flex items-center gap-2 text-lg font-bold text-slate-800">
                            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                                <ListChecks className="h-4 w-4" />
                            </div>
                            Petunjuk Ujian
                        </h3>
                    </div>
                    <div className="p-6 sm:p-8">
                        <ul className="space-y-3 text-sm text-slate-600 list-none">
                            <li className="flex gap-3 items-start"><span className="text-indigo-400 mt-0.5">•</span> Pastikan koneksi internet Anda stabil selama pengerjaan.</li>
                            <li className="flex gap-3 items-start"><span className="text-indigo-400 mt-0.5">•</span> Timer akan berjalan otomatis setelah ujian dimulai dan tidak dapat dijeda.</li>
                            <li className="flex gap-3 items-start"><span className="text-indigo-400 mt-0.5">•</span> Jawaban Anda akan tersimpan secara otomatis setiap kali Anda menjawab.</li>
                            <li className="flex gap-3 items-start"><span className="text-indigo-400 mt-0.5">•</span> Ujian akan otomatis berakhir dan disubmit jika waktu habis.</li>
                            <li className="flex gap-3 items-start"><span className="text-indigo-400 mt-0.5">•</span> Periksa kembali semua jawaban Anda sebelum menekan tombol "Submit".</li>
                        </ul>
                    </div>
                </div>
            </div>
            
            {/* Kolom Kanan: Status & Aksi */}
            <div className="lg:col-span-1">
                <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden sticky top-8">
                    <div className="p-6 border-b border-slate-50 bg-slate-50/50">
                        <h3 className="text-base font-bold text-slate-800 tracking-tight">Status Ujian</h3>
                    </div>
                    <div className="p-6">
                        {getActionComponent()}
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
}
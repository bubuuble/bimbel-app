// FILE: app/dashboard/components/StudentClassView.tsx (Versi Final & Diperbaiki)

'use client'

import type { User } from "@supabase/supabase-js";
import { useRouter } from 'next/navigation'; // <-- Import useRouter
import type { Class, Material, Submission, Test, TestSubmission } from "@/lib/types"; // <-- Import Test, TestSubmission
import SubmissionForm from "./SubmissionForm";
import StudentAttendance from "./StudentAttendance";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { FileText, Clock, CheckCircle, AlertCircle, ChevronDown, Paperclip, ClipboardList, Eye} from "lucide-react"; // <-- Tambah ClipboardList
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";
import Link from "next/link";

type Props = {
  user: User;
  classInfo: Pick<Class, 'id' | 'name' | 'description'>;
  materials: Material[];
  activeSession: { id: string, title: string | null, expires_at: string } | null;
  scheduledSession: { id: string, title: string | null, start_time: string } | null;
  hasAttended: boolean;
  submissions: Pick<Submission, 'material_id' | 'id' | 'file_url' | 'grade' | 'feedback'>[];
  tests: Test [];
  testSubmissions: TestSubmission[];
};

export default function StudentClassView({ user, classInfo, materials, activeSession, scheduledSession, hasAttended, submissions, tests, testSubmissions }: Props) {
  const testSubmissionMap = new Map(testSubmissions.map(s => [s.test_id, s]));
  const submissionMap = new Map(submissions.map(s => [s.material_id, s]));
  const now = new Date();
  const [openMaterialId, setOpenMaterialId] = useState<string | null>(null);
  const router = useRouter();

  const handleResultClick = (e: React.MouseEvent<HTMLAnchorElement>, submission: TestSubmission | undefined) => {
    if (!submission) {
      e.preventDefault(); // Mencegah navigasi Link
      alert("Anda harus mengerjakan ujian ini terlebih dahulu sebelum bisa melihat hasilnya.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Student Attendance */}
      <StudentAttendance
        classId={classInfo.id}
        activeSession={activeSession}
        scheduledSession={scheduledSession}
        hasAttended={hasAttended}
      />

      <Separator />

      {/* Materials & Tasks */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <FileText className="h-5 w-5 text-indigo-500" />
            Materi & Tugas
        </h2>
        
        {materials && materials.length > 0 ? (
          <div className="space-y-2">
            {materials.map(material => {
              const hasDeadline = material.is_task && material.deadline;
              const deadlineDate = hasDeadline ? new Date(material.deadline!) : null;
              const isOverdue = hasDeadline && deadlineDate! < now;
              
              const currentSubmission = submissionMap.get(material.id);
              const hasBeenGraded = currentSubmission && currentSubmission.grade !== null;

              return (
                <Collapsible 
                  key={material.id}
                  open={openMaterialId === material.id}
                  onOpenChange={() => setOpenMaterialId(prevId => prevId === material.id ? null : material.id)}
                  className="w-full"
                >
                  <div className={`overflow-hidden rounded-2xl border transition-all duration-200 ${openMaterialId === material.id ? 'border-indigo-200 shadow-md ring-4 ring-indigo-50/50 bg-white' : 'border-slate-100 bg-white shadow-sm hover:border-indigo-100 hover:shadow-md'}`}>
                    <CollapsibleTrigger asChild>
                      <div className="cursor-pointer p-5 sm:p-6 flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-base sm:text-lg font-bold text-slate-800 flex items-center gap-2.5">
                            {material.title}
                            {material.is_task && (
                              <span className={`shrink-0 inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold uppercase tracking-wider ${
                                hasBeenGraded ? "bg-teal-50 text-teal-700 border border-teal-200" : 
                                isOverdue ? "bg-rose-50 text-rose-700 border border-rose-200" : 
                                "bg-amber-50 text-amber-700 border border-amber-200"
                              }`}>
                                {hasBeenGraded ? "Dinilai" : isOverdue ? "Terlambat" : "Tugas"}
                              </span>
                            )}
                          </h3>
                          {material.description && openMaterialId !== material.id && (
                            <p className="text-sm text-slate-500 mt-1.5 line-clamp-1">{material.description}</p>
                          )}
                        </div>
                        <div className={`flex shrink-0 h-8 w-8 items-center justify-center rounded-full transition-colors ${openMaterialId === material.id ? 'bg-indigo-100 text-indigo-700' : 'bg-slate-50 text-slate-400'}`}>
                            <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${openMaterialId === material.id ? 'rotate-180' : ''}`} />
                        </div>
                      </div>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <div className="px-5 sm:px-6 pb-6 pt-0 space-y-5">
                         {material.description && (
                          <div className="bg-slate-50/50 rounded-xl p-4 border border-slate-100">
                             <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{material.description}</p>
                          </div>
                        )}
                        {/* Deadline Alert */}
                        {hasDeadline && (
                          <div className={`flex items-center gap-3 p-3 rounded-xl border ${isOverdue ? 'bg-rose-50 border-rose-100 text-rose-700' : 'bg-amber-50 border-amber-100 text-amber-800'}`}>
                            <Clock className="h-5 w-5 shrink-0" />
                            <p className="text-sm font-medium">
                              Deadline: {deadlineDate!.toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' })}
                              {isOverdue && <span className="ml-2 font-bold uppercase tracking-wide text-xs bg-rose-200/50 px-2 py-0.5 rounded-md">(Terlambat)</span>}
                            </p>
                          </div>
                        )}

                        {/* <<< PERUBAHAN 2: Ganti logika dari satu file menjadi daftar file >>> */}
                        {material.material_files && material.material_files.length > 0 && (
                          <div className="space-y-2.5">
                            <Label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Lampiran File</Label>
                            <div className="flex flex-wrap gap-2">
                                {material.material_files.map(file => (
                                <a key={file.id} href={file.file_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-white border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors">
                                    <Paperclip className="h-4 w-4 shrink-0 text-slate-400" />
                                    <span className="truncate max-w-[200px]">{file.file_name}</span>
                                </a>
                                ))}
                            </div>
                          </div>
                        )}

                        {/* Hasil Penilaian Collapsible (nested) */}
                        {material.is_task && hasBeenGraded && (
                          <Collapsible>
                            <CollapsibleTrigger className="w-full flex items-center justify-between p-3 rounded-xl border border-indigo-100 bg-indigo-50/50 text-indigo-700 hover:bg-indigo-100/50 transition-colors font-medium text-sm">
                                <span className="flex items-center gap-2"><CheckCircle className="h-4 w-4" /> Lihat Hasil & Umpan Balik Guru</span>
                                <ChevronDown className="h-4 w-4" />
                            </CollapsibleTrigger>
                            <CollapsibleContent className="pt-3">
                                <div className="bg-white border-2 border-green-100 rounded-xl overflow-hidden">
                                  <div className="bg-green-50/50 px-4 py-3 border-b border-green-100 flex items-center justify-between">
                                    <span className="font-semibold text-green-800 text-sm">Nilai Akhir</span>
                                    <span className="inline-flex items-center justify-center bg-green-500 text-white font-bold text-lg px-3 py-0.5 rounded-lg shadow-sm">
                                      {currentSubmission.grade}
                                    </span>
                                  </div>
                                  {currentSubmission.feedback && (
                                    <div className="p-4 space-y-2">
                                      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Catatan Guru</p>
                                      <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                                        {currentSubmission.feedback}
                                      </div>
                                    </div>
                                  )}
                                </div>
                            </CollapsibleContent>
                          </Collapsible>
                        )}

                        {/* Submission Form */}
                        {material.is_task && (
                          <div className="pt-2">
                              <SubmissionForm
                                materialId={material.id}
                                studentId={user.id}
                                classId={classInfo.id}
                                existingSubmission={currentSubmission || null}
                              />
                          </div>
                        )}
                      </div>
                    </CollapsibleContent>
                  </div>
                </Collapsible>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-100 border-dashed bg-slate-50 p-12 text-center text-slate-500">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 mx-auto mb-4">
              <AlertCircle className="h-6 w-6 text-slate-400" />
            </div>
            <p className="font-medium">
              Belum ada materi atau tugas yang diunggah untuk kelas ini.
            </p>
          </div>
        )}
      </div>
            <Separator />

      {/* --- [SEKSI UJIAN BARU] --- */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-indigo-500" />
            Ujian Tersedia
        </h2>
        {tests && tests.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {tests.map(test => {
                const submission = testSubmissionMap.get(test.id);
                const isCompleted = submission?.status === 'COMPLETED';
                const isInProgress = submission?.status === 'IN_PROGRESS';

                // --- [PERBAIKAN 2: URL Link yang diperbaiki] ---
                const getButtonLink = () => {
                  if (isInProgress) {
                    return `/dashboard/class/${classInfo.id}/ujian/${test.id}/take/${submission!.id}`;
                  }
                  // Untuk 'Mulai' atau 'Lihat Hasil', arahkan ke halaman 'start'
                  // Halaman 'start' akan menampilkan info atau hasil berdasarkan status
                  return `/dashboard/class/${classInfo.id}/ujian/${test.id}/start`;
                };
                
                // Link khusus untuk tombol "Lihat Hasil"
                const resultLink = isCompleted 
                    ? `/dashboard/class/${classInfo.id}/ujian/${test.id}/hasil/${submission!.id}` 
                    : '#';

                return (
                    <div key={test.id} className="flex flex-col rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden hover:shadow-md hover:border-indigo-100 transition-all duration-200">
                        <div className="p-5 flex-grow space-y-3">
                            <h3 className="font-bold text-slate-800 leading-tight">{test.title}</h3>
                            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 bg-slate-50 w-fit px-2 py-1 rounded-md">
                                <Clock className="h-3.5 w-3.5" />
                                {test.duration_minutes} Menit
                            </div>
                            
                            <div className="pt-2">
                                {isCompleted ? (
                                    <div className="bg-teal-50 border border-teal-100 text-teal-800 px-3 py-2.5 rounded-xl flex items-center gap-2 text-sm font-medium">
                                        <CheckCircle className="h-4 w-4 text-teal-600 shrink-0" />
                                        <span>Skor: <strong className="text-teal-700">{submission.total_score ?? 'N/A'}</strong></span>
                                    </div>
                                ) : isInProgress ? (
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200 uppercase tracking-wide">
                                        Sedang Dikerjakan
                                    </span>
                                ) : (
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200 uppercase tracking-wide">
                                        Belum Dikerjakan
                                    </span>
                                )}
                            </div>
                        </div>
                        <div className="p-5 pt-0 border-t border-slate-50/50 flex flex-col gap-2 mt-auto">
                           {/* Tombol Aksi Utama (Mulai atau Lanjutkan) */}
                           <Link href={getButtonLink()} className={`flex items-center justify-center gap-2 w-full mt-4 rounded-xl h-10 text-sm font-semibold transition-colors ${isInProgress ? 'bg-amber-500 hover:bg-amber-600 text-white shadow-sm' : isCompleted ? 'bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200' : 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm'}`}>
                                {isInProgress ? 'Lanjutkan Ujian' : isCompleted ? 'Buka Ringkasan' : 'Mulai Ujian'}
                           </Link>

                           {/* Tombol Lihat Hasil, hanya ditampilkan jika ujian sudah pernah dikerjakan */}
                           {submission && isCompleted && (
                               <Link 
                                 href={resultLink}
                                 onClick={(e) => handleResultClick(e, submission)}
                                 className="flex items-center justify-center gap-2 w-full rounded-xl h-10 text-sm font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                               >
                                 <Eye className="h-4 w-4" />
                                 Lihat Hasil Detail
                               </Link>
                           )}
                        </div>
                    </div>
                );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-100 border-dashed bg-slate-50 p-12 text-center text-slate-500">
            <ClipboardList className="h-8 w-8 text-slate-400 mx-auto mb-3" />
            <p className="font-medium">Belum ada ujian yang tersedia untuk kelas ini.</p>
          </div>
        )}
      </div>
    </div>
  );
}
// FILE: app/dashboard/components/StudentClassView.tsx (Versi Final & Diperbaiki)

'use client'

import type { User } from "@supabase/supabase-js";
import type { Class, Material, Submission } from "@/lib/types";
import SubmissionForm from "./SubmissionForm";
import StudentAttendance from "./StudentAttendance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
// <<< PERUBAHAN 1: Impor ikon Paperclip >>>
import { FileText, Clock, CheckCircle, AlertCircle, ExternalLink, ChevronDown, Paperclip } from "lucide-react"; 
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useState } from "react";

type Props = {
  user: User;
  classInfo: Pick<Class, 'id' | 'name' | 'description'>;
  materials: Material[];
  activeSession: { id: string, title: string | null, expires_at: string } | null;
  scheduledSession: { id: string, title: string | null, start_time: string } | null;
  hasAttended: boolean;
  submissions: Pick<Submission, 'material_id' | 'id' | 'file_url' | 'grade' | 'feedback'>[];
};

export default function StudentClassView({ user, classInfo, materials, activeSession, scheduledSession, hasAttended, submissions }: Props) {
  const submissionMap = new Map(submissions.map(s => [s.material_id, s]));
  const now = new Date();
  
  const [openMaterialId, setOpenMaterialId] = useState<string | null>(null);

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
        <h2 className="text-2xl font-bold">Materi & Tugas</h2>
        
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
                  <Card>
                    <CollapsibleTrigger asChild>
                      <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors rounded-t-lg">
                        <div className="flex items-start justify-between">
                          <CardTitle className="flex items-center gap-3">
                            <FileText className="h-5 w-5 flex-shrink-0" />
                            <span className="flex-1">{material.title}</span>
                          </CardTitle>
                          <div className="flex items-center gap-2 ml-4">
                            {material.is_task && (
                              <Badge variant={hasBeenGraded ? "default" : isOverdue ? "destructive" : "secondary"}>
                                {hasBeenGraded ? "Dinilai" : isOverdue ? "Terlambat" : "Tugas"}
                              </Badge>
                            )}
                            <ChevronDown className={`h-5 w-5 transition-transform duration-200 ${openMaterialId === material.id ? 'rotate-180' : ''}`} />
                          </div>
                        </div>
                        {material.description && openMaterialId !== material.id && (
                          <p className="text-sm text-muted-foreground pt-2 line-clamp-1">{material.description}</p>
                        )}
                      </CardHeader>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <CardContent className="pt-4 space-y-4">
                         {material.description && (
                          <p className="text-sm text-muted-foreground">{material.description}</p>
                        )}
                        {/* Deadline Alert */}
                        {hasDeadline && (
                          <Alert variant={isOverdue ? "destructive" : "default"}>
                            <Clock className="h-4 w-4" />
                            <AlertDescription>
                              <span className="font-medium">
                                Deadline: {deadlineDate!.toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' })}
                              </span>
                              {isOverdue && <span className="ml-2 font-bold">(TERLAMBAT)</span>}
                            </AlertDescription>
                          </Alert>
                        )}

                        {/* <<< PERUBAHAN 2: Ganti logika dari satu file menjadi daftar file >>> */}
                        {material.material_files && material.material_files.length > 0 && (
                          <div className="space-y-2 pt-2">
                            <Label>Lampiran File:</Label>
                            {material.material_files.map(file => (
                              <Button key={file.id} variant="outline" className="w-fit" asChild>
                                <a href={file.file_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                                  <Paperclip className="h-4 w-4" />
                                  {file.file_name}
                                </a>
                              </Button>
                            ))}
                          </div>
                        )}

                        {/* Hasil Penilaian Collapsible (nested) */}
                        {material.is_task && hasBeenGraded && (
                          <Collapsible>
                            <CollapsibleTrigger asChild>
                              <Button variant="outline" className="w-full justify-between">
                                Lihat Hasil & Feedback
                                <ChevronDown className="h-4 w-4" />
                              </Button>
                            </CollapsibleTrigger>
                            <CollapsibleContent className="pt-4">
                              <Card className="bg-blue-50 border-blue-200">
                                <CardHeader className="pb-3">
                                  <CardTitle className="text-base flex items-center gap-2">
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                    Hasil Penilaian
                                  </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                  <div className="flex items-center gap-2">
                                    <Badge variant="default" className="text-lg px-3 py-1">
                                      Nilai: {currentSubmission.grade}
                                    </Badge>
                                  </div>
                                  {currentSubmission.feedback && (
                                    <div className="space-y-2">
                                      <p className="font-medium text-sm">Umpan Balik dari Guru:</p>
                                      <div className="bg-white p-3 rounded-md border text-sm whitespace-pre-wrap">
                                        {currentSubmission.feedback}
                                      </div>
                                    </div>
                                  )}
                                </CardContent>
                              </Card>
                            </CollapsibleContent>
                          </Collapsible>
                        )}

                        {/* Submission Form */}
                        {material.is_task && (
                          <SubmissionForm
                            materialId={material.id}
                            studentId={user.id}
                            classId={classInfo.id}
                            existingSubmission={currentSubmission || null}
                          />
                        )}
                      </CardContent>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
              );
            })}
          </div>
        ) : (
          <Card>
            <CardContent className="text-center py-8">
              <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <p className="text-muted-foreground">
                Belum ada materi atau tugas yang diunggah untuk kelas ini.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
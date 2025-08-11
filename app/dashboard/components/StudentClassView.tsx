// FILE: app/dashboard/components/StudentClassView.tsx

import type { User } from "@supabase/supabase-js";
import type { Class, Material, Submission } from "@/lib/types";
import SubmissionForm from "./SubmissionForm";
import StudentAttendance from "./StudentAttendance";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileText, Clock, CheckCircle, AlertCircle, ExternalLink } from "lucide-react";

type Props = {
  user: User;
  classInfo: Pick<Class, 'id' | 'name' | 'description'>;
  materials: Material[];
  activeSession: { id: string, title: string | null, expires_at: string } | null;
  hasAttended: boolean;
  submissions: Pick<Submission, 'material_id' | 'id' | 'file_url' | 'grade' | 'feedback'>[];
};

export default function StudentClassView({ user, classInfo, materials, activeSession, hasAttended, submissions }: Props) {
  const submissionMap = new Map(submissions.map(s => [s.material_id, s]));
  const now = new Date();

  return (
    <div className="space-y-6">
      {/* Student Attendance */}
      <StudentAttendance
        classId={classInfo.id}
        activeSession={activeSession}
        hasAttended={hasAttended}
      />

      <Separator />

      {/* Materials & Tasks */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold">Materi & Tugas</h2>
        
        {materials && materials.length > 0 ? (
          <div className="space-y-4">
            {materials.map(material => {
              const hasDeadline = material.is_task && material.deadline;
              const deadlineDate = hasDeadline ? new Date(material.deadline!) : null;
              const isOverdue = hasDeadline && deadlineDate! < now;
              
              const currentSubmission = submissionMap.get(material.id);
              const hasBeenGraded = currentSubmission && currentSubmission.grade !== null;

              return (
                <Card key={material.id} className="w-full">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="flex items-center gap-2">
                        <FileText className="h-5 w-5" />
                        {material.title}
                      </CardTitle>
                      {material.is_task && (
                        <Badge variant={hasBeenGraded ? "default" : isOverdue ? "destructive" : "secondary"}>
                          {hasBeenGraded ? "Dinilai" : isOverdue ? "Terlambat" : "Tugas"}
                        </Badge>
                      )}
                    </div>
                    {material.description && (
                      <p className="text-sm text-muted-foreground">{material.description}</p>
                    )}
                  </CardHeader>

                  <CardContent className="space-y-4">
                    {/* Deadline Alert */}
                    {hasDeadline && (
                      <Alert variant={isOverdue ? "destructive" : "default"}>
                        <Clock className="h-4 w-4" />
                        <AlertDescription>
                          <span className="font-medium">
                            Deadline: {deadlineDate!.toLocaleString('id-ID', { 
                              dateStyle: 'full', 
                              timeStyle: 'short' 
                            })}
                          </span>
                          {isOverdue && (
                            <span className="ml-2 font-bold">(TERLAMBAT)</span>
                          )}
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Material File Link */}
                    {material.file_url && (
                      <Button variant="outline" className="w-fit" asChild>
                        <a href={material.file_url} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          Lihat Materi/Soal
                        </a>
                      </Button>
                    )}

                    {/* Grade Results */}
                    {material.is_task && hasBeenGraded && (
                      <Card className="bg-blue-50 border-blue-200">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-lg flex items-center gap-2">
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
                </Card>
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
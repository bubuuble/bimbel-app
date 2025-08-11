// FILE: app/dashboard/class/[classId]/task/[materialId]/page.tsx

import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, FileText, Calendar, User } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import GradeSubmissionForm from "../../../../components/GradeSubmissionForm";

type SubmissionWithProfile = {
  id: number;
  created_at: string;
  file_url: string | null;
  text_content: string | null;
  grade: number | null;
  feedback: string | null;
  material_id: string;
  profiles: {
    name: string | null;
    username: string | null;
  } | null;
};

export default async function TaskSubmissionsPage({ params }: { params: { classId: string, materialId: string } }) {
  const supabase = await createClient();

  // 1. Dapatkan pengguna yang sedang login
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect('/login');

  // 2. Ambil data material yang diminta
  const { data: material } = await supabase
    .from('materials')
    .select(`title, class_id`)
    .eq('id', params.materialId)
    .single();
  
  if (!material) notFound();

  // 3. Ambil data kelas yang terkait dengan material
  const { data: classData } = await supabase
    .from('classes')
    .select('teacher_id')
    .eq('id', material.class_id)
    .single();

  if (!classData) {
    return (
      <div className="container max-w-4xl mx-auto p-6">
        <Alert variant="destructive">
          <AlertDescription>
            Error: Class data for this material not found.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // 4. Lakukan Otorisasi dengan data yang sudah pasti
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  
  const isTeacherOwner = classData.teacher_id === user.id;
  const isAdmin = profile?.role === 'ADMIN';

  if (!isTeacherOwner && !isAdmin) {
    return (
      <div className="container max-w-4xl mx-auto p-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-destructive">Access Denied</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">You are not authorized to view this page.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 5. Jika otorisasi berhasil, ambil semua submissions
  const { data: submissions, error } = await supabase
    .from('submissions')
    .select(`*, profiles ( name, username )`)
    .eq('material_id', params.materialId)
    .order('created_at', { ascending: true })
    .returns<SubmissionWithProfile[]>();

  if (error) {
    return (
      <div className="container max-w-4xl mx-auto p-6">
        <Alert variant="destructive">
          <AlertDescription>
            Error loading submissions: {error.message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // 6. Render Halaman
  return (
    <div className="container max-w-4xl mx-auto p-6 space-y-6">
      {/* Header Section */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/dashboard/class/${params.classId}`}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Kelas
          </Link>
        </Button>
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Jawaban Tugas</h1>
        <p className="text-xl text-muted-foreground">{material.title}</p>
      </div>

      <Separator />

      {/* Submissions Section */}
      {submissions.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Belum ada submission</h3>
              <p className="text-muted-foreground">Belum ada siswa yang mengumpulkan tugas ini.</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Submission ({submissions.length})</h2>
            <Badge variant="secondary">{submissions.length} jawaban</Badge>
          </div>
          
          <div className="space-y-4">
            {submissions.map(submission => (
              <Card key={submission.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <User className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <CardTitle className="text-lg">
                          {submission.profiles?.name || submission.profiles?.username || "Unknown User"}
                        </CardTitle>
                        {submission.grade !== null && (
                          <Badge variant={submission.grade >= 70 ? "default" : "secondary"} className="mt-1">
                            Nilai: {submission.grade}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      {new Date(submission.created_at).toLocaleString('id-ID')}
                    </div>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  {/* File Submission */}
                  {submission.file_url ? (
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-blue-500" />
                      <Button variant="link" className="p-0 h-auto" asChild>
                        <a href={submission.file_url} target="_blank" rel="noopener noreferrer">
                          Lihat File Jawaban
                        </a>
                      </Button>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">
                      Tidak ada file yang diunggah.
                    </p>
                  )}

                  {/* Text Content */}
                  {submission.text_content && (
                    <div className="bg-muted/50 p-3 rounded-md">
                      <p className="text-sm font-medium mb-1">Jawaban Teks:</p>
                      <p className="text-sm">{submission.text_content}</p>
                    </div>
                  )}

                  {/* Feedback */}
                  {submission.feedback && (
                    <div className="bg-blue-50 dark:bg-blue-950/20 p-3 rounded-md border border-blue-200 dark:border-blue-800">
                      <p className="text-sm font-medium mb-1 text-blue-700 dark:text-blue-300">Feedback:</p>
                      <p className="text-sm text-blue-600 dark:text-blue-200">{submission.feedback}</p>
                    </div>
                  )}

                  <Separator />
                  
                  {/* Grading Form */}
                  <GradeSubmissionForm submission={submission} classId={params.classId} />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
// FILE: app/dashboard/class/[classId]/page.tsx

import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft, Users, BookOpen, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import TeacherClassView from "../../components/TeacherClassView";
import StudentClassView from "../../components/StudentClassView";

export default async function ClassDetailPage({ params }: { params: { classId: string } }) {
  const supabase = await createClient();
  const { classId } = params;

  // 1. User Authorization
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return redirect('/login');
  }

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <Alert variant="destructive">
              <Shield className="h-4 w-4" />
              <AlertTitle>Profile Not Found</AlertTitle>
              <AlertDescription>
                Unable to load your profile information.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 2. Get Class Info
  const { data: classInfo, error: classError } = await supabase
    .from('classes')
    .select('id, name, description, teacher_id')
    .eq('id', classId)
    .single();

  if (classError || !classInfo) {
    notFound();
  }

  // 3. Determine User Access Rights
  const isTeacherOwner = profile.role === 'GURU' && classInfo.teacher_id === user.id;
  const isAdmin = profile.role === 'ADMIN';
  const canManage = isTeacherOwner || isAdmin;

  const { data: enrollment } = await supabase
    .from('enrollments')
    .select('id')
    .eq('class_id', classId)
    .eq('student_id', user.id)
    .maybeSingle();
  const isEnrolledStudent = profile.role === 'SISWA' && !!enrollment;

  // Access Denied UI
  if (!canManage && !isEnrolledStudent) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <Alert variant="destructive" className="mb-6">
              <Shield className="h-4 w-4" />
              <AlertTitle>Access Denied</AlertTitle>
              <AlertDescription>
                You are not authorized to view this class.
              </AlertDescription>
            </Alert>
            <Button asChild>
              <Link href="/dashboard">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // 4. Get common data needed by all roles
  const { data: materials } = await supabase
    .from('materials')
    .select('*')
    .eq('class_id', classId)
    .order('created_at', { ascending: false });

  // 5. Prepare view component based on role
  let viewComponent;
  if (canManage) {
    // Teacher/Admin specific data
    const { data: initialSessions } = await supabase
      .from('attendance_sessions')
      .select('*')
      .eq('class_id', classId)
      .order('created_at', { ascending: false });

    viewComponent = (
      <TeacherClassView 
        classInfo={classInfo} 
        materials={materials || []}
        initialSessions={initialSessions || []}
      />
    );
  } else if (isEnrolledStudent) {
    // Student specific data
    const now = new Date().toISOString();
    const { data: activeSession } = await supabase
      .from('attendance_sessions')
      .select('id, title, expires_at')
      .eq('class_id', classId)
      .gt('expires_at', now)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    let hasAttended = false;
    if (activeSession) {
      const { data: attendanceRecord } = await supabase
        .from('attendance_records')
        .select('id')
        .eq('session_id', activeSession.id)
        .eq('student_id', user.id)
        .maybeSingle();
      hasAttended = !!attendanceRecord;
    }

    const { data: submissions } = await supabase
      .from('submissions')
      .select('id, material_id, file_url, grade, feedback')
      .eq('student_id', user.id);

    viewComponent = (
      <StudentClassView
        user={user}
        classInfo={classInfo}
        materials={materials || []}
        activeSession={activeSession || null}
        hasAttended={hasAttended}
        submissions={submissions || []}
      />
    );
  }

  // Get additional stats for header
  const [{ count: materialCount }, { count: studentCount }] = await Promise.all([
    supabase.from('materials').select('*', { count: 'exact', head: true }).eq('class_id', classId),
    supabase.from('enrollments').select('*', { count: 'exact', head: true }).eq('class_id', classId)
  ]);

  // 6. Render Page
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
            <div className="flex-1 space-y-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <BookOpen className="w-6 h-6 text-primary" />
                </div>
                <Badge variant={canManage ? "default" : "secondary"}>
                  {canManage ? (isAdmin ? 'Admin' : 'Teacher') : 'Student'}
                </Badge>
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">{classInfo.name}</h1>
                <p className="text-lg text-muted-foreground mt-2">{classInfo.description}</p>
              </div>
            </div>
            
            {/* Stats */}
            <div className="flex gap-4">
              <Card className="text-center min-w-[100px]">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-primary/10 rounded-lg mx-auto mb-2">
                    <BookOpen className="w-4 h-4 text-primary" />
                  </div>
                  <div className="text-2xl font-bold">{materialCount || 0}</div>
                  <div className="text-xs text-muted-foreground">Materials</div>
                </CardContent>
              </Card>
              <Card className="text-center min-w-[100px]">
                <CardContent className="pt-4 pb-4">
                  <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-lg mx-auto mb-2">
                    <Users className="w-4 h-4 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold">{studentCount || 0}</div>
                  <div className="text-xs text-muted-foreground">Students</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {viewComponent}
      </div>
    </div>
  );
}
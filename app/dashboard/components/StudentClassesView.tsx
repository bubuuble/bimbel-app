// FILE: app/dashboard/components/StudentClassesView.tsx
'use client'

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState, useCallback } from "react";
import type { UserProfile } from "@/lib/types";
import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { enrollInClass, unenrollFromClass, type EnrollState } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Loader2, UserCheck, GraduationCap, BookOpen } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

type AvailableClass = {
  id: string;
  name: string;
  description: string | null;
  profiles: { name: string | null; } | null;
};

type EnrolledClass = {
  classes: { id: string, name: string } | null;
};

function EnrollButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {pending ? 'Mendaftar...' : 'Daftar Kelas'}
    </Button>
  );
}

function UnenrollButton() {
  const { pending } = useFormStatus();
  return (
    <Button 
      type="submit" 
      disabled={pending} 
      variant="outline" 
      size="sm"
      className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
    >
      {pending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {pending ? '...' : 'Keluar'}
    </Button>
  );
}

function ClassCard({ classInfo, onEnrollSuccess }: { classInfo: AvailableClass, onEnrollSuccess: () => void }) {
  const initialState: EnrollState = null;
  const [state, formAction] = useActionState(enrollInClass, initialState);
  
  useEffect(() => {
    if (state?.success) { 
      alert(state.success);
      onEnrollSuccess(); 
    }
    if (state?.error) { 
      alert(state.error);
    }
  }, [state, onEnrollSuccess]);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          {classInfo.name}
        </CardTitle>
        <CardDescription className="flex items-center gap-1">
          <UserCheck className="h-4 w-4" />
          Guru: {classInfo.profiles?.name || 'N/A'}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col">
        <p className="text-sm text-muted-foreground mb-4 flex-1">
          {classInfo.description || 'Tidak ada deskripsi.'}
        </p>
        <form action={formAction} className="mt-auto">
          <input type="hidden" name="classId" value={classInfo.id} />
          <EnrollButton />
          {state?.error && (
            <Alert className="mt-2" variant="destructive">
              <AlertDescription className="text-sm">{state.error}</AlertDescription>
            </Alert>
          )}
        </form>
      </CardContent>
    </Card>
  );
}

export default function StudentClassesView({ userProfile }: { userProfile: Pick<UserProfile, 'id'> }) {
  const [availableClasses, setAvailableClasses] = useState<AvailableClass[]>([]);
  const [enrolledClasses, setEnrolledClasses] = useState<EnrolledClass[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchData = useCallback(async () => {
    setLoading(true);
    
    const { data: enrolledData } = await supabase
      .from('enrollments')
      .select(`classes!inner(id, name)`)
      .eq('student_id', userProfile.id)
      .returns<EnrolledClass[]>();
    
    if (enrolledData) setEnrolledClasses(enrolledData);
    const enrolledClassIds = enrolledData?.map(e => e.classes?.id).filter(Boolean) || [];

    const { data: allData } = await supabase
      .from('classes')
      .select(`id, name, description, profiles(name)`)
      .returns<AvailableClass[]>();

    if (allData) {
      const available = allData.filter(c => !enrolledClassIds.includes(c.id));
      setAvailableClasses(available);
    }
    
    setLoading(false);
  }, [supabase, userProfile.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading kelas...</span>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="flex items-center gap-3 mb-8">
        <GraduationCap className="h-8 w-8" />
        <h1 className="text-3xl font-bold">Kelas Saya & Pendaftaran</h1>
      </div>
      
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Kelas yang Diikuti
          </CardTitle>
        </CardHeader>
        <CardContent>
          {enrolledClasses.length > 0 ? (
            <div className="space-y-3">
              {enrolledClasses.map((enrollment) => {
                if (!enrollment.classes) return null;
                return (
                  <div key={enrollment.classes.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <Link 
                      href={`/dashboard/class/${enrollment.classes.id}`}
                      className="font-medium text-primary hover:underline"
                    >
                      {enrollment.classes.name}
                    </Link>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="border-destructive text-destructive hover:bg-destructive hover:text-destructive-foreground"
                        >
                          Keluar
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Konfirmasi Keluar Kelas</AlertDialogTitle>
                          <AlertDialogDescription>
                            Anda yakin ingin keluar dari kelas "{enrollment.classes.name}"?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Batal</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={async () => {
                              const formData = new FormData();
                              formData.append('classId', enrollment.classes!.id);
                              await unenrollFromClass(formData);
                              fetchData();
                            }}
                            className="bg-destructive hover:bg-destructive/90"
                          >
                            Keluar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-muted-foreground">Anda belum terdaftar di kelas manapun.</p>
          )}
        </CardContent>
      </Card>

      <div className="mb-4">
        <h2 className="text-2xl font-semibold mb-2">Kelas yang Tersedia</h2>
        <Separator />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {availableClasses.length > 0 ? (
          availableClasses.map(c => (
            <ClassCard key={c.id} classInfo={c} onEnrollSuccess={fetchData} />
          ))
        ) : (
          <div className="col-span-full">
            <Card>
              <CardContent className="pt-6">
                <p className="text-center text-muted-foreground">
                  Tidak ada kelas lain yang tersedia untuk pendaftaran saat ini.
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
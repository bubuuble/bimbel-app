// FILE: app/dashboard/components/TeacherClassesView.tsx

'use client'

import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { useEffect, useState, useRef, useCallback } from "react";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createClass, type ClassFormState } from "@/lib/actions";
import type { UserProfile } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Plus, BookOpen } from "lucide-react";

type ClassData = {
  id: string;
  name: string;
  description: string | null;
};

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Creating...
        </>
      ) : (
        <>
          <Plus className="mr-2 h-4 w-4" />
          Create Class
        </>
      )}
    </Button>
  );
}

export default function TeacherClassesView({ userProfile }: { userProfile: Pick<UserProfile, 'id'> }) {
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState(createClass, null);
  
  const fetchClasses = useCallback(async () => {
    const { data } = await supabase
      .from('classes')
      .select('id, name, description')
      .eq('teacher_id', userProfile.id)
      .order('name', { ascending: true });
    if (data) setClasses(data);
    setLoading(false);
  }, [supabase, userProfile.id]);

  useEffect(() => {
    fetchClasses();
  }, [fetchClasses]);

  useEffect(() => {
    if (state?.success) {
      alert(state.success); // Replace with toast
      formRef.current?.reset();
      fetchClasses();
    }
    if (state?.error) {
      alert(state.error); // Replace with toast
    }
  }, [state, fetchClasses]);
  
  return (
    <div className="container mx-auto max-w-4xl p-6 space-y-8">
      <div className="flex items-center gap-2">
        <BookOpen className="h-8 w-8" />
        <h1 className="text-3xl font-bold">Manajemen Kelas</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Buat Kelas Baru</CardTitle>
          <CardDescription>
            Buat kelas baru untuk mulai mengajar dan mengelola siswa
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form ref={formRef} action={formAction} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="className">Nama Kelas</Label>
              <Input 
                type="text" 
                name="className" 
                id="className" 
                placeholder="Masukkan nama kelas"
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Textarea 
                name="description" 
                id="description" 
                placeholder="Deskripsi kelas (opsional)"
                rows={3}
              />
            </div>
            <SubmitButton />
          </form>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Kelas Anda</h2>
        {loading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading classes...</span>
          </div>
        ) : classes.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {classes.map(c => (
              <Card key={c.id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">
                    <Link 
                      href={`/dashboard/class/${c.id}`} 
                      className="hover:text-primary transition-colors"
                    >
                      {c.name}
                    </Link>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {c.description || 'Tidak ada deskripsi'}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-8 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">Belum ada kelas</h3>
              <p className="text-muted-foreground">
                Anda belum membuat kelas. Mulai dengan membuat kelas pertama Anda!
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
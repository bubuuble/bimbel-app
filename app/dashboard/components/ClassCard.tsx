// src/app/dashboard/siswa/ClassCard.tsx
'use client'
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { enrollInClass, type EnrollState } from '@/lib/actions';
import { useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User } from "lucide-react";

// Tipe data untuk properti komponen
type ClassInfo = {
  id: string;
  name: string;
  description: string | null;
  profiles: { name: string | null } | null;
};

function EnrollButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? 'Enrolling...' : 'Enroll'}
    </Button>
  );
}

// Ini adalah komponen untuk satu kartu kelas
export default function ClassCard({ classInfo }: { classInfo: ClassInfo }) {
  const initialState: EnrollState = null;
  const [state, formAction] = useActionState(enrollInClass, initialState);

  // Tampilkan alert saat ada hasil dari server action
  useEffect(() => {
    if (state?.success) alert(state.success);
    if (state?.error) alert(state.error);
  }, [state]);

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-lg">{classInfo.name}</CardTitle>
        <CardDescription className="flex items-center gap-2">
          <User className="h-4 w-4" />
          <span>Teacher: {classInfo.profiles?.name || 'N/A'}</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          {classInfo.description || 'No description available.'}
        </p>
      </CardContent>
      <CardFooter>
        <form action={formAction} className="w-full">
          <input type="hidden" name="classId" value={classInfo.id} />
          <EnrollButton />
        </form>
      </CardFooter>
    </Card>
  );
}
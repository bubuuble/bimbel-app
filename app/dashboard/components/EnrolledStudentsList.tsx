// src/app/dashboard/components/EnrolledStudentsList.tsx
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, UserCheck } from "lucide-react";

type EnrolledStudent = {
  profiles: { id: string; name: string | null; username: string | null; } | null;
};

export default async function EnrolledStudentsList({ classId }: { classId: string }) {
  const supabase = await createClient();

  const { data: enrolledStudents, error } = await supabase
    .from('enrollments')
    .select(`profiles (id, name, username)`)
    .eq('class_id', classId)
    .returns<EnrolledStudent[]>();

  if (error) {
    console.error("Error fetching enrolled students:", error);
    return (
      <Card className="mt-8">
        <CardContent className="pt-6">
          <p className="text-destructive">Error loading student list.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-fit sticky top-4">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Users className="h-4 w-4" />
          Siswa Terdaftar
          <Badge variant="secondary" className="ml-auto text-xs">
            {enrolledStudents.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {enrolledStudents.length > 0 ? (
          <div className="space-y-2">
            {enrolledStudents.map((enrollment, index) => {
              const student = enrollment.profiles;
              if (!student) return null;
              return (
                <div key={student.id} className="flex items-center gap-2 p-2 rounded-md border bg-card hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-medium">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{student.name}</p>
                    <p className="text-xs text-muted-foreground truncate">@{student.username}</p>
                  </div>
                  <UserCheck className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-6">
            <Users className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
            <p className="text-xs text-muted-foreground">Belum ada siswa terdaftar</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
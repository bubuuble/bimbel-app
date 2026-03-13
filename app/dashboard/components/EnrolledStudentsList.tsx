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

  if (error || !enrolledStudents) {
    console.error("Error fetching enrolled students:", error);
    return (
      <div className="rounded-2xl border border-rose-100 bg-rose-50 mt-8">
        <div className="p-6 text-rose-700 font-medium text-sm">Error loading student list.</div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden sticky top-4">
      <div className="p-4 sm:p-5 border-b border-slate-50 flex items-center gap-2 bg-slate-50/30">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-500 shrink-0">
            <Users className="h-4 w-4" />
        </div>
        <h2 className="text-base font-semibold text-slate-800 flex-1">
          Siswa Terdaftar
        </h2>
        <span className="inline-flex items-center justify-center h-6 min-w-[24px] px-2 text-xs font-bold rounded-full bg-slate-100 text-slate-600">
            {enrolledStudents.length}
        </span>
      </div>
      <div className="p-4 sm:p-5 pt-4">
        {enrolledStudents.length > 0 ? (
          <div className="space-y-2">
            {enrolledStudents.map((enrollment, index) => {
              const student = enrollment.profiles;
              if (!student) return null;
              return (
                <div key={student.id} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 bg-white hover:border-indigo-100 transition-colors">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-indigo-50 text-indigo-600 font-bold text-xs shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800 text-sm truncate">{student.name}</p>
                    <p className="text-xs font-medium text-slate-500 truncate">@{student.username}</p>
                  </div>
                  <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-teal-50 text-teal-600">
                      <UserCheck className="h-3 w-3" />
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 mx-auto mb-3">
                <Users className="h-6 w-6 text-slate-400" />
            </div>
            <p className="text-sm font-medium text-slate-500">Belum ada siswa terdaftar</p>
          </div>
        )}
      </div>
    </div>
  );
}
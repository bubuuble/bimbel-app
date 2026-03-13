// FILE: app/dashboard/components/TasksToGradeList.tsx
import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ListTodo, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

type UngradedTask = {
    id: string;
    title: string;
    class_id: string;
    submission_count: number;
};

export default async function TasksToGradeList() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    // Query untuk mengambil tugas dengan submission yang belum dinilai
    const { data: tasks } = await supabase.rpc('get_tasks_to_grade', { p_teacher_id: user.id });

    if (!tasks || tasks.length === 0) {
        return (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-5 sm:p-6 border-b border-slate-50 bg-slate-50/50">
                    <h3 className="flex items-center gap-2 text-lg font-bold text-slate-800 tracking-tight">
                       <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                           <ListTodo className="h-4 w-4" />
                       </div>
                       Perlu Dinilai
                    </h3>
                </div>
                <div className="p-5 sm:p-6 py-8">
                    <p className="text-sm font-medium text-slate-500 text-center">Kerja bagus! Tidak ada tugas yang perlu dinilai saat ini.</p>
                </div>
            </div>
        );
    }
    return (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-slate-50 bg-slate-50/50">
                <h3 className="flex items-center gap-2 text-lg font-bold text-slate-800 tracking-tight">
                   <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600">
                       <ListTodo className="h-4 w-4" />
                   </div>
                   Perlu Dinilai
                </h3>
                <p className="text-sm text-slate-500 mt-2">Tugas dengan jawaban baru yang belum Anda nilai.</p>
            </div>
            <div className="p-5 sm:p-6">
                <ul className="space-y-3">
                    {tasks.map((task: UngradedTask) => (
                        <li key={task.id} className="group flex items-center justify-between p-3 sm:p-4 rounded-xl hover:bg-slate-50 border border-transparent hover:border-slate-100 transition-all">
                            <div>
                                <Link href={`/dashboard/class/${task.class_id}/task/${task.id}`} className="font-semibold text-slate-800 group-hover:text-indigo-600 transition-colors">
                                    {task.title}
                                </Link>
                                <div className="mt-2">
                                    <Badge className="bg-rose-100 hover:bg-rose-100 text-rose-700 border-none font-medium px-2 py-0.5 rounded-md">
                                        {task.submission_count} jawaban baru
                                    </Badge>
                                </div>
                            </div>
                            <Link href={`/dashboard/class/${task.class_id}/task/${task.id}`} className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white border border-slate-200 text-slate-400 group-hover:bg-indigo-600 group-hover:border-indigo-600 group-hover:text-white transition-all shadow-sm">
                                <ArrowRight className="h-4 w-4" />
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}
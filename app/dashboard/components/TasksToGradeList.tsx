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
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><ListTodo className="h-5 w-5" /> Perlu Dinilai</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">Kerja bagus! Tidak ada tugas yang perlu dinilai saat ini.</p>
                </CardContent>
            </Card>
        );
    }
    
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><ListTodo className="h-5 w-5" /> Perlu Dinilai</CardTitle>
                <CardDescription>Tugas dengan jawaban baru yang belum Anda nilai.</CardDescription>
            </CardHeader>
            <CardContent>
                <ul className="space-y-4">
                    {tasks.map((task: UngradedTask) => (
                        <li key={task.id} className="flex items-center justify-between">
                            <div>
                                <Link href={`/dashboard/class/${task.class_id}/task/${task.id}`} className="font-medium hover:underline">
                                    {task.title}
                                </Link>
                                <p className="text-sm text-muted-foreground">
                                    <Badge variant="destructive">{task.submission_count} jawaban baru</Badge>
                                </p>
                            </div>
                            <Link href={`/dashboard/class/${task.class_id}/task/${task.id}`}>
                                <ArrowRight className="h-5 w-5 text-muted-foreground" />
                            </Link>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    );
}
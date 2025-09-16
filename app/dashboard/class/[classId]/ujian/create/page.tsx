// FILE: app/dashboard/class/[classId]/ujian/create/page.tsx

import { createClient } from "@/lib/supabase/server";
import CreateTestForm from "@/app/dashboard/components/CreateTestForm";
import { notFound } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function CreateTestPage({ params }: { params: { classId: string } }) {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    const { data: classInfo } = await supabase
        .from('classes')
        .select('id, name, teacher_id')
        .eq('id', params.classId)
        .single();

    if (!classInfo || classInfo.teacher_id !== user?.id) {
        notFound();
    }
    
    return (
        <div className="max-w-2xl mx-auto py-8 px-4">
             <Link href={`/dashboard/class/${classInfo.id}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
                <ArrowLeft className="w-4 h-4" />
                Kembali ke Kelas {classInfo.name}
            </Link>
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl">Buat Ujian Baru</CardTitle>
                    <CardDescription>Masukkan detail dasar untuk ujian. Anda akan diarahkan untuk menambah soal setelah ini.</CardDescription>
                </CardHeader>
                <CardContent>
                    <CreateTestForm classId={classInfo.id} />
                </CardContent>
            </Card>
        </div>
    );
}
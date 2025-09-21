// FILE: app/dashboard/class/[classId]/ujian/[testId]/edit/page.tsx

import { createClient } from "@/lib/supabase/server";
import QuestionEditor from "@/app/dashboard/components/QuestionEditor";
import DeleteTestButton from "@/app/dashboard/components/DeleteTestButton"; // <-- Impor komponen baru
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function EditTestPage({ params }: { params: Promise<{ classId: string, testId: string }> }) {
    
    const { classId, testId } = await params;
    const supabase = await createClient();
    
    const { data: testInfo } = await supabase
        .from('tests')
        .select('*, classes(name), total_questions')
        .eq('id', testId)
        .single();
    if (!testInfo) notFound();
    
    return (
        <div className="container py-8 space-y-6">
            <div className="flex justify-between items-center">
                <Link href={`/dashboard/class/${classId}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="w-4 h-4" />
                    Kembali ke Kelas {testInfo.classes?.name}
                </Link>
                {/* [PERBAIKAN] Gunakan Client Component yang sudah dibuat */}
                <DeleteTestButton testId={testId} classId={classId} />
            </div>
            <div>
                <h1 className="text-3xl font-bold">Editor Soal: {testInfo.title}</h1>
                <p className="text-muted-foreground">Tambah, hapus, dan atur soal untuk ujian ini.</p>
            </div>
            
            <QuestionEditor testId={testId} testInfo={testInfo} />
        </div>
    );
}
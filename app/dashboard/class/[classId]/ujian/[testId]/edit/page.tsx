// FILE: app/dashboard/class/[classId]/ujian/[testId]/edit/page.tsx

import { createClient } from "@/lib/supabase/server";
import QuestionEditor from "@/app/dashboard/components/QuestionEditor"; // Pastikan path benar
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

// Hapus 'type Question' dari import jika tidak digunakan lagi di sini

export default async function EditTestPage({ params }: { params: Promise<{ classId: string, testId: string }> }) {
    
    // Kita tetap butuh ini untuk mengambil info judul ujian
    const { classId, testId } = await params;
    const supabase = await createClient();
    
    const { data: testInfo } = await supabase.from('tests').select('*, classes(name)').eq('id', testId).single();
    if (!testInfo) notFound();

    // !!! PERHATIKAN: KODE UNTUK MENGAMBIL 'questions' DIHAPUS DARI SINI !!!

    
    return (
        // [PERBAIKAN] Menggunakan class 'container' yang sudah kita definisikan di globals.css
        // dan menambahkan padding vertikal 'py-8' serta 'space-y-6' untuk jarak yang lebih baik.
        <div className="container py-8 space-y-6">
            <Link href={`/dashboard/class/${classId}`} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-4 h-4" />
                Kembali ke Kelas {testInfo.classes?.name}
            </Link>
            <div>
                <h1 className="text-3xl font-bold">Editor Soal: {testInfo.title}</h1>
                <p className="text-muted-foreground">Tambah, hapus, dan atur soal untuk ujian ini.</p>
            </div>
            
            <QuestionEditor testId={testId} />
        </div>
    );
}
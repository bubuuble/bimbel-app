import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import UjianDashboardClient from "@/app/dashboard/components/UjianDashboardClient";
import type { Test } from "@/lib/types";

type TestWithClass = Test & {
  classes: { name: string } | null;
};

// Tipe sederhana untuk daftar kelas di modal
type TeacherClass = {
    id: string;
    name: string;
}

export default async function UjianDashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return redirect('/login');
    }

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    if (!profile) return notFound();
    
    let tests: TestWithClass[] = [];
    let teacherClasses: TeacherClass[] = []; // [PERUBAHAN] Variabel baru

    if (profile.role === 'GURU') {
        // Ambil data ujian
        const { data: testData, error } = await supabase
        .from('tests')
        .select(`*, classes ( name )`)
        .eq('teacher_id', user.id) // <-- Filter ini penting
        .order('created_at', { ascending: false });
    
    // [DEBUG 3] Cek hasil fetch data di terminal server
    console.log("Data ujian yang diambil untuk guru:", testData);
    if (error) console.error("Error saat fetch ujian guru:", error);

    if (testData) tests = testData;

        // [PERUBAHAN] Ambil juga daftar kelas yang diajar guru ini
        const { data: classData } = await supabase.from('classes').select('id, name').eq('teacher_id', user.id).order('name');
        if (classData) teacherClasses = classData;

    } else if (profile.role === 'SISWA') {
        const { data } = await supabase.rpc('get_student_tests', { p_student_id: user.id });
        if (data) tests = data as TestWithClass[];
    }

    return (
        <div className="space-y-6 sm:space-y-8">
            <UjianDashboardClient 
                initialTests={tests}
                userRole={profile.role}
                teacherClasses={teacherClasses} // <-- Kirim data kelas ke client
            />
        </div>
    );
}
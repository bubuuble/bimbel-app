'use client'

import { useState } from 'react';
import type { Test } from '@/lib/types';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ClipboardList, Plus, Eye, Play } from 'lucide-react';
import CreateTestModal from './CreateTestModal'; // <-- [PERUBAHAN] Impor modal baru

type TestWithClass = Test & {
  classes: { name: string } | null;
};

type TeacherClass = {
    id: string;
    name: string;
};

interface Props {
    initialTests: TestWithClass[];
    userRole: 'GURU' | 'SISWA' | 'ADMIN';
    teacherClasses: TeacherClass[]; // <-- [PERUBAHAN] Terima prop baru
}

export default function UjianDashboardClient({ initialTests, userRole, teacherClasses }: Props) {
    const [tests] = useState(initialTests);
    // [PERUBAHAN] State untuk mengontrol visibilitas modal
    const [isModalOpen, setIsModalOpen] = useState(false);

    return (
        <>
            <div className="space-y-6">
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2"><ClipboardList className="h-8 w-8" />Ujian Tryout</h1>
                        <p className="text-muted-foreground">{userRole === 'GURU' ? "Kelola semua ujian yang telah Anda buat." : "Daftar ujian yang tersedia untuk Anda."}</p>
                    </div>
                    {userRole === 'GURU' && (
                        // [PERUBAHAN] Ganti Link menjadi Button yang membuka modal
                        <Button onClick={() => setIsModalOpen(true)}>
                            <Plus className="h-4 w-4 mr-2" />
                            Buat Ujian Baru
                        </Button>
                    )}
                </div>
                
                {tests.length === 0 ? (
                    <Card><CardContent className="py-12 text-center"><p className="text-muted-foreground">Tidak ada ujian yang ditemukan.</p></CardContent></Card>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {tests.map(test => (
                            <Card key={test.id} className="flex flex-col">
                                <CardHeader><CardTitle>{test.title}</CardTitle><CardDescription>{test.classes?.name || 'Kelas tidak diketahui'}</CardDescription></CardHeader>
                                <CardContent className="flex-grow"><Badge variant="outline">{test.duration_minutes} Menit</Badge></CardContent>
                                <CardFooter>
                                    {userRole === 'GURU' ? (
                                        <Button asChild className="w-full"><Link href={`/dashboard/class/${test.class_id}/ujian/${test.id}/edit`}><Eye className="h-4 w-4 mr-2"/>Kelola Soal</Link></Button>
                                    ) : (
                                        <Button asChild className="w-full">
                                            <Link href={`/dashboard/class/${test.class_id}/ujian/${test.id}/start`}>
                                                <Play className="h-4 w-4 mr-2"/>Mulai Ujian
                                            </Link>
                                        </Button>
                                    )}
                                </CardFooter>
                            </Card>
                        ))}
                    </div>
                )}
            </div>
            
            {/* [PERUBAHAN] Render komponen modal di sini */}
            <CreateTestModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                teacherClasses={teacherClasses}
            />
        </>
    );
}
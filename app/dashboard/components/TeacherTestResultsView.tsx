// FILE: app/dashboard/components/TeacherTestResultsView.tsx
'use client'

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FilePenLine } from "lucide-react"; // Ikon untuk tombol nilai

type Props = {
  submissions: any[];
  testInfo: {
    id: string;
    title: string;
    has_essays: boolean;
  };
}

export default function TeacherTestResultsView({ submissions, testInfo }: Props) {
  const router = useRouter();

  const handleRowClick = (submissionId: string) => {
    // Arahkan ke halaman detail jawaban siswa
    router.push(`./hasil/${submissionId}`);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between">
        <div>
            <CardTitle>Peringkat Siswa</CardTitle>
            <CardDescription>Daftar siswa yang telah menyelesaikan ujian. Klik baris untuk melihat detail.</CardDescription>
        </div>
        {/* --- [PERBAIKAN UTAMA DI SINI] --- */}
        {/* Tombol ini akan muncul di pojok kanan atas jika ada soal esai */}
        {testInfo.has_essays && (
            <Button asChild>
                {/* Link ini mengarah ke halaman penilaian esai kolektif */}
                <Link href={`./hasil/grade-essays`}>
                    <FilePenLine className="h-4 w-4 mr-2" />
                    Nilai Jawaban Esai
                </Link>
            </Button>
        )}
      </CardHeader>
      <CardContent>
        {submissions.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Belum ada siswa yang menyelesaikan ujian ini.</p>
        ) : (
            <div className="border rounded-lg">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-[50px]">Peringkat</TableHead>
                            <TableHead>Nama Siswa</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Tanggal Selesai</TableHead>
                            <TableHead className="text-right">Skor</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                    {submissions.map((sub, index) => (
                        <TableRow 
                            key={sub.id} 
                            onClick={() => handleRowClick(sub.id)}
                            className="cursor-pointer hover:bg-muted/50"
                        >
                        <TableCell className="font-medium text-center">{index + 1}</TableCell>
                        <TableCell>
                            <div className="font-medium">{sub.profiles.name || sub.profiles.username}</div>
                            <div className="text-sm text-muted-foreground">@{sub.profiles.username}</div>
                        </TableCell>
                        <TableCell>
                            <Badge variant={sub.status === 'COMPLETED' ? 'default' : 'secondary'}>
                            {sub.status === 'COMPLETED' ? 'Selesai' : 'Berlangsung'}
                            </Badge>
                        </TableCell>
                        <TableCell>
                            {sub.completed_at ? new Date(sub.completed_at).toLocaleString('id-ID') : '-'}
                        </TableCell>
                        <TableCell className="text-right font-bold text-lg text-blue-600">
                            {sub.total_score ?? '-'}
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </div>
        )}
      </CardContent>
    </Card>
  )
}
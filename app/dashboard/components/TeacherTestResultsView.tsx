// FILE: app/dashboard/components/TeacherTestResultsView.tsx
'use client'

import { useRouter } from "next/navigation";
import Link from "next/link";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FilePenLine } from "lucide-react"; // Ikon untuk tombol nilai
import { cn } from "@/lib/utils";

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
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
            <h3 className="text-lg font-bold text-slate-800 tracking-tight">Peringkat Siswa</h3>
            <p className="text-sm text-slate-500 mt-1">Daftar siswa yang telah menyelesaikan ujian. Klik baris untuk melihat detail.</p>
        </div>
        {/* --- [PERBAIKAN UTAMA DI SINI] --- */}
        {/* Tombol ini akan muncul di pojok kanan atas jika ada soal esai */}
        {testInfo.has_essays && (
            <Button asChild className="rounded-xl h-10 w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all shadow-sm">
                {/* Link ini mengarah ke halaman penilaian esai kolektif */}
                <Link href={`./hasil/grade-essays`}>
                    <FilePenLine className="h-4 w-4 mr-2" />
                    Nilai Jawaban Esai
                </Link>
            </Button>
        )}
      </div>
      <div className="p-0 sm:p-6">
        {submissions.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-400 mb-4">
                <FilePenLine className="h-6 w-6" />
              </div>
              <p className="text-slate-500 font-medium">Belum ada siswa yang menyelesaikan ujian ini.</p>
            </div>
        ) : (
            <div className="overflow-x-auto border-t sm:border border-slate-100 sm:rounded-xl">
                <Table>
                    <TableHeader className="bg-slate-50/80">
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="w-[60px] text-center font-semibold text-slate-600">No</TableHead>
                            <TableHead className="font-semibold text-slate-600">Nama Siswa</TableHead>
                            <TableHead className="font-semibold text-slate-600">Status</TableHead>
                            <TableHead className="font-semibold text-slate-600">Selesai</TableHead>
                            <TableHead className="text-right font-semibold text-slate-600 pr-6">Skor</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                    {submissions.map((sub, index) => (
                        <TableRow 
                            key={sub.id} 
                            onClick={() => handleRowClick(sub.id)}
                            className="cursor-pointer hover:bg-indigo-50/50 transition-colors border-slate-100"
                        >
                        <TableCell className="font-medium text-center text-slate-500">{index + 1}</TableCell>
                        <TableCell>
                            <div className="font-bold text-slate-800">{sub.profiles.name || sub.profiles.username}</div>
                            <div className="text-xs text-slate-500 mt-0.5">@{sub.profiles.username}</div>
                        </TableCell>
                        <TableCell>
                            <Badge className={cn("rounded-md border-none font-medium px-2.5 py-1", sub.status === 'COMPLETED' ? "bg-teal-50 text-teal-700" : "bg-amber-50 text-amber-700")}>
                                {sub.status === 'COMPLETED' ? 'Selesai' : 'Berlangsung'}
                            </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-slate-600">
                            {sub.completed_at ? new Date(sub.completed_at).toLocaleString('id-ID', {day: 'numeric', month: 'short', hour: '2-digit', minute:'2-digit'}) : '-'}
                        </TableCell>
                        <TableCell className="text-right pr-6">
                            <span className="font-bold text-lg text-indigo-600">{sub.total_score ?? '-'}</span>
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
            </div>
        )}
      </div>
    </div>
  )
}
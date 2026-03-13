'use client'
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2 } from "lucide-react";
import ExportButton from "./ExportButton";

type SessionInfo = { 
  session_id: string; 
  session_title: string | null; 
  session_created_at: string; 
  class_name: string; 
  teacher_name: string | null; 
};

type ReportRow = { 
  student_name: string | null; 
  status: string; 
};

export default function AdminAttendanceReport({ initialSessions }: { initialSessions: SessionInfo[] }) {
    const [sessions, setSessions] = useState(initialSessions);
    const [selectedSessionReport, setSelectedSessionReport] = useState<ReportRow[]>([]);
    const [isReportLoading, setIsReportLoading] = useState(false);
    const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
    const supabase = createClient();

    const handleSessionClick = async (sessionId: string) => {
        setIsReportLoading(true);
        setSelectedSessionId(sessionId);
        setSelectedSessionReport([]);
        const { data, error } = await supabase.rpc('get_session_attendance_report', { p_session_id: sessionId });
        if (error) alert(`Error loading report: ${error.message}`);
        else if (data) setSelectedSessionReport(data as ReportRow[]);
        setIsReportLoading(false);
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-1 rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-16rem)] min-h-[500px]">
                <div className="px-6 py-4 border-b border-slate-50 bg-slate-50/50">
                    <h2 className="text-sm font-semibold text-slate-700">Pilih Sesi</h2>
                </div>
                <div className="flex-1 p-4 overflow-hidden">
                    <ScrollArea className="h-full pr-4">
                        <div className="space-y-2">
                            {sessions.map(s => (
                                <button
                                    key={s.session_id}
                                    onClick={() => handleSessionClick(s.session_id)}
                                    className={`w-full text-left p-4 rounded-xl transition-all duration-200 border ${
                                        selectedSessionId === s.session_id 
                                        ? "bg-indigo-50 border-indigo-200 shadow-sm ring-1 ring-indigo-500/10" 
                                        : "bg-white border-slate-100 hover:border-indigo-100 hover:bg-slate-50"
                                    }`}
                                >
                                    <div className={`font-semibold text-sm ${selectedSessionId === s.session_id ? "text-indigo-900" : "text-slate-700"}`}>
                                        {s.session_title || `Sesi ${new Date(s.session_created_at).toLocaleDateString()}`}
                                    </div>
                                    <div className="text-xs text-slate-500 mt-1.5 flex flex-col gap-0.5">
                                        <span><span className="font-medium text-slate-400">Kelas:</span> {s.class_name}</span>
                                        <span><span className="font-medium text-slate-400">Guru:</span> {s.teacher_name}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </ScrollArea>
                </div>
            </div>

            <div className="lg:col-span-2 rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[calc(100vh-16rem)] min-h-[500px]">
                <div className="flex justify-between items-center px-6 py-4 border-b border-slate-50 bg-slate-50/50">
                    <h2 className="text-sm font-semibold text-slate-700">Detail Laporan</h2>
                    {selectedSessionId && selectedSessionReport.length > 0 && (
                        <ExportButton sessionId={selectedSessionId} />
                    )}
                </div>
                <div className="flex-1 p-0 overflow-hidden flex flex-col">
                    {isReportLoading ? (
                        <div className="flex flex-col items-center justify-center flex-1 py-12 text-slate-400">
                            <Loader2 className="h-8 w-8 animate-spin text-indigo-500 mb-4" />
                            <span className="text-sm font-medium">Memuat laporan...</span>
                        </div>
                    ) : selectedSessionReport.length > 0 ? (
                        <ScrollArea className="flex-1">
                            <Table>
                                <TableHeader className="bg-slate-50/50 sticky top-0 z-10 shadow-sm">
                                    <TableRow className="border-b-slate-100 hover:bg-transparent">
                                        <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-500 h-10 px-6">Nama Siswa</TableHead>
                                        <TableHead className="text-xs font-semibold uppercase tracking-wider text-slate-500 h-10 px-6">Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {selectedSessionReport.map((r, i) => (
                                        <TableRow key={`${r.student_name}-${i}`} className="border-b-slate-50 hover:bg-slate-50/50 transition-colors">
                                            <TableCell className="px-6 py-3 font-medium text-slate-700">{r.student_name}</TableCell>
                                            <TableCell className="px-6 py-3">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    r.status.toUpperCase() === 'HADIR' ? 'bg-teal-50 text-teal-700 border border-teal-200' :
                                                    r.status.toUpperCase() === 'IZIN' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                                                    r.status.toUpperCase() === 'SAKIT' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                                                    'bg-rose-50 text-rose-700 border border-rose-200'
                                                }`}>
                                                    {r.status}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </ScrollArea>
                    ) : (
                        <div className="flex flex-col items-center justify-center flex-1 py-16 text-center px-4">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 mb-4">
                                <span className="text-xl text-slate-400">📝</span>
                            </div>
                            <p className="text-sm font-medium text-slate-600">Pilih sesi untuk melihat detail.</p>
                            <p className="text-xs text-slate-400 mt-1">Daftar kehadiran siswa akan muncul di sini.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
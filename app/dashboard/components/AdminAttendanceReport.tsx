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
            <Card className="lg:col-span-1">
                <CardHeader>
                    <CardTitle>Pilih Sesi</CardTitle>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[60vh]">
                        <div className="space-y-2">
                            {sessions.map(s => (
                                <Button
                                    key={s.session_id}
                                    variant={selectedSessionId === s.session_id ? "default" : "outline"}
                                    onClick={() => handleSessionClick(s.session_id)}
                                    className="w-full justify-start h-auto p-3"
                                >
                                    <div className="text-left">
                                        <div className="font-medium">
                                            {s.session_title || `Sesi ${new Date(s.session_created_at).toLocaleDateString()}`}
                                        </div>
                                        <div className="text-xs text-muted-foreground mt-1">
                                            Kelas: {s.class_name} | Guru: {s.teacher_name}
                                        </div>
                                    </div>
                                </Button>
                            ))}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>

            <Card className="lg:col-span-2">
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>Detail Laporan</CardTitle>
                        {selectedSessionId && selectedSessionReport.length > 0 && (
                            <ExportButton sessionId={selectedSessionId} />
                        )}
                    </div>
                </CardHeader>
                <CardContent>
                    {isReportLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-6 w-6 animate-spin mr-2" />
                            <span>Loading report...</span>
                        </div>
                    ) : selectedSessionReport.length > 0 ? (
                        <div className="border rounded-md">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nama Siswa</TableHead>
                                        <TableHead>Status</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {selectedSessionReport.map((r, i) => (
                                        <TableRow key={`${r.student_name}-${i}`}>
                                            <TableCell>{r.student_name}</TableCell>
                                            <TableCell>{r.status}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                        <div className="text-center py-8 text-muted-foreground">
                            Pilih sesi untuk melihat detail.
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
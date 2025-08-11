// FILE: app/dashboard/components/TeacherGlobalAttendanceManager.tsx

'use client'
import { createClient } from "@/lib/supabase/client";
import { useState, useRef } from "react";
import { createAttendanceSession } from "@/lib/actions";
import { useFormStatus } from "react-dom";
import type { AttendanceSession } from "@/lib/types";
import ExportButton from "./ExportButton";
import PaginationControls from "./PaginationControls";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, Users, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type ReportRow = { 
  student_name: string | null; 
  student_username: string | null;
  status: string; 
  submitted_at: string | null;
  notes: string | null;
};
type TeacherClass = { id: string; name: string; };
type SessionWithClass = AttendanceSession & {
  classes: { name: string; } | null;
};

function SubmitButton({ text }: { text: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "Menyimpan..." : text}
    </Button>
  );
}

function SessionRow({ session, onSelect, isSelected }: { session: SessionWithClass, onSelect: () => void, isSelected: boolean }) {
  return (
    <Card 
      className={cn(
        "cursor-pointer transition-colors hover:bg-accent/50",
        isSelected && "ring-2 ring-primary bg-accent"
      )}
      onClick={onSelect}
    >
      <CardContent className="p-4">
        <div className="space-y-2">
          <h4 className="font-semibold text-sm">{session.title}</h4>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Users className="h-3 w-3" />
            <span>{session.classes?.name || 'N/A'}</span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <CalendarDays className="h-3 w-3" />
            <span>{new Date(session.start_time).toLocaleString()}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function TeacherGlobalAttendanceManager({ 
    teacherClasses, 
    initialSessions,
    currentPage,
    totalPages
}: { 
    teacherClasses: TeacherClass[], 
    initialSessions: SessionWithClass[],
    currentPage: number;
    totalPages: number;
}) {
  const supabase = createClient();
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
  const [reportData, setReportData] = useState<ReportRow[]>([]);
  const [isLoadingReport, setIsLoadingReport] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const handleSessionClick = async (sessionId: string) => {
    if (selectedSessionId === sessionId) {
      setSelectedSessionId(null);
      setReportData([]);
      return;
    }
    setIsLoadingReport(true);
    setError(null);
    setSelectedSessionId(sessionId);
    const { data, error } = await supabase.rpc('get_session_attendance_report', { p_session_id: sessionId });
    if (error) {
      setError(`Gagal memuat laporan: ${error.message}`);
      setReportData([]);
    } else {
      setReportData(data);
    }
    setIsLoadingReport(false);
  };
  
  return (
    <div className="container mx-auto p-6 max-w-7xl space-y-6">
      <div className="flex items-center gap-2">
        <Clock className="h-6 w-6" />
        <h1 className="text-3xl font-bold">Manajemen Absensi</h1>
      </div>
      
      {teacherClasses.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Buat Sesi Absensi Baru</CardTitle>
          </CardHeader>
          <CardContent>
            <form 
              ref={formRef} 
              action={async (formData) => {
                await createAttendanceSession(formData);
                formRef.current?.reset();
              }}
              className="space-y-4"
            >
              <div className="space-y-2">
                <Label htmlFor="classId">Pilih Kelas</Label>
                <Select name="classId" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kelas..." />
                  </SelectTrigger>
                  <SelectContent>
                    {teacherClasses.map(c => (
                      <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="sessionTitle">Judul Sesi</Label>
                <Input 
                  type="text" 
                  name="sessionTitle" 
                  placeholder="e.g., Pertemuan 5 - Review" 
                  required 
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="startTime">Waktu Mulai Absensi</Label>
                <Input 
                  type="datetime-local" 
                  name="startTime" 
                  required 
                />
              </div>
              
              <SubmitButton text="Jadwalkan Sesi (Aktif 15 Menit)" />
            </form>
          </CardContent>
        </Card>
      ) : (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Anda harus membuat minimal satu kelas untuk bisa membuat sesi absensi.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Riwayat Sesi</CardTitle>
            </CardHeader>
            <CardContent>
              {initialSessions.length > 0 ? (
                <ScrollArea className="h-[500px] pr-4">
                  <div className="space-y-3">
                    {initialSessions.map(session => (
                      <SessionRow 
                        key={session.id} 
                        session={session} 
                        onSelect={() => handleSessionClick(session.id)}
                        isSelected={selectedSessionId === session.id}
                      />
                    ))}
                  </div>
                </ScrollArea>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  Belum ada sesi yang dibuat.
                </p>
              )}
            </CardContent>
          </Card>
          <PaginationControls currentPage={currentPage} totalPages={totalPages} />
        </div>
        
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Detail Laporan</CardTitle>
                {selectedSessionId && reportData.length > 0 && (
                  <ExportButton sessionId={selectedSessionId} />
                )}
              </div>
            </CardHeader>
            <CardContent>
              {!selectedSessionId ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Pilih sesi untuk melihat laporan kehadiran</p>
                </div>
              ) : isLoadingReport ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                  <p className="mt-4 text-muted-foreground">Memuat laporan...</p>
                </div>
              ) : error ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              ) : reportData.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <AlertCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Belum ada data kehadiran untuk sesi ini</p>
                </div>
              ) : (
                <ScrollArea className="h-[400px]">
                  <div className="space-y-3">
                    {reportData.map((row, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="font-medium">{row.student_name || 'N/A'}</p>
                          <p className="text-sm text-muted-foreground">@{row.student_username || 'N/A'}</p>
                        </div>
                        <div className="text-right">
                          <Badge variant={row.status === 'hadir' ? 'default' : 'secondary'}>
                            {row.status}
                          </Badge>
                          {row.submitted_at && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {new Date(row.submitted_at).toLocaleString()}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
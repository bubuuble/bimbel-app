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
    <div 
      className={cn(
        "cursor-pointer transition-all duration-200 border rounded-xl overflow-hidden bg-white hover:border-indigo-200 hover:shadow-sm",
        isSelected ? "ring-2 ring-indigo-500 border-indigo-200 bg-indigo-50/30" : "border-slate-100"
      )}
      onClick={onSelect}
    >
      <div className="p-4 sm:p-5">
        <div className="space-y-3">
          <h4 className="font-bold text-slate-800 text-sm leading-tight">{session.title}</h4>
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-indigo-50 text-indigo-500">
                <Users className="h-3.5 w-3.5" />
              </div>
              <span className="truncate">{session.classes?.name || 'N/A'}</span>
            </div>
            <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
              <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-teal-50 text-teal-600">
                <CalendarDays className="h-3.5 w-3.5" />
              </div>
              <span>{new Date(session.start_time).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
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
    <div className="space-y-6 sm:space-y-8">
      {/* Header section is now handled by the page wrapper's banner, removing local header */}
      
      {teacherClasses.length > 0 ? (
        <div className="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-5 sm:p-6 border-b border-slate-50 bg-slate-50/30">
            <h2 className="text-base font-semibold text-slate-800">Buat Sesi Absensi Baru</h2>
          </div>
          <div className="p-5 sm:p-6">
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
          </div>
        </div>
      ) : (
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Anda harus membuat minimal satu kelas untuk bisa membuat sesi absensi.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden lg:sticky lg:top-4">
            <div className="p-5 border-b border-slate-50 bg-slate-50/30">
              <h2 className="text-base font-semibold text-slate-800">Riwayat Sesi</h2>
            </div>
            <div className="p-5">
              {initialSessions.length > 0 ? (
                <ScrollArea className="h-[500px] pr-4 -mr-4">
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
                  <div className="flex flex-col items-center justify-center py-12 text-slate-500 bg-slate-50/50 rounded-xl border border-slate-100 border-dashed">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white shadow-sm mb-3">
                        <CalendarDays className="h-6 w-6 text-slate-400" />
                    </div>
                    <p className="font-medium text-sm">Belum ada sesi yang dibuat.</p>
                  </div>
                )}
            </div>
          </div>
          <PaginationControls currentPage={currentPage} totalPages={totalPages} />
        </div>
        
        <div className="lg:col-span-3">
          <div className="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-slate-50 bg-slate-50/30 flex justify-between items-center">
                <h2 className="text-base font-semibold text-slate-800">Detail Laporan</h2>
                {selectedSessionId && reportData.length > 0 && (
                  <ExportButton sessionId={selectedSessionId} />
                )}
            </div>
            <div className="p-0">
              {!selectedSessionId ? (
                <div className="flex flex-col items-center justify-center py-20 px-4 text-center text-slate-500 bg-slate-50/30 m-6 rounded-2xl border border-slate-100 border-dashed">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm mb-4">
                      <Users className="h-8 w-8 text-slate-300" />
                  </div>
                  <p className="font-medium">Pilih sesi untuk melihat laporan detail kehadiran</p>
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
                  <div className="flex flex-col items-center justify-center py-20 px-4 text-center text-slate-500 bg-slate-50/30 m-6 rounded-2xl border border-slate-100 border-dashed">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-sm mb-4">
                        <AlertCircle className="h-8 w-8 text-slate-300" />
                    </div>
                    <p className="font-medium">Belum ada data kehadiran untuk sesi ini</p>
                  </div>
              ) : (
                <ScrollArea className="h-[400px]">
                  <div className="min-w-full">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                      <thead className="bg-slate-50/80 sticky top-0 z-10 backdrop-blur-sm">
                        <tr>
                          <th className="px-6 py-4 font-semibold text-slate-600 text-xs uppercase tracking-wider border-b border-slate-100">Siswa</th>
                          <th className="px-6 py-4 font-semibold text-slate-600 text-xs uppercase tracking-wider border-b border-slate-100 text-right">Status & Waktu</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {reportData.map((row, index) => (
                          <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 font-bold text-xs">
                                  {row.student_name ? row.student_name.charAt(0).toUpperCase() : '?'}
                                </div>
                                <div>
                                  <p className="font-bold text-slate-800">{row.student_name || 'N/A'}</p>
                                  <p className="text-xs font-medium text-slate-500">@{row.student_username || 'N/A'}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex flex-col items-end gap-1.5">
                                <span className={cn(
                                  "inline-flex items-center justify-center px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest rounded-md border",
                                  row.status === 'hadir' ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                                  row.status === 'izin' ? "bg-amber-50 text-amber-700 border-amber-200" :
                                  row.status === 'sakit' ? "bg-blue-50 text-blue-700 border-blue-200" :
                                  "bg-rose-50 text-rose-700 border-rose-200"
                                )}>
                                  {row.status}
                                </span>
                                {row.submitted_at && (
                                  <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {new Date(row.submitted_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                                  </span>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </ScrollArea>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
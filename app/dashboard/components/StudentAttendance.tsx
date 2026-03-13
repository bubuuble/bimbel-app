// FILE: app/dashboard/components/StudentAttendance.tsx (Versi FINAL)

'use client'

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { submitAttendance, type StudentAttendanceState } from "@/lib/actions";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, Clock, UserCheck, CalendarClock, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

function SubmitButton({ status, text, variant = "default" }: { status: string, text: string, variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" }) {
  const { pending } = useFormStatus();
  return (
    <Button 
      type="submit" 
      name="status" 
      value={status} 
      disabled={pending}
      variant={variant}
      className={cn(
        "w-full h-11 rounded-xl font-semibold transition-all",
        variant === "default" && "bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm hover:shadow-md",
        variant === "outline" && "border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
      )}
    >
      {pending ? <span className="animate-pulse">Memproses...</span> : text}
    </Button>
  );
}

type Session = { id: string; title: string | null; expires_at: string };
type ScheduledSession = { id: string; title: string | null; start_time: string };
type Props = {
  classId: string;
  activeSession: Session | null;
  scheduledSession: ScheduledSession | null;
  hasAttended: boolean;
};

export default function StudentAttendance({ classId, activeSession, scheduledSession, hasAttended }: Props) {
  const initialState: StudentAttendanceState = null;
  const [state, formAction] = useActionState(submitAttendance, initialState);
  const [showNotes, setShowNotes] = useState(false);

  useEffect(() => {
    if (state?.success) {
      toast.success("Berhasil", {
        description: state.success,
      });
    }
    if (state?.error) {
      toast.error("Gagal Submit", {
        description: state.error,
      });
    }
  }, [state]);

  // KONDISI 0: Tidak ada sesi sama sekali (baik aktif maupun terjadwal)
  if (!activeSession && !scheduledSession) {
    return (
      <div className="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-50 bg-slate-50/30">
          <h2 className="text-base font-semibold text-slate-800">Absensi</h2>
        </div>
        <div className="p-5 sm:p-6 text-center py-10">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 mx-auto mb-4">
             <Clock className="h-6 w-6 text-slate-400" />
          </div>
          <p className="font-medium text-slate-500 text-sm">
            Tidak ada sesi absensi yang sedang dibuka atau dijadwalkan oleh guru saat ini.
          </p>
        </div>
      </div>
    );
  }

  // Render komponen dalam blok terpisah
  return (
    <div className="space-y-6">
      {/* BLOK 1: Menampilkan Status Sesi Saat Ini (jika ada) */}
      {hasAttended && (
        <div className="rounded-2xl bg-white border border-emerald-100 shadow-sm overflow-hidden text-emerald-950">
          <div className="p-5 sm:p-6 border-b border-emerald-50 bg-emerald-50/50 flex items-center gap-2 text-emerald-600 font-bold">
              <CheckCircle className="h-5 w-5" />
              Status Absensi
          </div>
          <div className="p-5 sm:p-6">
            <div className="flex items-start gap-4 p-4 rounded-xl bg-emerald-50 border border-emerald-100">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <UserCheck className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-emerald-900 mb-1">Berhasil Tercatat</h4>
                <p className="text-sm font-medium text-emerald-700">Terima kasih, Anda sudah melakukan absensi untuk sesi ini.</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {!hasAttended && activeSession && (
        <div className="rounded-2xl bg-white border border-indigo-200 shadow-md ring-4 ring-indigo-50 overflow-hidden relative">
          {/* Animated gradient strip */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 animate-pulse"></div>
          
          <div className="p-5 sm:p-6 border-b border-slate-50 bg-indigo-50/30">
            <h2 className="text-base font-bold text-indigo-700 flex items-center gap-2">
              <Clock className="h-5 w-5 animate-spin-slow shrink-0" />
              Sesi Absensi Terbuka!
            </h2>
          </div>
          <div className="p-5 sm:p-6">
            <div className="space-y-6">
              <div className="bg-slate-50 rounded-xl p-4 border border-slate-100 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">{activeSession.title}</h3>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
                    </span>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
                      Ditutup pada: <span className="text-rose-600">{new Date(activeSession.expires_at).toLocaleTimeString('id-ID', { hour:'2-digit', minute:'2-digit' })}</span>
                    </p>
                  </div>
                </div>
              </div>
              <form action={formAction} className="space-y-5">
                <input type="hidden" name="sessionId" value={activeSession.id} />
                <input type="hidden" name="classId" value={classId} />
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <SubmitButton status="HADIR" text="Saya Hadir" variant="default" />
                  </div>
                  <Button type="button" variant="outline" onClick={() => setShowNotes(!showNotes)} className="flex-1 h-11 rounded-xl border-slate-200 font-semibold text-slate-600 hover:bg-slate-50">
                    Izin / Sakit
                  </Button>
                </div>
                
                {showNotes && (
                  <div className="space-y-4 pt-4 border-t border-slate-100 animate-in fade-in slide-in-from-top-4 duration-300">
                    <div className="space-y-2">
                      <Label htmlFor="notes" className="text-xs font-semibold uppercase tracking-wide text-slate-600">Alasan / Keterangan <span className="text-rose-500">*</span></Label>
                      <Textarea 
                        id="notes" 
                        name="notes" 
                        placeholder="Detail keterangan mengapa tidak bisa hadir..." 
                        className="min-h-[100px] resize-none rounded-xl border-slate-200 focus:border-indigo-400 focus:ring-indigo-400" 
                        required 
                      />
                    </div>
                    <div className="flex gap-3">
                      <div className="flex-1">
                          <SubmitButton status="IZIN" text="Kirim Izin" variant="outline" />
                      </div>
                      <div className="flex-1">
                          <SubmitButton status="SAKIT" text="Kirim Sakit" variant="outline" />
                      </div>
                    </div>
                  </div>
                )}
                {state?.error && (
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-sm font-medium">
                    <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                    <p>{state.error}</p>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      )}

      {/* BLOK 2: Menampilkan Sesi Berikutnya (jika ada), SELALU ditampilkan terlepas dari status Blok 1 */}
      {scheduledSession && (
        <div className="rounded-2xl bg-white border border-blue-100 shadow-sm overflow-hidden relative">
          <div className="p-5 sm:p-6 border-b border-blue-50 bg-blue-50/50 flex items-center gap-2">
              <CalendarClock className="h-5 w-5 text-blue-500" />
              <h2 className="text-base font-bold text-blue-800">Absensi Terjadwal Berikutnya</h2>
          </div>
          <div className="p-5 sm:p-6">
            <div className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                <CalendarClock className="h-5 w-5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 mb-1">{scheduledSession.title}</h4>
                <p className="text-sm font-medium text-slate-600">
                  Akan dimulai pada:<br className="sm:hidden" /> <strong className="text-blue-700 sm:ml-1">{new Date(scheduledSession.start_time).toLocaleString('id-ID', {
                  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                })}</strong>
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
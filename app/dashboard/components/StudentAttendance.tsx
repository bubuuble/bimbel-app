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
import { CheckCircle, Clock, UserCheck, CalendarClock } from "lucide-react";
import { toast } from "sonner";

function SubmitButton({ status, text, variant = "default" }: { status: string, text: string, variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link" }) {
  const { pending } = useFormStatus();
  return (
    <Button 
      type="submit" 
      name="status" 
      value={status} 
      disabled={pending}
      variant={variant}
    >
      {pending ? '...' : text}
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
      <Card>
        <CardHeader>
          <CardTitle>Absensi</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Tidak ada sesi absensi yang sedang dibuka atau dijadwalkan oleh guru saat ini.
          </p>
        </CardContent>
      </Card>
    );
  }

  // Render komponen dalam blok terpisah
  return (
    <div className="space-y-6">
      {/* BLOK 1: Menampilkan Status Sesi Saat Ini (jika ada) */}
      {hasAttended && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              Absensi
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="default" className="bg-green-50 border-green-200">
              <UserCheck className="h-4 w-4 text-green-700" />
              <AlertDescription className="text-green-800 font-medium">
                Terima kasih, Anda sudah melakukan absensi untuk sesi ini.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}

      {!hasAttended && activeSession && (
        <Card className="border-primary ring-2 ring-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <Clock className="h-5 w-5 animate-pulse" />
              Sesi Absensi Dibuka!
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <p className="font-semibold">{activeSession.title}</p>
                <p className="text-sm text-muted-foreground">
                  Sesi akan ditutup pada: {new Date(activeSession.expires_at).toLocaleTimeString('id-ID')}
                </p>
              </div>
              <form action={formAction} className="space-y-4">
                <input type="hidden" name="sessionId" value={activeSession.id} />
                <input type="hidden" name="classId" value={classId} />
                <div className="flex gap-4 items-center">
                  <SubmitButton status="HADIR" text="Hadir" />
                  <Button type="button" variant="outline" onClick={() => setShowNotes(!showNotes)}>
                    Izin / Sakit
                  </Button>
                </div>
                {showNotes && (
                  <div className="space-y-4 pt-4 border-t">
                    <div className="space-y-2">
                      <Label htmlFor="notes">Keterangan (wajib untuk Izin/Sakit):</Label>
                      <Textarea id="notes" name="notes" placeholder="Tuliskan keterangan izin atau sakit..." className="min-h-[80px]" required />
                    </div>
                    <div className="flex gap-4">
                      <SubmitButton status="IZIN" text="Kirim Izin" variant="secondary" />
                      <SubmitButton status="SAKIT" text="Kirim Sakit" variant="secondary" />
                    </div>
                  </div>
                )}
                {state?.error && <Alert variant="destructive"><AlertDescription>{state.error}</AlertDescription></Alert>}
              </form>
            </div>
          </CardContent>
        </Card>
      )}

      {/* BLOK 2: Menampilkan Sesi Berikutnya (jika ada), SELALU ditampilkan terlepas dari status Blok 1 */}
      {scheduledSession && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-600">
              <CalendarClock className="h-5 w-5" />
              Absensi Berikutnya
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert variant="default" className="bg-blue-50 border-blue-200">
              <AlertDescription className="text-blue-800">
                <p className="font-semibold">{scheduledSession.title}</p>
                <p>Sesi akan dimulai pada: <strong>{new Date(scheduledSession.start_time).toLocaleString('id-ID', {
                  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit'
                })}</strong></p>
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
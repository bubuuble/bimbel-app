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
import { CheckCircle, Clock, UserCheck } from "lucide-react";
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
type Props = {
  classId: string;
  activeSession: Session | null;
  hasAttended: boolean;
};

export default function StudentAttendance({ classId, activeSession, hasAttended }: Props) {
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
      toast.error("Error", {
        description: state.error,
      });
    }
  }, [state]);

  if (hasAttended) {
    return (
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Absensi
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <UserCheck className="h-4 w-4" />
            <AlertDescription>
              <strong>Terima kasih, Anda sudah melakukan absensi untuk sesi ini.</strong>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (!activeSession) {
    return (
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Absensi</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Tidak ada sesi absensi yang sedang dibuka oleh guru saat ini.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-8 border-primary">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Sesi Absensi Dibuka!
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="font-semibold">{activeSession.title}</p>
            <p className="text-sm text-muted-foreground">
              Sesi akan ditutup pada: {new Date(activeSession.expires_at).toLocaleTimeString()}
            </p>
          </div>

          <form action={formAction} className="space-y-4">
            <input type="hidden" name="sessionId" value={activeSession.id} />
            <input type="hidden" name="classId" value={classId} />
            
            <div className="flex gap-4 items-center">
              <SubmitButton status="HADIR" text="Hadir" />
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setShowNotes(!showNotes)}
              >
                Izin / Sakit
              </Button>
            </div>

            {showNotes && (
              <div className="space-y-4 pt-4 border-t">
                <div className="space-y-2">
                  <Label htmlFor="notes">Keterangan (opsional):</Label>
                  <Textarea 
                    id="notes"
                    name="notes" 
                    placeholder="Tuliskan keterangan izin atau sakit..." 
                    className="min-h-[80px]"
                  />
                </div>
                <div className="flex gap-4">
                  <SubmitButton status="IZIN" text="Kirim Izin" variant="secondary" />
                  <SubmitButton status="SAKIT" text="Kirim Sakit" variant="secondary" />
                </div>
              </div>
            )}

            {state?.error && (
              <Alert variant="destructive">
                <AlertDescription>{state.error}</AlertDescription>
              </Alert>
            )}
          </form>
        </div>
      </CardContent>
    </Card>
  );
}

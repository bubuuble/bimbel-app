// FILE: app/dashboard/components/GradeSubmissionForm.tsx

'use client'
import { useState } from "react";
import { gradeSubmission } from "@/lib/actions";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

type Submission = {
  id: number;
  material_id: string;
  grade: number | null;
  feedback: string | null;
};

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
      <Button type="submit" disabled={pending} className="h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all shadow-sm px-6">
        {pending ? "Menyimpan..." : "Simpan Nilai"}
      </Button>
    );
}

export default function GradeSubmissionForm({ submission, classId }: { submission: Submission, classId: string }) {
  const [grade, setGrade] = useState(submission.grade?.toString() || '');
  const [feedback, setFeedback] = useState(submission.feedback || '');

  return (
    <div className="mt-4 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="p-6">
        <form action={gradeSubmission} className="space-y-6">
          <input type="hidden" name="submissionId" value={submission.id} />
          <input type="hidden" name="classId" value={classId} />
          <input type="hidden" name="materialId" value={submission.material_id} />

          <div className="grid grid-cols-[100px_1fr] gap-4 items-center">
            <Label htmlFor={`grade-${submission.id}`} className="font-semibold text-slate-700">Nilai (0-100)</Label>
            <Input 
              type="number" 
              id={`grade-${submission.id}`} 
              name="grade" 
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              min="0" 
              max="100" 
              required 
              className="h-11 rounded-xl border-slate-200 focus-visible:ring-indigo-500"
            />
            
            <Label htmlFor={`feedback-${submission.id}`} className="font-semibold text-slate-700 mt-2">Umpan Balik</Label>
            <Textarea 
              id={`feedback-${submission.id}`} 
              name="feedback" 
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={3} 
              placeholder="Tulis umpan balik (opsional)..."
              className="rounded-xl border-slate-200 focus-visible:ring-indigo-500 resize-none"
            />
          </div>
          
          <div className="flex justify-end pt-2 border-t border-slate-50">
            <SubmitButton />
          </div>
        </form>
      </div>
    </div>
  );
}
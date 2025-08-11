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
      <Button type="submit" disabled={pending}>
        {pending ? "Menyimpan..." : "Simpan Nilai"}
      </Button>
    );
}

export default function GradeSubmissionForm({ submission, classId }: { submission: Submission, classId: string }) {
  const [grade, setGrade] = useState(submission.grade?.toString() || '');
  const [feedback, setFeedback] = useState(submission.feedback || '');

  return (
    <Card className="mt-4">
      <CardContent className="p-6">
        <form action={gradeSubmission} className="space-y-4">
          <input type="hidden" name="submissionId" value={submission.id} />
          <input type="hidden" name="classId" value={classId} />
          <input type="hidden" name="materialId" value={submission.material_id} />

          <div className="grid grid-cols-[100px_1fr] gap-4 items-center">
            <Label htmlFor={`grade-${submission.id}`}>Nilai (0-100)</Label>
            <Input 
              type="number" 
              id={`grade-${submission.id}`} 
              name="grade" 
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              min="0" 
              max="100" 
              required 
            />
            
            <Label htmlFor={`feedback-${submission.id}`}>Umpan Balik</Label>
            <Textarea 
              id={`feedback-${submission.id}`} 
              name="feedback" 
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={3} 
              placeholder="Tulis umpan balik (opsional)..."
            />
          </div>
          
          <div className="flex justify-end">
            <SubmitButton />
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
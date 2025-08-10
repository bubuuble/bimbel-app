// FILE: app/dashboard/components/GradeSubmissionForm.tsx

'use client'
import { useState } from "react";
import { gradeSubmission } from "@/lib/actions";
import { useFormStatus } from "react-dom";

type Submission = {
  id: number;
  material_id: string; // atau tipe data ID Anda
  grade: number | null;
  feedback: string | null;
};

function SubmitButton() {
    const { pending } = useFormStatus();
    return <button type="submit" disabled={pending}>{pending ? "Menyimpan..." : "Simpan Nilai"}</button>
}

export default function GradeSubmissionForm({ submission, classId }: { submission: Submission, classId: string }) {
  const [grade, setGrade] = useState(submission.grade?.toString() || '');
  const [feedback, setFeedback] = useState(submission.feedback || '');

  return (
    <form action={gradeSubmission} style={{ marginTop: '1rem', borderTop: '1px solid #eee', paddingTop: '1rem' }}>
      <input type="hidden" name="submissionId" value={submission.id} />
      <input type="hidden" name="classId" value={classId} />
      <input type="hidden" name="materialId" value={submission.material_id} />

      <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '1rem', alignItems: 'center' }}>
        <label htmlFor={`grade-${submission.id}`}>Nilai (0-100)</label>
        <input 
          type="number" 
          id={`grade-${submission.id}`} 
          name="grade" 
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
          min="0" 
          max="100" 
          required 
        />
        
        <label htmlFor={`feedback-${submission.id}`}>Umpan Balik</label>
        <textarea 
          id={`feedback-${submission.id}`} 
          name="feedback" 
          value={feedback}
          onChange={(e) => setFeedback(e.target.value)}
          rows={3} 
          placeholder="Tulis umpan balik (opsional)..."
        />
      </div>
      <div style={{ marginTop: '1rem' }}>
        <SubmitButton />
      </div>
    </form>
  )
}
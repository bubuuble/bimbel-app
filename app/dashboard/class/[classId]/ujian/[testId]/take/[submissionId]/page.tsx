// file: app/dashboard/class/[classId]/ujian/[testId]/take/[submissionId]/page.tsx

// --- [PERBAIKAN 1] --- Add necessary imports for a Server Component
import { createClient } from "@/lib/supabase/server";
import { notFound, redirect } from "next/navigation";
import TestTakingInterface from "@/app/dashboard/components/TestTakingInterface";

// --- [PERBAIKAN 2] --- This is a Server Component, so it's naturally async
export default async function TakeTestPage({ 
  params 
}: { 
  params: { submissionId: string } 
}) {
  const { submissionId } = params;
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return redirect('/login');

  // 1. Verify this submission belongs to the current user
  const { data: submission } = await supabase
    .from('test_submissions')
    .select('*')
    .eq('id', submissionId)
    .eq('student_id', user.id)
    .single();
    
  if (!submission) notFound();

  // 2. If already completed, redirect to the results page
  if (submission.status === 'COMPLETED') {
    return redirect(`/ujian/hasil/${submission.id}`);
  }

  // 3. Get the full test data, including all questions and their options
  const { data: testData } = await supabase
    .from('tests')
    .select(`
      *,
      questions(
        *,
        multiple_choice_options(*),
        true_false_statements(*),
        matching_prompts(*),
        matching_options(*)
      )
    `)
    .eq('id', submission.test_id)
    .order('sort_order', { referencedTable: 'questions', ascending: true }) // Ensure questions are ordered
    .single();
    
  if (!testData) notFound();

  // 4. Get any answers the student has already saved for this session
  const { data: existingAnswers } = await supabase
    .from('student_answers')
    .select('*')
    .eq('submission_id', submissionId);

  // 5. Pass all the real data to the client component
  return (
    <TestTakingInterface
      testData={testData}
      submission={submission}
      existingAnswers={existingAnswers || []}
      classId={submission.class_id}
    />
  );
}
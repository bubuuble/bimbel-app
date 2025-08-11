// FILE: app/dashboard/components/SubmissionForm.tsx

'use client'
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Upload, FileText, ChevronDown } from "lucide-react";

type Props = {
  materialId: string;
  studentId: string;
  classId: string;
  existingSubmission: { 
    id: number,
    file_url: string | null
  } | null;
}

export default function SubmissionForm({ materialId, studentId, classId, existingSubmission }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) {
      setError("Please select a file to upload.");
      return;
    }

    setIsUploading(true);
    setError(null);

    const filePath = `submissions/${classId}/${materialId}/${studentId}/${file.name.replace(/\s+/g, '_')}`;

    try {
      const { error: uploadError } = await supabase.storage.from('submissions').upload(filePath, file, { upsert: true });
      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage.from('submissions').getPublicUrl(filePath);

      let dbError;
      if (existingSubmission) {
        const { error } = await supabase
          .from('submissions')
          .update({ file_url: publicUrl })
          .eq('id', existingSubmission.id);
        dbError = error;
      } else {
        const { error } = await supabase
          .from('submissions')
          .insert({
            material_id: materialId,
            student_id: studentId,
            class_id: classId,
            file_url: publicUrl
          });
        dbError = error;
      }
      
      if (dbError) throw dbError;
      
      setError(null);
      router.refresh();

    } catch (err: any) {
      setError(err.message);
      if (err.details) setError(`${err.message} (${err.details})`);
    } finally {
      setIsUploading(false);
    }
  };

  if (existingSubmission) {
    return (
      <Card className="mt-2">
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="bg-green-100 text-green-800">
              <FileText className="w-3 h-3 mr-1" />
              Submitted
            </Badge>
          </div>
          <CardDescription>
            You have already submitted this assignment.
            {existingSubmission.file_url && (
              <Button variant="link" className="p-0 h-auto ml-1" asChild>
                <a href={existingSubmission.file_url} target="_blank" rel="noopener noreferrer">
                  View your submission
                </a>
              </Button>
            )}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full justify-between">
                Resubmit Assignment
                <ChevronDown className="h-4 w-4" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="resubmit-file">Upload New File</Label>
                  <Input 
                    id="resubmit-file"
                    type="file" 
                    onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} 
                    required 
                  />
                </div>
                <Button type="submit" disabled={isUploading} className="w-full">
                  <Upload className="w-4 h-4 mr-2" />
                  {isUploading ? 'Uploading...' : 'Resubmit Assignment'}
                </Button>
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </form>
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="mt-2">
      <CardHeader>
        <CardTitle className="text-lg">Submit Assignment</CardTitle>
        <CardDescription>Upload your assignment file below</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="assignment-file">Upload Your Answer</Label>
            <Input 
              id="assignment-file"
              type="file" 
              onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} 
              required 
            />
          </div>
          <Button type="submit" disabled={isUploading} className="w-full">
            <Upload className="w-4 h-4 mr-2" />
            {isUploading ? 'Uploading...' : 'Submit Assignment'}
          </Button>
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
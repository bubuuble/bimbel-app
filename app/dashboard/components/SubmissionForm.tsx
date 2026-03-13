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
      <div className="mt-4 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-slate-50 bg-slate-50/50">
          <div className="flex items-center gap-2 mb-2">
            <Badge className="bg-green-100 hover:bg-green-100 text-green-700 border-none font-medium px-3 py-1 rounded-lg">
              <FileText className="w-4 h-4 mr-1.5" />
              Tugas Dikumpulkan
            </Badge>
          </div>
          <p className="text-slate-600 text-sm">
            Anda telah mengumpulkan tugas ini.
            {existingSubmission.file_url && (
              <Button variant="link" className="p-0 h-auto ml-1 text-indigo-600 font-semibold" asChild>
                <a href={existingSubmission.file_url} target="_blank" rel="noopener noreferrer">
                  Lihat file Anda
                </a>
              </Button>
            )}
          </p>
        </div>
        <div className="p-5 sm:p-6">
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="outline" className="w-full justify-between h-12 rounded-xl border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 hover:text-slate-900">
                Kumpulkan Ulang Tugas
                <ChevronDown className="h-4 w-4 text-slate-400" />
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-4">
              <form onSubmit={handleSubmit} className="space-y-5 bg-slate-50 p-4 rounded-xl border border-slate-100">
                <div className="space-y-1.5">
                  <Label htmlFor="resubmit-file" className="text-sm font-semibold text-slate-700">Pilih File Baru</Label>
                  <Input 
                    id="resubmit-file"
                    type="file" 
                    onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} 
                    required 
                    className="h-11 rounded-xl bg-white border-slate-200 cursor-pointer text-slate-600 file:bg-slate-100 file:text-slate-700 file:border-0 file:rounded-lg file:px-4 file:py-1 file:mr-4 file:-ml-1 hover:file:bg-slate-200"
                  />
                </div>
                <Button type="submit" disabled={isUploading} className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all shadow-sm">
                  <Upload className="w-4 h-4 mr-2" />
                  {isUploading ? 'Mengunggah...' : 'Kumpulkan Ulang'}
                </Button>
                {error && (
                  <Alert variant="destructive" className="rounded-xl">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </form>
            </CollapsibleContent>
          </Collapsible>
        </div>
      </div>
    );
  }
  
  return (
    <div className="mt-4 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <div className="p-5 sm:p-6 border-b border-slate-50 bg-slate-50/50">
        <h3 className="text-lg font-bold text-slate-800 tracking-tight">Kumpulkan Tugas</h3>
        <p className="text-sm text-slate-500 mt-1">Unggah file jawaban tugas Anda di bawah ini</p>
      </div>
      <div className="p-5 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="assignment-file" className="text-sm font-semibold text-slate-700">Pilih File Jawaban</Label>
            <Input 
              id="assignment-file"
              type="file" 
              onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} 
              required 
              className="h-11 rounded-xl border-slate-200 cursor-pointer text-slate-600 file:bg-slate-100 file:text-slate-700 file:border-0 file:rounded-lg file:px-4 file:py-1 file:mr-4 file:-ml-1 hover:file:bg-slate-200"
            />
          </div>
          <Button type="submit" disabled={isUploading} className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition-all shadow-sm">
            <Upload className="w-4 h-4 mr-2" />
            {isUploading ? 'Mengunggah...' : 'Kumpulkan Tugas'}
          </Button>
          {error && (
            <Alert variant="destructive" className="rounded-xl">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </form>
      </div>
    </div>
  );
}
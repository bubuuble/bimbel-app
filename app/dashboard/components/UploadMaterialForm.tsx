// FILE: app/dashboard/components/UploadMaterialForm.tsx (Versi FINAL & Diperbaiki)

'use client'

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState, type FormEvent, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Loader2, Upload, Calendar, FileText, ChevronDown, Plus, X } from "lucide-react";

export default function UploadMaterialForm({ classId }: { classId: string }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isTask, setIsTask] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  
  const supabase = createClient();
  const router = useRouter();

  // <<< PERBAIKAN UTAMA DI SINI >>>
  // Logika diubah untuk MENAMBAHKAN file ke state yang ada, bukan menggantinya.
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      // Menggunakan functional update untuk memastikan kita bekerja dengan state terbaru
      setFiles(prevFiles => [...prevFiles, ...Array.from(e.target.files!)]);
    }
  };
  
  const removeFile = (indexToRemove: number) => {
    setFiles(files.filter((_, index) => index !== indexToRemove));
  };


  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsUploading(true);
    setError(null);

    // Validasi
    if (!isTask && files.length === 0) {
      setError('At least one file is required for regular materials.');
      setIsUploading(false);
      return;
    }
    if (!title) {
        setError('Material Title is required.');
        setIsUploading(false);
        return;
    }

    try {
      const deadlineValue = isTask && deadline ? new Date(deadline).toISOString() : null;
      
      const { data: materialData, error: materialError } = await supabase
        .from('materials')
        .insert({
          title: title,
          description: description || null,
          class_id: classId,
          is_task: isTask,
          deadline: deadlineValue,
        })
        .select('id')
        .single();
        
      if (materialError) throw materialError;
      
      const newMaterialId = materialData.id;

      if (files.length > 0) {
        const uploadPromises = files.map(async (file) => {
          const sanitizedFileName = file.name.replace(/\s+/g, '_');
          const filePath = `${classId}/${newMaterialId}/${Date.now()}_${sanitizedFileName}`;
          
          const { error: uploadError } = await supabase.storage.from('materials').upload(filePath, file);
          if (uploadError) throw new Error(`Upload failed for ${file.name}: ${uploadError.message}`);
          
          const { data: { publicUrl } } = supabase.storage.from('materials').getPublicUrl(filePath);

          return {
            material_id: newMaterialId,
            file_name: file.name,
            file_url: publicUrl,
            file_type: file.type,
          };
        });

        const uploadedFilesData = await Promise.all(uploadPromises);

        const { error: filesInsertError } = await supabase
          .from('material_files')
          .insert(uploadedFilesData);

        if (filesInsertError) throw filesInsertError;
      }

      alert('Material/Task created successfully!');
      router.refresh(); 
      
      // Reset form
      (event.target as HTMLFormElement).reset();
      setTitle('');
      setDescription('');
      setFiles([]);
      setIsTask(false);
      setDeadline('');
      setIsOpen(false);

    } catch (err: any) {
      console.error("Process failed:", err);
      setError(`Failed: ${err.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="w-full">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add New Material / Task
              </div>
              <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </CardTitle>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="pt-0">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="e.g., Bab 1 - Latihan Soal & Pembahasan"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="materialFiles">Files {!isTask && "(Required)"}</Label>
                <p className="text-xs text-gray-600">Tekan lagi untuk mengupload lebih dari satu file</p>
                <div className="flex items-center space-x-2">
                  <Input
                    id="materialFiles"
                    type="file"
                    multiple // Atribut penting untuk multi-file
                    onChange={handleFileChange}
                    className="cursor-pointer"
                  />
                  <Upload className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
              
              {files.length > 0 && (
                <div className="space-y-2 p-3 border rounded-md">
                    <p className="text-sm font-medium">Selected files:</p>
                    <ul className="space-y-1">
                        {files.map((file, index) => (
                            <li key={index} className="flex items-center justify-between text-sm text-muted-foreground">
                                <span>{file.name}</span>
                                <Button type="button" variant="ghost" size="icon" className="h-6 w-6" onClick={() => removeFile(index)}>
                                    <X className="h-4 w-4" />
                                </Button>
                            </li>
                        ))}
                    </ul>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="description">Description (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Add a description for this material or task..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={2}
                />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/30">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="isTask"
                    checked={isTask}
                    onCheckedChange={(checked) => setIsTask(checked as boolean)}
                  />
                  <Label htmlFor="isTask" className="font-medium text-sm">
                    This is a Task (requires student submission)
                  </Label>
                </div>
                
                {isTask && (
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <Input
                      type="datetime-local"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      className="w-auto text-sm"
                      placeholder="Deadline"
                    />
                  </div>
                )}
              </div>
              
              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
              
              <div className="flex gap-2">
                <Button type="submit" disabled={isUploading} className="flex-1">
                  {isUploading ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</>
                  ) : (
                    <><FileText className="mr-2 h-4 w-4" />Save {isTask ? 'Task' : 'Material'}</>
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isUploading}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
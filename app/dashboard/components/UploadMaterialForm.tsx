// FILE: app/dashboard/components/UploadMaterialForm.tsx

'use client'

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Loader2, Upload, Calendar, FileText, ChevronDown, Plus } from "lucide-react";

export default function UploadMaterialForm({ classId }: { classId: string }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isTask, setIsTask] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  
  const supabase = createClient();
  const router = useRouter();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsUploading(true);
    setError(null);

    // Validasi
    if (!isTask && !file) {
      setError('File is required for regular materials.');
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
      
      let fileUrl = null;
      let fileType = null;

      if (file) {
        const sanitizedFileName = file.name.replace(/\s+/g, '_');
        const filePath = `${classId}/${Date.now()}_${sanitizedFileName}`;
        
        const { error: uploadError } = await supabase.storage.from('materials').upload(filePath, file);
        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage.from('materials').getPublicUrl(filePath);
        fileUrl = publicUrl;
        fileType = file.type;
      }
      
      const { error: dbError } = await supabase
        .from('materials')
        .insert({
          title: title,
          description: description || null,
          file_url: fileUrl,
          file_type: fileType,
          class_id: classId,
          is_task: isTask,
          deadline: deadlineValue,
        });
      if (dbError) throw dbError;

      alert('Material/Task created successfully!');
      router.refresh(); 
      
      // Reset form
      (event.target as HTMLFormElement).reset();
      setTitle('');
      setDescription('');
      setFile(null);
      setIsTask(false);
      setDeadline('');
      setIsOpen(false); // Close the dropdown after successful submission

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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    type="text"
                    placeholder="e.g., Bab 1 PDF or Tugas Video Esai"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="materialFile">File {!isTask && "(Required)"}</Label>
                  <div className="flex items-center space-x-2">
                    <Input
                      id="materialFile"
                      type="file"
                      onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                      className="cursor-pointer"
                    />
                    <Upload className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
              </div>
              
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
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <FileText className="mr-2 h-4 w-4" />
                      Save {isTask ? 'Task' : 'Material'}
                    </>
                  )}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsOpen(false)}
                  disabled={isUploading}
                >
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
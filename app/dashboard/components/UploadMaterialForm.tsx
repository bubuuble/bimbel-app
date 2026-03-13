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
import { Loader2, Upload, Calendar, FileText, ChevronDown, Plus, X, AlertCircle } from "lucide-react";

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
    <div className="w-full">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <div className="cursor-pointer flex items-center justify-between p-4 rounded-xl border border-indigo-100 bg-indigo-50/50 hover:bg-indigo-100/50 transition-colors group">
              <div className="flex items-center gap-2 font-semibold text-indigo-700">
                <Plus className="h-5 w-5 shrink-0 transition-transform group-hover:scale-110" />
                Tambah Materi / Tugas Baru
              </div>
              <ChevronDown className={`h-4 w-4 text-indigo-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
            <form onSubmit={handleSubmit} className="space-y-5 pt-5 pb-2">
              <div className="space-y-1.5">
                <Label htmlFor="title" className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Judul</Label>
                <Input
                  id="title"
                  type="text"
                  placeholder="Contoh: Bab 1 - Latihan Soal & Pembahasan"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="rounded-xl border-slate-200 focus:border-indigo-400 focus:ring-indigo-400 h-11"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="materialFiles" className="text-xs font-semibold text-slate-600 uppercase tracking-wide">File Lampiran {!isTask && <span className="text-rose-500">*</span>}</Label>
                  <span className="text-xs text-slate-400 font-medium italic">Tekan lagi untuk upload ganda</span>
                </div>
                <div className="relative group">
                  <Input
                    id="materialFiles"
                    type="file"
                    multiple // Atribut penting untuk multi-file
                    onChange={handleFileChange}
                    className="cursor-pointer file:border-0 file:bg-indigo-50 file:text-indigo-700 file:text-sm file:font-semibold file:rounded-lg file:px-4 file:py-1 hover:file:bg-indigo-100 h-11 rounded-xl border-slate-200 pt-1.5 pb-0 px-2"
                  />
                  <Upload className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-hover:text-indigo-500 transition-colors pointer-events-none" />
                </div>
              </div>
              
              {files.length > 0 && (
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mb-3">File Terpilih:</p>
                    <ul className="space-y-2">
                        {files.map((file, index) => (
                            <li key={index} className="flex items-center justify-between text-sm bg-white border border-slate-200 rounded-lg p-2 shadow-sm">
                                <div className="flex items-center gap-2 overflow-hidden">
                                  <FileText className="h-4 w-4 text-indigo-400 shrink-0" />
                                  <span className="truncate font-medium text-slate-700">{file.name}</span>
                                </div>
                                <button type="button" className="flex h-7 w-7 items-center justify-center rounded-md text-rose-400 hover:bg-rose-50 hover:text-rose-600 transition-colors shrink-0" onClick={() => removeFile(index)}>
                                    <X className="h-3.5 w-3.5" />
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
              )}

              <div className="space-y-1.5">
                <Label htmlFor="description" className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Deskripsi (Opsional)</Label>
                <Textarea
                  id="description"
                  placeholder="Tambahkan deskripsi atau instruksi untuk materi/tugas ini..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  className="rounded-xl border-slate-200 focus:border-indigo-400 focus:ring-indigo-400 resize-none"
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-amber-100 rounded-xl bg-amber-50/40 gap-4">
                <div className="flex items-start space-x-3">
                  <Checkbox
                    id="isTask"
                    checked={isTask}
                    onCheckedChange={(checked) => setIsTask(checked as boolean)}
                    className="mt-0.5 border-amber-300 data-[state=checked]:bg-amber-500 data-[state=checked]:border-amber-500"
                  />
                  <div className="space-y-1">
                    <Label htmlFor="isTask" className="font-semibold text-sm text-slate-800 cursor-pointer">
                      Jadikan sebagai Tugas
                    </Label>
                    <p className="text-xs text-slate-500">
                      Siswa perlu mengunggah jawaban untuk dinilai.
                    </p>
                  </div>
                </div>
                
                {isTask && (
                  <div className="flex items-center space-x-2 bg-white px-3 py-2 rounded-lg border border-amber-200 shadow-sm sm:w-auto w-full">
                    <Calendar className="h-4 w-4 text-amber-500 shrink-0" />
                    <Input
                      type="datetime-local"
                      value={deadline}
                      onChange={(e) => setDeadline(e.target.value)}
                      className="border-0 h-8 p-0 focus-visible:ring-0 shadow-none text-sm text-slate-700 min-w-[200px]"
                      placeholder="Pilih Deadline"
                    />
                  </div>
                )}
              </div>
              
              {error && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-100 text-rose-700 text-sm font-medium">
                  <AlertCircle className="h-4 w-4 shrink-0" />
                  {error}
                </div>
              )}
              
              <div className="flex flex-col-reverse sm:flex-row gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)} disabled={isUploading} className="flex-1 h-11 rounded-xl font-semibold text-slate-600 border-slate-200">
                  Batal
                </Button>
                <Button type="submit" disabled={isUploading} className="flex-1 h-11 rounded-xl font-semibold text-white bg-indigo-600 hover:bg-indigo-700">
                  {isUploading ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin shrink-0" />Menyimpan...</>
                  ) : (
                    <><Upload className="mr-2 h-4 w-4 shrink-0" />Simpan {isTask ? 'Tugas' : 'Materi'}</>
                  )}
                </Button>
              </div>
            </form>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
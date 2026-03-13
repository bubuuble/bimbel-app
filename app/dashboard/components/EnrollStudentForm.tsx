// FILE: app/dashboard/components/EnrollStudentForm.tsx
'use client'

import { useActionState, useEffect, useRef, useState } from "react";
import { useFormStatus } from "react-dom";
import { enrollStudentByTeacher, type FormState } from "@/lib/actions";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Loader2, Search, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

type AvailableStudent = {
  id: string;
  name: string | null;
  username: string | null;
}

interface EnrollStudentFormProps {
  classId: string;
  availableStudents: AvailableStudent[];
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold">
      {pending ? (
        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menambahkan...</>
      ) : (
        <><Plus className="mr-2 h-4 w-4 shrink-0" /> Tambah ke Kelas</>
      )}
    </Button>
  );
}

export default function EnrollStudentForm({ classId, availableStudents }: EnrollStudentFormProps) {
  const [state, formAction] = useActionState(enrollStudentByTeacher, null);
  const formRef = useRef<HTMLFormElement>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<AvailableStudent | null>(null);

  // Filter siswa berdasarkan pencarian
  const filteredStudents = availableStudents.filter(student => {
    const searchLower = searchQuery.toLowerCase();
    const matchName = student.name?.toLowerCase().includes(searchLower) || false;
    const matchUsername = student.username?.toLowerCase().includes(searchLower) || false;
    return matchName || matchUsername;
  });

  useEffect(() => {
    if (state?.success) {
      toast.success(state.success);
      setIsModalOpen(false);
      setSelectedStudent(null);
      setSearchQuery('');
      formRef.current?.reset();
    }
    if (state?.error) {
      toast.error("Gagal", { description: state.error });
    }
  }, [state]);

  const handleStudentSelect = (student: AvailableStudent) => {
    setSelectedStudent(student);
  };

  const handleSubmit = async () => {
    if (!selectedStudent) {
      toast.error("Silakan pilih siswa terlebih dahulu");
      return;
    }
    
    // Buat FormData dan submit langsung ke server action
    const formData = new FormData();
    formData.append('classId', classId);
    formData.append('studentId', selectedStudent.id);
    
    // Panggil server action langsung
    const result = await enrollStudentByTeacher(null, formData);
    
    // Handle result
    if (result?.success) {
      toast.success(result.success);
      setIsModalOpen(false);
      setSelectedStudent(null);
      setSearchQuery('');
      // Refresh page untuk update daftar siswa
      window.location.reload();
    } else if (result?.error) {
      toast.error("Gagal", { description: result.error });
    }
  };

  const clearSelection = () => {
    setSelectedStudent(null);
  };

  return (
    <div className="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden sticky top-20">
      <div className="p-5 sm:p-6 border-b border-slate-50 bg-slate-50/30">
        <h2 className="text-base font-semibold text-slate-800">Tambah Siswa</h2>
        <p className="text-xs text-slate-500 mt-1">
          {availableStudents.length > 0 
            ? `${availableStudents.length} siswa tersedia untuk ditambahkan ke kelas ini.`
            : "Semua siswa sudah terdaftar di kelas ini."
          }
        </p>
      </div>
      <div className="p-5 sm:p-6">
        {availableStudents.length > 0 ? (
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Tambah Siswa
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px] p-0 overflow-hidden border-0 rounded-2xl shadow-xl">
              <div className="bg-slate-50 border-b border-slate-100 p-5">
                <DialogTitle className="text-lg font-bold text-slate-800">Pilih Siswa</DialogTitle>
              </div>
              
              <div className="p-5 space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input
                    placeholder="Cari nama atau username..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 h-11 rounded-xl border-slate-200 focus:border-indigo-400 focus:ring-indigo-400 text-sm"
                  />
                </div>

                {/* Selected Student Display */}
                {selectedStudent && (
                  <div className="p-3 bg-indigo-50 rounded-xl border border-indigo-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-indigo-900 text-sm">{selectedStudent.name}</p>
                        <p className="text-xs font-medium text-indigo-600">@{selectedStudent.username}</p>
                      </div>
                      <button 
                        onClick={clearSelection}
                        className="flex h-8 w-8 items-center justify-center rounded-lg text-indigo-400 hover:bg-indigo-100 hover:text-indigo-600 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Student List */}
                <div className="h-[300px] w-full border border-slate-100 rounded-xl overflow-y-auto">
                  <div className="p-2 space-y-1.5">
                    {filteredStudents.length > 0 ? (
                      filteredStudents.map(student => (
                        <div
                          key={student.id}
                          onClick={() => handleStudentSelect(student)}
                          className={`p-3 rounded-xl border cursor-pointer transition-all ${
                            selectedStudent?.id === student.id 
                              ? 'bg-indigo-50 border-indigo-200' 
                              : 'border-transparent hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1 min-w-0">
                              <p className={`font-medium text-sm truncate ${selectedStudent?.id === student.id ? 'text-indigo-900' : 'text-slate-700'}`}>{student.name || 'Nama tidak tersedia'}</p>
                              <p className={`text-xs truncate ${selectedStudent?.id === student.id ? 'text-indigo-600 font-medium' : 'text-slate-500'}`}>@{student.username}</p>
                            </div>
                            {selectedStudent?.id === student.id && (
                              <div className="ml-2 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-12 text-slate-500">
                        {searchQuery ? (
                          <div className="flex flex-col items-center">
                            <p className="text-sm">Tidak ditemukan "{searchQuery}"</p>
                            <button 
                              onClick={() => setSearchQuery('')}
                              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 mt-2"
                            >
                              Hapus pencarian
                            </button>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center">
                              <Loader2 className="h-6 w-6 animate-spin text-slate-300 mb-2" />
                              <p className="text-sm">Membuat daftar siswa...</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex gap-3 pt-2">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 h-11 rounded-xl font-semibold text-slate-600 border-slate-200"
                  >
                    Batal
                  </Button>
                  <Button 
                    onClick={handleSubmit}
                    disabled={!selectedStudent}
                    className="flex-1 h-11 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold"
                  >
                    <Plus className="mr-2 h-4 w-4 shrink-0" />
                    Tambah
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        ) : (
          <div className="text-center py-4">
            <p className="text-sm text-muted-foreground mb-2">
              Semua siswa sudah terdaftar di kelas ini.
            </p>
            <Badge variant="secondary">
              Tidak ada siswa tersedia
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
}
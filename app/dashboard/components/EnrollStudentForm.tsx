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
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? (
        <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Menambahkan...</>
      ) : (
        <><Plus className="mr-2 h-4 w-4" /> Tambah ke Kelas</>
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
    <Card className="sticky top-20">
      <CardHeader>
        <CardTitle>Tambah Siswa</CardTitle>
        <CardDescription>
          {availableStudents.length > 0 
            ? `${availableStudents.length} siswa tersedia untuk ditambahkan ke kelas ini.`
            : "Semua siswa sudah terdaftar di kelas ini."
          }
        </CardDescription>
      </CardHeader>
      <CardContent>
        {availableStudents.length > 0 ? (
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Tambah Siswa
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Pilih Siswa</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4">
                {/* Search Bar */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    placeholder="Cari siswa berdasarkan nama atau username..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>

                {/* Selected Student Display */}
                {selectedStudent && (
                  <div className="p-3 bg-primary/10 rounded-lg border-2 border-primary/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">{selectedStudent.name}</p>
                        <p className="text-sm text-muted-foreground">@{selectedStudent.username}</p>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={clearSelection}
                        className="h-8 w-8 p-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Student List */}
                <ScrollArea className="h-[300px] w-full border rounded-md">
                  <div className="p-4 space-y-2">
                    {filteredStudents.length > 0 ? (
                      filteredStudents.map(student => (
                        <div
                          key={student.id}
                          onClick={() => handleStudentSelect(student)}
                          className={`p-3 rounded-lg border cursor-pointer transition-all hover:bg-muted/50 ${
                            selectedStudent?.id === student.id 
                              ? 'bg-primary/10 border-primary/50' 
                              : 'border-border'
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <p className="font-medium">{student.name || 'Nama tidak tersedia'}</p>
                              <p className="text-sm text-muted-foreground">@{student.username}</p>
                            </div>
                            {selectedStudent?.id === student.id && (
                              <Badge variant="default" className="ml-2">
                                Dipilih
                              </Badge>
                            )}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        {searchQuery ? (
                          <div>
                            <p>Tidak ada siswa ditemukan untuk "{searchQuery}"</p>
                            <Button 
                              variant="link" 
                              onClick={() => setSearchQuery('')}
                              className="p-0 h-auto mt-2"
                            >
                              Hapus pencarian
                            </Button>
                          </div>
                        ) : (
                          <p>Memuat daftar siswa...</p>
                        )}
                      </div>
                    )}
                  </div>
                </ScrollArea>

                {/* Submit Button */}
                <div className="flex gap-2 pt-4">
                  <Button 
                    variant="outline" 
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1"
                  >
                    Batal
                  </Button>
                  <Button 
                    onClick={handleSubmit}
                    disabled={!selectedStudent}
                    className="flex-1"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah ke Kelas
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
      </CardContent>
    </Card>
  );
}
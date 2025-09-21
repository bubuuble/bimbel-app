// FILE: app/dashboard/components/TeacherClassView.tsx (Versi Multi-File)

import type { Class, Material, AttendanceSession, Test } from "@/lib/types";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { FileText, Trash2, ExternalLink, Eye, Paperclip, Plus, ClipboardList } from "lucide-react";

import UploadMaterialForm from "./UploadMaterialForm";
import EnrolledStudentsList from "./EnrolledStudentsList";
import DeleteClassForm from "./DeleteClassForm";
import EnrollStudentForm from "./EnrollStudentForm"; // Impor form baru
import { deleteMaterial } from "@/lib/actions"; // Impor aksi penghapusan materi

// --- [PERBAIKAN UTAMA DI SINI] ---

// Tipe data untuk prop siswa yang akan ditambahkan
type AvailableStudent = {
  id: string;
  name: string | null;
  username: string | null;
}

// Perbarui tipe 'Props' untuk menyertakan 'availableStudents'
type Props = {
  classInfo: Pick<Class, 'id' | 'name' | 'description'>;
  materials: Material[];
  initialSessions: AttendanceSession[];
  tests: Test[];
  availableStudents: AvailableStudent[]; // <-- TAMBAHKAN BARIS INI
};

export default function TeacherClassView({ classInfo, materials, initialSessions, tests, availableStudents   }: Props) {
  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <DeleteClassForm classId={classInfo.id} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Upload Materi / Tugas Baru</CardTitle>
            </CardHeader>
            <CardContent>
              <UploadMaterialForm classId={classInfo.id} />
            </CardContent>
          </Card>

          <Separator />

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Daftar Materi & Tugas
              </CardTitle>
            </CardHeader>
            <CardContent>
              {materials && materials.length > 0 ? (
                <div className="space-y-4">
                  {materials.map(material => (
                    // <<< PERUBAHAN 1: Tata letak diubah untuk mendukung daftar file >>>
                    <div key={material.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex items-start justify-between gap-4">
                        {/* Konten Utama */}
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold">{material.title}</h3>
                            {material.is_task && <Badge variant="secondary">Tugas</Badge>}
                          </div>
                          
                          {/* Daftar File */}
                          {material.material_files && material.material_files.length > 0 && (
                            <div className="space-y-2">
                              {material.material_files.map(file => (
                                <a
                                  key={file.id}
                                  href={file.file_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                                >
                                  <Paperclip className="h-4 w-4" />
                                  <span>{file.file_name}</span>
                                </a>
                              ))}
                            </div>
                          )}

                          {/* Tombol Lihat Jawaban (jika tugas) */}
                          {material.is_task && (
                            <Button variant="outline" size="sm" asChild>
                              <Link 
                                href={`/dashboard/class/${classInfo.id}/task/${material.id}`}
                                className="flex items-center gap-1"
                              >
                                <Eye className="h-4 w-4" />
                                Lihat Jawaban
                              </Link>
                            </Button>
                          )}
                        </div>

                        {/* Tombol Hapus */}
                        <form action={deleteMaterial}>
                          <input type="hidden" name="materialId" value={material.id} />
                          <input type="hidden" name="classId" value={classInfo.id} />
                          {/* fileUrl tidak lagi diperlukan di sini karena akan dihapus via CASCADE */}
                          <Button type="submit" variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10 hover:text-destructive">
                            <Trash2 className="h-4 w-4 mr-1" />
                            Hapus
                          </Button>
                        </form>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  Belum ada materi yang diunggah untuk kelas ini.
                </p>
              )}
            </CardContent>
          </Card>

          <Separator />

          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center gap-2">
                  <ClipboardList className="h-5 w-5" />
                  Ujian Tryout
                </CardTitle>
                <Button asChild size="sm">
                  <Link href={`/dashboard/class/${classInfo.id}/ujian/create`}>
                    <Plus className="h-4 w-4 mr-2" />
                    Buat Ujian Baru
                  </Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {tests && tests.length > 0 ? (
                <div className="space-y-3">
                  {/* [PERBAIKAN] Menambahkan tipe eksplisit untuk 'test' */}
                  {tests.map((test: Test) => (
                    <div key={test.id} className="p-4 border rounded-lg flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">{test.title}</h3>
                        <p className="text-sm text-muted-foreground">{test.duration_minutes} Menit</p>
                      </div>
                      <div className="flex gap-2">
                         <Button variant="outline" size="sm" asChild>
                            <Link href={`/dashboard/class/${classInfo.id}/ujian/${test.id}/hasil`}>
                                Lihat Hasil
                            </Link>
                         </Button>
                         <Button variant="default" size="sm" asChild>
                            <Link href={`/dashboard/class/${classInfo.id}/ujian/${test.id}/edit`}>
                                <Eye className="h-4 w-4 mr-1" />
                                Edit Soal
                            </Link>
                         </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-8">
                  Belum ada ujian yang dibuat untuk kelas ini.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Kolom Kanan */}
        <div className="lg:col-span-1 space-y-6">
          {/* 1. Tambahkan komponen EnrollStudentForm di sini */}
          <EnrollStudentForm
            classId={classInfo.id}
            availableStudents={availableStudents}
          />
          {/* 2. Komponen EnrolledStudentsList yang sudah ada */}
          <EnrolledStudentsList classId={classInfo.id} />
        </div>
      </div>
    </div>
  );
}
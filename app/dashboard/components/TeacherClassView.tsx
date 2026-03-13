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
          <div className="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden">
            <div className="p-5 sm:p-6 border-b border-slate-50 bg-slate-50/30">
              <h2 className="text-base font-semibold text-slate-800">Upload Materi / Tugas Baru</h2>
            </div>
            <div className="p-5 sm:p-6">
              <UploadMaterialForm classId={classInfo.id} />
            </div>
          </div>

          <Separator />

          <div className="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden mt-6">
            <div className="p-5 sm:p-6 border-b border-slate-50 bg-slate-50/30">
              <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
                <FileText className="h-5 w-5 text-indigo-500 shrink-0" />
                Daftar Materi & Tugas
              </h2>
            </div>
            <div className="p-5 sm:p-6">
              {materials && materials.length > 0 ? (
                <div className="space-y-4">
                  {materials.map(material => (
                    // <<< PERUBAHAN 1: Tata letak diubah untuk mendukung daftar file >>>
                    <div key={material.id} className="p-5 border border-slate-100 rounded-xl hover:shadow-md hover:border-indigo-100 transition-all duration-200 bg-white">
                      <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
                        {/* Konten Utama */}
                        <div className="flex-1 space-y-3 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-bold text-slate-800 truncate">{material.title}</h3>
                            {material.is_task && <span className="shrink-0 inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-widest bg-amber-50 text-amber-700 border border-amber-200">Tugas</span>}
                          </div>
                          
                          {/* Daftar File */}
                          {material.material_files && material.material_files.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {material.material_files.map(file => (
                                <a
                                  key={file.id}
                                  href={file.file_url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 bg-slate-50 border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 text-slate-600 hover:text-indigo-700 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors"
                                >
                                  <Paperclip className="h-3.5 w-3.5 shrink-0" />
                                  <span className="truncate max-w-[200px]">{file.file_name}</span>
                                </a>
                              ))}
                            </div>
                          )}

                          {/* Tombol Lihat Jawaban (jika tugas) */}
                          {material.is_task && (
                            <Link 
                                href={`/dashboard/class/${classInfo.id}/task/${material.id}`}
                                className="inline-flex items-center justify-center gap-1.5 rounded-xl text-sm font-semibold h-9 px-4 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors"
                            >
                                <Eye className="h-4 w-4" />
                                Lihat Jawaban Siswa
                            </Link>
                          )}
                        </div>

                        {/* Tombol Hapus */}
                        <form action={deleteMaterial} className="sm:ml-auto">
                          <input type="hidden" name="materialId" value={material.id} />
                          <input type="hidden" name="classId" value={classInfo.id} />
                          {/* fileUrl tidak lagi diperlukan di sini karena akan dihapus via CASCADE */}
                          <button type="submit" className="inline-flex items-center justify-center h-9 w-9 rounded-xl text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition-colors" title="Hapus Materi">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </form>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-slate-100 border-dashed bg-slate-50 p-12 text-center text-slate-500">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 mx-auto mb-4">
                    <FileText className="h-6 w-6 text-slate-400" />
                  </div>
                  <p className="font-medium">Belum ada materi yang diunggah untuk kelas ini.</p>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden mt-6">
            <div className="p-5 sm:p-6 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-50/30">
              <h2 className="text-base font-semibold text-slate-800 flex items-center gap-2">
                <ClipboardList className="h-5 w-5 text-indigo-500 shrink-0" />
                Ujian Tryout
              </h2>
              <Link href={`/dashboard/class/${classInfo.id}/ujian/create`} className="inline-flex items-center justify-center h-9 px-4 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors">
                  <Plus className="h-4 w-4 mr-2" />
                  Buat Ujian Baru
              </Link>
            </div>
            <div className="p-5 sm:p-6">
              {tests && tests.length > 0 ? (
                <div className="space-y-3">
                  {/* [PERBAIKAN] Menambahkan tipe eksplisit untuk 'test' */}
                  {tests.map((test: Test) => (
                    <div key={test.id} className="p-4 border border-slate-100 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white hover:border-indigo-100 hover:shadow-sm transition-all">
                      <div>
                        <h3 className="font-bold text-slate-800">{test.title}</h3>
                        <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-1">{test.duration_minutes} Menit</p>
                      </div>
                      <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                         <Link href={`/dashboard/class/${classInfo.id}/ujian/${test.id}/hasil`} className="inline-flex flex-1 sm:flex-none justify-center items-center h-9 px-4 rounded-xl text-sm font-semibold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors">
                              Lihat Hasil
                         </Link>
                         <Link href={`/dashboard/class/${classInfo.id}/ujian/${test.id}/edit`} className="inline-flex flex-1 sm:flex-none justify-center items-center h-9 px-4 rounded-xl text-sm font-semibold bg-indigo-50 text-indigo-700 hover:bg-indigo-100 transition-colors">
                              <Eye className="h-4 w-4 mr-1.5 shrink-0" />
                              Edit Soal
                         </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-slate-100 border-dashed bg-slate-50 p-12 text-center text-slate-500">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 mx-auto mb-4">
                    <ClipboardList className="h-6 w-6 text-slate-400" />
                  </div>
                  <p className="font-medium">Belum ada ujian yang dibuat untuk kelas ini.</p>
                </div>
              )}
            </div>
          </div>
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
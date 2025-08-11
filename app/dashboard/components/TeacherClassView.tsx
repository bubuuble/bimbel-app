// FILE: app/dashboard/components/TeacherClassView.tsx

import type { Class, Material, AttendanceSession } from "@/lib/types";
import { deleteMaterial } from "@/lib/actions";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, FileText, Trash2, ExternalLink, Eye } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

import UploadMaterialForm from "./UploadMaterialForm";
import EnrolledStudentsList from "./EnrolledStudentsList";
import DeleteClassForm from "./DeleteClassForm";

type Props = {
  classInfo: Pick<Class, 'id' | 'name' | 'description'>;
  materials: Material[];
  initialSessions: AttendanceSession[];
};

export default function TeacherClassView({ classInfo, materials, initialSessions }: Props) {
  return (
    <div className="space-y-6">
      {/* Delete Button - Top Right Corner */}
      <div className="flex justify-end">
        <DeleteClassForm classId={classInfo.id} />
      </div>

      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Left Side */}
        <div className="lg:col-span-2 space-y-6">
          {/* Upload Material */}
          <Card>
            <CardHeader>
              <CardTitle>Upload Materi</CardTitle>
            </CardHeader>
            <CardContent>
              <UploadMaterialForm classId={classInfo.id} />
            </CardContent>
          </Card>

          <Separator />

        {/* Materials & Tasks List */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Daftar Materi & Tugas
            </CardTitle>
          </CardHeader>
          <CardContent>
            {materials && materials.length > 0 ? (
              <div className="space-y-3">
                {materials.map(material => (
                  <div key={material.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <FileText className="h-4 w-4 text-gray-500" />
                      <div className="flex items-center gap-2">
                        <a 
                          href={material.file_url!} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="font-medium hover:text-blue-600 transition-colors"
                        >
                          {material.title}
                        </a>
                        <ExternalLink className="h-3 w-3 text-gray-400" />
                        
                        {material.is_task && (
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary">Tugas</Badge>
                            <Link 
                              href={`/dashboard/class/${classInfo.id}/task/${material.id}`}
                              className="flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 transition-colors"
                            >
                              <Eye className="h-3 w-3" />
                              Lihat Jawaban
                            </Link>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <form action={deleteMaterial}>
                      <input type="hidden" name="materialId" value={material.id} />
                      <input type="hidden" name="fileUrl" value={material.file_url || ''} />
                      <input type="hidden" name="classId" value={classInfo.id} />
                      <Button type="submit" variant="outline" size="sm" className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground">
                        <Trash2 className="h-3 w-3 mr-1" />
                        Hapus
                      </Button>
                    </form>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">
                Belum ada materi yang diunggah untuk kelas ini.
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Sidebar - Right Side */}
      <div className="lg:col-span-1">
        <EnrolledStudentsList classId={classInfo.id} />
      </div>
    </div>
    </div>
  );
}
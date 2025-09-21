// FILE: app/dashboard/components/StudentClassesView.tsx
'use client'

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState, useCallback } from "react";
import type { UserProfile } from "@/lib/types";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { UserCheck, BookOpen } from "lucide-react";

// Tipe data yang dibutuhkan disederhanakan untuk menampilkan kelas dan nama guru
type EnrolledClass = {
  classes: { 
    id: string; 
    name: string;
    description: string | null;
    profiles: { name: string | null; } | null; // Data guru
  } | null; 
};

export default function StudentClassesView({ userProfile }: { userProfile: Pick<UserProfile, 'id'> }) {
  // State disederhanakan: hanya untuk kelas yang sudah diikuti dan status loading
  const [enrolledClasses, setEnrolledClasses] = useState<EnrolledClass[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  // Logika pengambilan data yang jauh lebih simpel
  const fetchData = useCallback(async () => {
    setLoading(true);
    
    // Hanya ambil kelas tempat siswa terdaftar, dan sertakan data guru
    const { data: enrolledData, error } = await supabase
      .from('enrollments')
      .select(`
        classes!inner (
          id,
          name,
          description,
          profiles:teacher_id ( name )
        )
      `)
      .eq('student_id', userProfile.id)
      .order('name', { referencedTable: 'classes', ascending: true })
      .returns<EnrolledClass[]>();
      
    if (error) {
      console.error("Error fetching enrolled classes:", error);
      setEnrolledClasses([]);
    } else {
      setEnrolledClasses(enrolledData || []);
    }
    
    setLoading(false);
  }, [supabase, userProfile.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
        <div className="space-y-4">
            <Card>
                <CardHeader>
                    <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-4 w-64 bg-gray-200 rounded animate-pulse mt-2"></div>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div className="h-48 w-full bg-gray-200 rounded-lg animate-pulse"></div>
                    <div className="h-48 w-full bg-gray-200 rounded-lg animate-pulse"></div>
                    <div className="h-48 w-full bg-gray-200 rounded-lg animate-pulse"></div>
                </CardContent>
            </Card>
        </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Komponen utama sekarang hanya menampilkan kelas yang sudah diikuti */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5 text-primary" />
            Kelas yang Anda Ikuti
          </CardTitle>
          <CardDescription>
            Ini adalah daftar kelas di mana Anda telah ditambahkan oleh guru. Klik untuk melihat materi dan tugas.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {enrolledClasses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrolledClasses.map(({ classes }) => classes && (
                <Card key={classes.id} className="flex flex-col hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="text-lg">{classes.name}</CardTitle>
                    <CardDescription>
                      Oleh: {classes.profiles?.name || 'N/A'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                     <p className="text-sm text-muted-foreground line-clamp-3">
                        {classes.description || 'Tidak ada deskripsi untuk kelas ini.'}
                     </p>
                  </CardContent>
                  <div className="p-6 pt-0">
                    <Button asChild className="w-full">
                      <Link href={`/dashboard/class/${classes.id}`}>
                        Masuk Kelas
                      </Link>
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
                <BookOpen className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">Belum Ada Kelas</h3>
                <p className="mt-1 text-sm text-muted-foreground">Anda belum ditambahkan ke kelas manapun oleh guru.</p>
            </div>
          )}
        </CardContent>
      </Card>
      {/* Bagian "Pendaftaran Kelas Tersedia" telah dihapus sepenuhnya */}
    </div>
  );
}
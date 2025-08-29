// FILE: app/dashboard/components/StudentClassesView.tsx
'use client'

import { createClient } from "@/lib/supabase/client";
import { useEffect, useState, useCallback } from "react";
import type { UserProfile } from "@/lib/types";
import Link from "next/link";
// --- [PERBAIKAN 1] --- Ganti useActionState menjadi useFormState
import { useFormState, useFormStatus } from "react-dom";
import { enrollInClass, unenrollFromClass, type EnrollState } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Loader2, UserCheck, CheckCircle, BookOpen } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Definisikan tipe data yang akan kita gunakan
type AvailableClass = {
  id: string;
  name: string;
  description: string | null;
  sanity_product_id: string;
  profiles: { name: string | null; } | null; // Profil adalah objek, bukan array
};
type EnrolledClass = {
  classes: { id: string, name: string } | null; // Classes adalah objek, bukan array
};
type Entitlement = {
  sanity_product_id: string;
  product_name: string;
};

// ... (Komponen ClassCard tidak perlu diubah jika sudah dipindahkan ke sini)
function ClassCard({ classInfo, onEnroll }: { classInfo: AvailableClass, onEnroll: (classId: string) => void }) {
  const [isEnrolling, setIsEnrolling] = useState(false);

  const handlePress = async () => {
    setIsEnrolling(true);
    await onEnroll(classInfo.id);
    setIsEnrolling(false);
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle>{classInfo.name}</CardTitle>
        <CardDescription>Oleh: {classInfo.profiles?.name || 'N/A'}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col justify-end">
        <p className="text-sm text-muted-foreground mb-4 flex-1">{classInfo.description}</p>
        <Button onClick={handlePress} disabled={isEnrolling} className="w-full">
          {isEnrolling ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
          {isEnrolling ? 'Mendaftar...' : 'Daftar & Masuk'}
        </Button>
      </CardContent>
    </Card>
  );
}


export default function StudentClassesView({ userProfile }: { userProfile: Pick<UserProfile, 'id'> }) {
  const [availableClasses, setAvailableClasses] = useState<AvailableClass[]>([]);
  const [enrolledClasses, setEnrolledClasses] = useState<EnrolledClass[]>([]);
  const [entitlements, setEntitlements] = useState<Entitlement[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  const fetchData = useCallback(async () => {
    setLoading(true);
    
    // 1. Ambil "tiket" kelas
    const { data: entitlementsData } = await supabase.rpc('get_user_entitlements');
    setEntitlements(entitlementsData || []);

    // 2. Ambil kelas yang sudah diikuti
    const { data: enrolledData } = await supabase
      .from('enrollments')
      .select(`classes!inner(id, name)`)
      .eq('student_id', userProfile.id)
      // --- [PERBAIKAN 2] --- Gunakan .returns() untuk memaksa tipe yang benar
      .returns<EnrolledClass[]>();
    setEnrolledClasses(enrolledData || []);
    
    // 3. Ambil semua kelas yang tersedia
    const { data: allData } = await supabase
      .from('classes')
      .select(`id, name, description, sanity_product_id, profiles(name)`)
      .order('name', { ascending: true })
      // --- [PERBAIKAN 3] --- Gunakan .returns() untuk memaksa tipe yang benar
      .returns<AvailableClass[]>();
    setAvailableClasses(allData || []);

    setLoading(false);
  }, [supabase, userProfile.id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleEnroll = async (classId: string) => {
    const formData = new FormData();
    formData.append('classId', classId);
    const result = await enrollInClass(null, formData);
    if (result?.success) {
      alert(result.success);
      fetchData(); // Muat ulang data
    } else if (result?.error) {
      alert(result.error);
    }
  };

  if (loading) { /* ... UI Loading ... */ }

  return (
    <div className="container mx-auto p-0 md:p-6 max-w-7xl space-y-8">
      {/* Bagian 1: Kelas yang Sudah Diikuti */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2"><UserCheck className="h-5 w-5" />Kelas yang Anda Ikuti</CardTitle>
          <CardDescription>Ini adalah kelas-kelas yang sedang atau pernah Anda ikuti.</CardDescription>
        </CardHeader>
        <CardContent>
          {enrolledClasses.length > 0 ? (
            <div className="space-y-3">
              {enrolledClasses.map(({ classes }) => classes && (
                <div key={classes.id} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                  <Link href={`/dashboard/class/${classes.id}`} className="font-medium text-primary hover:underline">{classes.name}</Link>
                  <span className="text-sm text-green-600 font-semibold">Terdaftar</span>
                </div>
              ))}
            </div>
          ) : (<p className="text-muted-foreground text-center py-4">Anda belum terdaftar di kelas manapun.</p>)}
        </CardContent>
      </Card>
      <Separator />
      {/* Bagian 2: Kelas Tersedia Berdasarkan Pembayaran */}
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">Pendaftaran Kelas Tersedia</h2>
          <p className="text-muted-foreground mt-1">Pilih kelas berdasarkan produk yang telah Anda bayar.</p>
        </div>
        {entitlements.length === 0 ? (
          <Card className="text-center p-8 bg-gray-50">
            <p className="text-muted-foreground">Anda tidak memiliki hak akses pendaftaran kelas. Silakan selesaikan pembayaran di halaman Produk.</p>
          </Card>
        ) : (
          entitlements.map(entitlement => {
            const matchingClasses = availableClasses.filter(c => c.sanity_product_id === entitlement.sanity_product_id);
            return (
              <div key={entitlement.sanity_product_id} className="space-y-4">
                <h3 className="text-xl font-semibold flex items-center gap-2 text-green-700">
                  <CheckCircle className="h-5 w-5" />
                  <span>Akses Terbuka untuk: <span className="font-bold">{entitlement.product_name}</span></span>
                </h3>
                {matchingClasses.length > 0 ? (
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {matchingClasses.map(cls => (
                      <ClassCard key={cls.id} classInfo={cls} onEnroll={handleEnroll} />
                    ))}
                  </div>
                ) : (<Card className="text-center p-8"><p className="text-muted-foreground">Belum ada jadwal kelas yang dibuka oleh guru untuk produk ini.</p></Card>)}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
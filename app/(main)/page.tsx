import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, Star, ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Welcome to <span className="text-blue-600">Bimbel Master</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Platform pembelajaran modern untuk siswa, guru, dan administrator. 
            Kelola kelas, absensi, dan materi pembelajaran dengan mudah.
          </p>
          <div className="flex gap-4 justify-center">
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Fitur Unggulan
        </h2>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="mx-auto mb-4 p-3 bg-blue-100 rounded-full w-fit">
                <BookOpen className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle>Manajemen Kelas</CardTitle>
              <CardDescription>
                Kelola kelas, siswa, dan materi pembelajaran dengan sistem yang terintegrasi
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="mx-auto mb-4 p-3 bg-green-100 rounded-full w-fit">
                <Users className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle>Absensi Digital</CardTitle>
              <CardDescription>
                Sistem absensi digital untuk memantau kehadiran siswa secara real-time
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="mx-auto mb-4 p-3 bg-purple-100 rounded-full w-fit">
                <Star className="h-8 w-8 text-purple-600" />
              </div>
              <CardTitle>Dashboard Analitik</CardTitle>
              <CardDescription>
                Laporan dan analitik komprehensif untuk memantau progress pembelajaran
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
}

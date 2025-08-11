// FILE: app/(main)/about/page.tsx

import Image from 'next/image';
import { Users, Award, BookOpen, Target, Heart, Trophy } from 'lucide-react';

export default function AboutPage() {
  const stats = [
    { icon: Users, number: '1200+', label: 'Siswa Aktif', color: 'rgb(0,75,173)' },
    { icon: Award, number: '95%', label: 'Tingkat Kelulusan', color: 'rgb(209,51,19)' },
    { icon: BookOpen, number: '50+', label: 'Program Kelas', color: 'rgb(0,75,173)' },
    { icon: Trophy, number: '10+', label: 'Tahun Pengalaman', color: 'rgb(209,51,19)' }
  ];

  const values = [
    {
      icon: Target,
      title: 'Fokus pada Hasil',
      description: 'Kami berkomitmen untuk membantu setiap siswa mencapai target akademik mereka dengan metode pembelajaran yang terbukti efektif.'
    },
    {
      icon: Heart,
      title: 'Pembelajaran Personal',
      description: 'Setiap siswa adalah unik. Kami menyediakan pendekatan personal yang disesuaikan dengan gaya belajar dan kebutuhan individual.'
    },
    {
      icon: Users,
      title: 'Komunitas Supportif',
      description: 'Menciptakan lingkungan belajar yang positif dan mendukung dimana siswa dapat berkembang dengan percaya diri.'
    }
  ];

  const team = [
    {
      name: 'Dr. Ahmad Wijaya',
      role: 'Direktur Akademik',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
      description: 'Lulusan S3 Pendidikan dengan 15 tahun pengalaman dalam pengembangan kurikulum.'
    },
    {
      name: 'Sarah Putri, M.Pd',
      role: 'Kepala Divisi Matematika',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b550?q=80&w=400&auto=format&fit=crop',
      description: 'Spesialis Matematika dengan track record mengajar di berbagai institusi ternama.'
    },
    {
      name: 'Budi Santoso, S.Si',
      role: 'Koordinator Sains',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop',
      description: 'Ahli dalam bidang Fisika dan Kimia dengan pengalaman mengajar lebih dari 12 tahun.'
    }
  ];

  return (
    <main>
      {/* Hero Section */}
      <section className="py-20 px-4" style={{background: 'linear-gradient(135deg, rgba(0,75,173,0.05) 0%, rgba(209,51,19,0.05) 100%)'}}>
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm text-sm font-medium border mb-6" 
               style={{borderColor: 'rgb(0,75,173)', color: 'rgb(0,75,173)'}}>
            <div className="w-2 h-2 rounded-full animate-pulse" style={{backgroundColor: 'rgb(209,51,19)'}} />
            Tentang Kami
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6" style={{color: 'rgb(0,75,173)'}}>
            Membangun Masa Depan Cerah Melalui Pendidikan Berkualitas
          </h1>
          <p className="text-lg max-w-3xl mx-auto leading-relaxed" style={{color: 'rgb(0,75,173)', opacity: 0.8}}>
            Bimbel Master hadir sebagai solusi terpercaya untuk kebutuhan pendidikan siswa Indonesia. 
            Dengan pengalaman lebih dari 10 tahun, kami telah membantu ribuan siswa meraih impian akademik mereka.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <div key={index} className="text-center group">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110" 
                       style={{backgroundColor: `${stat.color}15`}}>
                    <Icon className="w-8 h-8" style={{color: stat.color}} />
                  </div>
                  <div className="text-3xl font-bold mb-2" style={{color: stat.color}}>
                    {stat.number}
                  </div>
                  <div className="text-sm" style={{color: 'rgb(0,75,173)', opacity: 0.8}}>
                    {stat.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 px-4" style={{background: 'linear-gradient(135deg, rgba(0,75,173,0.02) 0%, rgba(209,51,19,0.02) 100%)'}}>
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold leading-tight" style={{color: 'rgb(0,75,173)'}}>
                Perjalanan Kami Dimulai dari Mimpi Sederhana
              </h2>
              <div className="space-y-4">
                <p className="text-lg leading-relaxed" style={{color: 'rgb(0,75,173)', opacity: 0.8}}>
                  Pada tahun 2014, Bimbel Master didirikan dengan visi sederhana namun mulia: memberikan akses pendidikan berkualitas 
                  tinggi untuk semua kalangan. Dimulai dari sebuah ruang kecil dengan 5 siswa, kini kami telah berkembang menjadi 
                  institusi pendidikan yang dipercaya oleh ribuan keluarga.
                </p>
                <p className="text-lg leading-relaxed" style={{color: 'rgb(0,75,173)', opacity: 0.8}}>
                  Komitmen kami tidak pernah berubah: menghadirkan metode pembelajaran inovatif yang disesuaikan dengan kebutuhan 
                  setiap siswa, didukung oleh tenaga pengajar berpengalaman dan fasilitas modern.
                </p>
              </div>
            </div>
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4" 
                   style={{borderColor: 'rgba(0,75,173,0.1)'}}>
                <Image 
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=800&auto=format&fit=crop"
                  alt="Suasana belajar di Bimbel Master"
                  width={600}
                  height={400}
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 rounded-full blur-2xl" 
                   style={{backgroundColor: 'rgba(209,51,19,0.2)'}} />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 rounded-full blur-3xl" 
                   style={{backgroundColor: 'rgba(0,75,173,0.2)'}} />
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{color: 'rgb(0,75,173)'}}>
              Nilai-Nilai yang Kami Junjung Tinggi
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{color: 'rgb(0,75,173)', opacity: 0.8}}>
              Setiap keputusan dan tindakan kami didasari oleh nilai-nilai fundamental yang menjadi landasan kesuksesan siswa.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="bg-white p-8 rounded-2xl border-2 hover:shadow-xl transition-all duration-300 hover:-translate-y-1" 
                     style={{borderColor: 'rgba(0,75,173,0.1)'}}>
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6" 
                       style={{backgroundColor: index % 2 === 0 ? 'rgba(0,75,173,0.1)' : 'rgba(209,51,19,0.1)'}}>
                    <Icon className="w-7 h-7" 
                          style={{color: index % 2 === 0 ? 'rgb(0,75,173)' : 'rgb(209,51,19)'}} />
                  </div>
                  <h3 className="text-xl font-semibold mb-4" style={{color: 'rgb(0,75,173)'}}>
                    {value.title}
                  </h3>
                  <p className="leading-relaxed" style={{color: 'rgb(0,75,173)', opacity: 0.8}}>
                    {value.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 px-4" style={{background: 'linear-gradient(135deg, rgba(0,75,173,0.02) 0%, rgba(209,51,19,0.02) 100%)'}}>
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4" style={{color: 'rgb(0,75,173)'}}>
              Tim Pengajar Berpengalaman
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{color: 'rgb(0,75,173)', opacity: 0.8}}>
              Bertemu dengan para ahli pendidikan yang akan membimbing perjalanan akademik Anda menuju kesuksesan.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2" 
                   style={{borderColor: 'rgba(0,75,173,0.1)'}}>
                <div className="relative h-64">
                  <Image 
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-1" style={{color: 'rgb(0,75,173)'}}>
                    {member.name}
                  </h3>
                  <p className="text-sm font-medium mb-3" style={{color: 'rgb(209,51,19)'}}>
                    {member.role}
                  </p>
                  <p className="text-sm leading-relaxed" style={{color: 'rgb(0,75,173)', opacity: 0.8}}>
                    {member.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

export const metadata = {
  title: 'Tentang Kami - Bimbel Master',
  description: 'Pelajari lebih lanjut tentang Bimbel Master, visi misi kami, dan tim pengajar berpengalaman yang siap membantu kesuksesan akademik Anda.',
};

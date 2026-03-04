// app/(main)/about/page.tsx

import Image from 'next/image';
import { Users, Award, BookOpen, Target, Heart, Trophy, ArrowRight, Briefcase } from 'lucide-react';

export default function AboutPage() {
  const stats = [
    { icon: Users,    number: '1200+', label: 'Siswa Aktif',        color: 'var(--primary)' },
    { icon: Award,    number: '95%',   label: 'Tingkat Kelulusan',  color: 'var(--secondary)' },
    { icon: BookOpen, number: '50+',   label: 'Program Kelas',      color: 'var(--primary)' },
    { icon: Trophy,   number: '10+',   label: 'Tahun Pengalaman',   color: 'var(--accent)' },
  ];

  const values = [
    {
      icon: Target,
      title: 'Fokus pada Hasil',
      description: 'Kami berkomitmen untuk membantu setiap siswa mencapai target akademik mereka dengan metode pembelajaran yang terbukti efektif.',
    },
    {
      icon: Heart,
      title: 'Pembelajaran Personal',
      description: 'Setiap siswa adalah unik. Kami menyediakan pendekatan personal yang disesuaikan dengan gaya belajar dan kebutuhan individual.',
    },
    {
      icon: Users,
      title: 'Komunitas Supportif',
      description: 'Menciptakan lingkungan belajar yang positif dan mendukung dimana siswa dapat berkembang dengan percaya diri.',
    },
  ];

  const team = [
    {
      name: 'Dr. Ahmad Wijaya',
      role: 'Direktur Akademik',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop',
      description: 'Lulusan S3 Pendidikan dengan 15 tahun pengalaman dalam pengembangan kurikulum.',
    },
    {
      name: 'Sarah Putri, M.Pd',
      role: 'Kepala Divisi Matematika',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b550?q=80&w=400&auto=format&fit=crop',
      description: 'Spesialis Matematika dengan track record mengajar di berbagai institusi ternama.',
    },
    {
      name: 'Budi Santoso, S.Si',
      role: 'Koordinator Sains',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop',
      description: 'Ahli dalam bidang Fisika dan Kimia dengan pengalaman mengajar lebih dari 12 tahun.',
    },
  ];

  return (
    <main className="overflow-x-hidden bg-background text-foreground">

      {/* ── HERO ────────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-24 px-4 overflow-hidden bg-gradient-to-br from-background via-primary/5 to-secondary/5">
        <div className="absolute top-[-80px] right-[-80px] w-[400px] h-[400px] rounded-full pointer-events-none bg-primary/10 blur-3xl" />
        <div className="absolute bottom-[-60px] left-[-60px] w-72 h-72 rounded-full pointer-events-none bg-secondary/10 blur-3xl" />

        <div className="container mx-auto text-center relative z-10 space-y-6">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest bg-primary/10 border border-primary/20 text-primary">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
            Tentang Kami
          </span>
          <h1 className="text-5xl md:text-7xl font-sans font-extrabold leading-tight max-w-4xl mx-auto text-foreground">
            Tentang <span className="text-primary">Misi Kami</span>
          </h1>
          <p className="text-xl max-w-3xl mx-auto font-sans leading-relaxed text-foreground/70">
            Bimbel Master hadir sebagai solusi terpercaya untuk kebutuhan pendidikan siswa Indonesia.
            Dengan pengalaman lebih dari 10 tahun, kami telah membantu ribuan siswa meraih impian akademik mereka.
          </p>
        </div>
      </section>

      {/* ── STATS ───────────────────────────────────────────────────────── */}
      <section className="py-16 px-4 bg-background">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className="text-center group">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl flex items-center justify-center transition-all duration-300 group-hover:scale-110 bg-card border border-border/50 shadow-sm">
                    <Icon className="w-8 h-8" style={{ color: s.color }} />
                  </div>
                  <div className="text-3xl font-sans font-extrabold mb-1" style={{ color: s.color }}>{s.number}</div>
                  <div className="text-sm font-sans text-foreground/60 uppercase tracking-wider font-bold">{s.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── STORY ───────────────────────────────────────────────────────── */}
      <section className="py-24 px-4 bg-background/50">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            {/* Images left */}
            <div className="relative h-[550px]">
              <div className="absolute top-0 left-0 w-[65%] h-[75%] rounded-[2.5rem] overflow-hidden shadow-2xl shadow-primary/10">
                <Image src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&auto=format" alt="Bimbel Master" fill className="object-cover" />
              </div>
              <div className="absolute bottom-4 right-0 w-[55%] h-[55%] rounded-[2.5rem] overflow-hidden border-[10px] border-background shadow-2xl shadow-primary/10">
                <Image src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?q=80&w=600&auto=format&fit=crop" alt="Suasana belajar" fill className="object-cover" />
              </div>
              <div className="absolute top-1/2 left-[-30px] -translate-y-1/2 w-40 h-40 bg-accent/30 rounded-[2rem] rotate-12 -z-10 blur-xl" />
            </div>

            {/* Content right */}
            <div className="space-y-8">
              <h2 className="font-sans font-extrabold text-4xl lg:text-5xl leading-tight text-foreground">
                Perjalanan Kami Dimulai dari{' '}
                <span className="text-secondary">Mimpi Sederhana</span>
              </h2>
              <div className="space-y-4 text-lg text-foreground/70 font-sans leading-relaxed">
                <p>
                  Pada tahun 2014, Bimbel Master didirikan dengan visi sederhana namun mulia: memberikan akses pendidikan berkualitas
                  tinggi untuk semua kalangan. Dimulai dari sebuah ruang kecil dengan 5 siswa, kini kami telah berkembang menjadi
                  institusi pendidikan yang dipercaya oleh ribuan keluarga.
                </p>
                <p>
                  Komitmen kami tidak pernah berubah: menghadirkan metode pembelajaran inovatif yang disesuaikan dengan kebutuhan
                  setiap siswa, didukung oleh tenaga pengajar berpengalaman dan fasilitas modern.
                </p>
              </div>
              <div className="flex items-center gap-12 pt-4">
                {[
                  { label: 'Siswa Aktif', value: '1200+' },
                  { label: 'Program Kelas', value: '50+' },
                  { label: 'Tahun Pengalaman', value: '10+' },
                ].map((stat, i) => (
                  <div key={i}>
                    <div className="text-3xl font-sans font-extrabold text-primary">{stat.value}</div>
                    <div className="text-sm font-sans font-bold text-foreground/60 uppercase tracking-wider">{stat.label}</div>
                  </div>
                ))}
              </div>
              <button className="px-10 py-4 rounded-full font-bold flex items-center gap-2 text-primary-foreground transition-all hover:scale-105 bg-primary shadow-sm">
                Selengkapnya <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ── VALUES ──────────────────────────────────────────────────────── */}
      <section className="py-24 px-4 bg-background">
        <div className="container mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-sans font-extrabold text-foreground">
              Nilai-Nilai yang Kami <span className="text-primary">Junjung Tinggi</span>
            </h2>
            <p className="text-foreground/70 max-w-2xl mx-auto font-sans text-lg">
              Setiap keputusan dan tindakan kami didasari oleh nilai-nilai fundamental yang menjadi landasan kesuksesan siswa.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((v, i) => {
              const Icon = v.icon;
              const colors = ['var(--primary)', 'var(--secondary)', 'var(--accent)'];
              return (
                <div key={i} className="bg-card p-10 rounded-[2.5rem] border border-border/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-2">
                  <div className="w-20 h-20 rounded-[1.5rem] flex items-center justify-center mb-8 bg-card shadow-sm border border-border/50">
                    <Icon className="w-10 h-10" style={{ color: colors[i] }} />
                  </div>
                  <h3 className="text-2xl font-sans font-bold text-foreground mb-4">{v.title}</h3>
                  <p className="text-foreground/70 font-sans leading-relaxed">{v.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── TEAM ────────────────────────────────────────────────────────── */}
      <section className="py-24 px-4 bg-background/50">
        <div className="container mx-auto">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl md:text-5xl font-sans font-extrabold text-foreground">
              Tim Pengajar <span className="text-secondary">Berpengalaman</span>
            </h2>
            <p className="text-foreground/70 max-w-2xl mx-auto font-sans text-lg">
              Bertemu dengan para ahli pendidikan yang akan membimbing perjalanan akademik Anda menuju kesuksesan.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {team.map((m, i) => (
              <div key={i} className="bg-card rounded-[2.5rem] overflow-hidden border border-border/50 hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 hover:-translate-y-2">
                <div className="relative h-64">
                  <Image src={m.image} alt={m.name} fill className="object-cover" />
                </div>
                <div className="p-8 space-y-2">
                  <h3 className="text-xl font-sans font-bold text-foreground">{m.name}</h3>
                  <p className="text-sm font-bold text-primary font-sans">{m.role}</p>
                  <p className="text-foreground/70 font-sans text-sm leading-relaxed pt-1">{m.description}</p>
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

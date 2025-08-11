// FILE: app/(main)/blog/page.tsx

import Image from 'next/image';
import Link from 'next/link';
import { Calendar, User, Clock, ArrowRight, BookOpen, TrendingUp, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function BlogPage() {
  const featuredPost = {
    id: 1,
    title: 'Strategi Efektif Persiapan UTBK 2025: Panduan Lengkap untuk Sukses',
    excerpt: 'Temukan strategi dan tips terbaik untuk mempersiapkan UTBK 2025. Dari manajemen waktu hingga teknik menjawab soal, semua ada di sini.',
    content: 'UTBK 2025 semakin dekat dan persiapan yang matang adalah kunci kesuksesan. Dalam artikel ini, kami akan membahas strategi komprehensif yang telah terbukti membantu ribuan siswa meraih skor tinggi...',
    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=800&auto=format&fit=crop',
    author: 'Dr. Ahmad Wijaya',
    date: '15 Juli 2025',
    readTime: '8 menit',
    category: 'UTBK',
    views: 1520
  };

  const blogPosts = [
    {
      id: 2,
      title: 'Tips Mengatasi Kecemasan Saat Ujian: Panduan Psikologis untuk Siswa',
      excerpt: 'Kecemasan ujian adalah hal yang wajar, namun bisa diatasi dengan teknik yang tepat. Pelajari cara mengelola stres dan meningkatkan performa.',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=600&auto=format&fit=crop',
      author: 'Sarah Putri, M.Psi',
      date: '12 Juli 2025',
      readTime: '6 menit',
      category: 'Psikologi',
      views: 892
    },
    {
      id: 3,
      title: 'Matematika Tidak Sulit: Metode Visual untuk Memahami Konsep Kompleks',
      excerpt: 'Ubah persepsi Anda tentang matematika dengan pendekatan visual yang memudahkan pemahaman konsep-konsep rumit.',
      image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?q=80&w=600&auto=format&fit=crop',
      author: 'Budi Santoso, M.Pd',
      date: '10 Juli 2025',
      readTime: '7 menit',
      category: 'Matematika',
      views: 1156
    },
    {
      id: 4,
      title: 'Teknologi dalam Pendidikan: Bagaimana AI Mengubah Cara Belajar',
      excerpt: 'Eksplorasi peran kecerdasan buatan dalam dunia pendidikan dan bagaimana teknologi ini meningkatkan efektivitas pembelajaran.',
      image: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=600&auto=format&fit=crop',
      author: 'Lisa Amanda, S.Kom',
      date: '8 Juli 2025',
      readTime: '5 menit',
      category: 'Teknologi',
      views: 743
    },
    {
      id: 5,
      title: 'Fisika dalam Kehidupan Sehari-hari: Fenomena yang Menarik untuk Dipelajari',
      excerpt: 'Temukan keajaiban fisika di sekitar kita dan bagaimana pemahaman konsep fisika dapat meningkatkan apresiasi terhadap dunia.',
      image: 'https://images.unsplash.com/photo-1636466497217-26a8cbeaf0aa?q=80&w=600&auto=format&fit=crop',
      author: 'Rudi Hermawan, S.Si',
      date: '5 Juli 2025',
      readTime: '6 menit',
      category: 'Fisika',
      views: 654
    },
    {
      id: 6,
      title: 'Pentingnya Soft Skills dalam Dunia Kerja Modern',
      excerpt: 'Selain kemampuan akademik, soft skills menjadi faktor penentu kesuksesan. Pelajari skill apa saja yang penting untuk dikembangkan.',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=600&auto=format&fit=crop',
      author: 'Maya Sari, M.Pd',
      date: '3 Juli 2025',
      readTime: '8 menit',
      category: 'Karir',
      views: 987
    }
  ];

  const categories = [
    { name: 'UTBK', count: 12, icon: BookOpen },
    { name: 'Matematika', count: 8, icon: TrendingUp },
    { name: 'Psikologi', count: 6, icon: Users },
    { name: 'Teknologi', count: 4, icon: BookOpen },
    { name: 'Fisika', count: 5, icon: TrendingUp },
    { name: 'Karir', count: 7, icon: Users }
  ];

  return (
    <main>
      {/* Hero Section */}
      <section className="py-20 px-4" style={{background: 'linear-gradient(135deg, rgba(0,75,173,0.05) 0%, rgba(209,51,19,0.05) 100%)'}}>
        <div className="container mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm text-sm font-medium border mb-6" 
               style={{borderColor: 'rgb(0,75,173)', color: 'rgb(0,75,173)'}}>
            <div className="w-2 h-2 rounded-full animate-pulse" style={{backgroundColor: 'rgb(209,51,19)'}} />
            Blog Edukatif
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6" style={{color: 'rgb(0,75,173)'}}>
            Wawasan dan Tips Pendidikan Terkini
          </h1>
          <p className="text-lg max-w-3xl mx-auto leading-relaxed" style={{color: 'rgb(0,75,173)', opacity: 0.8}}>
            Temukan artikel-artikel inspiratif, tips belajar efektif, dan insight terbaru dari dunia pendidikan 
            yang akan membantu perjalanan akademik Anda.
          </p>
        </div>
      </section>

      {/* Featured Post */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium" 
                   style={{backgroundColor: 'rgba(209,51,19,0.1)', color: 'rgb(209,51,19)'}}>
                Featured Post
              </div>
              <h2 className="text-3xl md:text-4xl font-bold leading-tight" style={{color: 'rgb(0,75,173)'}}>
                {featuredPost.title}
              </h2>
              <p className="text-lg leading-relaxed" style={{color: 'rgb(0,75,173)', opacity: 0.8}}>
                {featuredPost.excerpt}
              </p>
              <div className="flex items-center gap-6 text-sm" style={{color: 'rgb(0,75,173)', opacity: 0.7}}>
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {featuredPost.author}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {featuredPost.date}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {featuredPost.readTime}
                </div>
              </div>
              <Button asChild 
                      className="px-6 py-3 rounded-xl border-2 hover:shadow-lg transition-all duration-300 group"
                      style={{
                        backgroundColor: 'rgb(209,51,19)', 
                        borderColor: 'rgb(209,51,19)', 
                        color: 'white'
                      }}>
                <Link href={`/blog/${featuredPost.id}`} className="inline-flex items-center gap-2">
                  Baca Selengkapnya
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                </Link>
              </Button>
            </div>
            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4" 
                   style={{borderColor: 'rgba(0,75,173,0.1)'}}>
                <Image 
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  width={600}
                  height={400}
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 rounded-full blur-2xl" 
                   style={{backgroundColor: 'rgba(209,51,19,0.2)'}} />
              <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full blur-3xl" 
                   style={{backgroundColor: 'rgba(0,75,173,0.2)'}} />
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4" style={{background: 'linear-gradient(135deg, rgba(0,75,173,0.02) 0%, rgba(209,51,19,0.02) 100%)'}}>
        <div className="container mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12" style={{color: 'rgb(0,75,173)'}}>
            Kategori Artikel
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category, index) => {
              const Icon = category.icon;
              return (
                <Link key={index} href={`/blog/category/${category.name.toLowerCase()}`}
                      className="bg-white p-4 rounded-xl border-2 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 text-center group"
                      style={{borderColor: 'rgba(0,75,173,0.1)'}}>
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center" 
                       style={{backgroundColor: index % 2 === 0 ? 'rgba(0,75,173,0.1)' : 'rgba(209,51,19,0.1)'}}>
                    <Icon className="w-6 h-6" 
                          style={{color: index % 2 === 0 ? 'rgb(0,75,173)' : 'rgb(209,51,19)'}} />
                  </div>
                  <h3 className="font-semibold text-sm mb-1" style={{color: 'rgb(0,75,173)'}}>
                    {category.name}
                  </h3>
                  <p className="text-xs" style={{color: 'rgb(0,75,173)', opacity: 0.7}}>
                    {category.count} artikel
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12" style={{color: 'rgb(0,75,173)'}}>
            Artikel Terbaru
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.map((post, index) => (
              <article key={post.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 group" 
                       style={{borderColor: 'rgba(0,75,173,0.1)'}}>
                <div className="relative h-48">
                  <Image 
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium" 
                       style={{backgroundColor: 'rgba(209,51,19,0.9)', color: 'white'}}>
                    {post.category}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-semibold mb-3 line-clamp-2 group-hover:opacity-80 transition-opacity" 
                      style={{color: 'rgb(0,75,173)'}}>
                    <Link href={`/blog/${post.id}`}>
                      {post.title}
                    </Link>
                  </h3>
                  <p className="text-sm leading-relaxed mb-4 line-clamp-3" 
                     style={{color: 'rgb(0,75,173)', opacity: 0.8}}>
                    {post.excerpt}
                  </p>
                  <div className="flex items-center justify-between text-xs" 
                       style={{color: 'rgb(0,75,173)', opacity: 0.7}}>
                    <div className="flex items-center gap-4">
                      <span>{post.author}</span>
                      <span>{post.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
          
          {/* Load More Button */}
          <div className="text-center mt-12">
            <Button className="px-8 py-3 rounded-xl border-2 hover:shadow-lg transition-all duration-300"
                    style={{
                      backgroundColor: 'transparent', 
                      borderColor: 'rgb(0,75,173)', 
                      color: 'rgb(0,75,173)'
                    }}>
              Muat Artikel Lainnya
            </Button>
          </div>
        </div>
      </section>
    </main>
  );
}

export const metadata = {
  title: 'Blog - Bimbel Master',
  description: 'Temukan artikel-artikel edukatif, tips belajar, dan insight terbaru dari dunia pendidikan di blog Bimbel Master.',
};

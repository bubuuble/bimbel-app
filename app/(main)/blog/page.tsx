// app/(main)/blog/page.tsx

import Image from 'next/image';
import Link from 'next/link';
import { Calendar, User, Clock, ArrowRight, BookOpen, TrendingUp, Users } from 'lucide-react';
import { client } from '@/sanity/lib/client';

const FEATURED_POST_QUERY = `
  *[_type == "blog" && featured == true] | order(_createdAt desc)[0] {
    _id, title, slug, excerpt,
    "imageUrl": featuredImage.asset->url,
    "imageAlt": featuredImage.alt,
    author, _createdAt, readTime, category, tags, featured
  }
`;

const BLOG_POSTS_QUERY = `
  *[_type == "blog"] | order(_createdAt desc)[0...6] {
    _id, title, slug, excerpt,
    "imageUrl": featuredImage.asset->url,
    "imageAlt": featuredImage.alt,
    author, _createdAt, readTime, category, tags, featured
  }
`;

const CATEGORIES_QUERY = `*[_type == "blog"]{ category }`;

interface BlogPost {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt: string;
  imageUrl?: string;
  imageAlt?: string;
  author: { name: string; bio?: string; avatar?: any };
  _createdAt: string;
  readTime: number;
  category: string;
  tags: string[];
  featured?: boolean;
}

interface Category { name: string; count: number }

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
}

function getCategoryIcon(category: string) {
  switch (category.toLowerCase()) {
    case 'utbk': case 'tips-belajar': return BookOpen;
    case 'matematika': case 'fisika': case 'kimia': case 'biologi': return TrendingUp;
    case 'psikologi': case 'motivasi': case 'karir': return Users;
    default: return BookOpen;
  }
}

export default async function BlogPage() {
  try {
    const [featuredPost, blogPosts, categoriesRaw]: [BlogPost | null, BlogPost[], { category: string }[]] =
      await Promise.all([
        client.fetch(FEATURED_POST_QUERY).catch(() => null),
        client.fetch(BLOG_POSTS_QUERY).catch(() => []),
        client.fetch(CATEGORIES_QUERY).catch(() => []),
      ]);

    const categoryData: Category[] = [];
    if (categoriesRaw?.length) {
      const m = new Map<string, number>();
      categoriesRaw.forEach(i => { if (i.category) m.set(i.category, (m.get(i.category) || 0) + 1); });
      m.forEach((count, name) => categoryData.push({ name, count }));
    }

    return (
      <main className="overflow-x-hidden">

        {/* ── HERO ──────────────────────────────────────────────────────── */}
        <section
          className="relative pt-32 pb-24 px-4 overflow-hidden bg-gradient-to-br from-background via-primary/5 to-secondary/5"
        >
          <div className="absolute top-[-80px] right-[-80px] w-[400px] h-[400px] rounded-full pointer-events-none bg-primary/10 blur-3xl" />
          <div className="absolute bottom-[-60px] left-[-60px] w-72 h-72 rounded-full pointer-events-none bg-secondary/10 blur-3xl" />

          <div className="container mx-auto text-center relative z-10 space-y-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest border border-primary/20 bg-primary/10 text-primary">
              <span className="w-1.5 h-1.5 rounded-full bg-secondary animate-pulse" />
              Blog Edukatif
            </span>
            <h1 className="text-5xl md:text-7xl font-sans font-extrabold leading-tight max-w-4xl mx-auto text-foreground">
              Blog <span className="text-primary">Edukatif</span>
            </h1>
            <p className="text-xl max-w-3xl mx-auto font-sans leading-relaxed text-foreground/70">
              Temukan artikel-artikel inspiratif, tips belajar efektif, dan insight terbaru dari dunia pendidikan
              yang akan membantu perjalanan akademik Anda.
            </p>
          </div>
        </section>

        {/* ── FEATURED POST ─────────────────────────────────────────────── */}
        {featuredPost && (
          <section className="py-20 px-4 bg-background">
            <div className="container mx-auto">
              <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div className="space-y-6">
                  <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold bg-accent/20 text-accent-foreground font-sans">
                    Artikel Unggulan
                  </span>
                  <h2 className="font-sans font-extrabold text-3xl md:text-4xl leading-tight text-foreground">
                    {featuredPost.title}
                  </h2>
                  <p className="text-lg text-foreground/70 font-sans leading-relaxed">{featuredPost.excerpt}</p>
                  <div className="flex items-center gap-6 text-sm text-foreground/60 font-sans font-medium">
                    <span className="flex items-center gap-1.5"><User className="w-4 h-4 text-primary" />{featuredPost.author.name}</span>
                    <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4 text-secondary" />{formatDate(featuredPost._createdAt)}</span>
                    <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-accent" />{featuredPost.readTime} menit</span>
                  </div>
                  <Link href={`/blog/${featuredPost.slug.current}`}
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-primary-foreground transition-all duration-300 group bg-primary shadow-sm hover:scale-105"
                  >
                    Baca Selengkapnya
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
                <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl shadow-primary/10 border border-border/50">
                  <Image src={featuredPost.imageUrl || '/image/dummy1.jpg'}
                    alt={featuredPost.imageAlt || featuredPost.title}
                    width={600} height={420} className="w-full h-auto" />
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── POSTS GRID ────────────────────────────────────────────────── */}
          <section className="py-24 px-4 bg-background/50">
          <div className="container mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-sans font-extrabold text-foreground">
                Artikel <span className="text-secondary">Terbaru</span>
              </h2>
            </div>
            {blogPosts?.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {blogPosts.map(post => (
                  <article key={post._id} className="bg-card rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 group border border-border/50 flex flex-col">
                    <div className="relative h-56 overflow-hidden">
                      <Image src={post.imageUrl || '/image/dummy1.jpg'}
                        alt={post.imageAlt || post.title} fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700" />
                      <div className="absolute top-4 left-4 px-4 py-1.5 rounded-full text-xs font-bold text-primary-foreground shadow-lg bg-primary">
                        {post.category}
                      </div>
                    </div>
                    <div className="p-8 space-y-4 flex flex-col flex-1">
                      <h3 className="text-xl font-bold text-foreground line-clamp-2 min-h-[56px] leading-snug group-hover:text-primary transition-colors font-sans">
                        <Link href={`/blog/${post.slug.current}`}>{post.title}</Link>
                      </h3>
                      <p className="text-sm text-foreground/70 font-sans leading-relaxed line-clamp-2 flex-grow">{post.excerpt}</p>
                      <div className="flex items-center justify-between text-xs text-foreground/60 font-medium pt-6 mt-auto border-t border-border/50">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-primary" />
                          {formatDate(post._createdAt)}
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-secondary" />
                          {post.readTime}m read
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-10 text-primary" />
                <p className="text-foreground/70 font-sans">Belum ada artikel tersedia.</p>
              </div>
            )}
          </div>
        </section>

      </main>
    );
  } catch (error) {
    console.error('Error fetching blog data:', error);
    return (
      <main>
        <section
          className="relative py-28 px-4 overflow-hidden bg-gradient-to-br from-background via-primary/5 to-secondary/5"
        >
          <div className="container mx-auto text-center relative z-10 space-y-4">
            <h1 className="text-4xl md:text-5xl font-sans font-extrabold text-foreground">Blog Edukatif</h1>
            <p className="text-lg text-foreground/60 max-w-3xl mx-auto">
              Maaf, terjadi kesalahan saat memuat konten blog. Silakan coba lagi nanti.
            </p>
          </div>
        </section>
      </main>
    );
  }
}

export const metadata = {
  title: 'Blog - Bimbel Master',
  description: 'Temukan artikel-artikel edukatif, tips belajar, dan insight terbaru dari dunia pendidikan di blog Bimbel Master.',
};

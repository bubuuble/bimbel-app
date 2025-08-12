// FILE: app/(main)/blog/page.tsx

import Image from 'next/image';
import Link from 'next/link';
import { Calendar, User, Clock, ArrowRight, BookOpen, TrendingUp, Users, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { client } from '@/sanity/lib/client';
import { urlForImage } from '@/sanity/lib/image';

// GROQ queries - More specific image handling
const FEATURED_POST_QUERY = `
  *[_type == "blog" && featured == true] | order(_createdAt desc)[0] {
    _id,
    title,
    slug,
    excerpt,
    "imageUrl": featuredImage.asset->url, // Diubah ke featuredImage
    "imageAlt": featuredImage.alt,        // Diubah ke featuredImage
    author,
    _createdAt,
    readTime,
    category,
    tags,
    featured
  }
`;

const BLOG_POSTS_QUERY = `
  *[_type == "blog"] | order(_createdAt desc)[0...6] {
    _id,
    title,
    slug,
    excerpt,
    "imageUrl": featuredImage.asset->url, // Diubah ke featuredImage
    "imageAlt": featuredImage.alt,        // Diubah ke featuredImage
    author,
    _createdAt,
    readTime,
    category,
    tags,
    featured
  }
`;

const CATEGORIES_QUERY = `
  *[_type == "blog"] {
    category
  }
`;

interface BlogPost {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt: string;
  imageUrl?: string;
  imageAlt?: string;
  author: {
    name: string;
    bio?: string;
    avatar?: any;
  };
  _createdAt: string;
  readTime: number;
  category: string;
  tags: string[];
  featured?: boolean;
}

interface Category {
  name: string;
  count: number;
}

// Helper function to format date
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

// Helper function to get category icon
function getCategoryIcon(category: string) {
  switch (category.toLowerCase()) {
    case 'utbk':
    case 'tips-belajar':
      return BookOpen;
    case 'matematika':
    case 'fisika':
    case 'kimia':
    case 'biologi':
      return TrendingUp;
    case 'psikologi':
    case 'motivasi':
    case 'karir':
      return Users;
    default:
      return BookOpen;
  }
}

export default async function BlogPage() {
  // Fetch data from Sanity with error handling
  try {
    const [featuredPost, blogPosts, categoriesRaw]: [BlogPost | null, BlogPost[], { category: string }[]] = await Promise.all([
      client.fetch(FEATURED_POST_QUERY).catch(() => null),
      client.fetch(BLOG_POSTS_QUERY).catch(() => []),
      client.fetch(CATEGORIES_QUERY).catch(() => [])
    ]);

    // Process categories to get unique categories with counts
    const categoryData: Category[] = [];
    if (categoriesRaw && categoriesRaw.length > 0) {
      const categoryMap = new Map<string, number>();
      
      categoriesRaw.forEach(item => {
        if (item.category) {
          categoryMap.set(item.category, (categoryMap.get(item.category) || 0) + 1);
        }
      });

      categoryMap.forEach((count, name) => {
        categoryData.push({ name, count });
      });
    }

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
          {featuredPost ? (
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
                    {featuredPost.author.name}
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    {formatDate(featuredPost._createdAt)}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {featuredPost.readTime} menit
                  </div>
                </div>
                <Button asChild 
                        className="px-6 py-3 rounded-xl border-2 hover:shadow-lg transition-all duration-300 group"
                        style={{
                          backgroundColor: 'rgb(209,51,19)', 
                          borderColor: 'rgb(209,51,19)', 
                          color: 'white'
                        }}>
                  <Link href={`/blog/${featuredPost.slug.current}`} className="inline-flex items-center gap-2">
                    Baca Selengkapnya
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                  </Link>
                </Button>
              </div>
              <div className="relative">
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4" 
                     style={{borderColor: 'rgba(0,75,173,0.1)'}}>
                  <Image 
                    src={featuredPost.imageUrl || '/image/dummy1.jpg'}
                    alt={featuredPost.imageAlt || featuredPost.title}
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
          ) : (
            <div className="text-center py-12">
              <p className="text-lg" style={{color: 'rgb(0,75,173)', opacity: 0.7}}>
                Belum ada artikel unggulan tersedia.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 px-4" style={{background: 'linear-gradient(135deg, rgba(0,75,173,0.02) 0%, rgba(209,51,19,0.02) 100%)'}}>
        <div className="container mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12" style={{color: 'rgb(0,75,173)'}}>
            Kategori Artikel
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categoryData && categoryData.length > 0 ? categoryData.map((category, index) => {
              const Icon = getCategoryIcon(category.name);
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
            }) : (
              <div className="col-span-full text-center py-8">
                <p className="text-sm" style={{color: 'rgb(0,75,173)', opacity: 0.7}}>
                  Kategori sedang dimuat...
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12" style={{color: 'rgb(0,75,173)'}}>
            Artikel Terbaru
          </h2>
          {blogPosts && blogPosts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post, index) => (
                <article key={post._id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 group" 
                         style={{borderColor: 'rgba(0,75,173,0.1)'}}>
                  <div className="relative h-48">
                    <Image 
                      src={post.imageUrl || '/image/dummy1.jpg'}
                      alt={post.imageAlt || post.title}
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
                      <Link href={`/blog/${post.slug.current}`}>
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
                        <span>{post.author.name}</span>
                        <span>{formatDate(post._createdAt)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-3 h-3" />
                        {post.readTime} menit
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg" style={{color: 'rgb(0,75,173)', opacity: 0.7}}>
                Belum ada artikel tersedia.
              </p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
  } catch (error) {
    console.error('Error fetching blog data:', error);
    
    // Return fallback UI when data fetching fails
    return (
      <main>
        <section className="py-20 px-4" style={{background: 'linear-gradient(135deg, rgba(0,75,173,0.05) 0%, rgba(209,51,19,0.05) 100%)'}}>
          <div className="container mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6" style={{color: 'rgb(0,75,173)'}}>
              Blog Edukatif
            </h1>
            <p className="text-lg max-w-3xl mx-auto leading-relaxed" style={{color: 'rgb(0,75,173)', opacity: 0.8}}>
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

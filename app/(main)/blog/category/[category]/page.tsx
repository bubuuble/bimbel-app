// FILE: app/(main)/blog/category/[category]/page.tsx

import Image from 'next/image';
import Link from 'next/link';
import { Calendar, User, Clock, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { client } from '@/sanity/lib/client';
import { urlForImage } from '@/sanity/lib/image';
import { notFound } from 'next/navigation';

// GROQ query for posts by category
const POSTS_BY_CATEGORY_QUERY = `
  *[_type == "blog" && category == $category] | order(_createdAt desc) {
    _id,
    title,
    slug,
    excerpt,
    "image": featuredImage{ // <-- Diubah ke featuredImage
      asset->{
        _id,
        url
      },
      alt
    },
    author,
    _createdAt,
    readTime,
    category,
    tags
  }
`;

// Get all categories for static generation
const CATEGORIES_QUERY = `
  array::unique(*[_type == "blog"].category)
`;

interface BlogPost {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt: string;
  image: {
    asset: {
      _id: string;
      url: string;
    };
    alt?: string;
  } | null;
  author: {
    name: string;
    bio?: string;
    avatar?: any;
  };
  _createdAt: string;
  readTime: number;
  category: string;
  tags: string[];
}

interface CategoryPageProps {
  params: Promise<{ category: string }>;
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

// Helper function to format category name for display
function formatCategoryName(category: string): string {
  const categoryMap: Record<string, string> = {
    'utbk': 'UTBK',
    'matematika': 'Matematika',
    'fisika': 'Fisika',
    'kimia': 'Kimia',
    'biologi': 'Biologi',
    'bahasa-indonesia': 'Bahasa Indonesia',
    'bahasa-inggris': 'Bahasa Inggris',
    'psikologi': 'Psikologi',
    'tips-belajar': 'Tips Belajar',
    'teknologi': 'Teknologi',
    'karir': 'Karir',
    'motivasi': 'Motivasi'
  };
  
  return categoryMap[category] || category.charAt(0).toUpperCase() + category.slice(1);
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { category } = await params;
  const posts: BlogPost[] = await client.fetch(POSTS_BY_CATEGORY_QUERY, { 
    category: formatCategoryName(category) 
  });

  const categoryDisplayName = formatCategoryName(category);

  if (posts.length === 0) {
    notFound();
  }

  return (
    <main>
      {/* Hero Section */}
      <section className="py-20 px-4" style={{background: 'linear-gradient(135deg, rgba(0,75,173,0.05) 0%, rgba(209,51,19,0.05) 100%)'}}>
        <div className="container mx-auto text-center">
          {/* Back Navigation */}
          <div className="mb-8">
            <Button asChild variant="ghost" className="text-blue-600 hover:text-blue-800">
              <Link href="/blog" className="inline-flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Kembali ke Blog
              </Link>
            </Button>
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm text-sm font-medium border mb-6" 
               style={{borderColor: 'rgb(0,75,173)', color: 'rgb(0,75,173)'}}>
            <div className="w-2 h-2 rounded-full animate-pulse" style={{backgroundColor: 'rgb(209,51,19)'}} />
            Kategori: {categoryDisplayName}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-6" style={{color: 'rgb(0,75,173)'}}>
            Artikel {categoryDisplayName}
          </h1>
          
          <p className="text-lg max-w-3xl mx-auto leading-relaxed" style={{color: 'rgb(0,75,173)', opacity: 0.8}}>
            Temukan artikel-artikel terbaik seputar {categoryDisplayName.toLowerCase()} yang akan membantu 
            perjalanan belajar Anda.
          </p>

          <div className="mt-6 text-sm" style={{color: 'rgb(0,75,173)', opacity: 0.7}}>
            {posts.length} artikel ditemukan
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-20 px-4 bg-white">
        <div className="container mx-auto">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article key={post._id} 
                       className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 group" 
                       style={{borderColor: 'rgba(0,75,173,0.1)'}}>
                <div className="relative h-48">
                  <Image 
                    src={post.image?.asset?.url || '/image/dummy1.jpg'}
                    alt={post.image?.alt || post.title}
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
        </div>
      </section>
    </main>
  );
}

export async function generateStaticParams() {
  const categories = await client.fetch(CATEGORIES_QUERY);
  return categories.map((category: string) => ({
    category: category.toLowerCase().replace(/\s+/g, '-'),
  }));
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { category } = await params;
  const categoryDisplayName = formatCategoryName(category);
  
  return {
    title: `Artikel ${categoryDisplayName} - Blog Bimbel Master`,
    description: `Temukan artikel-artikel terbaik seputar ${categoryDisplayName} di blog Bimbel Master.`,
  };
}

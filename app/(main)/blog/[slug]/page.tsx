// FILE: app/(main)/blog/[slug]/page.tsx

import Image from 'next/image';
import Link from 'next/link';
import { Calendar, User, Clock, ArrowLeft, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { client } from '@/sanity/lib/client';
import { urlForImage } from '@/sanity/lib/image';
import RichTextRenderer from '@/components/RichTextRenderer';
import { notFound } from 'next/navigation';

// GROQ queries
const BLOG_POST_QUERY = `
  *[_type == "blog" && slug.current == $slug][0] {
    _id,
    title,
    slug,
    excerpt,
    content,
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
    tags[],
    featured
  }
`;

const RELATED_POSTS_QUERY = `
  *[_type == "blog" && slug.current != $slug && category == $category] | order(_createdAt desc)[0...3] {
    _id,
    title,
    slug,
    excerpt,
    image {
      asset->{
        _id,
        url
      },
      alt
    },
    author,
    _createdAt,
    readTime,
    category
  }
`;

interface BlogPost {
  _id: string;
  title: string;
  slug: { current: string };
  excerpt: string;
  content: any[];
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
  featured: boolean;
}

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
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

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post: BlogPost = await client.fetch(BLOG_POST_QUERY, { slug });

  if (!post) {
    notFound();
  }

  const relatedPosts: BlogPost[] = await client.fetch(RELATED_POSTS_QUERY, { 
    slug: slug, 
    category: post.category 
  });

  return (
    <main>
      {/* Hero Section */}
      <section className="py-20 px-4" style={{background: 'linear-gradient(135deg, rgba(0,75,173,0.05) 0%, rgba(209,51,19,0.05) 100%)'}}>
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            {/* Back Navigation */}
            <div className="mb-8">
              <Button asChild variant="ghost" className="text-blue-600 hover:text-blue-800">
                <Link href="/blog" className="inline-flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Kembali ke Blog
                </Link>
              </Button>
            </div>

            {/* Category Badge */}
            <div className="mb-6">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium"
                    style={{backgroundColor: 'rgba(209,51,19,0.1)', color: 'rgb(209,51,19)'}}>
                {post.category}
              </span>
            </div>

            {/* Title */}
            <h1 className="text-3xl md:text-5xl font-bold leading-tight mb-6" 
                style={{color: 'rgb(0,75,173)'}}>
              {post.title}
            </h1>

            {/* Excerpt */}
            <p className="text-lg md:text-xl leading-relaxed mb-8" 
               style={{color: 'rgb(0,75,173)', opacity: 0.8}}>
              {post.excerpt}
            </p>

            {/* Meta Information */}
            <div className="flex flex-wrap items-center gap-6 text-sm mb-8" 
                 style={{color: 'rgb(0,75,173)', opacity: 0.7}}>
              <div className="flex items-center gap-2">
                <User className="w-4 h-4" />
                {post.author.name}
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {formatDate(post._createdAt)}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4" />
                {post.readTime} menit membaca
              </div>
            </div>

            {/* Featured Image */}
            {post.image && (
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 mb-8" 
                   style={{borderColor: 'rgba(0,75,173,0.1)'}}>
                <Image 
                  src={post.image.asset.url}
                  alt={post.image.alt || post.title}
                  width={1200}
                  height={600}
                  className="w-full h-auto"
                  priority
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Article Content */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">
            <article className="prose prose-lg max-w-none">
              <RichTextRenderer content={post.content} />
            </article>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-12 pt-8 border-t border-gray-200">
                <div className="flex items-center gap-2 mb-4">
                  <Tag className="w-5 h-5" style={{color: 'rgb(0,75,173)'}} />
                  <span className="font-semibold" style={{color: 'rgb(0,75,173)'}}>
                    Tags:
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag, index) => (
                    <span key={index} 
                          className="px-3 py-1 rounded-full text-sm font-medium"
                          style={{backgroundColor: 'rgba(0,75,173,0.1)', color: 'rgb(0,75,173)'}}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Author Info */}
            <div className="mt-12 p-6 rounded-2xl border-2" 
                 style={{borderColor: 'rgba(0,75,173,0.1)', backgroundColor: 'rgba(0,75,173,0.02)'}}>
              <div className="flex items-center gap-4">
                {post.author.avatar && (
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2" 
                       style={{borderColor: 'rgb(0,75,173)'}}>
                    <Image 
                      src={urlForImage(post.author.avatar)?.url() || ''}
                      alt={post.author.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div>
                  <h3 className="font-semibold text-lg" style={{color: 'rgb(0,75,173)'}}>
                    {post.author.name}
                  </h3>
                  {post.author.bio && (
                    <p className="text-sm mt-1" style={{color: 'rgb(0,75,173)', opacity: 0.8}}>
                      {post.author.bio}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <section className="py-16 px-4" style={{background: 'linear-gradient(135deg, rgba(0,75,173,0.02) 0%, rgba(209,51,19,0.02) 100%)'}}>
          <div className="container mx-auto">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-2xl md:text-3xl font-bold text-center mb-12" style={{color: 'rgb(0,75,173)'}}>
                Artikel Terkait
              </h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {relatedPosts.map((relatedPost) => (
                  <article key={relatedPost._id} 
                           className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 group" 
                           style={{borderColor: 'rgba(0,75,173,0.1)'}}>
                    <div className="relative h-48">
                      <Image 
                        src={relatedPost.image?.asset?.url || '/image/dummy1.jpg'}
                        alt={relatedPost.image?.alt || relatedPost.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-medium" 
                           style={{backgroundColor: 'rgba(209,51,19,0.9)', color: 'white'}}>
                        {relatedPost.category}
                      </div>
                    </div>
                    <div className="p-6">
                      <h3 className="text-lg font-semibold mb-3 line-clamp-2 group-hover:opacity-80 transition-opacity" 
                          style={{color: 'rgb(0,75,173)'}}>
                        <Link href={`/blog/${relatedPost.slug.current}`}>
                          {relatedPost.title}
                        </Link>
                      </h3>
                      <p className="text-sm leading-relaxed mb-4 line-clamp-3" 
                         style={{color: 'rgb(0,75,173)', opacity: 0.8}}>
                        {relatedPost.excerpt}
                      </p>
                      <div className="flex items-center justify-between text-xs" 
                           style={{color: 'rgb(0,75,173)', opacity: 0.7}}>
                        <div className="flex items-center gap-4">
                          <span>{relatedPost.author.name}</span>
                          <span>{formatDate(relatedPost._createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-3 h-3" />
                          {relatedPost.readTime} menit
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
}

export async function generateStaticParams() {
  const posts = await client.fetch(`*[_type == "blog"]{ slug }`);
  return posts.map((post: { slug: { current: string } }) => ({
    slug: post.slug.current,
  }));
}

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post: BlogPost = await client.fetch(BLOG_POST_QUERY, { slug });

  if (!post) {
    return {
      title: 'Artikel Tidak Ditemukan - Bimbel Master',
      description: 'Artikel yang Anda cari tidak ditemukan.',
    };
  }

  return {
    title: `${post.title} - Blog Bimbel Master`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: post.image ? [post.image.asset.url] : [],
    },
  };
}

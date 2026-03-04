// FILE: app/(main)/blog/[slug]/page.tsx

import Image from 'next/image';
import Link from 'next/link';
import { Calendar, User, Clock, ArrowLeft, Tag } from 'lucide-react';
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
    <main className="bg-white overflow-x-hidden">

      {/* ── ARTICLE HEADER ─────────────────────────────────────────── */}
      <section className="py-20 lg:py-32 px-6 bg-gradient-to-br from-background via-primary/5 to-secondary/5">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">

            <Link href="/blog"
              className="inline-flex items-center gap-2 font-bold mb-10 hover:gap-3 transition-all duration-200 font-sans text-primary group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              Back to Blog
            </Link>

            <div className="space-y-6">
              <span className="px-4 py-1.5 rounded-full text-primary-foreground text-xs font-bold font-sans bg-primary shadow-sm" >
                {post.category}
              </span>
              <h1 className="font-sans font-extrabold text-4xl md:text-6xl text-foreground leading-tight">
                {post.title}
              </h1>
              <p className="text-lg md:text-xl text-foreground/70 font-sans leading-relaxed">
                {post.excerpt}
              </p>
              <div className="flex flex-wrap items-center gap-8 text-foreground/60 font-sans font-medium pt-4 border-t border-border/50">
                <div className="flex items-center gap-2"><User className="w-5 h-5 text-primary" />{post.author.name}</div>
                <div className="flex items-center gap-2"><Calendar className="w-5 h-5 text-primary" />{formatDate(post._createdAt)}</div>
                <div className="flex items-center gap-2"><Clock className="w-5 h-5 text-primary" />{post.readTime} min read</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ARTICLE CONTENT ─────────────────────────────────────────── */}
      <section className="pb-24 px-6">
        <div className="container mx-auto">
          <div className="max-w-4xl mx-auto">

            {/* Featured Image — overlaps hero */}
            <div className="relative h-[500px] w-full rounded-[2.5rem] overflow-hidden shadow-2xl shadow-primary/5 border border-border/50 mb-16 -mt-10 lg:-mt-20">
              <Image
                src={post.image?.asset?.url || '/image/dummy1.jpg'}
                alt={post.image?.alt || post.title}
                fill
                className="object-cover"
                priority
              />
            </div>

            <article className="prose prose-lg prose-headings:font-sans prose-headings:font-extrabold prose-headings:text-foreground prose-p:font-sans prose-p:text-foreground/70 max-w-none">
              <RichTextRenderer content={post.content} />
            </article>

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-16 pt-8 border-t border-border/50 flex flex-wrap gap-3">
                {post.tags.map((tag, index) => (
                  <span key={index}
                    className="px-4 py-2 rounded-lg bg-card text-foreground/70 font-sans text-sm flex items-center gap-2 border border-border/50">
                    <Tag className="w-4 h-4 text-primary" /> {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Author Info */}
            <div className="mt-16 p-8 rounded-[2rem] border border-border/50 bg-primary/5">
              <div className="flex items-center gap-5">
                {post.author.avatar && (
                  <div className="w-16 h-16 rounded-full overflow-hidden border-2 flex-shrink-0 border-primary shadow-sm" >
                    <Image
                      src={urlForImage(post.author.avatar)?.url() || ''}
                      alt={post.author.name}
                      width={64} height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div>
                  <h3 className="font-sans font-bold text-lg text-foreground">{post.author.name}</h3>
                  {post.author.bio && (
                    <p className="text-sm text-foreground/70 font-sans mt-1">{post.author.bio}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── RELATED POSTS ───────────────────────────────────────────── */}
      {relatedPosts.length > 0 && (
        <section className="py-24 px-6 bg-background/50">
          <div className="container mx-auto">
            <div className="container mx-auto">
            <h2 className="text-3xl md:text-4xl font-sans font-extrabold text-center text-foreground mb-14">
              Artikel <span className="text-secondary">Terkait</span>
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedPosts.map((relatedPost) => (
                <article key={relatedPost._id}
                  className="bg-card rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-border/50 flex flex-col">
                  <div className="relative h-56 overflow-hidden">
                    <Image
                      src={relatedPost.image?.asset?.url || '/image/dummy1.jpg'}
                      alt={relatedPost.image?.alt || relatedPost.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute top-4 left-4 px-4 py-1.5 rounded-full text-xs font-bold text-primary-foreground shadow-sm bg-primary">
                      {relatedPost.category}
                    </div>
                  </div>
                  <div className="p-8 space-y-4 flex flex-col flex-1">
                    <h3 className="text-xl font-bold text-foreground line-clamp-2 min-h-[56px] leading-snug group-hover:text-primary transition-colors font-sans">
                      <Link href={`/blog/${relatedPost.slug.current}`}>{relatedPost.title}</Link>
                    </h3>
                    <p className="text-sm text-foreground/70 font-sans leading-relaxed line-clamp-2 flex-grow">{relatedPost.excerpt}</p>
                    <div className="flex items-center justify-between text-xs text-foreground/60 font-medium pt-6 mt-auto border-t border-border/50">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" />{formatDate(relatedPost._createdAt)}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-secondary" />{relatedPost.readTime}m read
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

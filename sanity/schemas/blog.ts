// FILE: sanity/schemas/blog.ts

import {defineField, defineType} from 'sanity'
import { DocumentTextIcon } from '@sanity/icons'

export default defineType({
  name: 'blog',
  title: 'Blog Post',
  type: 'document',
  icon: DocumentTextIcon,
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'meta', title: 'Meta Data'},
    {name: 'seo', title: 'SEO'}
  ],
  fields: [
    // Content Fields
    defineField({
      name: 'title',
      title: 'Judul Artikel',
      type: 'string',
      group: 'content',
      validation: Rule => Rule.required().max(100)
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      options: {
        source: 'title',
        maxLength: 96,
        slugify: input => input
          .toLowerCase()
          .replace(/\s+/g, '-')
          .replace(/[^\w\-]+/g, '')
          .replace(/\-\-+/g, '-')
          .replace(/^-+/, '')
          .replace(/-+$/, '')
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'excerpt',
      title: 'Ringkasan',
      type: 'text',
      group: 'content',
      validation: Rule => Rule.required().min(50).max(300),
      description: 'Ringkasan singkat artikel (50-300 karakter)'
    }),
    defineField({
      name: 'featuredImage',
      title: 'Gambar Utama',
      type: 'image',
      group: 'content',
      options: {
        hotspot: true
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Teks Alternatif'
        },
        {
          name: 'caption',
          type: 'string',
          title: 'Caption'
        }
      ],
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'category',
      title: 'Kategori',
      type: 'string',
      group: 'content',
      options: {
        list: [
          {title: 'UTBK', value: 'utbk'},
          {title: 'Matematika', value: 'matematika'},
          {title: 'Fisika', value: 'fisika'},
          {title: 'Kimia', value: 'kimia'},
          {title: 'Biologi', value: 'biologi'},
          {title: 'Bahasa Indonesia', value: 'bahasa-indonesia'},
          {title: 'Bahasa Inggris', value: 'bahasa-inggris'},
          {title: 'Psikologi', value: 'psikologi'},
          {title: 'Tips Belajar', value: 'tips-belajar'},
          {title: 'Teknologi', value: 'teknologi'},
          {title: 'Karir', value: 'karir'},
          {title: 'Motivasi', value: 'motivasi'}
        ]
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      group: 'content',
      of: [{type: 'string'}],
      options: {
        layout: 'tags'
      }
    }),
    defineField({
      name: 'content',
      title: 'Konten Artikel',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'H1', value: 'h1'},
            {title: 'H2', value: 'h2'},
            {title: 'H3', value: 'h3'},
            {title: 'H4', value: 'h4'}
          ],
          lists: [
            {title: 'Bullet', value: 'bullet'},
            {title: 'Number', value: 'number'}
          ],
          marks: {
            decorators: [
              {title: 'Strong', value: 'strong'},
              {title: 'Emphasis', value: 'em'},
              {title: 'Code', value: 'code'},
              {title: 'Underline', value: 'underline'},
              {title: 'Strike', value: 'strike-through'}
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                    title: 'URL',
                    validation: Rule => Rule.uri({
                      scheme: ['http', 'https', 'mailto', 'tel']
                    })
                  },
                  {
                    name: 'blank',
                    type: 'boolean',
                    title: 'Open in new tab',
                    initialValue: true
                  }
                ]
              },
              {
                name: 'highlight',
                type: 'object',
                title: 'Highlight',
                fields: [
                  {
                    name: 'color',
                    type: 'string',
                    title: 'Color',
                    options: {
                      list: [
                        {title: 'Yellow', value: 'yellow'},
                        {title: 'Green', value: 'green'},
                        {title: 'Blue', value: 'blue'},
                        {title: 'Red', value: 'red'}
                      ]
                    }
                  }
                ]
              }
            ]
          }
        },
        {
          type: 'image',
          options: {hotspot: true},
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Teks Alternatif'
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption'
            }
          ]
        },
        {
          type: 'object',
          name: 'codeBlock',
          title: 'Code Block',
          fields: [
            {
              name: 'language',
              type: 'string',
              title: 'Language',
              options: {
                list: [
                  {title: 'JavaScript', value: 'javascript'},
                  {title: 'Python', value: 'python'},
                  {title: 'HTML', value: 'html'},
                  {title: 'CSS', value: 'css'},
                  {title: 'PHP', value: 'php'},
                  {title: 'SQL', value: 'sql'}
                ]
              }
            },
            {
              name: 'code',
              type: 'text',
              title: 'Code'
            }
          ]
        },
        // Custom blockquote object to avoid HTML nesting issues
        {
          type: 'blockquote'
        }
      ],
      validation: Rule => Rule.required()
    }),

    // Meta Data Fields
    defineField({
      name: 'author',
      title: 'Penulis',
      type: 'object',
      group: 'meta',
      fields: [
        {
          name: 'name',
          type: 'string',
          title: 'Nama',
          validation: Rule => Rule.required()
        },
        {
          name: 'bio',
          type: 'text',
          title: 'Bio Singkat'
        },
        {
          name: 'avatar',
          type: 'image',
          title: 'Foto Profil',
          options: {hotspot: true}
        }
      ],
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'publishedAt',
      title: 'Tanggal Publikasi',
      type: 'datetime',
      group: 'meta',
      initialValue: () => new Date().toISOString()
    }),
    defineField({
      name: 'readTime',
      title: 'Estimasi Waktu Baca (menit)',
      type: 'number',
      group: 'meta',
      validation: Rule => Rule.required().min(1).max(60)
    }),
    defineField({
      name: 'featured',
      title: 'Artikel Unggulan',
      type: 'boolean',
      group: 'meta',
      initialValue: false,
      description: 'Centang untuk menampilkan di featured section'
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      group: 'meta',
      options: {
        list: [
          {title: 'Draft', value: 'draft'},
          {title: 'Published', value: 'published'},
          {title: 'Archived', value: 'archived'}
        ]
      },
      initialValue: 'draft'
    }),

    // SEO Fields
    defineField({
      name: 'seoTitle',
      title: 'SEO Title',
      type: 'string',
      group: 'seo',
      validation: Rule => Rule.max(60),
      description: 'Judul untuk SEO (max 60 karakter)'
    }),
    defineField({
      name: 'seoDescription',
      title: 'SEO Description',
      type: 'text',
      group: 'seo',
      validation: Rule => Rule.max(160),
      description: 'Deskripsi untuk SEO (max 160 karakter)'
    }),
    defineField({
      name: 'seoKeywords',
      title: 'SEO Keywords',
      type: 'array',
      group: 'seo',
      of: [{type: 'string'}],
      options: {
        layout: 'tags'
      }
    })
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'category',
      media: 'featuredImage',
      author: 'author.name',
      status: 'status'
    },
    prepare(selection) {
      const {title, subtitle, media, author, status} = selection
      const statusEmoji = status === 'published' ? '✅' : status === 'draft' ? '📝' : '📦'
      return {
        title: title,
        subtitle: `${statusEmoji} ${subtitle} • ${author}`,
        media: media
      }
    }
  },
  orderings: [
    {
      title: 'Terbaru',
      name: 'publishedAtDesc',
      by: [
        {field: 'publishedAt', direction: 'desc'}
      ]
    },
    {
      title: 'Terlama',
      name: 'publishedAtAsc',
      by: [
        {field: 'publishedAt', direction: 'asc'}
      ]
    },
    {
      title: 'Judul A-Z',
      name: 'titleAsc',
      by: [
        {field: 'title', direction: 'asc'}
      ]
    },
    {
      title: 'Kategori A-Z',
      name: 'categoryAsc',
      by: [
        {field: 'category', direction: 'asc'}
      ]
    }
  ]
})

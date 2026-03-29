// sanity/schemas/gallery.ts

import { defineField, defineType } from 'sanity'
import { ImageIcon } from '@sanity/icons'

export default defineType({
  name: 'gallery',
  title: 'Gallery',
  type: 'document',
  icon: ImageIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Judul',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'image',
      title: 'Gambar',
      type: 'image',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Teks Alternatif',
          validation: Rule => Rule.required()
        }
      ],
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'category',
      title: 'Kategori',
      type: 'string',
      options: {
        list: [
          { title: 'Kegiatan', value: 'kegiatan' },
          { title: 'Fasilitas', value: 'fasilitas' },
          { title: 'Prestasi', value: 'prestasi' },
          { title: 'Event', value: 'event' },
          { title: 'Lainnya', value: 'lainnya' },
        ],
        layout: 'radio'
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'description',
      title: 'Deskripsi',
      type: 'text',
      description: 'Keterangan singkat tentang gambar'
    }),
    defineField({
      name: 'publishedAt',
      title: 'Tanggal',
      type: 'datetime',
      initialValue: () => new Date().toISOString()
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'category',
      media: 'image'
    }
  },
  orderings: [
    {
      title: 'Terbaru',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }]
    }
  ]
})

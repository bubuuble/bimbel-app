// sanity/schemas/prestasiSiswa.ts

import { defineField, defineType } from 'sanity'
import { StarIcon } from '@sanity/icons'

export default defineType({
  name: 'prestasiSiswa',
  title: 'Prestasi Siswa',
  type: 'document',
  icon: StarIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Nama Siswa',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'achievementTitle',
      title: 'Judul Prestasi',
      type: 'string',
      description: 'Contoh: Diterima di FK UI, Juara 1 OSN Matematika',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'universityAccepted',
      title: 'Universitas/Institusi',
      type: 'string',
      description: 'Universitas yang diterima atau institusi penyelenggara kompetisi'
    }),
    defineField({
      name: 'competitionWon',
      title: 'Kompetisi yang Dimenangkan',
      type: 'string',
      description: 'Contoh: OSN Fisika, KSN Informatika, lomba debat nasional'
    }),
    defineField({
      name: 'description',
      title: 'Deskripsi Prestasi',
      type: 'text',
      description: 'Cerita singkat tentang pencapaian siswa',
      validation: Rule => Rule.max(500)
    }),
    defineField({
      name: 'image',
      title: 'Foto Siswa',
      type: 'image',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Teks Alternatif'
        }
      ]
    }),
    defineField({
      name: 'school',
      title: 'Asal Sekolah',
      type: 'string'
    }),
    defineField({
      name: 'program',
      title: 'Program yang Diikuti',
      type: 'string',
      options: {
        list: [
          { title: 'SD', value: 'sd' },
          { title: 'SMP', value: 'smp' },
          { title: 'SMA', value: 'sma' },
          { title: 'UTBK', value: 'utbk' },
          { title: 'Olimpiade', value: 'olimpiade' },
          { title: 'Umum', value: 'umum' },
        ]
      }
    }),
    defineField({
      name: 'year',
      title: 'Tahun Prestasi',
      type: 'string',
      description: 'Contoh: 2024, 2025'
    }),
    defineField({
      name: 'featured',
      title: 'Tampilkan di Beranda',
      type: 'boolean',
      initialValue: false,
      description: 'Centang untuk menampilkan di halaman utama'
    }),
    defineField({
      name: 'publishedAt',
      title: 'Tanggal Publikasi',
      type: 'datetime',
      initialValue: () => new Date().toISOString()
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'achievementTitle',
      media: 'image'
    },
    prepare(selection) {
      const { title, subtitle, media } = selection
      return {
        title,
        subtitle: subtitle || 'No achievement title',
        media
      }
    }
  },
  orderings: [
    {
      title: 'Terbaru',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }]
    },
    {
      title: 'Nama A-Z',
      name: 'nameAsc',
      by: [{ field: 'name', direction: 'asc' }]
    }
  ]
})

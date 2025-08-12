// FILE: sanity/schemas/testimonial.ts

import {defineField, defineType} from 'sanity'
import { UserIcon } from '@sanity/icons'

export default defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({
      name: 'name',
      title: 'Nama Siswa',
      type: 'string',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'testimonial',
      title: 'Testimoni',
      type: 'text',
      validation: Rule => Rule.required().min(10).max(500)
    }),
    defineField({
      name: 'image',
      title: 'Foto Siswa',
      type: 'image',
      options: {
        hotspot: true
      },
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
          {title: 'SD', value: 'sd'},
          {title: 'SMP', value: 'smp'},
          {title: 'SMA', value: 'sma'},
          {title: 'SBMPTN', value: 'sbmptn'},
          {title: 'CPNS', value: 'cpns'},
          {title: 'TOEFL', value: 'toefl'},
          {title: 'Umum', value: 'umum'},
          {title: 'UTBK', value: 'utbk'},
          {title: 'Olimpiade Matematika', value: 'olimpiade-matematika'},
          {title: 'Olimpiade Fisika', value: 'olimpiade-fisika'},
          {title: 'Olimpiade Kimia', value: 'olimpiade-kimia'},
          {title: 'Persiapan UN', value: 'persiapan-un'},
          {title: 'Bimbingan Reguler', value: 'bimbingan-reguler'}
        ]
      },
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'achievement',
      title: 'Pencapaian',
      type: 'string',
      description: 'Contoh: PTN Favorit, Juara Olimpiade, dll'
    }),
    defineField({
      name: 'rating',
      title: 'Rating (1-5)',
      type: 'number',
      validation: Rule => Rule.required().min(1).max(5)
    }),
    defineField({
      name: 'featured',
      title: 'Tampilkan di Beranda',
      type: 'boolean',
      initialValue: false,
      description: 'Centang untuk menampilkan testimoni ini di halaman utama'
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
      subtitle: 'school',
      media: 'image',
      rating: 'rating'
    },
    prepare(selection) {
      const {title, subtitle, media, rating} = selection
      return {
        title: title,
        subtitle: `${subtitle} - ${rating ? '★'.repeat(rating) : 'No rating'}`,
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
      title: 'Rating Tertinggi',
      name: 'ratingDesc',
      by: [
        {field: 'rating', direction: 'desc'}
      ]
    },
    {
      title: 'Nama A-Z',
      name: 'nameAsc',
      by: [
        {field: 'name', direction: 'asc'}
      ]
    }
  ]
})

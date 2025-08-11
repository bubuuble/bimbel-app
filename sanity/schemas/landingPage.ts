// FILE: bimbel-cms/sanity/schemas/landingPage.ts (VERSI SEDERHANA)

import {defineField, defineType} from 'sanity'
import { HomeIcon } from '@sanity/icons'

export default defineType({
  name: 'landingPage',
  title: 'Landing Page',
  type: 'document',
  icon: HomeIcon,
  // Hanya ada satu dokumen "Landing Page", cegah pembuatan dokumen baru
  groups: [
    { name: 'hero', title: 'Hero Section', default: true },
    { name: 'stats', title: 'Company Stats' },
    { name: 'supporters', title: 'Supporters' },
    { name: 'benefits', title: 'Value & Outcomes' },
    { name: 'pricing', title: 'Pricing' },
    { name: 'testimonials', title: 'Testimonials' },
    { name: 'cta', title: 'Call to Action' },
  ],
  fields: [
    // --- Hero Section ---
    defineField({ name: 'heroTitle', title: 'Hero: Judul Utama', type: 'string', group: 'hero' }),
    defineField({ name: 'heroDescription', title: 'Hero: Deskripsi', type: 'text', group: 'hero' }),
    defineField({
      name: 'heroImages', title: 'Hero: Gambar Carousel', type: 'array', group: 'hero',
      of: [{ type: 'image', options: { hotspot: true }, fields: [{ name: 'alt', type: 'string', title: 'Teks Alternatif' }] }],
    }),

    // --- Company Stats Section (Data dimasukkan langsung) ---
    defineField({
      name: 'companyStats', title: 'Company Stats', type: 'array', group: 'stats',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'title', title: 'Judul', type: 'string' }),
          defineField({ name: 'targetValue', title: 'Nilai Angka', type: 'number' }),
          defineField({ name: 'suffix', title: 'Suffix (e.g., +)', type: 'string' }),
          defineField({ name: 'icon', title: 'Nama Ikon Lucide', type: 'string' }),
        ]
      }],
    }),

    // --- Supporters Section (Data dimasukkan langsung) ---
    defineField({
      name: 'supporters', title: 'Supporters / Partners', type: 'array', group: 'supporters',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'name', title: 'Nama Partner', type: 'string' }),
          defineField({ name: 'logo', title: 'Logo', type: 'image' }),
        ]
      }],
    }),
    
    // --- Value Proposition & Outcomes (Digabung) ---
    defineField({ name: 'benefitsTitle', title: 'Judul Keuntungan & Capaian', type: 'string', group: 'benefits' }),
    defineField({
      name: 'benefitsList', title: 'Daftar Keuntungan & Capaian', type: 'array', group: 'benefits',
      of: [{
        type: 'object',
        fields: [
            defineField({ name: 'title', title: 'Judul', type: 'string' }),
            defineField({ name: 'description', title: 'Deskripsi', type: 'text' }),
            defineField({ name: 'icon', title: 'Nama Ikon Lucide', type: 'string' }),
        ]
      }]
    }),

    // --- Pricing Section (Data dimasukkan langsung) ---
    defineField({
      name: 'pricingPackages', title: 'Paket Harga', type: 'array', group: 'pricing',
      of: [{
        type: 'object',
        name: 'pricingPackage',
        fields: [
          defineField({ name: 'name', title: 'Nama Paket', type: 'string' }),
          defineField({ name: 'price', title: 'Harga (teks)', type: 'string' }),
          defineField({ name: 'price_period', title: 'Periode Harga', type: 'string' }),
          defineField({
            name: 'features', title: 'Fitur Paket', type: 'array',
            of: [{ type: 'object', fields: [{name: 'text', type: 'string'}, {name: 'included', type: 'boolean', initialValue: true}]}]
          }),
          defineField({ name: 'isFeatured', title: 'Paket Unggulan?', type: 'boolean' }),
        ]
      }],
    }),

    // --- Testimonials Section (Data dimasukkan langsung) ---
    defineField({
      name: 'testimonials', title: 'Testimonials', type: 'array', group: 'testimonials',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'name', title: 'Nama Siswa', type: 'string' }),
          defineField({ name: 'testimonial', title: 'Kutipan', type: 'text' }),
          defineField({ name: 'image', title: 'Foto Siswa', type: 'image', options: { hotspot: true } }),
        ]
      }],
    }),
    
    // --- CTA Section ---
    defineField({ name: 'ctaTitle', title: 'CTA: Judul', type: 'string', group: 'cta' }),
    defineField({ name: 'ctaDescription', title: 'CTA: Deskripsi', type: 'text', group: 'cta' }),
  ],
})
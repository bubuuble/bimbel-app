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
    defineField({
      name: 'heroFloatingObjects', title: 'Hero: Floating Objects', type: 'array', group: 'hero',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'text', title: 'Text', type: 'string' }),
          defineField({ name: 'label', title: 'Label', type: 'string' }),
          defineField({ name: 'image', title: 'Icon Image', type: 'image' }),
          defineField({ name: 'position', title: 'CSS Position Class', type: 'string', 
            description: 'e.g., "top-16 left-10" or "bottom-20 right-16"' }),
        ]
      }],
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

  ],
})
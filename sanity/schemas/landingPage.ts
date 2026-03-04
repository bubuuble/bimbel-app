// FILE: bimbel-cms/sanity/schemas/landingPage.ts (VERSI SEDERHANA)

import { defineField, defineType } from 'sanity'
import { HomeIcon } from '@sanity/icons'

export default defineType({
  name: 'landingPage',
  title: 'Landing Page',
  type: 'document',
  icon: HomeIcon,
  // Hanya ada satu dokumen "Landing Page", cegah pembuatan dokumen baru
  groups: [
    { name: 'hero', title: 'Hero Section', default: true },
    { name: 'supporters', title: 'Supporters / Logos' },
    { name: 'features', title: 'Fitur Prioritas' },
    { name: 'products', title: 'Program Section' },
    { name: 'why', title: 'Why Us Section' },
    { name: 'testimonials', title: 'Testimonials Section' },
    { name: 'cta', title: 'CTA Banner' },
  ],
  fields: [
    // --- Hero Section ---
    defineField({
      name: 'heroImages', title: 'Hero: Gambar Carousel', type: 'array', group: 'hero',
      of: [{ type: 'image', options: { hotspot: true }, fields: [{ name: 'alt', type: 'string', title: 'Teks Alternatif' }] }],
    }),

    // --- Supporters Section ---
    defineField({ name: 'supportersSubtitle', title: 'Supporters Subtitle', type: 'styledText', group: 'supporters', description: 'Teks kecil di atas logo (ex: Alumni kami diterima di)' }),
    defineField({
      name: 'supporters', title: 'Supporters Logos', type: 'array', group: 'supporters',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'name', title: 'Nama Partner', type: 'string' }),
          defineField({ name: 'logo', title: 'Logo', type: 'image' }),
        ]
      }],
    }),

    // --- Features Strip Section ---
    defineField({ name: 'featuresSubtitle', title: 'Features Subtitle', type: 'styledText', group: 'features' }),
    defineField({
      name: 'featuresList', title: 'Features Iterms', type: 'array', group: 'features',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'label', title: 'Label', type: 'string' }),
          defineField({
            name: 'icon', title: 'Icon', type: 'string',
            options: {
              list: ['BookOpen', 'Users', 'Award', 'UserCheck', 'GraduationCap', 'Zap', 'Target', 'Clock', 'MessageCircle', 'CheckCircle', 'Globe', 'Shield', 'TrendingUp', 'Heart']
            }
          }),
        ]
      }]
    }),

    // --- Products Section ---
    defineField({ name: 'productsSubtitle', title: 'Products Subtitle', type: 'styledText', group: 'products' }),
    // --- Why Us Section ---
    defineField({ name: 'whySubtitle', title: 'Why Us Subtitle', type: 'styledText', group: 'why' }),
    defineField({ name: 'whyTitle', title: 'Why Us Title', type: 'styledText', group: 'why' }),
    defineField({ name: 'whyDescription', title: 'Why Us Description', type: 'text', group: 'why' }),
    defineField({
      name: 'whyList', title: 'Why Us Items', type: 'array', group: 'why',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'title', title: 'Title', type: 'string' }),
          defineField({ name: 'description', title: 'Description', type: 'text' }),
          defineField({
            name: 'icon', title: 'Icon', type: 'string',
            options: {
              list: ['BookOpen', 'Users', 'Award', 'UserCheck', 'GraduationCap', 'Zap', 'Target', 'Clock', 'MessageCircle', 'CheckCircle', 'Globe', 'Shield', 'TrendingUp', 'Heart']
            }
          }),
        ]
      }]
    }),

    // --- Testimonials Section ---
    defineField({ name: 'testimonialsSubtitle', title: 'Testimonials Subtitle', type: 'styledText', group: 'testimonials' }),

    // --- CTA Section ---
    defineField({ name: 'ctaSubtitle', title: 'CTA Subtitle', type: 'styledText', group: 'cta' }),
    defineField({ name: 'ctaTitle', title: 'CTA Title', type: 'styledText', group: 'cta' }),
    defineField({ name: 'ctaDescription', title: 'CTA Description', type: 'text', group: 'cta' }),
    defineField({
      name: 'ctaButtons', title: 'CTA Buttons', type: 'array', group: 'cta',
      of: [{
        type: 'object',
        fields: [
          defineField({ name: 'label', title: 'Button Label', type: 'string' }),
          defineField({ name: 'url', title: 'Button URL', type: 'string' }),
          defineField({ name: 'style', title: 'Button Style', type: 'string', options: { list: ['primary', 'outline'] } }),
        ]
      }]
    }),
  ],
})
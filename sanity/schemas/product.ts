//sanity/schemas/product.ts
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'product',
  title: 'Produk / Pricelist',
  type: 'document',
  groups: [
    { name: 'basic', title: 'Informasi Dasar', default: true },
    { name: 'content', title: 'Konten & Deskripsi' },
    { name: 'images', title: 'Gambar & Media' },
    { name: 'pricing', title: 'Harga & Urutan' },
  ],
  fields: [
    // Basic Information
    defineField({
      name: 'title',
      title: 'Nama Paket',
      type: 'string',
      group: 'basic',
      description: 'Contoh: ONLINE CLASS, PRIVATE EXCLUSIVE',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Kategori',
      type: 'string',
      group: 'basic',
      description: 'Untuk filtering di halaman. Contoh: Online, Private, Regular',
      options: {
        list: [
          { title: 'Online Class', value: 'online' },
          { title: 'Private Exclusive', value: 'private' },
          { title: 'Regular Class', value: 'regular' },
          { title: 'Responsive Class', value: 'responsive' },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),

    // Content & Description
    defineField({
      name: 'shortDescription',
      title: 'Deskripsi Singkat',
      type: 'text',
      group: 'content',
      description: 'Ringkasan singkat produk (akan ditampilkan di kartu produk)',
      validation: (Rule) => Rule.required().max(200),
    }),
    defineField({
      name: 'description',
      title: 'Deskripsi Lengkap',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H3', value: 'h3' },
            { title: 'H4', value: 'h4' },
            { title: 'Quote', value: 'blockquote' }
          ],
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Number', value: 'number' }
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' }
            ]
          }
        }
      ],
      description: 'Deskripsi detail produk yang akan ditampilkan di modal',
    }),
    defineField({
      name: 'features',
      title: 'Fitur-Fitur Unggulan',
      type: 'array',
      group: 'content',
      of: [{ type: 'string' }],
      description: 'Daftar fitur utama produk (bullet points)',
    }),
    defineField({
      name: 'duration',
      title: 'Durasi Program',
      type: 'string',
      group: 'content',
      description: 'Contoh: 6 Bulan, 1 Tahun, 3 Bulan',
    }),
    defineField({
      name: 'targetAudience',
      title: 'Target Peserta',
      type: 'string',
      group: 'content',
      description: 'Contoh: Siswa SMA Kelas 12, Alumni SMA, Semua Tingkat',
    }),

    // Images & Media
    defineField({
      name: 'featuredImage',
      title: 'Gambar Utama (Thumbnail)',
      type: 'image',
      group: 'images',
      description: 'Gambar utama yang akan ditampilkan di grid produk',
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Teks Alternatif'
        }
      ],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'gallery',
      title: 'Galeri Gambar',
      type: 'array',
      group: 'images',
      of: [
        {
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Teks Alternatif',
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption/Keterangan',
            }
          ]
        }
      ],
      description: 'Gambar-gambar tambahan yang akan ditampilkan dalam slider modal',
      validation: (Rule) => Rule.max(10),
    }),

    // Legacy field for backward compatibility
    defineField({
      name: 'pricelistImage',
      title: 'Gambar Pricelist (Legacy)',
      type: 'image',
      group: 'images',
      description: '⚠️ Field lama - gunakan Featured Image dan Gallery untuk gambar baru',
      options: {
        hotspot: true,
      },
      hidden: true, // Hide in studio but keep for existing data
    }),
    defineField({
      name: 'altText',
      title: 'Teks Alternatif Legacy',
      type: 'string',
      group: 'images',
      description: '⚠️ Field lama - gunakan alt text di Featured Image',
      hidden: true, // Hide in studio but keep for existing data
    }),

    // Pricing & Order
    defineField({
      name: 'price',
      title: 'Harga (Angka)',
      type: 'number',
      group: 'pricing',
      description: 'Masukkan harga dalam angka saja, tanpa Rp atau titik. Contoh: 2500000',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'originalPrice',
      title: 'Harga Asli (Opsional)',
      type: 'number',
      group: 'pricing',
      description: 'Jika ada diskon, masukkan harga asli sebelum diskon',
    }),
    defineField({
      name: 'order',
      title: 'Urutan Tampil',
      type: 'number',
      group: 'pricing',
      description: 'Angka lebih kecil akan ditampilkan lebih dulu.',
    }),
    defineField({
      name: 'featured',
      title: 'Tampilkan di Beranda',
      type: 'boolean',
      group: 'basic',
      initialValue: false,
      description: 'Centang untuk menampilkan program ini di halaman utama',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'category',
      media: 'featuredImage',
      price: 'price'
    },
    prepare(selection) {
      const { title, subtitle, media, price } = selection
      const formattedPrice = price ? `Rp ${price.toLocaleString('id-ID')}` : ''
      return {
        title: title,
        subtitle: `${subtitle} • ${formattedPrice}`,
        media: media
      }
    }
  },
})
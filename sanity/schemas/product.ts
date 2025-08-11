//sanity/schemas/product.ts
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'product',
  title: 'Produk / Pricelist',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Nama Paket',
      type: 'string',
      description: 'Contoh: ONLINE CLASS, PRIVATE EXCLUSIVE',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'Kategori',
      type: 'string',
      description: 'Untuk filtering di halaman. Contoh: Online, Private, Regular',
      options: {
        list: [
          {title: 'Online Class', value: 'online'},
          {title: 'Private Exclusive', value: 'private'},
          {title: 'Regular Class', value: 'regular'},
          {title: 'Responsive Class', value: 'responsive'},
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'pricelistImage',
      title: 'Gambar Pricelist',
      type: 'image',
      description: 'Upload gambar pricelist yang sudah didesain.',
      options: {
        hotspot: true, // Memungkinkan cropping yang lebih baik
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'altText',
      title: 'Teks Alternatif Gambar',
      type: 'string',
      description: 'Deskripsi singkat gambar untuk SEO dan aksesibilitas.',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
        name: 'price',
        title: 'Harga (Angka)',
        type: 'number',
        description: 'Masukkan harga dalam angka saja, tanpa Rp atau titik. Contoh: 2500000',
        validation: (Rule) => Rule.required(),
    }),
    defineField({
        name: 'order',
        title: 'Urutan Tampil',
        type: 'number',
        description: 'Angka lebih kecil akan ditampilkan lebih dulu.',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'category',
      media: 'pricelistImage',
    },
  },
})
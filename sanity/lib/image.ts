// FILE: sanity/lib/image.ts (REVISED)

import createImageUrlBuilder from '@sanity/image-url'
import type { Image } from 'sanity'

// Baca environment variables langsung di sini
const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET

// Pastikan projectId dan dataset ada sebelum membuat builder
if (!projectId || !dataset) {
  throw new Error('Missing Sanity project ID or dataset. Check your .env.local file.')
}

const imageBuilder = createImageUrlBuilder({
  projectId: projectId,
  dataset: dataset,
})

export const urlForImage = (source: Image) => {
  // Fungsi ini sekarang akan aman digunakan di mana saja
  return imageBuilder.image(source).auto('format').fit('max')
}
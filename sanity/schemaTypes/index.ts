// FILE: sanity/schemaTypes/index.ts (VERSI SEDERHANA)
import { type SchemaTypeDefinition } from 'sanity'

import landingPage from '../schemas/landingPage'
import product from '../schemas/product' // Skema produk tetap terpisah karena itu adalah entitas sendiri
import testimonial from '../schemas/testimonial' // Skema testimoni yang terpisah
import blog from '../schemas/blog' // Skema blog untuk artikel dan tips

// Object types
import blockquote from './objects/blockquote'
import styledText from './objects/styledText'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Hanya daftarkan tipe dokumen utama
    landingPage,
    product,
    testimonial,
    blog,
    // Object types
    blockquote,
    styledText,
  ],
}
// FILE: sanity/schemaTypes/index.ts (VERSI SEDERHANA)
import { type SchemaTypeDefinition } from 'sanity'

import landingPage from '../schemas/landingPage'
import product from '../schemas/product' // Skema produk tetap terpisah karena itu adalah entitas sendiri

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Hanya daftarkan tipe dokumen utama
    landingPage, 
    product,
  ],
}
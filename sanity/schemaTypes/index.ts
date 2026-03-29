// FILE: sanity/schemaTypes/index.ts
import { type SchemaTypeDefinition } from 'sanity'

import landingPage from '../schemas/landingPage'
import product from '../schemas/product'
import testimonial from '../schemas/testimonial'
import blog from '../schemas/blog'
import prestasiSiswa from '../schemas/prestasiSiswa'
import gallery from '../schemas/gallery'

// Object types
import blockquote from './objects/blockquote'
import styledText from './objects/styledText'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    landingPage,
    product,
    testimonial,
    blog,
    prestasiSiswa,
    gallery,
    // Object types
    blockquote,
    styledText,
  ],
}
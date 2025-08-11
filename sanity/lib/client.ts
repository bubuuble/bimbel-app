// FILE: lib/sanity.ts (atau sanity/lib/client.ts)

import { createClient } from 'next-sanity'

// Impor dari file env Anda, karena file ini digunakan di sisi server
import { apiVersion, dataset, projectId } from '@/sanity/env'

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Direkomendasikan 'false' untuk fetch data di Server Components
})
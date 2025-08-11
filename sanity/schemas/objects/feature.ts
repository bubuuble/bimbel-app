// sanity/schemas/objects/feature.ts
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'feature',
  title: 'Feature / Benefit',
  type: 'object',
  fields: [
    defineField({ name: 'title', type: 'string', title: 'Judul', validation: (Rule) => Rule.required() }),
    defineField({ name: 'description', type: 'text', title: 'Deskripsi', validation: (Rule) => Rule.required() }),
    defineField({ 
        name: 'icon', 
        type: 'string', 
        title: 'Ikon (dari Lucide)', 
        description: 'Contoh: Award, Briefcase, Rocket'
    }),
  ],
})
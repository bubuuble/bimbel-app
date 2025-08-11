// sanity/schemas/objects/statCard.ts
import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'statCard',
  title: 'Stat Card (Hero)',
  type: 'object',
  fields: [
    defineField({ name: 'value', title: 'Nilai (e.g., 5+)', type: 'string' }),
    defineField({ name: 'label', title: 'Label (e.g., Tahun Pengalaman)', type: 'string' }),
    defineField({ name: 'icon', type: 'string', title: 'Ikon (Award, Users, Star, CheckCircle)'}),
    defineField({ name: 'color', type: 'string', title: 'Warna (blue, orange, green, yellow)'}),
    defineField({ name: 'layout', type: 'string', title: 'Layout (vertical, horizontal)'}),
    defineField({ name: 'position', type: 'string', title: 'Posisi (Tailwind Class)', description: 'e.g., top-10 -left-16'}),
  ],
})
import { defineType } from 'sanity'

export default defineType({
  name: 'blockquote',
  title: 'Block Quote',
  type: 'object',
  fields: [
    {
      name: 'text',
      title: 'Quote Text',
      type: 'text',
      validation: Rule => Rule.required(),
    },
    {
      name: 'author',
      title: 'Author',
      type: 'string',
    },
    {
      name: 'source',
      title: 'Source',
      type: 'string',
    },
  ],
  preview: {
    select: {
      text: 'text',
      author: 'author',
    },
    prepare({ text, author }) {
      return {
        title: `"${text?.slice(0, 50)}${text?.length > 50 ? '...' : ''}"`,
        subtitle: author ? `— ${author}` : undefined,
      }
    },
  },
})

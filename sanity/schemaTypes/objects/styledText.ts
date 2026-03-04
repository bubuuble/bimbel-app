import { defineField, defineType } from 'sanity'

export default defineType({
    name: 'styledText',
    title: 'Styled Text',
    type: 'object',
    fields: [
        defineField({
            name: 'text',
            title: 'Teks Utama',
            type: 'string',
            description: 'Teks biasa (tanpa styling khusus). Biarkan kosong jika seluruhnya styling',
        }),
        defineField({
            name: 'highlightText',
            title: 'Teks Highlight',
            type: 'string',
            description: 'Teks yang akan diberi styling khusus',
        }),
        defineField({
            name: 'highlightColor',
            title: 'Warna Highlight (Hex/Tailwind class)',
            type: 'string',
            description: 'Contoh: text-primary, text-secondary, atau #FF0000',
        }),
        defineField({
            name: 'fontSize',
            title: 'Ukuran Font Highlight',
            type: 'string',
            options: {
                list: [
                    { title: 'Default', value: '' },
                    { title: 'Extra Small', value: 'text-xs' },
                    { title: 'Small', value: 'text-sm' },
                    { title: 'Base', value: 'text-base' },
                    { title: 'Large', value: 'text-lg' },
                    { title: 'Extra Large', value: 'text-xl' },
                    { title: '2XL', value: 'text-2xl' },
                    { title: '3XL', value: 'text-3xl' },
                    { title: '4XL', value: 'text-4xl' },
                    { title: '5XL', value: 'text-5xl' },
                ],
            },
        }),
        defineField({
            name: 'fontFamily',
            title: 'Jenis Font Highlight',
            type: 'string',
            options: {
                list: [
                    { title: 'Plus Jakarta Sans (Normal)', value: 'font-sans' },
                    { title: 'Plus Jakarta Sans - Medium', value: 'font-sans font-medium' },
                    { title: 'Plus Jakarta Sans - Bold', value: 'font-sans font-bold' },
                    { title: 'Montserrat (Modern)', value: 'font-montserrat' },
                    { title: 'Montserrat - Medium', value: 'font-montserrat font-medium' },
                    { title: 'Montserrat - Bold', value: 'font-montserrat font-bold' },
                    { title: 'Playfair Display (Serif/Klasik)', value: 'font-serif' },
                    { title: 'Playfair Display - Bold', value: 'font-serif font-bold' },
                    { title: 'Monospace (Coding)', value: 'font-mono' },
                ],
            },
        }),
        defineField({
            name: 'highlightPosition',
            title: 'Posisi Highlight',
            type: 'string',
            options: {
                list: [
                    { title: 'Di Depan', value: 'start' },
                    { title: 'Di Belakang', value: 'end' },
                ],
                layout: 'radio',
            },
            initialValue: 'end',
        }),
    ],
})

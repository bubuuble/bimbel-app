import { PortableText } from '@portabletext/react'
import Image from 'next/image'
import { urlForImage } from '@/sanity/lib/image'
import type { PortableTextComponents } from '@portabletext/react'

// Custom blockquote component
const BlockquoteComponent = ({ value }: { value: any }) => {
  return (
    <blockquote className="my-6 border-l-4 border-blue-500 bg-gray-50 p-4 italic">
      <div className="text-lg text-gray-700 mb-2">"{value.text}"</div>
      {(value.author || value.source) && (
        <footer className="text-sm text-gray-500">
          {value.author && <cite className="font-semibold">— {value.author}</cite>}
          {value.source && (
            <span className="ml-2">
              {value.author ? ', ' : '— '}
              <em>{value.source}</em>
            </span>
          )}
        </footer>
      )}
    </blockquote>
  )
}

// Portable Text components
const portableTextComponents: PortableTextComponents = {
  types: {
    // Custom blockquote component
    blockquote: BlockquoteComponent,
    
    // Image component
    image: ({ value }: { value: any }) => {
      return (
        <div className="my-6">
          <Image
            src={urlForImage(value)?.url() || ''}
            alt={value.alt || 'Blog image'}
            width={800}
            height={400}
            className="rounded-lg w-full h-auto"
          />
          {value.caption && (
            <p className="text-sm text-gray-600 text-center mt-2 italic">
              {value.caption}
            </p>
          )}
        </div>
      )
    },
    
    // Code block component
    codeBlock: ({ value }: { value: any }) => {
      return (
        <div className="my-6">
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto">
            <code className={`language-${value.language || 'text'}`}>
              {value.code}
            </code>
          </pre>
          {value.filename && (
            <p className="text-sm text-gray-600 mt-1">
              File: <code className="bg-gray-100 px-2 py-1 rounded">{value.filename}</code>
            </p>
          )}
        </div>
      )
    }
  },
  
  // Block components (for regular text blocks)
  block: {
    h1: ({ children }) => (
      <h1 className="text-4xl font-bold text-gray-900 mb-6 mt-8">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-3xl font-bold text-gray-900 mb-4 mt-6">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-2xl font-bold text-gray-900 mb-3 mt-5">{children}</h3>
    ),
    h4: ({ children }) => (
      <h4 className="text-xl font-bold text-gray-900 mb-2 mt-4">{children}</h4>
    ),
    normal: ({ children }) => (
      <p className="text-gray-700 leading-relaxed mb-4">{children}</p>
    )
  },
  
  // List components
  list: {
    bullet: ({ children }) => (
      <ul className="list-disc list-inside mb-4 space-y-1 text-gray-700">{children}</ul>
    ),
    number: ({ children }) => (
      <ol className="list-decimal list-inside mb-4 space-y-1 text-gray-700">{children}</ol>
    )
  },
  
  // Mark components (inline formatting)
  marks: {
    strong: ({ children }) => (
      <strong className="font-bold">{children}</strong>
    ),
    em: ({ children }) => (
      <em className="italic">{children}</em>
    ),
    code: ({ children }) => (
      <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono">{children}</code>
    ),
    underline: ({ children }) => (
      <span className="underline">{children}</span>
    ),
    'strike-through': ({ children }) => (
      <span className="line-through">{children}</span>
    ),
    link: ({ value, children }) => (
      <a 
        href={value?.href} 
        target={value?.blank ? '_blank' : undefined}
        rel={value?.blank ? 'noopener noreferrer' : undefined}
        className="text-blue-600 hover:text-blue-800 underline"
      >
        {children}
      </a>
    )
  }
}

interface RichTextRendererProps {
  content: any[]
}

export default function RichTextRenderer({ content }: RichTextRendererProps) {
  return (
    <div className="prose prose-lg max-w-none">
      <PortableText 
        value={content} 
        components={portableTextComponents}
      />
    </div>
  )
}

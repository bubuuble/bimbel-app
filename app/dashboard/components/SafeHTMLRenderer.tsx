// FILE: app/dashboard/components/SafeHTMLRenderer.tsx
'use client'

import DOMPurify from 'isomorphic-dompurify';

type SafeHTMLRendererProps = {
  html: string | undefined | null;
  className?: string;
};

// This component ensures DOMPurify is only used on the client.
export default function SafeHTMLRenderer({ html, className }: SafeHTMLRendererProps) {
  // We use the isomorphic version which is safe, but this pattern is robust.
  const sanitizedHtml = DOMPurify.sanitize(html || '');

  return (
    <div
      className={className}
      dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
    />
  );
}
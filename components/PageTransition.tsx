'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'
import Image from 'next/image'

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(false)
  const [displayPath, setDisplayPath] = useState(pathname)

  useEffect(() => {
    if (pathname !== displayPath) {
      setIsLoading(true)
      const timer = setTimeout(() => {
        setDisplayPath(pathname)
        setIsLoading(false)
      }, 400)
      return () => clearTimeout(timer)
    }
  }, [pathname, displayPath])

  return (
    <>
      {/* Loading overlay */}
      {isLoading && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/80 backdrop-blur-sm transition-opacity duration-300">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <Image
                src="/image/logo/logo1.png"
                alt="Loading"
                width={48}
                height={48}
                className="animate-pulse"
              />
            </div>
            <div className="w-48 h-1.5 rounded-full bg-primary/20 overflow-hidden">
              <div className="h-full rounded-full bg-primary animate-loading-bar" />
            </div>
          </div>
        </div>
      )}
      {children}
    </>
  )
}

'use client'

import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

function NavLink({
  href,
  children,
  isScrolled,
}: {
  href: string;
  children: React.ReactNode;
  isScrolled: boolean;
}) {
  const pathname = usePathname();
  const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <Link
      href={href}
      className={`flex items-center gap-1 font-sans font-medium text-sm transition-all duration-300 py-1 hover:opacity-70 ${
        isActive ? 'text-secondary font-bold' : isScrolled ? 'text-foreground' : 'text-foreground/80'
      }`}
    >
      {children}
    </Link>
  );
}

export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    fetchUser();

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    const handleScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);

    return () => {
      authListener.subscription.unsubscribe();
      window.removeEventListener("scroll", handleScroll);
    };
  }, [supabase]);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/about", label: "About" },
    { href: "/product", label: "Product" }, 
    { href: "/blog", label: "Blog" },
    { href: "/testimoni", label: "Testimonials" },
  ];

  return (
    <header className="fixed top-5 inset-x-0 z-[100] transition-all duration-500 px-4 flex justify-center">
      <div
        className={`
          container max-w-7xl h-[72px] rounded-full flex items-center justify-between px-8 transition-all duration-500 border
          ${
            scrolled
              ? 'bg-background/90 backdrop-blur-xl border-border shadow-lg shadow-primary/10'
              : 'bg-background/20 backdrop-blur-sm border-white/10'
          }
        `}
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-primary/20">
            <Image src="/image/logo/logo1.png" alt="Logo" width={36} height={36} />
          </div>
          <span className="font-sans font-extrabold text-xl text-foreground">
            Bimbel<span className="text-secondary">Master</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-7">
          {navLinks.map((link) => (
            <NavLink key={link.href} href={link.href} isScrolled={scrolled}>
              {link.label}
            </NavLink>
          ))}
        </nav>

        {/* Actions */}
        <div className="hidden lg:flex items-center gap-3">
          {user ? (
            <Link
              href="/dashboard"
              className="px-5 py-2.5 rounded-full font-sans font-semibold text-sm hover:opacity-90 transition-all text-primary-foreground bg-primary"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="px-5 py-2.5 rounded-full font-sans font-semibold text-sm border-2 border-primary/30 text-primary hover:bg-primary/10 transition-all"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="px-5 py-2.5 rounded-full font-sans font-semibold text-sm text-secondary-foreground shadow-md hover:opacity-90 transition-all bg-secondary"
              >
                Daftar
              </Link>
            </>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="lg:hidden w-9 h-9 rounded-full flex items-center justify-center bg-primary/10 text-primary transition-colors hover:bg-primary/20"
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
      </div>

      {/* Mobile Drawer */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="right" className="w-80 p-0 bg-background/95 backdrop-blur-md">
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <div className="flex flex-col h-full">
            {/* Drawer header */}
            <div className="px-6 py-5 border-b border-border">
              <span className="font-sans font-extrabold text-xl text-foreground">
                Bimbel<span className="text-secondary">Master</span>
              </span>
            </div>

            <nav className="flex-1 px-4 py-6 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center px-4 py-3 rounded-xl font-sans font-medium text-base hover:bg-primary/10 transition-all text-foreground"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="px-6 py-6 border-t border-border space-y-3">
              {user ? (
                <Link href="/dashboard" className="flex justify-center w-full py-3.5 rounded-full text-primary-foreground font-bold bg-primary hover:opacity-90 transition-opacity">
                  Dashboard
                </Link>
              ) : (
                <>
                  <Link href="/login" className="flex justify-center w-full py-3.5 rounded-full font-bold border-2 border-primary/30 text-primary hover:bg-primary/10 transition-colors">
                    Masuk
                  </Link>
                  <Link href="/register" className="flex justify-center w-full py-3.5 rounded-full text-secondary-foreground font-bold bg-secondary hover:opacity-90 transition-opacity">
                    Daftar
                  </Link>
                </>
              )}
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </header>
  );
}
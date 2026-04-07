"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Award, GraduationCap, Star, X } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

export default function TestimoniPage() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const dummyMainTestimonials = [
    { id: 1, name: "Cover Story 1", image: "https://placehold.co/600x800/e2e8f0/94a3b8.png?text=Main+Testimoni+1" },
    { id: 2, name: "Cover Story 2", image: "https://placehold.co/600x800/e2e8f0/94a3b8.png?text=Main+Testimoni+2" },
    { id: 3, name: "Cover Story 3", image: "https://placehold.co/600x800/e2e8f0/94a3b8.png?text=Main+Testimoni+3" },
    { id: 4, name: "Cover Story 4", image: "https://placehold.co/600x800/e2e8f0/94a3b8.png?text=Main+Testimoni+4" },
    { id: 5, name: "Cover Story 5", image: "https://placehold.co/600x800/e2e8f0/94a3b8.png?text=Main+Testimoni+5" },
  ];

  const dummyJuaraTestimonials = [
    { id: 1, name: "Siswa Juara 1", image: "https://placehold.co/400x500/ffedd5/ea580c.png?text=Juara+1" },
    { id: 2, name: "Siswa Juara 2", image: "https://placehold.co/400x500/ffedd5/ea580c.png?text=Juara+2" },
    { id: 3, name: "Siswa Juara 3", image: "https://placehold.co/400x500/ffedd5/ea580c.png?text=Juara+3" },
    { id: 4, name: "Siswa Juara 4", image: "https://placehold.co/400x500/ffedd5/ea580c.png?text=Juara+4" },
    { id: 5, name: "Siswa Juara 5", image: "https://placehold.co/400x500/ffedd5/ea580c.png?text=Juara+5" },
    { id: 6, name: "Siswa Juara 6", image: "https://placehold.co/400x500/ffedd5/ea580c.png?text=Juara+6" },
    { id: 7, name: "Siswa Juara 7", image: "https://placehold.co/400x500/ffedd5/ea580c.png?text=Juara+7" },
    { id: 8, name: "Siswa Juara 8", image: "https://placehold.co/400x500/ffedd5/ea580c.png?text=Juara+8" },
  ];

  const dummySnbtTestimonials = [
    { id: 1, name: "Siswa SNBT 1", image: "/image/prestasi/1.jpeg" },
    { id: 2, name: "Siswa SNBT 2", image: "/image/prestasi/2.jpeg" },
    { id: 3, name: "Siswa SNBT 3", image: "https://placehold.co/400x500/d1fae5/059669.png?text=SNBT+3" },
    { id: 4, name: "Siswa SNBT 4", image: "https://placehold.co/400x500/d1fae5/059669.png?text=SNBT+4" },
    { id: 5, name: "Siswa SNBT 5", image: "https://placehold.co/400x500/d1fae5/059669.png?text=SNBT+5" },
    { id: 6, name: "Siswa SNBT 6", image: "https://placehold.co/400x500/d1fae5/059669.png?text=SNBT+6" },
    { id: 7, name: "Siswa SNBT 7", image: "https://placehold.co/400x500/d1fae5/059669.png?text=SNBT+7" },
    { id: 8, name: "Siswa SNBT 8", image: "https://placehold.co/400x500/d1fae5/059669.png?text=SNBT+8" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white pb-20">
      {/* Header Section */}
      <div className="pt-32 pb-16 relative overflow-hidden">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border-2 border-primary/20 rounded-full px-6 py-2.5 mb-6 font-semibold text-primary shadow-sm">
            <Star className="w-4 h-4 fill-primary/20" />
            <span>Testimoni Terpercaya</span>
            <Star className="w-4 h-4 fill-primary/20" />
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 font-heading text-slate-900 tracking-tight">
            Testimoni <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">Siswa</span>
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto text-lg md:text-xl leading-relaxed">
            Pengalaman langsung dan pencapaian membanggakan siswa-siswi kami yang telah merasakan
            transformasi pembelajaran berkualitas.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 space-y-24">
        {/* Main Testimonials (Large Story-like Cards) */}
        <section>
          <Carousel
            opts={{ align: "start", loop: true }}
            className="w-full relative"
          >
            <CarouselContent className="-ml-4 md:-ml-6">
              {dummyMainTestimonials.map((item, i) => (
                <CarouselItem key={item.id} className="pl-4 md:pl-6 basis-full md:basis-1/2">
                  <Card 
                    className="border-4 border-white shadow-xl overflow-hidden rounded-[2rem] h-[500px] md:h-[600px] flex items-center justify-center relative group transition-transform duration-300 hover:-translate-y-2 cursor-pointer"
                    onClick={() => setSelectedImage(item.image)}
                  >
                    <CardContent className="p-0 flex items-center justify-center h-full w-full bg-slate-100">
                      <Image 
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="relative z-10 flex flex-col items-center justify-end h-full pb-8 w-full gap-2">
                        <Award className="w-12 h-12 text-white/50" />
                        <div className="text-white font-bold text-xl tracking-wide uppercase">{item.name}</div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="flex justify-center gap-4 mt-8">
              <CarouselPrevious className="static translate-y-0 translate-x-0 bg-white border-2 hover:bg-slate-50 hover:text-primary transition-colors w-12 h-12 shadow-md lg:-ml-16 lg:absolute lg:top-1/2 lg:-translate-y-1/2" />
              <CarouselNext className="static translate-y-0 translate-x-0 bg-white border-2 hover:bg-slate-50 hover:text-primary transition-colors w-12 h-12 shadow-md lg:-mr-16 lg:absolute lg:top-1/2 lg:-translate-y-1/2" />
            </div>
          </Carousel>
        </section>

        {/* Testimoni Juara */}
        <section className="relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-orange-100 rounded-xl text-orange-600">
                  <Award className="w-6 h-6" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 font-heading">Testimoni Juara</h2>
              </div>
              <p className="text-slate-600 text-lg">Kisah sukses peraih medali & juara kelas.</p>
            </div>
            <Link href="/testimoni/juara" className="hidden md:flex items-center gap-1 text-primary font-bold hover:gap-2 transition-all bg-white px-5 py-2.5 shadow-sm rounded-full border border-slate-100 hover:border-primary/20 hover:shadow-md">
              Lihat Semua <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <Carousel opts={{ align: "start", loop: true }} className="w-full">
            <CarouselContent className="-ml-4">
              {dummyJuaraTestimonials.map((item, i) => (
                <CarouselItem key={item.id} className="pl-4 basis-[75%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/4">
                  <Card 
                    className="border-[6px] border-white shadow-lg overflow-hidden rounded-[2rem] h-[380px] flex items-center justify-center relative group hover:-translate-y-2 transition-transform duration-300 cursor-pointer"
                    onClick={() => setSelectedImage(item.image)}
                  >
                    <CardContent className="p-0 flex items-center justify-center h-full w-full bg-orange-50">
                      <img 
                        src={item.image}
                        alt={item.name}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      <div className="relative z-10 flex flex-col items-center justify-end h-full pb-6 w-full gap-2 opacity-90">
                        <Star className="w-8 h-8 text-orange-400 fill-orange-400" />
                        <div className="text-white font-bold px-4 text-center">{item.name}</div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            <div className="flex items-center justify-between md:justify-center mt-6 gap-4">
              <Link href="/testimoni/juara" className="md:hidden flex items-center gap-1 text-primary font-bold hover:gap-2 transition-all bg-white px-5 py-2 shadow-sm rounded-full border border-slate-100 hover:border-primary/20 hover:shadow-md text-sm">
                Lihat Semua <ChevronRight className="w-4 h-4" />
              </Link>
              <div className="flex gap-3">
                <CarouselPrevious className="static translate-y-0 translate-x-0 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 shadow-sm w-10 h-10" />
                <CarouselNext className="static translate-y-0 translate-x-0 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 shadow-sm w-10 h-10" />
              </div>
            </div>
          </Carousel>
        </section>

        {/* Testimoni SNBT */}
        <section className="relative">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-emerald-100 rounded-xl text-emerald-600">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 font-heading">Testimoni SNBT</h2>
              </div>
              <p className="text-slate-600 text-lg">Mereka yang berhasil tembus PTN Impian.</p>
            </div>
            <Link href="/testimoni/snbt" className="hidden md:flex items-center gap-1 text-primary font-bold hover:gap-2 transition-all bg-white px-5 py-2.5 shadow-sm rounded-full border border-slate-100 hover:border-primary/20 hover:shadow-md">
              Lihat Semua <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <Carousel opts={{ align: "start", loop: true }} className="w-full">
            <CarouselContent className="-ml-4">
              {dummySnbtTestimonials.map((item, i) => (
                <CarouselItem key={item.id} className="pl-4 basis-[75%] sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/4">
                  <Card 
                    className="border-[6px] border-white shadow-lg overflow-hidden rounded-[2rem] h-[380px] flex items-center justify-center relative group hover:-translate-y-2 transition-transform duration-300 cursor-pointer"
                    onClick={() => setSelectedImage(item.image)}
                  >
                    <CardContent className="p-0 flex items-center justify-center h-full w-full bg-emerald-50">
                      <img 
                        src={item.image}
                        alt={item.name}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      <div className="relative z-10 flex flex-col items-center justify-end h-full pb-6 w-full gap-2 opacity-90">
                        <GraduationCap className="w-8 h-8 text-emerald-400" />
                        <div className="text-white font-bold px-4 text-center">{item.name}</div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            
            <div className="flex items-center justify-between md:justify-center mt-6 gap-4">
              <Link href="/testimoni/snbt" className="md:hidden flex items-center gap-1 text-primary font-bold hover:gap-2 transition-all bg-white px-5 py-2 shadow-sm rounded-full border border-slate-100 hover:border-primary/20 hover:shadow-md text-sm">
                Lihat Semua <ChevronRight className="w-4 h-4" />
              </Link>
              <div className="flex gap-3">
                <CarouselPrevious className="static translate-y-0 translate-x-0 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 shadow-sm w-10 h-10" />
                <CarouselNext className="static translate-y-0 translate-x-0 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 shadow-sm w-10 h-10" />
              </div>
            </div>
          </Carousel>
        </section>
      </div>

      {/* Modal / Dialog for Image Preview */}
      <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
        <DialogContent showCloseButton={false} className="max-w-[90vw] md:max-w-4xl p-0 bg-transparent border-0 shadow-none flex justify-center items-center pointer-events-none">
          <DialogTitle className="sr-only">Preview Gambar Testimoni</DialogTitle>
          {selectedImage && (
            <div className="relative inline-flex items-center justify-center max-w-full max-h-[85vh] pointer-events-auto">
              <img 
                src={selectedImage} 
                alt="Preview Testimoni" 
                className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl"
              />
              <button 
                onClick={() => setSelectedImage(null)}
                className="absolute -top-4 -right-4 bg-white/70 hover:bg-white backdrop-blur-md p-2 rounded-full shadow-xl hover:scale-110 transition-all duration-300 z-50 group border border-white/50"
                aria-label="Close"
              >
                <X className="w-6 h-6 text-slate-700 group-hover:text-rose-500 transition-colors" />
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

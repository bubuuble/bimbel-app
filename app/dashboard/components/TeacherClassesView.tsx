'use client'

import { createClient as createSupabaseClient } from "@/lib/supabase/client";
import { client as sanityClient } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import Link from "next/link";
import { useEffect, useState, useRef, useCallback, useActionState } from "react";
import { useFormStatus } from "react-dom";
import { createClass, type ClassFormState } from "@/lib/actions";
import type { UserProfile } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus, BookOpen, ArrowRight, GraduationCap } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type ClassData = { id: string; name: string; description: string | null; };
type SanityProduct = { _id: string; title: string; };

const classColors = [
  'from-violet-400 to-purple-500',
  'from-indigo-400 to-blue-500',
  'from-teal-400 to-emerald-500',
  'from-rose-400 to-pink-500',
  'from-amber-400 to-orange-500',
];

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-violet-700 disabled:opacity-60 transition-colors"
    >
      {pending ? <><Loader2 className="h-4 w-4 animate-spin" />Membuat...</> : <><Plus className="h-4 w-4" />Buat Kelas</>}
    </button>
  );
}

export default function TeacherClassesView({ userProfile }: { userProfile: Pick<UserProfile, 'id'> }) {
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [sanityProducts, setSanityProducts] = useState<SanityProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createSupabaseClient();
  const formRef = useRef<HTMLFormElement>(null);
  const [state, formAction] = useActionState(createClass, null);

  const fetchClasses = useCallback(async () => {
    const { data } = await supabase.from('classes').select('id, name, description').eq('teacher_id', userProfile.id).order('name', { ascending: true });
    if (data) setClasses(data);
    setLoading(false);
  }, [supabase, userProfile.id]);

  useEffect(() => {
    const fetchSanityProducts = async () => {
      const query = groq`*[_type == "product"]{ _id, title } | order(title asc)`;
      const products = await sanityClient.fetch(query);
      setSanityProducts(products);
    };
    fetchSanityProducts();
    fetchClasses();
  }, [fetchClasses]);

  useEffect(() => {
    if (state?.success) { alert(state.success); formRef.current?.reset(); fetchClasses(); }
    if (state?.error) { alert(state.error); }
  }, [state, fetchClasses]);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500 p-6 sm:p-8 text-white shadow-lg">
        <div className="relative z-10">
          <p className="text-violet-200 text-sm font-medium mb-1">Guru</p>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight flex items-center gap-3">
            <GraduationCap className="h-7 w-7" /> Manajemen Kelas
          </h1>
          <p className="text-violet-200 mt-1 text-sm">Kelola dan buat kelas pembelajaran Anda.</p>
        </div>
        <div className="absolute -right-8 -top-8 h-40 w-40 rounded-full bg-white/10 pointer-events-none" />
      </div>

      {/* Create class form */}
      <div className="rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-50 flex items-center gap-2">
          <Plus className="h-4 w-4 text-violet-500" />
          <h2 className="text-sm font-semibold text-slate-700">Buat Kelas Baru</h2>
        </div>
        <div className="p-6">
          <form ref={formRef} action={formAction} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="className" className="text-xs font-medium text-slate-600">Nama Kelas</Label>
              <Input type="text" name="className" id="className" placeholder="Contoh: Fisika Kuantum Pagi" required className="rounded-xl border-slate-200 text-sm" />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="sanityProductId" className="text-xs font-medium text-slate-600">Tipe Produk Kelas</Label>
              <Select name="sanityProductId" required>
                <SelectTrigger className="rounded-xl border-slate-200 text-sm">
                  <SelectValue placeholder="Pilih tipe produk..." />
                </SelectTrigger>
                <SelectContent>
                  {sanityProducts.map(product => (
                    <SelectItem key={product._id} value={product._id}>{product.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5 md:col-span-2">
              <Label htmlFor="description" className="text-xs font-medium text-slate-600">Deskripsi (opsional)</Label>
              <Textarea name="description" id="description" placeholder="Deskripsi kelas..." rows={2} className="rounded-xl border-slate-200 text-sm" />
            </div>
            <div className="md:col-span-2">
              <SubmitButton />
            </div>
          </form>
        </div>
      </div>

      {/* Class grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-700">Kelas Anda</h2>
          <span className="rounded-full bg-violet-100 px-2.5 py-0.5 text-xs font-semibold text-violet-600">{classes.length} kelas</span>
        </div>

        {loading ? (
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-36 w-full rounded-2xl" />)}
          </div>
        ) : classes.length > 0 ? (
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {classes.map((c, i) => {
              const grad = classColors[i % classColors.length];
              return (
                <div key={c.id} className="group rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden hover:-translate-y-0.5">
                  <div className={`h-1.5 w-full bg-gradient-to-r ${grad}`} />
                  <div className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${grad} text-white text-sm font-bold shadow-sm`}>
                        {c.name.charAt(0).toUpperCase()}
                      </div>
                      <p className="text-sm font-semibold text-slate-800 truncate">{c.name}</p>
                    </div>
                    <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">{c.description || 'Tidak ada deskripsi.'}</p>
                    <Link
                      href={`/dashboard/class/${c.id}`}
                      className="flex items-center justify-center gap-1.5 w-full rounded-xl border border-violet-200 bg-violet-50 py-2 text-xs font-semibold text-violet-600 hover:bg-violet-100 transition-colors"
                    >
                      Kelola Kelas <ArrowRight className="h-3 w-3" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-12 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-100 mb-4">
              <BookOpen className="h-6 w-6 text-violet-400" />
            </div>
            <p className="text-sm font-medium text-slate-500">Belum ada kelas</p>
            <p className="text-xs text-slate-400 mt-1">Buat kelas pertama Anda di atas!</p>
          </div>
        )}
      </div>
    </div>
  );
}
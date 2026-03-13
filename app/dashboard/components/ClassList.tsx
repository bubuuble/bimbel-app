import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";

const classColors = [
  'from-indigo-400 to-blue-500',
  'from-teal-400 to-emerald-500',
  'from-violet-400 to-purple-500',
  'from-rose-400 to-pink-500',
  'from-amber-400 to-orange-500',
];

export default async function ClassList() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: classes, error } = await supabase
    .from('classes')
    .select('*')
    .eq('teacher_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    return (
      <div className="rounded-2xl bg-rose-50 border border-rose-100 p-6 text-sm text-rose-600">
        Gagal memuat kelas.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-700">Kelas Saya</h3>
        <span className="rounded-full bg-indigo-100 px-2.5 py-0.5 text-xs font-semibold text-indigo-600">
          {classes.length} kelas
        </span>
      </div>

      {classes.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-12 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 mb-4">
            <BookOpen className="h-6 w-6 text-indigo-400" />
          </div>
          <p className="text-sm font-medium text-slate-500">Belum ada kelas</p>
          <p className="text-xs text-slate-400 mt-1">Buat kelas pertama Anda.</p>
        </div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          {classes.map((c, i) => {
            const grad = classColors[i % classColors.length];
            return (
              <div key={c.id} className="group rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden hover:-translate-y-0.5">
                {/* Color strip */}
                <div className={`h-1.5 w-full bg-gradient-to-r ${grad}`} />
                <div className="p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${grad} text-white text-sm font-bold shadow-sm`}>
                      {c.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{c.name}</p>
                      <span className="inline-flex items-center rounded-md bg-teal-50 px-1.5 py-0.5 text-[10px] font-semibold text-teal-600">
                        Aktif
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-2 mb-4 leading-relaxed">
                    {c.description || 'Tidak ada deskripsi.'}
                  </p>
                  <Link
                    href={`/dashboard/class/${c.id}`}
                    className="flex items-center justify-center gap-1.5 w-full rounded-xl border border-indigo-200 bg-indigo-50 py-2 text-xs font-semibold text-indigo-600 hover:bg-indigo-100 transition-colors"
                  >
                    Lihat Kelas <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
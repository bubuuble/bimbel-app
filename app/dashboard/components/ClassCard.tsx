'use client'

import { useActionState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { enrollInClass, type EnrollState } from '@/lib/actions';
import { User, BookOpen } from "lucide-react";

type ClassInfo = {
  id: string;
  name: string;
  description: string | null;
  profiles: { name: string | null } | null;
};

const classColors = [
  'from-indigo-400 to-blue-500',
  'from-teal-400 to-emerald-500',
  'from-violet-400 to-purple-500',
  'from-rose-400 to-pink-500',
  'from-amber-400 to-orange-500',
];

function EnrollButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-xl bg-indigo-600 py-2 text-sm font-semibold text-white transition-all hover:bg-indigo-700 disabled:opacity-60"
    >
      {pending ? 'Mendaftar...' : 'Daftar Sekarang'}
    </button>
  );
}

export default function ClassCard({
  classInfo,
  index = 0,
}: {
  classInfo: ClassInfo;
  index?: number;
}) {
  const initialState: EnrollState = null;
  const [state, formAction] = useActionState(enrollInClass, initialState);
  const gradient = classColors[index % classColors.length];

  useEffect(() => {
    if (state?.success) alert(state.success);
    if (state?.error) alert(state.error);
  }, [state]);

  return (
    <div className="group rounded-2xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden hover:-translate-y-0.5">
      {/* Colored top strip */}
      <div className={`h-2 w-full bg-gradient-to-r ${gradient}`} />

      <div className="p-5">
        {/* Icon + Title */}
        <div className="flex items-start gap-3 mb-3">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} text-white text-sm font-bold shadow-sm`}>
            {classInfo.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800 leading-tight">{classInfo.name}</h3>
            <div className="flex items-center gap-1.5 mt-0.5">
              <User className="h-3 w-3 text-slate-400" />
              <span className="text-xs text-slate-500">{classInfo.profiles?.name || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-400 leading-relaxed line-clamp-2 mb-4">
          {classInfo.description || 'Tidak ada deskripsi.'}
        </p>

        {/* Enroll form */}
        <form action={formAction}>
          <input type="hidden" name="classId" value={classInfo.id} />
          <EnrollButton />
        </form>
      </div>
    </div>
  );
}
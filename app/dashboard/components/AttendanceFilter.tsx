// FILE: app/dashboard/kehadiran/AttendanceFilter.tsx

'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Filter, BookOpen } from 'lucide-react'

type ClassOption = {
  id: string;
  name: string;
}

interface AttendanceFilterProps {
  classes: ClassOption[];
  selectedClassId?: string;
}

export default function AttendanceFilter({ classes, selectedClassId }: AttendanceFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const handleClassChange = (classId: string) => {
    const params = new URLSearchParams(searchParams?.toString() || '')
    
    if (classId === 'all') {
      params.delete('class_id')
    } else {
      params.set('class_id', classId)
    }
    
    // Gunakan router.replace agar tidak menambah history browser
    router.replace(`/dashboard/kehadiran?${params.toString()}`)
  }

  return (
    <div className="rounded-2xl bg-indigo-50/50 border border-indigo-100 shadow-sm overflow-hidden mb-6">
      <div className="p-5 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0 text-indigo-600">
              <Filter className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Filter Kehadiran</h3>
              <p className="text-xs font-medium text-slate-500">Pilih kelas untuk melihat riwayat</p>
            </div>
          </div>
          
          <div className="flex-1 w-full sm:min-w-[250px] sm:ml-auto">
            <Select
              value={selectedClassId || 'all'}
              onValueChange={handleClassChange}
            >
              <SelectTrigger className="w-full h-11 rounded-xl bg-white border-slate-200 hover:border-indigo-300 focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400">
                <div className="flex items-center gap-2 text-slate-600 text-sm font-medium">
                  <BookOpen className="w-4 h-4 shrink-0" />
                  <SelectValue placeholder="Pilih kelas..." />
                </div>
              </SelectTrigger>
              <SelectContent className="rounded-xl border border-slate-200 shadow-xl bg-white">
                <SelectItem value="all" className="rounded-lg cursor-pointer my-0.5 focus:bg-indigo-50 focus:text-indigo-900">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-slate-300 rounded-full shrink-0"></div>
                    <span className="font-medium text-sm">Semua Kelas</span>
                  </div>
                </SelectItem>
                {classes.map((classOption) => (
                  <SelectItem 
                    key={classOption.id} 
                    value={classOption.id}
                    className="rounded-lg cursor-pointer my-0.5 focus:bg-indigo-50 focus:text-indigo-900"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-indigo-500 rounded-full shrink-0"></div>
                      <span className="font-medium text-sm">{classOption.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  )
}
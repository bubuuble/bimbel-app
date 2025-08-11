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
    const params = new URLSearchParams(searchParams.toString())
    
    if (classId === 'all') {
      params.delete('class_id')
    } else {
      params.set('class_id', classId)
    }
    
    // Gunakan router.replace agar tidak menambah history browser
    router.replace(`/dashboard/kehadiran?${params.toString()}`)
  }

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
      <CardContent className="p-6">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <Filter className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Filter Kehadiran</h3>
              <p className="text-sm text-gray-600">Pilih kelas untuk melihat riwayat</p>
            </div>
          </div>
          
          <div className="flex-1 min-w-[250px] ml-auto">
            <Select
              value={selectedClassId || 'all'}
              onValueChange={handleClassChange}
            >
              <SelectTrigger className="w-full bg-white border-gray-300 hover:border-blue-400 focus:border-blue-500">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-gray-500" />
                  <SelectValue placeholder="Pilih kelas..." />
                </div>
              </SelectTrigger>
              <SelectContent className="bg-white border border-gray-200 shadow-lg">
                <SelectItem value="all" className="hover:bg-blue-50">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                    <span>Semua Kelas</span>
                  </div>
                </SelectItem>
                {classes.map((classOption) => (
                  <SelectItem 
                    key={classOption.id} 
                    value={classOption.id}
                    className="hover:bg-blue-50"
                  >
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <span>{classOption.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
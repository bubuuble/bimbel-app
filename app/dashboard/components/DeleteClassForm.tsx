// FILE: app/dashboard/components/DeleteClassForm.tsx

'use client'

import { deleteClass } from "@/lib/actions";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function DeleteClassForm({ classId }: { classId: string }) {
  
  const handleDelete = () => {
    const formData = new FormData();
    formData.append('classId', classId);
    deleteClass(formData);
  };

  return (
    <div className="flex-shrink-0">
      <TooltipProvider>
        <Tooltip>
          <AlertDialog>
            <TooltipTrigger asChild>
              <AlertDialogTrigger asChild>
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-9 px-4 rounded-xl border-rose-200 text-rose-600 hover:bg-rose-50 hover:text-rose-700 hover:border-rose-300 font-semibold transition-colors"
                >
                  <AlertTriangle className="h-4 w-4 mr-1.5 shrink-0" />
                  Hapus Kelas
                </Button>
              </AlertDialogTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Hapus kelas beserta semua data terkait</p>
            </TooltipContent>
              <AlertDialogContent className="p-0 overflow-hidden border-0 rounded-2xl shadow-xl sm:max-w-md">
                <div className="bg-rose-50 border-b border-rose-100 p-6 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-rose-600 mx-auto mb-4">
                      <AlertTriangle className="h-6 w-6" />
                  </div>
                  <AlertDialogTitle className="text-xl font-bold text-slate-800">Konfirmasi Penghapusan</AlertDialogTitle>
                </div>
                <div className="p-6 pt-5">
                  <AlertDialogDescription className="text-slate-600 text-center mb-6">
                    Anda yakin ingin menghapus kelas ini beserta semua materinya? 
                    <span className="block mt-1 font-semibold text-rose-600">Tindakan ini tidak dapat diurungkan.</span>
                  </AlertDialogDescription>
                  <AlertDialogFooter className="flex gap-3 sm:space-x-0">
                    <AlertDialogCancel className="mt-0 flex-1 h-11 rounded-xl font-semibold text-slate-600 border-slate-200">Batal</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDelete} className="flex-1 h-11 rounded-xl bg-rose-600 text-white hover:bg-rose-700 font-semibold focus:ring-rose-500">
                      Ya, Hapus Kelas
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </div>
              </AlertDialogContent>
          </AlertDialog>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}
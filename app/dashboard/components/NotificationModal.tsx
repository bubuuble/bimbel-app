'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"

// FILE: app/dashboard/components/NotificationModal.tsx

export default function NotificationModal({ 
  isOpen, 
  onClose, 
  children 
}: { 
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode 
}) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md max-h-[80vh] p-0 fixed top-16 right-4 translate-x-0 translate-y-0 rounded-2xl overflow-hidden shadow-2xl border-none">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle>Notifikasi</DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="flex-1 px-6 py-4 max-h-[60vh]">
          {children}
        </ScrollArea>
        
        <DialogFooter className="px-6 py-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Tutup
          </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    )
  }

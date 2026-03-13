// FILE: app/dashboard/components/MarkAsReadButton.tsx

'use client'
import { markNotificationAsRead } from "@/lib/actions";
import { useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Check, Loader2 } from "lucide-react";

export default function MarkAsReadButton({ notificationId }: { notificationId: string }) {
    let [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleClick = () => {
        startTransition(async () => {
            await markNotificationAsRead(notificationId);
            router.refresh(); 
        });
    };

    return (
        <Button 
            onClick={handleClick} 
            disabled={isPending}
            variant="outline"
            size="sm"
            className="h-9 px-4 text-xs font-medium rounded-lg bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 shadow-sm transition-all"
        >
            {isPending ? (
                <>
                    <Loader2 className="mr-1 h-3 w-3 animate-spin" />
                    Loading...
                </>
            ) : (
                <>
                    <Check className="mr-1 h-3 w-3" />
                    Tandai sudah dibaca
                </>
            )}
        </Button>
    );
}
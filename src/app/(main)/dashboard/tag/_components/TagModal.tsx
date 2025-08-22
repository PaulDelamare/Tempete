import React from "react";
import { Dialog, DialogOverlay, DialogContent, DialogTitle } from "@/components/ui/dialog";

export default function TagModal({
                                         open,
                                         onClose,
                                         children,
                                     }: {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
}) {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogOverlay className="fixed inset-0 bg-black/50" />
            <DialogContent className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded  w-full max-w-7xl p-0 border-none shadow-none gap-0">
                <DialogTitle>
                    <span className="sr-only h-0">Création de tags</span>
                </DialogTitle>
                {children}
            </DialogContent>
        </Dialog>
    );
}
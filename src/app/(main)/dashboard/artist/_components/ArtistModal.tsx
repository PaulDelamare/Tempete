import React from "react";

export default function ArtistModal({
    open,
    onClose,
    children,
}: {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
}) {
    // TODO: Modal pour création/édition artiste
    if (!open) return null;
    return (
        <div>
            <div onClick={onClose}>Fermer</div>
            {children}
        </div>
    );
}

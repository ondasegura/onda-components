import React from "react";
import { X } from "lucide-react";
import { create } from "zustand";

interface CardStore {
    dismissedCards: Set<string>;
    dismissCard: (id: string) => void;
    isCardDismissed: (id: string) => boolean;
}

const useCardStore = create<CardStore>((set, get) => ({
    dismissedCards: new Set(),
    dismissCard: (id: string) =>
        set((state) => ({
            dismissedCards: new Set([...state.dismissedCards, id]),
        })),
    isCardDismissed: (id: string) => get().dismissedCards.has(id),
}));

export interface CardProps {
    id?: string;
    title?: string;
    children: React.ReactNode;
    dismissible?: boolean;
    className?: string;
}

export const Card: React.FC<CardProps> = ({ id, title, children, dismissible = false, className = "" }) => {
    const { dismissCard, isCardDismissed } = useCardStore();

    if (id && isCardDismissed(id)) {
        return null;
    }

    const handleDismiss = () => {
        if (id) {
            dismissCard(id);
        }
    };

    return (
        <div className={`bg-white rounded-lg shadow-md p-6 relative ${className}`}>
            {dismissible && (
                <button onClick={handleDismiss} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors" aria-label="Fechar">
                    <X size={20} />
                </button>
            )}

            {title && <h3 className="text-lg font-semibold text-gray-900 mb-3">{title}</h3>}

            <div className="text-gray-700">{children}</div>
        </div>
    );
};

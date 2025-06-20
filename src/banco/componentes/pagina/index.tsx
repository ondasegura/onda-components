import React from "react";

export interface PaginaProps {
    titulo?: string;
    children?: React.ReactNode;
    className?: string;
    variant?: "default" | "destacada" | "simples";
}

export const Pagina: React.FC<PaginaProps> = ({ titulo, children, className = "", variant = "default" }) => {
    const baseClasses = "min-h-screen w-full p-6";

    const variantClasses = {
        default: "bg-gray-50 text-gray-900",
        destacada: "bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-900",
        simples: "bg-white text-gray-800",
    };

    return (
        <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
            {titulo && (
                <header className="mb-8 border-b border-gray-200 pb-4">
                    <h1 className="text-3xl font-bold text-gray-900">{titulo}</h1>
                </header>
            )}

            <main className="container mx-auto max-w-7xl">{children}</main>
        </div>
    );
};

// Export default também para facilitar imports
export default Pagina;

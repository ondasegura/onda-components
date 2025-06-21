import React from "react";
import { LucideIcon } from "lucide-react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline";
    size?: "sm" | "md" | "lg";
    icon?: LucideIcon;
    iconPosition?: "left" | "right";
    children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ variant = "primary", size = "md", icon: Icon, iconPosition = "left", children, className = "", ...props }) => {
    const baseStyles =
        "inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed rounded-md";

    const variants = {
        primary: "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500",
        secondary: "bg-gray-600 text-white hover:bg-gray-700 focus:ring-gray-500",
        outline: "border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500",
    };

    const sizes = {
        sm: "px-3 py-1.5 text-sm gap-1.5",
        md: "px-4 py-2 text-base gap-2",
        lg: "px-6 py-3 text-lg gap-2.5",
    };

    const iconSize = {
        sm: 16,
        md: 20,
        lg: 24,
    };

    return (
        <button className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
            {Icon && iconPosition === "left" && <Icon size={iconSize[size]} />}
            {children}
            {Icon && iconPosition === "right" && <Icon size={iconSize[size]} />}
        </button>
    );
};

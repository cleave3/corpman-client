import React, { ReactNode } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: ReactNode;
    size?: "sm" | "md";
    variant?: "primary" | "outline";
    startIcon?: ReactNode;
    endIcon?: ReactNode;
}

const Button: React.FC<ButtonProps> = ({
    children,
    size = "md",
    variant = "primary",
    startIcon,
    endIcon,
    onClick,
    className = "",
    disabled = false,
    type = "button",
    ...props
}) => {
    // Size Classes
    const sizeClasses = {
        sm: "px-3.5 py-2 text-xs",
        md: "px-5 py-3 text-sm"
    };

    // Variant Classes
    const variantClasses = {
        primary:
            "bg-brand-500 text-white shadow-theme-xs hover:bg-brand-600 disabled:bg-brand-300 dark:hover:bg-brand-600",
        outline:
            "bg-white text-gray-700 ring-1 ring-inset ring-gray-200 hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:ring-gray-700 dark:hover:bg-gray-700/60"
    };

    return (
        <button
            type={type}
            className={`inline-flex items-center justify-center gap-2 rounded-xl font-medium transition active:scale-[0.98] ${className} ${
                sizeClasses[size]
            } ${variantClasses[variant]} ${
                disabled ? "cursor-not-allowed opacity-50" : ""
            }`}
            onClick={onClick}
            disabled={disabled}
            {...props}
        >
            {startIcon && <span className="flex items-center">{startIcon}</span>}
            {children}
            {endIcon && <span className="flex items-center">{endIcon}</span>}
        </button>
    );
};

export default Button;

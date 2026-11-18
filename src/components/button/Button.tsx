import React from "react";
import clsx from "clsx";

export type ButtonVariant = "primary" | "secondary" | "success" | "danger" | "ghost" | "outline";
export type ButtonSize = "sm" | "md" | "lg";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    startIcon?: React.ReactNode;
    endIcon?: React.ReactNode;
    children: React.ReactNode;
}

const baseClasses =
    "inline-flex items-center justify-center gap-2 rounded-xl font-medium shadow-xs transition-all duration-150 focus:outline-none active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:active:scale-100";

const sizeClasses: Record<ButtonSize, string> = {
    sm: "px-3 py-1.5 text-xs",
    md: "px-4 py-2.5 text-sm",
    lg: "px-5 py-3 text-base"
};

const variantClasses: Record<ButtonVariant, string> = {
    primary:
        "border border-brand-500 bg-brand-500 text-white hover:bg-brand-600 hover:border-brand-600 dark:hover:bg-brand-600",
    secondary:
        "border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700/60",
    outline:
        "border border-gray-200 bg-transparent text-gray-700 hover:bg-gray-50 hover:text-gray-900 dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-800",
    success:
        "border border-emerald-600 bg-emerald-600 text-white hover:bg-emerald-700 dark:border-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700",
    danger:
        "border border-red-600 bg-red-600 text-white hover:bg-red-700 dark:border-red-600 dark:bg-red-600 dark:hover:bg-red-700",
    ghost:
        "border-transparent bg-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-200"
};

export const Button: React.FC<ButtonProps> = ({
    variant = "secondary",
    size = "md",
    leftIcon,
    rightIcon,
    startIcon,
    endIcon,
    children,
    className,
    type = "button",
    ...props
}) => {
    const iconLeft = leftIcon || startIcon;
    const iconRight = rightIcon || endIcon;

    return (
        <button
            type={type}
            className={clsx(baseClasses, sizeClasses[size], variantClasses[variant], className)}
            {...props}
        >
            {iconLeft && <span className="flex-shrink-0 flex items-center">{iconLeft}</span>}
            <span>{children}</span>
            {iconRight && <span className="flex-shrink-0 flex items-center">{iconRight}</span>}
        </button>
    );
};

export default Button;

import type React from "react";
import type { FC, InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    type?: "text" | "number" | "email" | "password" | "date" | "time" | string;
    id?: string;
    name?: string;
    placeholder?: string;
    value?: string | number;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
    min?: string;
    max?: string;
    step?: number;
    disabled?: boolean;
    success?: boolean;
    error?: boolean;
    hint?: string;
}

const Input: FC<InputProps> = ({
    type = "text",
    className = "",
    disabled = false,
    success = false,
    error = false,
    hint,
    ...props
}) => {
    let inputClasses = `h-12 sm:h-11 w-full rounded-xl border appearance-none px-4 py-2.5 text-base sm:text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none transition-colors dark:bg-gray-900/80 dark:text-white/90 dark:placeholder:text-gray-500 ${className}`;

    if (disabled) {
        inputClasses += ` text-gray-400 border-gray-200 bg-gray-100 cursor-not-allowed dark:bg-gray-800/60 dark:text-gray-500 dark:border-gray-800 opacity-60`;
    } else if (error) {
        inputClasses += ` border-error-500 text-error-900 focus:border-error-500 focus:ring-2 focus:ring-error-500/20 dark:text-error-300 dark:border-error-500 dark:focus:border-error-500`;
    } else if (success) {
        inputClasses += ` border-success-500 text-success-900 focus:border-success-500 focus:ring-2 focus:ring-success-500/20 dark:text-success-300 dark:border-success-500 dark:focus:border-success-500`;
    } else {
        inputClasses += ` bg-white text-gray-900 border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15 dark:border-gray-800 dark:text-white dark:focus:border-brand-500 dark:focus:ring-brand-500/20`;
    }

    return (
        <div className="relative w-full">
            <input type={type} disabled={disabled} className={inputClasses} {...props} />
            {hint && (
                <p
                    className={`mt-1.5 text-xs ${
                        error ? "text-error-500 font-medium" : success ? "text-success-500 font-medium" : "text-gray-500 dark:text-gray-400"
                    }`}
                >
                    {hint}
                </p>
            )}
        </div>
    );
};

export default Input;

import React from "react";

interface TextareaProps {
    placeholder?: string;
    rows?: number;
    value?: string;
    onChange?: (value: string) => void;
    className?: string;
    disabled?: boolean;
    error?: boolean;
    hint?: string;
    required?: boolean;
}

const TextArea: React.FC<TextareaProps> = ({
    placeholder = "Enter your message",
    rows = 3,
    value = "",
    onChange,
    className = "",
    disabled = false,
    error = false,
    hint = "",
    required = false
}) => {
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (onChange) {
            onChange(e.target.value);
        }
    };

    let textareaClasses = `w-full rounded-xl border px-4 py-2.5 text-base sm:text-sm shadow-theme-xs focus:outline-none transition-colors ${className} `;

    if (disabled) {
        textareaClasses += ` bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed dark:bg-gray-800/60 dark:text-gray-500 dark:border-gray-800 opacity-60`;
    } else if (error) {
        textareaClasses += ` border-error-500 text-error-900 focus:border-error-500 focus:ring-2 focus:ring-error-500/20 dark:text-error-300 dark:border-error-500 dark:focus:border-error-500`;
    } else {
        textareaClasses += ` bg-white text-gray-900 border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15 dark:bg-gray-900/80 dark:border-gray-800 dark:text-white dark:focus:border-brand-500 dark:focus:ring-brand-500/20`;
    }

    return (
        <div className="relative w-full">
            <textarea
                placeholder={placeholder}
                rows={rows}
                value={value}
                onChange={handleChange}
                disabled={disabled}
                className={textareaClasses}
                required={required}
            />
            {hint && (
                <p
                    className={`mt-1.5 text-xs ${
                        error ? "text-error-500 font-medium" : "text-gray-500 dark:text-gray-400"
                    }`}
                >
                    {hint}
                </p>
            )}
        </div>
    );
};

export default TextArea;

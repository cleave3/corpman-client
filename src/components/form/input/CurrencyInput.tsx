import React, { InputHTMLAttributes, useState, useEffect } from "react";

interface CurrencyInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
    value: number;
    onChange: (value: number) => void;
    disabled?: boolean;
    success?: boolean;
    error?: boolean;
}

const formatCurrency = (value: number | string): string => {
    if (value === "") return "";
    const num = typeof value === "number" ? value : parseFloat(value.replace(/,/g, ""));
    if (isNaN(num)) return "";

    // Format and remove unnecessary decimal zeroes
    const parts = num.toFixed(2).split(".");
    const intPart = parseInt(parts[1]) === 0 ? parts[0] : parts.join(".");
    return value == 0 ? "" : `₦${parseFloat(intPart).toLocaleString("en-NG")}`;
};

const parseCurrency = (formatted: string): number => {
    const raw = formatted.replace(/[₦,]/g, "");
    const parsed = parseFloat(raw);
    return isNaN(parsed) ? 0 : parsed;
};

const CurrencyInput: React.FC<CurrencyInputProps> = ({
    value,
    onChange,
    success,
    disabled,
    error,
    className,
    ...rest
}) => {
    const [display, setDisplay] = useState(formatCurrency(value));

    useEffect(() => {
        setDisplay(formatCurrency(value));
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value.replace(/[₦]/g, "");

        // Allow only digits and up to one decimal point
        const cleaned = raw.replace(/[^0-9.]/g, "");
        const parts = cleaned.split(".");
        if (parts.length > 2 || (parts[1] && parts[1].length > 2)) return;

        setDisplay(raw); // Show as user types
        const numericValue = parseCurrency(cleaned);
        onChange(numericValue);
    };

    const handleBlur = () => {
        const numeric = parseCurrency(display);
        setDisplay(formatCurrency(numeric));
        onChange(numeric);
    };

    let inputClasses = `h-12 sm:h-11 w-full rounded-xl border appearance-none px-4 py-2.5 text-base sm:text-sm shadow-theme-xs placeholder:text-gray-400 focus:outline-none transition-colors dark:bg-gray-900/80 dark:text-white/90 dark:placeholder:text-gray-500 ${
        className || ""
    }`;

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
        <input
            type="text"
            value={display}
            onChange={handleChange}
            onBlur={handleBlur}
            inputMode="decimal"
            disabled={disabled}
            className={inputClasses}
            {...rest}
        />
    );
};

export default CurrencyInput;

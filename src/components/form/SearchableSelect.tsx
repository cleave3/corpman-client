import React, { useState, useRef, useEffect } from "react";

interface Option {
    label: string;
    value: string;
}

interface SearchableSelectProps {
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    error?: boolean;
    success?: boolean;
    className?: string;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
    options,
    value,
    onChange,
    placeholder = "Select...",
    disabled,
    error,
    success,
    className = ""
}) => {
    const [search, setSearch] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find((opt) => opt.value === value);
    const selectedLabel = selectedOption?.label || "";

    const filtered = options.filter((opt) =>
        opt.label.toLowerCase().includes(search.toLowerCase())
    );

    const handleSelect = (val: string) => {
        onChange(val);
        setSearch("");
        setIsOpen(false);
    };

    const handleClickOutside = (e: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
            setIsOpen(false);
            setSearch("");
        }
    };

    useEffect(() => {
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    let baseClasses =
        "relative h-12 sm:h-11 w-full rounded-xl border px-4 py-2.5 text-base sm:text-sm shadow-theme-xs focus:outline-none transition-colors cursor-pointer bg-white text-gray-900 dark:text-gray-100 dark:bg-gray-900/80";

    if (disabled) {
        baseClasses +=
            " text-gray-400 border-gray-200 bg-gray-100 cursor-not-allowed dark:bg-gray-800/60 dark:text-gray-500 dark:border-gray-800 opacity-60";
    } else if (error) {
        baseClasses +=
            " border-error-500 text-error-900 focus:border-error-500 focus:ring-2 focus:ring-error-500/20 dark:text-error-300 dark:border-error-500 dark:focus:border-error-500";
    } else if (success) {
        baseClasses +=
            " border-success-500 text-success-900 focus:border-success-500 focus:ring-2 focus:ring-success-500/20 dark:text-success-300 dark:border-success-500 dark:focus:border-success-500";
    } else {
        baseClasses +=
            " border-gray-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15 dark:border-gray-800 dark:focus:border-brand-500 dark:focus:ring-brand-500/20";
    }

    return (
        <div className="relative w-full" ref={containerRef}>
            <div className="relative">
                <input
                    ref={inputRef}
                    type="text"
                    disabled={disabled}
                    className={`${baseClasses} pr-10 ${className}`}
                    value={isOpen ? search : selectedLabel}
                    onFocus={() => {
                        setIsOpen(true);
                        setSearch("");
                    }}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setIsOpen(true);
                    }}
                    placeholder={placeholder}
                    readOnly={!isOpen}
                />
                <div className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                    <svg
                        className={`size-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </div>
            </div>

            {isOpen && (
                <div className="absolute left-0 right-0 z-50 mt-1 max-h-60 overflow-y-auto rounded-xl border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-800 dark:bg-gray-900 custom-scrollbar">
                    {filtered.length > 0 ? (
                        filtered.map((opt) => {
                            const isSelected = opt.value === value;
                            return (
                                <div
                                    key={opt.value}
                                    onClick={() => handleSelect(opt.value)}
                                    className={`flex items-center justify-between px-4 py-3 sm:py-2.5 text-sm cursor-pointer transition-colors active:bg-gray-100 ${
                                        isSelected
                                            ? "bg-brand-50 font-semibold text-brand-600 dark:bg-brand-500/15 dark:text-brand-400"
                                            : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800/60"
                                    }`}
                                >
                                    <span className="truncate">{opt.label}</span>
                                    {isSelected && (
                                        <svg className="size-4 flex-shrink-0 text-brand-600 dark:text-brand-400 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                        </svg>
                                    )}
                                </div>
                            );
                        })
                    ) : (
                        <div className="px-4 py-3 text-center text-xs text-gray-500 dark:text-gray-400">
                            No matching options found
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchableSelect;

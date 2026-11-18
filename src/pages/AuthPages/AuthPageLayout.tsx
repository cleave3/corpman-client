import React from "react";
import { ThemeToggleButton } from "../../components/common/ThemeToggleButton";
import { useTheme } from "../../context/ThemeContext";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
    const { theme } = useTheme();

    const logo = theme === "dark" ? "/corpman_darkmode.png" : "/corpman_lightmode.png";

    return (
        <div className="relative min-h-dvh flex flex-col justify-center bg-gray-50 dark:bg-gray-950 transition-colors">
            {/* Top Right Theme Toggler - Always Accessible */}
            <div className="absolute top-4 right-4 z-30 sm:top-6 sm:right-6">
                <ThemeToggleButton />
            </div>

            <div className="relative flex flex-col justify-center w-full min-h-dvh lg:flex-row">
                {/* Form Column */}
                <div className="flex flex-col justify-center items-center w-full lg:w-1/2 px-4 py-12 sm:px-8 md:px-12">
                    <div className="w-full max-w-md">
                        {/* Child Auth Card Content */}
                        <div className="rounded-2xl bg-white p-6 sm:p-8 shadow-sm border border-gray-200/80 dark:border-gray-800 dark:bg-gray-900">
                            {children}
                        </div>
                    </div>
                </div>

                {/* Desktop Hero Branding Column (Visible on lg+) */}
                <div className="hidden lg:grid items-center justify-center w-1/2 min-h-screen bg-brand-950 dark:bg-white/[0.02] border-l border-brand-900/30 dark:border-gray-800 p-12">
                    <div className="flex flex-col items-center text-center max-w-sm mx-auto">
                        <div className="flex items-center justify-center size-32 rounded-3xl bg-brand-900/40 p-4 border border-brand-800/50 mb-6 shadow-2xl">
                            <img
                                loading="lazy"
                                src={logo}
                                alt="Corpman Logo"
                                className="size-full object-contain"
                            />
                        </div>
                        <h2 className="text-3xl font-black tracking-tight text-white select-none">
                            Corpman
                        </h2>
                        <p className="text-sm text-gray-300/80 dark:text-gray-400 mt-2 font-medium">
                            Organize. Optimize. Corpman.
                        </p>
                        <p className="text-xs text-gray-400/60 dark:text-gray-500 mt-6 leading-relaxed">
                            Streamlined operational management, instant ledger tracking, and automated financial insights for modern enterprises.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

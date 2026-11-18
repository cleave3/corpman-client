import React from "react";
import { Link } from "react-router";
import { useSidebar } from "../context/SidebarContext";
import { ThemeToggleButton } from "../components/common/ThemeToggleButton";
import { useTheme } from "../context/ThemeContext";
import { useAuthStore } from "../hooks/useAuthStore";
import { ROUTES } from "../utils";

const AppHeader: React.FC = () => {
    const { toggleSidebar } = useSidebar();
    const { theme } = useTheme();
    const user = useAuthStore((state) => state.user);

    const logo = theme === "dark" ? "/corpman_darkmode.png" : "/corpman_lightmode.png";
    const userInitials = `${user?.first_name?.[0] || ""}${user?.last_name?.[0] || ""}`.toUpperCase() || "CM";

    return (
        <header className="sticky top-0 z-30 flex w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center justify-between flex-grow px-3 py-2.5 sm:px-4 md:px-6">
                {/* Left Area: Desktop Toggle & Mobile Brand Logo */}
                <div className="flex items-center gap-3">
                    {/* Desktop Sidebar Toggle Button - Only visible on lg+ */}
                    <button
                        className="hidden lg:flex items-center justify-center size-10 text-gray-500 border border-gray-200 rounded-lg hover:bg-gray-100 dark:border-gray-800 dark:text-gray-400 dark:hover:bg-gray-800 transition"
                        onClick={toggleSidebar}
                        aria-label="Toggle Sidebar"
                    >
                        <svg
                            width="18"
                            height="14"
                            viewBox="0 0 16 12"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                fillRule="evenodd"
                                clipRule="evenodd"
                                d="M0.583252 1C0.583252 0.585788 0.919038 0.25 1.33325 0.25H14.6666C15.0808 0.25 15.4166 0.585786 15.4166 1C15.4166 1.41421 15.0808 1.75 14.6666 1.75L1.33325 1.75C0.919038 1.75 0.583252 1.41422 0.583252 1ZM0.583252 11C0.583252 10.5858 0.919038 10.25 1.33325 10.25L14.6666 10.25C15.0808 10.25 15.4166 10.5858 15.4166 11C15.4166 11.4142 15.0808 11.75 14.6666 11.75L1.33325 11.75C0.919038 11.75 0.583252 11.4142 0.583252 11ZM1.33325 5.25C0.919038 5.25 0.583252 5.58579 0.583252 6C0.583252 6.41421 0.919038 6.75 1.33325 6.75L7.99992 6.75C8.41413 6.75 8.74992 6.41421 8.74992 6C8.74992 5.58579 8.41413 5.25 7.99992 5.25L1.33325 5.25Z"
                                fill="currentColor"
                            />
                        </svg>
                    </button>

                    {/* Mobile Brand Mark - Clean & prominent on mobile */}
                    <Link to={ROUTES.DASHBOARD} className="flex lg:hidden items-center gap-2">
                        <img src={logo} alt="Corpman Logo" className="h-7 w-auto object-contain" />
                        {/* <span className="font-bold text-base tracking-tight text-gray-900 dark:text-white">
                            Corpman
                        </span> */}
                    </Link>
                </div>

                {/* Right Area: Theme Toggle & User Info */}
                <div className="flex items-center gap-2 sm:gap-3">
                    <ThemeToggleButton />

                    {/* Mobile User Profile Link */}
                    <Link
                        to={ROUTES.PROFILE}
                        className="flex lg:hidden items-center justify-center size-9 rounded-full bg-brand-50 text-brand-600 font-semibold text-xs border border-brand-200 dark:bg-brand-500/20 dark:text-brand-400 dark:border-brand-500/30"
                        aria-label="Profile"
                    >
                        {userInitials}
                    </Link>

                    {/* Desktop User display */}
                    <Link
                        to={ROUTES.PROFILE}
                        className="hidden lg:flex items-center gap-2.5 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                    >
                        <div className="flex size-9 items-center justify-center rounded-full bg-brand-50 text-brand-600 font-semibold text-xs border border-brand-200 dark:bg-brand-500/20 dark:text-brand-400 dark:border-brand-500/30">
                            {userInitials}
                        </div>
                        <div className="flex flex-col text-left">
                            <span className="text-xs font-semibold text-gray-800 dark:text-gray-200">
                                {user?.first_name} {user?.last_name}
                            </span>
                            <span className="text-[11px] text-gray-500 dark:text-gray-400">
                                {user?.user_type || "Member"}
                            </span>
                        </div>
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default AppHeader;

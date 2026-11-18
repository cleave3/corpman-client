import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router";
import {
    ChartPieIcon,
    BookOpenIcon,
    UserGroupIcon,
    Cog6ToothIcon,
    UserCircleIcon,
    ArrowRightOnRectangleIcon,
    XMarkIcon,
    ClockIcon,
    MoonIcon,
    SunIcon
} from "@heroicons/react/24/outline";
import { useAuthStore } from "../hooks/useAuthStore";
import { useTheme } from "../context/ThemeContext";
import { hasPermissions, menuPermissions, PERMISSION_VALUES, ROUTES } from "../utils";
import ConfirmationModal from "../components/confirm";

interface MobileNavDrawerProps {
    isOpen: boolean;
    onClose: () => void;
}

interface DrawerMenuItem {
    name: string;
    path: string;
    icon: React.ReactNode;
    componentPermissions?: string[];
    badge?: string;
}

interface DrawerSection {
    title: string;
    items: DrawerMenuItem[];
}

export const MobileNavDrawer: React.FC<MobileNavDrawerProps> = ({ isOpen, onClose }) => {
    const { user, logout } = useAuthStore((state) => state);
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    if (!isOpen) return null;

    const sections: DrawerSection[] = [
        {
            title: "Operations",
            items: [
                {
                    name: "Pending Approvals",
                    path: ROUTES.PENDING_TRANSACTIONS,
                    icon: <ClockIcon className="size-5 text-amber-500" />,
                    componentPermissions: [PERMISSION_VALUES.transaction.approve_transaction]
                },
                {
                    name: "Performance Metrics",
                    path: ROUTES.METRICS,
                    icon: <ChartPieIcon className="size-5 text-emerald-500" />,
                    componentPermissions: menuPermissions("metrics")
                },
                {
                    name: "My Entries",
                    path: ROUTES.MY_ENTRIES,
                    icon: <BookOpenIcon className="size-5 text-indigo-500" />,
                    componentPermissions: []
                }
            ]
        },
        {
            title: "Management",
            items: [
                {
                    name: "Team & Permissions",
                    path: ROUTES.USERS,
                    icon: <UserGroupIcon className="size-5 text-purple-500" />,
                    componentPermissions: menuPermissions("users")
                },
                {
                    name: "Business Preferences",
                    path: ROUTES.SETTINGS,
                    icon: <Cog6ToothIcon className="size-5 text-slate-500" />,
                    componentPermissions: menuPermissions("business")
                }
            ]
        },
        {
            title: "Account",
            items: [
                {
                    name: "My Profile",
                    path: ROUTES.PROFILE,
                    icon: <UserCircleIcon className="size-5 text-teal-500" />,
                    componentPermissions: []
                }
            ]
        }
    ];

    const handleLogout = () => {
        setShowLogoutConfirm(false);
        onClose();
        logout();
        navigate(ROUTES.SIGNIN);
    };

    const userInitials = `${user?.first_name?.[0] || ""}${user?.last_name?.[0] || ""}`.toUpperCase() || "CM";

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity lg:hidden"
                onClick={onClose}
                aria-hidden="true"
            />

            {/* Bottom Sheet Container */}
            <div
                className="fixed inset-x-0 bottom-0 z-50 flex max-h-[88vh] flex-col rounded-t-3xl bg-white shadow-2xl transition-transform duration-300 ease-out dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 lg:hidden"
                role="dialog"
                aria-modal="true"
            >
                {/* Drag Handle */}
                <div className="flex justify-center pt-3 pb-1" onClick={onClose}>
                    <div className="h-1.5 w-12 rounded-full bg-gray-300 dark:bg-gray-700" />
                </div>

                {/* User Header */}
                <div className="flex items-center justify-between px-5 py-3 border-b border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-3">
                        <div className="flex size-11 items-center justify-center rounded-full bg-brand-50 text-brand-600 font-bold text-base dark:bg-brand-500/20 dark:text-brand-400">
                            {userInitials}
                        </div>
                        <div className="flex flex-col">
                            <span className="font-semibold text-gray-900 text-sm dark:text-white">
                                {user?.first_name} {user?.last_name}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
                                {user?.email}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="flex size-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 transition"
                        aria-label="Close menu"
                    >
                        <XMarkIcon className="size-5" />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5 custom-scrollbar pb-[calc(2rem+env(safe-area-inset-bottom))]">
                    {sections.map((section) => {
                        const visibleItems = section.items.filter((item) =>
                            hasPermissions(user?.permissions, item.componentPermissions)
                        );

                        if (visibleItems.length === 0) return null;

                        return (
                            <div key={section.title} className="space-y-1">
                                <h3 className="px-3 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                                    {section.title}
                                </h3>
                                <div className="space-y-1">
                                    {visibleItems.map((item) => (
                                        <NavLink
                                            key={item.path}
                                            to={item.path}
                                            onClick={onClose}
                                            className={({ isActive }) =>
                                                `flex items-center justify-between px-3 py-3 rounded-xl text-sm font-medium transition-colors ${
                                                    isActive
                                                        ? "bg-brand-50 text-brand-600 dark:bg-brand-500/15 dark:text-brand-400"
                                                        : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800/60"
                                                }`
                                            }
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className="flex-shrink-0">{item.icon}</span>
                                                <span>{item.name}</span>
                                            </div>
                                        </NavLink>
                                    ))}
                                </div>
                            </div>
                        );
                    })}

                    {/* Preferences & Quick Actions */}
                    <div className="space-y-1 pt-2 border-t border-gray-100 dark:border-gray-800">
                        <h3 className="px-3 text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
                            Preferences
                        </h3>

                        {/* Theme Toggle Button */}
                        <button
                            type="button"
                            onClick={toggleTheme}
                            className="flex w-full items-center justify-between px-3 py-3 rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800/60 transition-colors"
                        >
                            <div className="flex items-center gap-3">
                                {theme === "dark" ? (
                                    <SunIcon className="size-5 text-amber-500" />
                                ) : (
                                    <MoonIcon className="size-5 text-slate-600" />
                                )}
                                <span>Theme</span>
                            </div>
                            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 capitalize">
                                {theme}
                            </span>
                        </button>

                        {/* Sign Out Button */}
                        <button
                            type="button"
                            onClick={() => setShowLogoutConfirm(true)}
                            className="flex w-full items-center gap-3 px-3 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30 transition-colors"
                        >
                            <ArrowRightOnRectangleIcon className="size-5 text-red-500" />
                            <span>Sign out</span>
                        </button>
                    </div>
                </div>
            </div>

            <ConfirmationModal
                title="Are you sure you want to sign out?"
                isOpen={showLogoutConfirm}
                onCancel={() => setShowLogoutConfirm(false)}
                onConfirm={handleLogout}
            />
        </>
    );
};

export default MobileNavDrawer;

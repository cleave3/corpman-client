import React, { useState } from "react";
import { NavLink, useLocation } from "react-router";
import {
    Squares2X2Icon,
    DocumentTextIcon,
    PlusIcon,
    UserGroupIcon,
    Bars3BottomRightIcon
} from "@heroicons/react/24/outline";
import { useAuthStore } from "../hooks/useAuthStore";
import { hasPermissions, menuPermissions, PERMISSION_VALUES, ROUTES } from "../utils";
import MobileNavDrawer from "./MobileNavDrawer";

export const MobileBottomNav: React.FC = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const user = useAuthStore((state) => state.user);
    const location = useLocation();

    const canInitiateTransaction = hasPermissions(user?.permissions, [
        PERMISSION_VALUES.transaction.initiate_transaction
    ]);
    const canViewCustomers = hasPermissions(user?.permissions, menuPermissions("customers"));
    const canViewTransactions = hasPermissions(user?.permissions, menuPermissions("transaction"));
    const canViewDashboard = hasPermissions(user?.permissions, menuPermissions("dashboard"));

    // Check if the current route is considered inside "More" drawer
    const isMoreActive = [
        ROUTES.METRICS,
        ROUTES.USERS,
        ROUTES.SETTINGS,
        ROUTES.MY_ENTRIES,
        ROUTES.PROFILE,
        ROUTES.PENDING_TRANSACTIONS
    ].includes(location.pathname);

    return (
        <>
            <nav
                className="fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-200/80 dark:border-gray-800 shadow-[0_-2px_12px_rgba(0,0,0,0.04)] lg:hidden"
                style={{ paddingBottom: "max(0.35rem, env(safe-area-inset-bottom))" }}
                aria-label="Mobile Navigation"
            >
                <div className="flex items-center justify-around px-2 pt-1.5 pb-1 h-16">
                    {/* 1. Dashboard */}
                    {canViewDashboard && (
                        <NavLink
                            to={ROUTES.DASHBOARD}
                            className={({ isActive }) =>
                                `flex flex-col items-center justify-center flex-1 py-1 min-w-0 transition-colors ${
                                    isActive
                                        ? "text-brand-600 dark:text-brand-400 font-semibold"
                                        : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                                }`
                            }
                        >
                            <Squares2X2Icon className="size-5" />
                            <span className="text-[11px] mt-1 truncate">Home</span>
                        </NavLink>
                    )}

                    {/* 2. Transactions */}
                    {canViewTransactions && (
                        <NavLink
                            to={ROUTES.ALL_TRANSACTIONS}
                            className={({ isActive }) =>
                                `flex flex-col items-center justify-center flex-1 py-1 min-w-0 transition-colors ${
                                    isActive || location.pathname === ROUTES.ALL_TRANSACTIONS
                                        ? "text-brand-600 dark:text-brand-400 font-semibold"
                                        : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                                }`
                            }
                        >
                            <DocumentTextIcon className="size-5" />
                            <span className="text-[11px] mt-1 truncate">Transactions</span>
                        </NavLink>
                    )}

                    {/* 3. Center Elevated Action Button (Initiate Transaction) */}
                    {canInitiateTransaction && (
                        <div className="flex items-center justify-center flex-1 px-1">
                            <NavLink
                                to={ROUTES.NEW_TRANSACTIONS}
                                className={({ isActive }) =>
                                    `flex size-12 items-center justify-center rounded-full bg-brand-500 text-white shadow-lg shadow-brand-500/30 transition-transform active:scale-95 hover:bg-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${
                                        isActive ? "ring-2 ring-white dark:ring-gray-900 scale-105" : ""
                                    }`
                                }
                                aria-label="Add Transaction"
                            >
                                <PlusIcon className="size-6 stroke-[2.5]" />
                            </NavLink>
                        </div>
                    )}

                    {/* 4. Customers */}
                    {canViewCustomers && (
                        <NavLink
                            to={ROUTES.CUSTOMERS}
                            className={({ isActive }) =>
                                `flex flex-col items-center justify-center flex-1 py-1 min-w-0 transition-colors ${
                                    isActive
                                        ? "text-brand-600 dark:text-brand-400 font-semibold"
                                        : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                                }`
                            }
                        >
                            <UserGroupIcon className="size-5" />
                            <span className="text-[11px] mt-1 truncate">Customers</span>
                        </NavLink>
                    )}

                    {/* 5. More (Opens Bottom Sheet) */}
                    <button
                        type="button"
                        onClick={() => setIsDrawerOpen(true)}
                        className={`flex flex-col items-center justify-center flex-1 py-1 min-w-0 transition-colors ${
                            isDrawerOpen || isMoreActive
                                ? "text-brand-600 dark:text-brand-400 font-semibold"
                                : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-200"
                        }`}
                        aria-label="Open more menu"
                    >
                        <Bars3BottomRightIcon className="size-5" />
                        <span className="text-[11px] mt-1 truncate">More</span>
                    </button>
                </div>
            </nav>

            {/* Slide-up Bottom Sheet Drawer */}
            <MobileNavDrawer
                isOpen={isDrawerOpen}
                onClose={() => setIsDrawerOpen(false)}
            />
        </>
    );
};

export default MobileBottomNav;

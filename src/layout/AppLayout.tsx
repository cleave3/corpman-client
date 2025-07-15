import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import { NavLink, Outlet } from "react-router";
import AppHeader from "./AppHeader";
import Backdrop from "./Backdrop";
import AppSidebar from "./AppSidebar";
import { useAuthStore } from "../hooks/useAuthStore";
import { useEffect } from "react";
import { BookOpenIcon, PlusIcon, Squares2X2Icon, UserIcon } from "@heroicons/react/24/outline";
import { PERMISSION_VALUES, ROUTES } from "../utils";
// import AccessWrapper from "../components/AccessController";

const LayoutContent: React.FC = () => {
    const { isExpanded, isHovered, isMobileOpen } = useSidebar();

    const { refreshAuth, user } = useAuthStore((state) => state);

    useEffect(() => {
        refreshAuth();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const hasTransactionPermission = user?.permissions?.includes(PERMISSION_VALUES.transaction.initiate_transaction);

    return (
        <>
            <div className="min-h-screen xl:flex">
                <div>
                    <AppSidebar />
                    <Backdrop />
                </div>
                <div
                    className={`flex-1 transition-all duration-300 ease-in-out ${
                        isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"
                    } ${isMobileOpen ? "ml-0" : ""}`}
                >
                    <AppHeader />
                    <div className="p-4 mx-auto max-w-screen-2xl md:p-6">
                        <Outlet />
                    </div>
                </div>
            </div>
            {/* <AccessWrapper componentPermissions={[...menuPermissions("dashboard"), PERMISSION_VALUES.transaction.initiate_transaction]}> */}
            <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around p-3 bg-white border-t border-gray-200 dark:bg-gray-900 dark:border-gray-800 lg:hidden">
                <div className="flex items-center justify-around w-full">
                    <NavLink
                        to={hasTransactionPermission ? ROUTES.NEW_TRANSACTIONS : ROUTES.PROFILE}
                        className="flex flex-col items-center text-gray-600 dark:text-gray-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors duration-200"
                    >
                        {hasTransactionPermission ? <PlusIcon className="size-6" /> : <UserIcon className="size-6" />}
                        <span className="text-xs mt-1">{hasTransactionPermission ? "New Transaction" : "Profile"}</span>
                    </NavLink>
                    {/* <AccessWrapper componentPermissions={[...menuPermissions("dashboard")]}> */}
                    <NavLink
                        to={ROUTES.DASHBOARD}
                        className="flex flex-col items-center text-gray-600 dark:text-gray-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors duration-200"
                    >
                        <Squares2X2Icon className="size-6" />
                        <span className="text-xs mt-1">Dashboard</span>
                    </NavLink>
                    {/* </AccessWrapper> */}
                    <NavLink
                        to={ROUTES.MY_ENTRIES}
                        className="flex flex-col items-center text-gray-600 dark:text-gray-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors duration-200"
                    >
                        <BookOpenIcon className="size-6" />
                        <span className="text-xs mt-1">My Entries</span>
                    </NavLink>
                </div>
            </div>
            {/* </AccessWrapper> */}
        </>
    );
};

const AppLayout: React.FC = () => {
    return (
        <SidebarProvider>
            <LayoutContent />
        </SidebarProvider>
    );
};

export default AppLayout;

import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import { NavLink, Outlet } from "react-router";
import AppHeader from "./AppHeader";
import Backdrop from "./Backdrop";
import AppSidebar from "./AppSidebar";
import { useAuthStore } from "../hooks/useAuthStore";
import { ReactNode, useEffect } from "react";
import { BookOpenIcon, DocumentPlusIcon, Squares2X2Icon, UserIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import { menuPermissions, PERMISSION_VALUES, ROUTES } from "../utils";
import AccessWrapper from "../components/AccessController";

interface BottomMenuProps {
    link: string;
    name: string;
    icon: ReactNode;
    componentPermissions: string[];
}

const BOTTOM_MENU: BottomMenuProps[] = [
    {
        link: ROUTES.NEW_TRANSACTIONS,
        name: "Transaction",
        icon: <DocumentPlusIcon className="size-6" />,
        componentPermissions: [PERMISSION_VALUES.transaction.initiate_transaction]
    },
    {
        link: ROUTES.CUSTOMERS,
        name: "Customers",
        icon: <UserGroupIcon className="size-6" />,
        componentPermissions: menuPermissions("customers")
    },
    {
        link: ROUTES.DASHBOARD,
        name: "Dashboard",
        icon: <Squares2X2Icon className="size-6" />,
        componentPermissions: []
    },
    {
        link: ROUTES.MY_ENTRIES,
        name: "Entries",
        icon: <BookOpenIcon className="size-6" />,
        componentPermissions: []
    },
    {
        link: ROUTES.PROFILE,
        name: "Profile",
        icon: <UserIcon className="size-6" />,
        componentPermissions: []
    }
];

const LayoutContent: React.FC = () => {
    const { isExpanded, isHovered, isMobileOpen } = useSidebar();

    const { refreshAuth } = useAuthStore((state) => state);

    useEffect(() => {
        refreshAuth();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // const hasTransactionPermission = user?.permissions?.includes(PERMISSION_VALUES.transaction.initiate_transaction);

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
                    <div className="p-4 mx-auto max-w-screen-2xl md:p-6 mb-20">
                        <Outlet />
                    </div>
                </div>
            </div>
            <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around p-3 bg-white border-t border-gray-200 dark:bg-gray-900 dark:border-gray-800 lg:hidden">
                <div className="flex items-center justify-around w-full">
                    {BOTTOM_MENU.map((menu, i) => (
                        <AccessWrapper componentPermissions={menu.componentPermissions} key={i}>
                            <NavLink
                                to={menu.link}
                                className="flex flex-col items-center text-gray-600 dark:text-gray-400 hover:text-brand-500 dark:hover:text-brand-400 transition-colors duration-200"
                            >
                                {menu.icon}
                                <span className="text-[12px] mt-1">{menu.name}</span>
                            </NavLink>
                        </AccessWrapper>
                    ))}
                </div>
            </div>
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

import React, { useEffect } from "react";
import { SidebarProvider, useSidebar } from "../context/SidebarContext";
import { Outlet } from "react-router";
import AppHeader from "./AppHeader";
import Backdrop from "./Backdrop";
import AppSidebar from "./AppSidebar";
import MobileBottomNav from "./MobileBottomNav";
import { useAuthStore } from "../hooks/useAuthStore";

const LayoutContent: React.FC = () => {
    const { isExpanded, isHovered } = useSidebar();
    const { refreshAuth } = useAuthStore((state) => state);

    useEffect(() => {
        refreshAuth();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
            {/* Desktop Sidebar & Backdrop - Hidden on mobile */}
            <div className="hidden lg:block">
                <AppSidebar />
                <Backdrop />
            </div>

            {/* Main Application Area */}
            <div
                className={`flex flex-col min-h-screen transition-all duration-300 ease-in-out ${
                    isExpanded || isHovered ? "lg:ml-[290px]" : "lg:ml-[90px]"
                }`}
            >
                <AppHeader />
                <main className="flex-1 p-3 sm:p-5 md:p-6 pb-[calc(5.5rem+env(safe-area-inset-bottom))] lg:pb-8 max-w-screen-2xl w-full mx-auto">
                    <Outlet />
                </main>
            </div>

            {/* Mobile Bottom Navigation Bar (< 1024px) */}
            <MobileBottomNav />
        </div>
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

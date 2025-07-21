import { useCallback, useEffect, useRef, useState } from "react";
import { ChartPieIcon, BookOpenIcon } from "@heroicons/react/24/outline";
import { Link, useLocation } from "react-router";
import { ChevronDownIcon, GridIcon, ListIcon, PageIcon, TeamIcon, UserGroup, UserIcon } from "../icons";
import { useSidebar } from "../context/SidebarContext";
import { menuPermissions, PERMISSION_VALUES, ROUTES } from "../utils";
// import { useAuthStore } from "../hooks/useAuthStore";
import useWidth from "../hooks/useWidth";
// import { useTheme } from "../context/ThemeContext";
import AccessWrapper from "../components/AccessController";

type NavItem = {
    name: string;
    icon: React.ReactNode;
    path?: string;
    subItems?: { name: string; path: string; pro?: boolean; new?: boolean; componentPermissions?: string[] }[];
    componentPermissions?: string[];
    hideOnMobile?: boolean;
};

const navItems: NavItem[] = [
    {
        icon: <GridIcon />,
        name: "Dashboard",
        path: ROUTES.DASHBOARD,
        componentPermissions: menuPermissions("dashboard"),
        hideOnMobile: true
    },
    {
        icon: <UserGroup />,
        name: "Customers",
        path: ROUTES.CUSTOMERS,
        componentPermissions: menuPermissions("customers"),
        hideOnMobile: true
    },
    {
        icon: <PageIcon />,
        name: "Transactions",
        // path: ROUTES.ALL_TRANSACTIONS,
        subItems: [
            {
                name: "Pending",
                path: ROUTES.PENDING_TRANSACTIONS,
                componentPermissions: [PERMISSION_VALUES.transaction.view_transactions, PERMISSION_VALUES.transaction.approve_transaction]
            },
            {
                name: "All Transactions",
                path: ROUTES.ALL_TRANSACTIONS,
                componentPermissions: [PERMISSION_VALUES.transaction.view_transactions]
            },
            {
                name: "New Transaction",
                path: ROUTES.NEW_TRANSACTIONS,
                componentPermissions: [PERMISSION_VALUES.transaction.initiate_transaction]
            }
        ],
        componentPermissions: menuPermissions("transaction")
    },
    {
        icon: <ChartPieIcon />,
        name: "Performance Metrics",
        path: ROUTES.METRICS,
        componentPermissions: menuPermissions("metrics"),
        hideOnMobile: true
    },
    {
        name: "Team",
        icon: <TeamIcon />,
        path: ROUTES.USERS,
        componentPermissions: menuPermissions("users")
    },
    {
        name: "Business Preferences",
        icon: <ListIcon />,
        path: ROUTES.SETTINGS,
        componentPermissions: menuPermissions("business")
    },
    {
        icon: <BookOpenIcon />,
        name: "My Entries",
        path: ROUTES.MY_ENTRIES,
        componentPermissions: [],
        hideOnMobile: true
    },
    {
        icon: <UserIcon />,
        name: "Profile",
        path: ROUTES.PROFILE,
        componentPermissions: [],
        hideOnMobile: true
    }
];

const AppSidebar: React.FC = () => {
    const { isExpanded, isMobileOpen, isHovered, setIsHovered, toggleMobileSidebar } = useSidebar();
    const location = useLocation();

    // const { logout } = useAuthStore((state) => state);

    const { isMobile } = useWidth();

    // const { theme } = useTheme();

    const [openSubmenu, setOpenSubmenu] = useState<{
        type: "main" | "others";
        index: number;
    } | null>(null);
    const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
    const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

    // const isActive = (path: string) => location.pathname === path;
    const isActive = useCallback((path: string) => location.pathname === path, [location.pathname]);

    useEffect(() => {
        let submenuMatched = false;
        navItems.forEach((nav, index) => {
            if (nav.subItems) {
                nav.subItems.forEach((subItem) => {
                    if (isActive(subItem.path)) {
                        setOpenSubmenu({
                            type: "main",
                            index
                        });
                        submenuMatched = true;
                    }
                });
            }
        });

        if (!submenuMatched) {
            setOpenSubmenu(null);
        }
    }, [location, isActive]);

    useEffect(() => {
        if (openSubmenu !== null) {
            const key = `${openSubmenu.type}-${openSubmenu.index}`;
            if (subMenuRefs.current[key]) {
                setSubMenuHeight((prevHeights) => ({
                    ...prevHeights,
                    [key]: subMenuRefs.current[key]?.scrollHeight || 0
                }));
            }
        }
    }, [openSubmenu]);

    const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
        setOpenSubmenu((prevOpenSubmenu) => {
            if (prevOpenSubmenu && prevOpenSubmenu.type === menuType && prevOpenSubmenu.index === index) {
                return null;
            }
            return { type: menuType, index };
        });
    };

    const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
        <ul className="flex flex-col gap-4">
            {items.map((nav, index) => (
                <AccessWrapper key={index} componentPermissions={nav.componentPermissions}>
                    <li key={nav.name} className={`${nav.hideOnMobile ? "lg:block hidden" : ""}`}>
                        {nav.subItems ? (
                            <button
                                onClick={() => handleSubmenuToggle(index, menuType)}
                                className={`menu-item group ${
                                    openSubmenu?.type === menuType && openSubmenu?.index === index
                                        ? "menu-item-active"
                                        : "menu-item-inactive"
                                } cursor-pointer ${!isExpanded && !isHovered ? "lg:justify-center" : "lg:justify-start"}`}
                            >
                                <span
                                    className={`menu-item-icon-size  ${
                                        openSubmenu?.type === menuType && openSubmenu?.index === index
                                            ? "menu-item-icon-active"
                                            : "menu-item-icon-inactive"
                                    }`}
                                >
                                    {nav.icon}
                                </span>
                                {(isExpanded || isHovered || isMobileOpen) && <span className="menu-item-text">{nav.name}</span>}
                                {(isExpanded || isHovered || isMobileOpen) && (
                                    <ChevronDownIcon
                                        className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                                            openSubmenu?.type === menuType && openSubmenu?.index === index
                                                ? "rotate-180 text-brand-500"
                                                : ""
                                        }`}
                                    />
                                )}
                            </button>
                        ) : (
                            nav.path && (
                                <Link
                                    to={nav.path}
                                    onClick={isMobile ? toggleMobileSidebar : undefined}
                                    className={`menu-item group ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"}`}
                                >
                                    <span
                                        className={`menu-item-icon-size ${
                                            isActive(nav.path) ? "menu-item-icon-active" : "menu-item-icon-inactive"
                                        }`}
                                    >
                                        {nav.icon}
                                    </span>
                                    {(isExpanded || isHovered || isMobileOpen) && <span className="menu-item-text">{nav.name}</span>}
                                </Link>
                            )
                        )}
                        {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
                            <div
                                ref={(el) => {
                                    subMenuRefs.current[`${menuType}-${index}`] = el;
                                }}
                                className="overflow-hidden transition-all duration-300"
                                style={{
                                    height:
                                        openSubmenu?.type === menuType && openSubmenu?.index === index
                                            ? `${subMenuHeight[`${menuType}-${index}`]}px`
                                            : "0px"
                                }}
                            >
                                <ul className="mt-2 space-y-1 ml-9">
                                    {nav.subItems.map((subItem, i) => (
                                        <AccessWrapper key={i}>
                                            <li key={subItem.name}>
                                                <Link
                                                    onClick={isMobile ? toggleMobileSidebar : undefined}
                                                    to={subItem.path}
                                                    className={`menu-dropdown-item ${
                                                        isActive(subItem.path) ? "menu-dropdown-item-active" : "menu-dropdown-item-inactive"
                                                    }`}
                                                >
                                                    {subItem.name}
                                                    <span className="flex items-center gap-1 ml-auto">
                                                        {subItem.new && (
                                                            <span
                                                                className={`ml-auto ${
                                                                    isActive(subItem.path)
                                                                        ? "menu-dropdown-badge-active"
                                                                        : "menu-dropdown-badge-inactive"
                                                                } menu-dropdown-badge`}
                                                            >
                                                                new
                                                            </span>
                                                        )}
                                                        {subItem.pro && (
                                                            <span
                                                                className={`ml-auto ${
                                                                    isActive(subItem.path)
                                                                        ? "menu-dropdown-badge-active"
                                                                        : "menu-dropdown-badge-inactive"
                                                                } menu-dropdown-badge`}
                                                            >
                                                                pro
                                                            </span>
                                                        )}
                                                    </span>
                                                </Link>
                                            </li>
                                        </AccessWrapper>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </li>
                </AccessWrapper>
            ))}
        </ul>
    );

    return (
        <aside
            className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-auto lg:h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${isExpanded || isMobileOpen ? "w-[290px]" : isHovered ? "w-[290px]" : "w-[90px]"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
            onMouseEnter={() => !isExpanded && setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* <div className="flex justify-start my-5 ps-4">
                <img src={theme === "light" ? "/corpman_lightmode.png" : "/corpman_darkmode.png"} alt="Logo" width={60} height={60} />
            </div> */}
            <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
                <nav className="mb-6 mt-10">
                    <div className="flex flex-col gap-4">
                        <div>{renderMenuItems(navItems, "main")}</div>
                    </div>
                </nav>
            </div>
            {/* <span
                className="lg:flex items-center gap-3 px-3 py-2 text-red-500 rounded-lg group text-theme-sm cursor-pointer absolute lg:bottom-5 bottom-40 left-4 w-full hidden"
                onClick={logout}
            >
                <ArrowLeftEndOnRectangleIcon className="w-5 h-5 text-red-500" />
                {(isExpanded || isHovered || isMobileOpen) && <span className="menu-item-text">Sign out</span>}
            </span> */}
        </aside>
    );
};

export default AppSidebar;

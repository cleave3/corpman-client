import React, { ReactNode } from "react";
import { Link } from "react-router";
import { ChevronRightIcon } from "@heroicons/react/24/outline";

interface BreadcrumbProps {
    pageTitle: ReactNode;
    showNavigation?: boolean;
}

const PageBreadcrumb: React.FC<BreadcrumbProps> = ({ pageTitle, showNavigation = true }) => {
    return (
        <div className="flex items-center justify-between gap-3 mb-4 sm:mb-6">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
                {pageTitle}
            </h1>
            {showNavigation && (
                <nav className="hidden sm:block">
                    <ol className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                        <li>
                            <Link
                                className="inline-flex items-center gap-1 hover:text-gray-900 dark:hover:text-white transition"
                                to="/"
                            >
                                Home
                            </Link>
                        </li>
                        <ChevronRightIcon className="size-3 text-gray-400" />
                        <li className="font-semibold text-gray-800 dark:text-gray-200 truncate max-w-[200px]">
                            {pageTitle}
                        </li>
                    </ol>
                </nav>
            )}
        </div>
    );
};

export default PageBreadcrumb;

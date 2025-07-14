import { ReactNode, KeyboardEvent } from "react";
import { GroupIcon } from "../../icons";
import { StaticFunc } from "../../api/types";

interface StatsCardprops {
    title: string;
    isLoading?: boolean;
    value?: string;
    icon?: ReactNode;
    onClick?: StaticFunc;
}

const StatsCard = ({ title, isLoading = false, value, icon = <GroupIcon className="size-6 text-blue-500" />, onClick }: StatsCardprops) => {
    const isClickable = !!onClick;

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (isClickable && (event.key === "Enter" || event.key === " ")) {
            event.preventDefault();
            onClick?.();
        }
    };

    const commonProps = {
        onClick: isClickable ? onClick : undefined,
        onKeyDown: isClickable ? handleKeyDown : undefined,
        role: isClickable ? "button" : undefined,
        tabIndex: isClickable ? 0 : undefined,
        "aria-busy": isLoading,
        "aria-label": title
    };

    return (
        <>
            <div
                {...commonProps}
                className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all duration-300 ease-in-out hover:shadow-md dark:border-gray-800 dark:bg-white/[0.03] md:p-5 cursor-pointer lg:block hidden"
            >
                <div className="absolute -right-4 -top-4 flex h-24 w-24 items-center justify-center rounded-full bg-blue-500/10 dark:bg-blue-500/20"></div>
                <div className="absolute -bottom-4 -left-4 flex h-24 w-24 items-center justify-center rounded-full bg-blue-500/10 dark:bg-blue-500/20"></div>

                <div className="relative z-10 flex flex-col items-start">
                    <div className="flex items-center justify-center w-12 h-7 mb-4 rounded-xl bg-blue-100 dark:bg-blue-900/50">{icon}</div>
                    <span className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</span>
                    <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
                        {isLoading ? <div className="h-6 w-16 bg-gray-200 rounded animate-pulse dark:bg-gray-700" /> : value}
                    </h4>
                </div>
            </div>
            <div
                {...commonProps}
                className={`
                p-5 rounded-xl border bg-white dark:bg-gray-900 dark:border-gray-700 lg:hidden
                flex items-center justify-between
                transition-all duration-300
                ${isClickable ? "cursor-pointer hover:shadow-lg hover:border-blue-500/50 dark:hover:border-blue-500/50" : "cursor-default"}
            `}
            >
                <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
                    <h3 className="mt-1 text-2xl font-bold text-gray-900 dark:text-white">
                        {isLoading ? <div className="h-8 w-24 bg-gray-200 rounded-md animate-pulse dark:bg-gray-700" /> : value}
                    </h3>
                </div>
                <div className="flex items-center justify-center size-12 rounded-full bg-blue-100 dark:bg-blue-900/50">{icon}</div>
            </div>
        </>
    );
};

export default StatsCard;

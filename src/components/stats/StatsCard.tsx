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

const StatsCard = ({
    title,
    isLoading = false,
    value,
    icon = <GroupIcon className="size-5 text-brand-600 dark:text-brand-400" />,
    onClick
}: StatsCardprops) => {
    const isClickable = !!onClick;

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (isClickable && (event.key === "Enter" || event.key === " ")) {
            event.preventDefault();
            onClick?.();
        }
    };

    return (
        <div
            onClick={isClickable ? onClick : undefined}
            onKeyDown={isClickable ? handleKeyDown : undefined}
            role={isClickable ? "button" : undefined}
            tabIndex={isClickable ? 0 : undefined}
            aria-busy={isLoading}
            aria-label={title}
            className={`relative overflow-hidden rounded-2xl border border-gray-200/80 bg-white p-4 sm:p-5 shadow-xs transition-all dark:border-gray-800 dark:bg-gray-900/60 ${
                isClickable
                    ? "cursor-pointer hover:border-brand-500/40 hover:shadow-sm active:scale-[0.98]"
                    : "cursor-default"
            }`}
        >
            <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400 truncate">
                    {title}
                </span>
                <div className="flex size-9 sm:size-10 flex-shrink-0 items-center justify-center rounded-xl bg-brand-50 dark:bg-brand-500/15">
                    {icon}
                </div>
            </div>

            <div className="mt-1">
                {isLoading ? (
                    <div className="h-7 w-20 bg-gray-200 dark:bg-gray-800 rounded-md animate-pulse" />
                ) : (
                    <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-gray-900 dark:text-white tabular-nums">
                        {value}
                    </h3>
                )}
            </div>
        </div>
    );
};

export default StatsCard;

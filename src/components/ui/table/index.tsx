import { ReactNode } from "react";
import { StaticFunc } from "../../../api/types";

// Props for Table
interface TableProps {
    children: ReactNode; // Table content (thead, tbody, etc.)
    className?: string; // Optional className for styling
}

// Props for TableHeader
interface TableHeaderProps {
    children: ReactNode; // Header row(s)
    className?: string; // Optional className for styling
}

// Props for TableBody
interface TableBodyProps {
    children: ReactNode; // Body row(s)
    className?: string; // Optional className for styling
}

// Props for TableRow
interface TableRowProps {
    children: ReactNode; // Cells (th or td)
    className?: string; // Optional className for styling
    onClick?: StaticFunc;
}

// Props for TableCell
interface TableCellProps {
    children: ReactNode; // Cell content
    isHeader?: boolean; // If true, renders as <th>, otherwise <td>
    className?: string; // Optional className for styling
}

// Table Component
const Table: React.FC<TableProps> = ({ children, className }) => {
    return <table className={`min-w-full  ${className}`}>{children}</table>;
};

// TableHeader Component
const TableHeader: React.FC<TableHeaderProps> = ({ children, className }) => {
    return <thead className={className}>{children}</thead>;
};

// TableBody Component
const TableBody: React.FC<TableBodyProps> = ({ children, className }) => {
    return <tbody className={className}>{children}</tbody>;
};

// TableRow Component
const TableRow: React.FC<TableRowProps> = ({ children, className, ...props }) => {
    return (
        <tr className={`${props?.onClick ? "hover:bg-slate-100 cursor-pointer" : ""}${className}`} {...props}>
            {children}
        </tr>
    );
};

// TableCell Component
const TableCell: React.FC<TableCellProps> = ({ children, isHeader = false, className }) => {
    const CellTag = isHeader ? "th" : "td";
    return (
        <CellTag
            className={`${
                isHeader
                    ? "px-5 py-3 font-extrabold text-gray-500 text-start text-theme-sm dark:text-gray-400"
                    : "px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400"
            } ${className}`}
        >
            {children}
        </CellTag>
    );
};

const TableLoader: React.FC<{ length?: number }> = ({ length = 6 }) => {
    return (
        <div className="p-3 sm:p-6">
            <div className="animate-pulse space-y-3 sm:space-y-0">
                {/* Mobile Skeleton Cards */}
                <div className="block lg:hidden space-y-3">
                    {Array.from({ length: 5 }).map((_, idx) => (
                        <div
                            key={idx}
                            className="rounded-2xl border border-gray-200/80 dark:border-gray-800 p-4 bg-white dark:bg-gray-900 shadow-xs"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className="space-y-1.5 flex-1">
                                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded-md w-1/3" />
                                    <div className="h-3 bg-gray-100 dark:bg-gray-800/60 rounded-md w-1/4" />
                                </div>
                                <div className="h-6 w-16 bg-gray-200 dark:bg-gray-800 rounded-full" />
                            </div>
                            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-100 dark:border-gray-800/60">
                                <div className="h-3.5 bg-gray-200 dark:bg-gray-800 rounded w-4/5" />
                                <div className="h-3.5 bg-gray-200 dark:bg-gray-800 rounded w-3/5 ml-auto" />
                                <div className="h-3 bg-gray-100 dark:bg-gray-800/60 rounded w-full" />
                                <div className="h-3 bg-gray-100 dark:bg-gray-800/60 rounded w-2/3 ml-auto" />
                            </div>
                        </div>
                    ))}
                </div>

                {/* Desktop View Skeleton */}
                <div className="hidden lg:block overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
                    <div className="overflow-x-auto">
                        <div className="min-w-[1102px]">
                            <table className="w-full">
                                <thead>
                                    <tr>
                                        {Array.from({ length }).map((_, idx) => (
                                            <th key={idx} className="px-5 py-3">
                                                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-24" />
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {Array.from({ length: 5 }).map((_, rowIdx) => (
                                        <tr key={rowIdx} className="border-b border-gray-100 dark:border-white/[0.05]">
                                            {Array.from({ length }).map((_, colIdx) => (
                                                <td key={colIdx} className="px-5 py-4">
                                                    <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-full" />
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const Pagination: React.FC<{ page: number; limit: number; total: number; loaded: number; nextFunc: StaticFunc; prevFunc: StaticFunc }> = ({
    limit,
    page,
    prevFunc,
    nextFunc,
    total,
    loaded
}) => {
    const totalPages = Math.max(1, Math.ceil(total / limit));
    return (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-3 sm:px-6 sm:py-4 border-t border-gray-100 dark:border-white/[0.05]">
            <div className="text-xs text-gray-500 dark:text-gray-400">
                {total === 0 ? "No records" : `Showing ${loaded} of ${total} records`}
            </div>
            <div className="flex items-center gap-2">
                <button
                    type="button"
                    className="inline-flex items-center justify-center h-9 px-3.5 rounded-lg border border-gray-200 bg-white text-xs font-semibold text-gray-700 hover:bg-gray-50 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 transition shadow-xs"
                    disabled={page === 1}
                    onClick={prevFunc}
                >
                    Previous
                </button>
                <span className="text-xs font-medium text-gray-600 dark:text-gray-300 px-1">
                    {total === 0 ? "0 / 0" : `${page} / ${totalPages}`}
                </span>
                <button
                    type="button"
                    className="inline-flex items-center justify-center h-9 px-3.5 rounded-lg border border-gray-200 bg-white text-xs font-semibold text-gray-700 hover:bg-gray-50 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800 transition shadow-xs"
                    disabled={page >= totalPages || total === 0}
                    onClick={nextFunc}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export { Table, TableHeader, TableBody, TableRow, TableCell, TableLoader, Pagination };

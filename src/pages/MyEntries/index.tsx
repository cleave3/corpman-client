import { useState } from "react";
import { formatCurrency } from "../../utils";
import { useMyEntries } from "../../hooks/useApiHooks";
import Badge from "../../components/ui/badge/Badge";
import { TableLoader, Table, TableHeader, TableRow, TableCell, TableBody } from "../../components/ui/table";
import { formatDate } from "../../utils/date";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";

const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

const MyEntries = () => {
    const [year, setYear] = useState(new Date().getFullYear());
    const [month, setMonth] = useState(new Date().getMonth() + 1);

    const { isLoading, data } = useMyEntries(month, year);
    const pageData = data?.data ?? [];

    const isCurrentYear = year === new Date().getFullYear();
    const maxMonth = isCurrentYear ? new Date().getMonth() + 1 : 12;

    return (
        <div className="space-y-4">
            <PageBreadcrumb pageTitle="My Entries" />

            {/* Filter & Summary Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl border border-gray-200/80 bg-white dark:border-gray-800 dark:bg-gray-900 shadow-xs">
                <div>
                    <h2 className="text-base font-bold text-gray-900 dark:text-white">
                        {months[month - 1]} {year} Entries
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        You have recorded {pageData.length} entr{pageData.length === 1 ? "y" : "ies"} this period
                    </p>
                </div>

                <div className="grid grid-cols-2 sm:flex items-center gap-2">
                    <select
                        className="h-11 appearance-none rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 shadow-xs focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/15 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-200"
                        value={month}
                        onChange={(e) => setMonth(Number(e.target.value))}
                    >
                        {months.map((monthName, idx) => {
                            if (idx + 1 > maxMonth) return null;
                            return (
                                <option key={idx + 1} value={idx + 1}>
                                    {monthName}
                                </option>
                            );
                        })}
                    </select>

                    <select
                        className="h-11 appearance-none rounded-xl border border-gray-200 bg-white px-3.5 py-2 text-xs font-semibold text-gray-700 shadow-xs focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/15 dark:border-gray-800 dark:bg-gray-800 dark:text-gray-200"
                        value={year}
                        onChange={(e) => setYear(Number(e.target.value))}
                    >
                        {Array.from({ length: new Date().getFullYear() - 2023 }, (_, i) => (
                            <option key={i} value={new Date().getFullYear() - i}>
                                {new Date().getFullYear() - i}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Content Container */}
            {isLoading ? (
                <TableLoader length={6} />
            ) : (
                <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white dark:border-gray-800 dark:bg-gray-900/60 shadow-xs">
                    {/* Desktop View Table */}
                    <div className="hidden lg:block max-w-full overflow-x-auto min-h-[400px]">
                        <div className="min-w-[1000px]">
                            {pageData.length === 0 ? (
                                <div className="text-center text-gray-400 dark:text-gray-500 py-12">
                                    No entries recorded for this period.
                                </div>
                            ) : (
                                <Table>
                                    <TableHeader className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20">
                                        <TableRow>
                                            <TableCell isHeader>ID</TableCell>
                                            <TableCell isHeader>Amount</TableCell>
                                            <TableCell isHeader>Charges</TableCell>
                                            <TableCell isHeader>Type / Customer</TableCell>
                                            <TableCell isHeader>Status</TableCell>
                                            <TableCell isHeader>Description</TableCell>
                                            <TableCell isHeader>Created Date</TableCell>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                                        {pageData.map((transaction) => (
                                            <TableRow key={transaction.id}>
                                                <TableCell className="font-mono text-xs">{transaction?.id}</TableCell>
                                                <TableCell className="font-semibold tabular-nums text-gray-900 dark:text-white">
                                                    {formatCurrency(transaction?.amount)}
                                                </TableCell>
                                                <TableCell className="tabular-nums text-xs text-red-500">
                                                    {transaction?.charges ? formatCurrency(transaction?.charges) : "—"}
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col text-xs">
                                                        <span className="font-medium capitalize text-gray-900 dark:text-white">
                                                            {transaction?.transaction_type?.replace(/_/g, " ")}
                                                        </span>
                                                        {transaction?.meta_data?.customer && (
                                                            <span className="text-gray-400 truncate max-w-[150px]">
                                                                {transaction.meta_data.customer}
                                                            </span>
                                                        )}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge
                                                        variant="light"
                                                        color={
                                                            transaction?.status === "completed"
                                                                ? "success"
                                                                : transaction?.status === "pending"
                                                                ? "warning"
                                                                : "error"
                                                        }
                                                    >
                                                        {transaction?.status}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell className="text-xs text-gray-500 truncate max-w-[200px]">
                                                    {transaction?.description || "—"}
                                                </TableCell>
                                                <TableCell className="text-xs text-gray-500">
                                                    {formatDate(transaction?.created_at, "lll")}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            )}
                        </div>
                    </div>

                    {/* Mobile View: High-Density Entry Cards */}
                    <div className="block lg:hidden divide-y divide-gray-100 dark:divide-gray-800">
                        {pageData.length === 0 ? (
                            <div className="py-12 px-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                No entries recorded for this period.
                            </div>
                        ) : (
                            pageData.map((transaction) => {
                                const isPositive =
                                    transaction?.transaction_type === "customer_deposit" ||
                                    transaction?.transaction_type === "income";

                                return (
                                    <div key={transaction.id} className="p-4 space-y-2.5">
                                        <div className="flex items-center justify-between gap-3">
                                            <div>
                                                <span className={`text-base font-bold tabular-nums ${
                                                    isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-gray-900 dark:text-white"
                                                }`}>
                                                    {isPositive ? "+" : ""}{formatCurrency(transaction?.amount)}
                                                </span>
                                                {transaction?.charges ? (
                                                    <span className="block text-[11px] text-red-500 dark:text-red-400">
                                                        Fee: {formatCurrency(transaction.charges)}
                                                    </span>
                                                ) : null}
                                            </div>

                                            <Badge
                                                variant="light"
                                                color={
                                                    transaction?.status === "completed"
                                                        ? "success"
                                                        : transaction?.status === "pending"
                                                        ? "warning"
                                                        : "error"
                                                }
                                            >
                                                {transaction?.status}
                                            </Badge>
                                        </div>

                                        <div className="flex items-center justify-between text-xs text-gray-700 dark:text-gray-300">
                                            <span className="font-medium capitalize text-gray-900 dark:text-white">
                                                {transaction?.transaction_type?.replace(/_/g, " ")}
                                            </span>
                                            {transaction?.meta_data?.customer && (
                                                <span className="font-semibold text-brand-600 dark:text-brand-400 truncate max-w-[160px]">
                                                    {transaction.meta_data.customer}
                                                </span>
                                            )}
                                        </div>

                                        {transaction?.description && (
                                            <p className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/40 p-2.5 rounded-xl">
                                                {transaction.description}
                                            </p>
                                        )}

                                        <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1 border-t border-gray-100 dark:border-gray-800/60">
                                            <span>
                                                Approved by: {transaction.approvers?.[0]?.approver?.name || "Pending"}
                                            </span>
                                            <span>{formatDate(transaction?.created_at, "lll")}</span>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MyEntries;

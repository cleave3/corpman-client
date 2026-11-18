import { useState } from "react";
import { ArrowDownTrayIcon, CalendarIcon } from "@heroicons/react/24/outline";
import { useWalletHistory } from "../../hooks/useApiHooks";
import { Customer, StaticFunc } from "../../api/types";
import { Pagination } from "../../components/ui/table";
import { formatCurrency } from "../../utils";
import { formatDate } from "../../utils/date";
import { Drawer } from "../../components/Drawer/Drawer";
import Input from "../../components/form/input/InputField";
import { toast } from "react-toastify";
import ApiService from "../../api/apiService";

const WalletHistory = ({ customer, onClose }: { customer: Customer; onClose: StaticFunc }) => {
    const [filterData, setFilterData] = useState({ page: 1, limit: 15, start_date: "", end_date: "" });

    const { data, isLoading } = useWalletHistory(customer?.id, filterData);
    const pageData = data?.data?.wallet_history ?? [];
    const currentPage = data?.data?.page ?? 1;
    const pageSize = data?.data?.limit ?? 15;
    const totalData = data?.data?.total ?? 0;

    const downloadReport = async () => {
        await toast.promise(
            async () =>
                await ApiService.downloadStatement(customer.id, {
                    start_date: filterData.start_date,
                    end_date: filterData.end_date
                }),
            {
                pending: "Generating statement PDF...",
                success: "Statement downloaded successfully",
                error: "Error generating report. Try again"
            }
        );
    };

    return (
        <Drawer
            title={
                <div>
                    <h2 className="text-base sm:text-lg font-bold tracking-tight text-gray-900 dark:text-white truncate max-w-[240px] sm:max-w-none">
                        {customer?.name}
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Wallet & Transaction History</p>
                </div>
            }
            isOpen={true}
            onClose={onClose}
            position="right"
            width="w-full sm:w-[480px] lg:w-[540px]"
        >
            <div className="flex flex-col space-y-4 py-3">
                {/* Balance & Export Header Box */}
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 space-y-3">
                    <div className="flex items-center justify-between">
                        <div>
                            <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Current Balance
                            </span>
                            <div className="text-xl sm:text-2xl font-black text-gray-900 dark:text-emerald-400 tabular-nums">
                                {formatCurrency(customer?.balance)}
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={downloadReport}
                            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-white bg-brand-500 hover:bg-brand-600 active:scale-95 transition shadow-xs"
                        >
                            <ArrowDownTrayIcon className="size-4" />
                            <span>Statement</span>
                        </button>
                    </div>

                    {/* Date Filters */}
                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-200/60 dark:border-gray-700/60 text-xs">
                        <div>
                            <label className="block text-[11px] font-medium text-gray-500 dark:text-gray-400 mb-1">
                                From Date
                            </label>
                            <Input
                                type="date"
                                value={filterData.start_date}
                                onChange={(e) => setFilterData((prev) => ({ ...prev, start_date: e.target.value, page: 1 }))}
                            />
                        </div>
                        <div>
                            <label className="block text-[11px] font-medium text-gray-500 dark:text-gray-400 mb-1">
                                To Date
                            </label>
                            <Input
                                type="date"
                                value={filterData.end_date}
                                onChange={(e) => setFilterData((prev) => ({ ...prev, end_date: e.target.value, page: 1 }))}
                            />
                        </div>
                    </div>
                </div>

                {/* History List */}
                {isLoading ? (
                    <div className="space-y-3">
                        {[...Array(5)].map((_, idx) => (
                            <div key={idx} className="p-3.5 rounded-xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900/40 animate-pulse space-y-2">
                                <div className="h-4 bg-gray-200 dark:bg-gray-800 rounded w-2/3" />
                                <div className="h-3 bg-gray-100 dark:bg-gray-800/60 rounded w-1/3" />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-2.5">
                        {pageData.length === 0 ? (
                            <div className="py-12 text-center text-xs text-gray-400 dark:text-gray-500">
                                No wallet movements found for the selected period.
                            </div>
                        ) : (
                            pageData.map((history) => {
                                const isCredit = !!history?.credit;
                                const amount = isCredit ? history.credit : history?.debit;

                                return (
                                    <div
                                        key={history.id}
                                        className="p-3.5 rounded-xl border border-gray-200/70 dark:border-gray-800 bg-white dark:bg-gray-900/50 shadow-xs flex items-center justify-between gap-3"
                                    >
                                        <div className="min-w-0 flex-1">
                                            <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 truncate">
                                                {history?.description || "Ledger Entry"}
                                            </p>
                                            <div className="flex items-center gap-1 text-[11px] text-gray-400 mt-0.5">
                                                <CalendarIcon className="size-3" />
                                                <span>{formatDate(history?.created_at, "lll")}</span>
                                            </div>
                                        </div>

                                        <span
                                            className={`text-sm font-bold tabular-nums flex-shrink-0 ${
                                                isCredit
                                                    ? "text-emerald-600 dark:text-emerald-400"
                                                    : "text-red-600 dark:text-red-400"
                                            }`}
                                        >
                                            {isCredit ? "+" : "-"}{formatCurrency(amount)}
                                        </span>
                                    </div>
                                );
                            })
                        )}
                    </div>
                )}

                {/* Pagination */}
                <Pagination
                    loaded={pageData.length}
                    total={totalData}
                    page={currentPage}
                    limit={pageSize}
                    nextFunc={() => setFilterData((prev) => ({ ...prev, page: prev.page + 1 }))}
                    prevFunc={() => setFilterData((prev) => ({ ...prev, page: prev.page - 1 }))}
                />
            </div>
        </Drawer>
    );
};

export default WalletHistory;

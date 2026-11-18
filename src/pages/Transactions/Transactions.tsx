import { useState, useEffect } from "react";
import { DocumentPlusIcon, FunnelIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { TableLoader, Table, TableHeader, TableRow, TableCell, TableBody, Pagination } from "../../components/ui/table";
import { useGetUsers, useTransactions } from "../../hooks/useApiHooks";
import { formatCurrency, PERMISSION_VALUES, ROUTES } from "../../utils";
import { formatDate } from "../../utils/date";
import Badge from "../../components/ui/badge/Badge";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../../components/ui/modal";
import { Transaction } from "../../api/types";
import TransactionDetail from "./TransactionDetail";
import Input from "../../components/form/input/InputField";
import { useNavigate, useSearchParams } from "react-router";
import SearchableSelect from "../../components/form/SearchableSelect";
import AccessWrapper from "../../components/AccessController";
import useWidth from "../../hooks/useWidth";
import Button from "../../components/button/Button";

const Transactions = () => {
    const [showFilters, setShowFilters] = useState(false);
    const [params] = useSearchParams();
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction>(null);
    const [filterData, setFilterData] = useState({
        page: 1,
        limit: 15,
        start_date: "",
        status: "",
        end_date: "",
        user_id: ""
    });

    const { closeModal, isOpen, openModal } = useModal();
    const { notDesktop } = useWidth();
    const { data, isLoading } = useTransactions(filterData);
    const { data: userData } = useGetUsers();
    const navigate = useNavigate();

    const pageData = data?.data?.transactions ?? [];
    const currentPage = data?.data?.page ?? 1;
    const pageSize = data?.data?.limit ?? 15;
    const totalData = data?.data?.total ?? 0;

    useEffect(() => {
        const status = params.get("status");
        if (status) {
            setFilterData((prev) => ({ ...prev, status }));
        }
    }, [params]);

    const users = [{ value: "", label: "All Initiators" }].concat(
        userData?.data?.map?.((u) => ({ value: u.uid, label: `${u.first_name} ${u.last_name}` })) ?? []
    );

    const handleResetFilters = () => {
        setFilterData({
            page: 1,
            limit: 15,
            start_date: "",
            status: "",
            end_date: "",
            user_id: ""
        });
        setShowFilters(false);
    };

    return (
        <div className="space-y-4">
            <PageBreadcrumb pageTitle="Transactions" />

            {/* Top Bar Controls */}
            <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between gap-3">
                    <AccessWrapper componentPermissions={[PERMISSION_VALUES.transaction.initiate_transaction]}>
                        <button
                            type="button"
                            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500 text-white font-medium text-sm hover:bg-brand-600 active:scale-[0.98] transition shadow-xs"
                            onClick={() => navigate(ROUTES.NEW_TRANSACTIONS)}
                        >
                            <DocumentPlusIcon className="size-4" />
                            <span>New Transaction</span>
                        </button>
                    </AccessWrapper>

                    <button
                        type="button"
                        className={`flex size-11 sm:size-10 flex-shrink-0 items-center justify-center rounded-xl border transition ${
                            showFilters || filterData.status || filterData.user_id || filterData.start_date
                                ? "bg-brand-50 border-brand-300 text-brand-600 dark:bg-brand-500/20 dark:border-brand-500/30 dark:text-brand-400"
                                : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:bg-gray-900 dark:border-gray-800 dark:text-gray-300"
                        }`}
                        onClick={() => setShowFilters((prev) => !prev)}
                        aria-label="Toggle Filters"
                    >
                        <FunnelIcon className="size-5" />
                    </button>
                </div>

                {/* Collapsible Filter Panel */}
                {showFilters && (
                    <div className="p-4 rounded-2xl border border-gray-200/80 bg-white dark:bg-gray-900/80 dark:border-gray-800 shadow-xs space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                                    Initiator
                                </label>
                                <SearchableSelect
                                    value={filterData.user_id}
                                    options={users}
                                    placeholder="All Initiators"
                                    onChange={(value) => setFilterData((prev) => ({ ...prev, user_id: value, page: 1 }))}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                                    Status
                                </label>
                                <SearchableSelect
                                    value={filterData?.status}
                                    options={[
                                        { value: "", label: "All Statuses" },
                                        { value: "completed", label: "Completed" },
                                        { value: "pending", label: "Pending" },
                                        { value: "cancelled", label: "Cancelled" }
                                    ]}
                                    placeholder="All Statuses"
                                    onChange={(value) => setFilterData((prev) => ({ ...prev, status: value, page: 1 }))}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                                    Start Date
                                </label>
                                <Input
                                    type="date"
                                    value={filterData?.start_date}
                                    onChange={(e) => setFilterData((prev) => ({ ...prev, start_date: e.target.value, page: 1 }))}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                                    End Date
                                </label>
                                <Input
                                    type="date"
                                    value={filterData?.end_date}
                                    onChange={(e) => setFilterData((prev) => ({ ...prev, end_date: e.target.value, page: 1 }))}
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                            <Button variant="ghost" className="text-xs" onClick={handleResetFilters}>
                                <ArrowPathIcon className="size-4 mr-1 inline" />
                                Reset
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Transactions Content */}
            {isLoading ? (
                <TableLoader length={filterData.limit} />
            ) : (
                <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white dark:border-gray-800 dark:bg-gray-900/60 shadow-xs">
                    {/* Desktop View Table */}
                    <div className="hidden lg:block max-w-full overflow-x-auto min-h-[400px]">
                        <div className="min-w-[1000px]">
                            <Table>
                                <TableHeader className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20">
                                    <TableRow>
                                        <TableCell isHeader>ID</TableCell>
                                        <TableCell isHeader>Amount</TableCell>
                                        <TableCell isHeader>Charges</TableCell>
                                        <TableCell isHeader>Type / Customer</TableCell>
                                        <TableCell isHeader>Status</TableCell>
                                        <TableCell isHeader>Description</TableCell>
                                        <TableCell isHeader>Initiator</TableCell>
                                        <TableCell isHeader>Created Date</TableCell>
                                    </TableRow>
                                </TableHeader>
                                <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {pageData.length === 0 ? (
                                        <TableRow>
                                            <TableCell className="text-center py-10 text-gray-400" isHeader={false}>
                                                No transactions found matching your criteria.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        pageData.map((transaction) => (
                                            <TableRow
                                                key={transaction.id}
                                                onClick={() => {
                                                    setSelectedTransaction(transaction);
                                                    openModal();
                                                }}
                                            >
                                                <TableCell className="font-mono text-xs">{transaction?.id}</TableCell>
                                                <TableCell className="font-semibold tabular-nums text-gray-900 dark:text-emerald-400">
                                                    {formatCurrency(transaction?.amount)}
                                                </TableCell>
                                                <TableCell className="tabular-nums text-xs text-red-600 dark:text-red-400">
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
                                                <TableCell className="text-xs text-gray-700 dark:text-gray-300">
                                                    {transaction?.initiator?.name || "—"}
                                                </TableCell>
                                                <TableCell className="text-xs text-gray-500">
                                                    {formatDate(transaction?.created_at, "lll")}
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                    {/* Mobile View: Clean Modern Activity Cards */}
                    <div className="block lg:hidden divide-y divide-gray-100 dark:divide-gray-800">
                        {pageData.length === 0 ? (
                            <div className="py-12 px-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                No transactions found matching your criteria.
                            </div>
                        ) : (
                            pageData.map((transaction) => {
                                const isPositive = transaction?.transaction_type === "customer_deposit" || transaction?.transaction_type === "income";

                                return (
                                    <div
                                        key={transaction.id}
                                        onClick={() => {
                                            setSelectedTransaction(transaction);
                                            openModal();
                                        }}
                                        className="p-4 space-y-2.5 transition-colors active:bg-gray-50/60 dark:active:bg-gray-800/40 cursor-pointer"
                                    >
                                        {/* Row 1: Amount & Status */}
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="flex flex-col">
                                                <span className={`text-base font-bold tabular-nums ${
                                                    isPositive ? "text-emerald-600 dark:text-emerald-400" : "text-gray-900 dark:text-white"
                                                }`}>
                                                    {isPositive ? "+" : ""}{formatCurrency(transaction?.amount)}
                                                </span>
                                                {transaction?.charges ? (
                                                    <span className="text-[11px] text-red-500 dark:text-red-400">
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

                                        {/* Row 2: Customer / Type */}
                                        <div className="flex items-center justify-between text-xs text-gray-700 dark:text-gray-300">
                                            <span className="font-medium capitalize text-gray-900 dark:text-white">
                                                {transaction?.transaction_type?.replace(/_/g, " ")}
                                            </span>
                                            {transaction?.meta_data?.customer && (
                                                <span className="font-semibold text-gray-800 dark:text-gray-200 truncate max-w-[160px]">
                                                    {transaction.meta_data.customer}
                                                </span>
                                            )}
                                        </div>

                                        {/* Row 3: Description Excerpt if any */}
                                        {transaction?.description && (
                                            <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">
                                                {transaction.description}
                                            </p>
                                        )}

                                        {/* Row 4: Initiator & Timestamp */}
                                        <div className="flex items-center justify-between text-[11px] text-gray-400 pt-1 border-t border-gray-100 dark:border-gray-800/60">
                                            <span>By: {transaction?.initiator?.name || "System"}</span>
                                            <span>{formatDate(transaction?.created_at, "lll")}</span>
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </div>

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
            )}

            {/* Transaction Detail Modal */}
            <Modal
                isOpen={isOpen}
                isFullscreen={notDesktop}
                onClose={() => {
                    setSelectedTransaction(null);
                    closeModal();
                }}
                className="max-w-[700px] m-0 sm:m-2"
            >
                {selectedTransaction && <TransactionDetail selectedTransaction={selectedTransaction} />}
            </Modal>
        </div>
    );
};

export default Transactions;

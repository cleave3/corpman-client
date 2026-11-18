import { useState } from "react";
import { CheckIcon, XMarkIcon, EyeIcon } from "@heroicons/react/24/outline";
import { Transaction } from "../../api/types";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { Modal } from "../../components/ui/modal";
import { TableLoader, Table, TableHeader, TableRow, TableCell, TableBody } from "../../components/ui/table";
import { useApproveTransaction, useDeclineTransaction, useGetUsers, usePendingTransactions } from "../../hooks/useApiHooks";
import { useModal } from "../../hooks/useModal";
import { formatCurrency, PERMISSION_VALUES } from "../../utils";
import { formatDate } from "../../utils/date";
import TransactionDetail from "./TransactionDetail";
import ConfirmationModal from "../../components/confirm";
import { Dropdown } from "../../components/ui/dropdown/Dropdown";
import { DropdownItem } from "../../components/ui/dropdown/DropdownItem";
import { MoreDotIcon } from "../../icons";
import AccessWrapper from "../../components/AccessController";
import useWidth from "../../hooks/useWidth";
import SearchableSelect from "../../components/form/SearchableSelect";

const PendingTransactions = () => {
    const [userId, setUserId] = useState("");
    const [openDropDown, setOpenDropDown] = useState(false);
    const [index, setIndex] = useState(0);

    function toggleDropdown() {
        setOpenDropDown((prev) => !prev);
    }

    function closeDropdown() {
        setOpenDropDown(false);
        setIndex(0);
    }

    const [actionParams, setActionParams] = useState<{ id?: string; action?: "approve" | "decline" }>({});
    const [selectedTransaction, setSelectedTransaction] = useState<Transaction>(null);

    const { closeModal, isOpen, openModal } = useModal();
    const { data: userData } = useGetUsers();
    const { data, isLoading } = usePendingTransactions(userId);
    const { mutate: aMutate } = useApproveTransaction();
    const { mutate: dMutate } = useDeclineTransaction();
    const { notDesktop } = useWidth();

    const handleProcessAction = () => {
        if (actionParams.action === "approve") {
            aMutate(actionParams.id);
            setActionParams({});
        } else {
            dMutate(actionParams.id);
            setActionParams({});
        }
    };

    const pageData = data?.data?.transactions ?? [];

    const users = [{ value: "", label: "All Initiators" }].concat(
        userData?.data?.map?.((u) => ({ value: u.uid, label: `${u.first_name} ${u.last_name}` })) ?? []
    );

    return (
        <div className="space-y-4">
            <PageBreadcrumb pageTitle="Pending Approvals" />

            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="w-full sm:w-64">
                    <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                        Filter by Initiator
                    </label>
                    <SearchableSelect
                        value={userId}
                        options={users}
                        placeholder="All Initiators"
                        onChange={(value) => setUserId(value)}
                    />
                </div>

                <div className="text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-3 py-2 rounded-xl self-start sm:self-auto">
                    {pageData.length} pending review{pageData.length === 1 ? "" : "s"}
                </div>
            </div>

            {/* Content Container */}
            <div className="overflow-hidden rounded-2xl border border-gray-200/80 bg-white dark:border-gray-800 dark:bg-gray-900/60 shadow-xs">
                {isLoading ? (
                    <TableLoader length={8} />
                ) : (
                    <>
                        {/* Desktop Table View */}
                        <div className="hidden lg:block max-w-full overflow-x-auto min-h-[400px]">
                            {pageData.length === 0 ? (
                                <div className="text-center text-gray-400 dark:text-gray-500 py-12">
                                    No pending transactions requiring approval.
                                </div>
                            ) : (
                                <div className="min-w-[1000px]">
                                    <Table>
                                        <TableHeader className="border-b border-gray-100 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-800/20">
                                            <TableRow>
                                                <TableCell isHeader>ID</TableCell>
                                                <TableCell isHeader>Amount</TableCell>
                                                <TableCell isHeader>Charges</TableCell>
                                                <TableCell isHeader>Type / Customer</TableCell>
                                                <TableCell isHeader>Description</TableCell>
                                                <TableCell isHeader>Initiator</TableCell>
                                                <TableCell isHeader>Created Date</TableCell>
                                                <TableCell isHeader>Actions</TableCell>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                                            {pageData.map((transaction, i) => (
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
                                                    <TableCell className="text-xs text-gray-500 truncate max-w-[200px]">
                                                        {transaction?.description || "—"}
                                                    </TableCell>
                                                    <TableCell className="text-xs text-gray-700 dark:text-gray-300">
                                                        {transaction?.initiator?.name || "—"}
                                                    </TableCell>
                                                    <TableCell className="text-xs text-gray-500">
                                                        {formatDate(transaction?.created_at, "lll")}
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className="relative">
                                                            <button
                                                                type="button"
                                                                className="p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                                                                onClick={() => {
                                                                    setIndex(i + 1);
                                                                    toggleDropdown();
                                                                }}
                                                            >
                                                                <MoreDotIcon className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 size-5" />
                                                            </button>

                                                            <Dropdown
                                                                isOpen={openDropDown && index === i + 1}
                                                                onClose={closeDropdown}
                                                                className="w-36 p-1.5"
                                                            >
                                                                <DropdownItem
                                                                    onItemClick={() => {
                                                                        setSelectedTransaction(transaction);
                                                                        openModal();
                                                                        closeDropdown();
                                                                    }}
                                                                    className="flex w-full text-xs font-medium text-gray-600 rounded-lg hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                                                                >
                                                                    View Details
                                                                </DropdownItem>

                                                                <AccessWrapper
                                                                    componentPermissions={[PERMISSION_VALUES.transaction.approve_transaction]}
                                                                >
                                                                    <>
                                                                        <DropdownItem
                                                                            onItemClick={() => {
                                                                                setActionParams({ action: "approve", id: transaction?.id });
                                                                                closeDropdown();
                                                                            }}
                                                                            className="flex w-full text-xs font-semibold text-emerald-600 rounded-lg hover:bg-emerald-50 dark:hover:bg-emerald-950/30"
                                                                        >
                                                                            Approve
                                                                        </DropdownItem>

                                                                        <DropdownItem
                                                                            onItemClick={() => {
                                                                                setActionParams({ action: "decline", id: transaction?.id });
                                                                                closeDropdown();
                                                                            }}
                                                                            className="flex w-full text-xs font-semibold text-red-600 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30"
                                                                        >
                                                                            Decline
                                                                        </DropdownItem>
                                                                    </>
                                                                </AccessWrapper>
                                                            </Dropdown>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </div>

                        {/* Mobile Cards View: Touch-Safe & Clean */}
                        <div className="block lg:hidden divide-y divide-gray-100 dark:divide-gray-800">
                            {pageData.length === 0 ? (
                                <div className="py-12 px-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                    No pending transactions requiring approval.
                                </div>
                            ) : (
                                pageData.map((transaction) => (
                                    <div key={transaction.id} className="p-4 space-y-3">
                                        {/* Row 1: Amount, Charges & Type */}
                                        <div className="flex items-start justify-between gap-3">
                                            <div>
                                                <span className="text-lg font-bold tabular-nums text-gray-900 dark:text-white">
                                                    {formatCurrency(transaction?.amount)}
                                                </span>
                                                {transaction?.charges ? (
                                                    <span className="block text-xs font-semibold text-red-500 dark:text-red-400 mt-0.5">
                                                        Charges: {formatCurrency(transaction.charges)}
                                                    </span>
                                                ) : null}
                                                <div className="text-xs font-medium capitalize text-gray-600 dark:text-gray-300 mt-0.5">
                                                    {transaction?.transaction_type?.replace(/_/g, " ")}
                                                    {transaction?.meta_data?.customer && (
                                                        <span className="font-semibold text-brand-600 dark:text-brand-400 ml-1">
                                                            ({transaction.meta_data.customer})
                                                        </span>
                                                    )}
                                                </div>
                                            </div>

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setSelectedTransaction(transaction);
                                                    openModal();
                                                }}
                                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700 transition"
                                            >
                                                <EyeIcon className="size-3.5" />
                                                <span>Details</span>
                                            </button>
                                        </div>

                                        {/* Description */}
                                        {transaction?.description && (
                                            <p className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-800/40 p-2.5 rounded-xl">
                                                {transaction.description}
                                            </p>
                                        )}

                                        {/* Metadata */}
                                        <div className="flex items-center justify-between text-xs text-gray-400">
                                            <span>Initiated by: {transaction?.initiator?.name || "System"}</span>
                                            <span>{formatDate(transaction?.created_at, "lll")}</span>
                                        </div>

                                        {/* Mobile Action Buttons: Large, Thumb-Friendly & Separated */}
                                        <AccessWrapper componentPermissions={[PERMISSION_VALUES.transaction.approve_transaction]}>
                                            <div className="grid grid-cols-2 gap-2.5 pt-2 border-t border-gray-100 dark:border-gray-800/60">
                                                <button
                                                    type="button"
                                                    onClick={() => setActionParams({ action: "decline", id: transaction?.id })}
                                                    className="flex items-center justify-center gap-1.5 h-11 rounded-xl border border-red-200 text-red-600 bg-red-50/50 hover:bg-red-100 active:scale-95 text-xs font-semibold dark:border-red-900/50 dark:bg-red-950/20 dark:text-red-400 transition"
                                                >
                                                    <XMarkIcon className="size-4 stroke-2" />
                                                    <span>Decline</span>
                                                </button>

                                                <button
                                                    type="button"
                                                    onClick={() => setActionParams({ action: "approve", id: transaction?.id })}
                                                    className="flex items-center justify-center gap-1.5 h-11 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 active:scale-95 text-xs font-semibold shadow-xs transition"
                                                >
                                                    <CheckIcon className="size-4 stroke-2" />
                                                    <span>Approve</span>
                                                </button>
                                            </div>
                                        </AccessWrapper>
                                    </div>
                                ))
                            )}
                        </div>
                    </>
                )}
            </div>

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

            {/* Action Confirmation Modal */}
            <ConfirmationModal
                title={`Are you sure you want to ${actionParams?.action} this transaction?`}
                isOpen={!!actionParams?.id}
                onCancel={() => setActionParams({})}
                onConfirm={handleProcessAction}
            />
        </div>
    );
};

export default PendingTransactions;

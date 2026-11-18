import React from "react";
import { Transaction } from "../../api/types";
import Badge from "../../components/ui/badge/Badge";
import { formatCurrency } from "../../utils";
import { formatDate } from "../../utils/date";

interface ReceiptItemProps {
    label: string;
    value: React.ReactNode;
}

const ReceiptItem: React.FC<ReceiptItemProps> = ({ label, value }) => {
    return (
        <div className="space-y-0.5">
            <span className="block text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                {label}
            </span>
            <span className="block text-sm font-semibold text-gray-800 dark:text-gray-200 break-words">
                {value ?? "—"}
            </span>
        </div>
    );
};

interface TransactionDetailProps {
    selectedTransaction: Transaction;
}

const TransactionDetail: React.FC<TransactionDetailProps> = ({ selectedTransaction }) => {
    return (
        <div className="flex flex-col space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 pb-4 border-b border-gray-100 dark:border-gray-800 pr-8">
                <div>
                    <h2 className="text-base sm:text-lg font-bold tracking-tight text-gray-900 dark:text-white">
                        Transaction Receipt
                    </h2>
                    <p className="font-mono text-xs text-gray-400 mt-0.5">
                        Ref: {selectedTransaction.id}
                    </p>
                </div>

                <Badge
                    variant="light"
                    color={
                        selectedTransaction.status === "completed"
                            ? "success"
                            : selectedTransaction.status === "pending"
                            ? "warning"
                            : "error"
                    }
                >
                    {selectedTransaction.status}
                </Badge>
            </div>

            {/* Prominent Amount Box */}
            <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800/50 flex flex-col items-center justify-center text-center">
                <span className="text-xs font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
                    Total Amount
                </span>
                <span className="text-2xl sm:text-3xl font-black tabular-nums text-gray-900 dark:text-white">
                    {formatCurrency(selectedTransaction.amount)}
                </span>
                {selectedTransaction.charges ? (
                    <span className="text-xs text-red-500 dark:text-red-400 mt-1 font-medium">
                        Service Fee: {formatCurrency(selectedTransaction.charges)}
                    </span>
                ) : null}
            </div>

            {/* Receipt Details Grid */}
            <div className="p-4 rounded-2xl border border-dashed border-gray-200 dark:border-gray-800 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <ReceiptItem
                        label="Transaction Type"
                        value={
                            <span className="capitalize">
                                {selectedTransaction.transaction_type?.replace(/_/g, " ")}
                            </span>
                        }
                    />

                    {selectedTransaction.charges ? (
                        <ReceiptItem
                            label="Processing Fee / Charges"
                            value={
                                <span className="text-red-600 dark:text-red-400 tabular-nums font-bold">
                                    {formatCurrency(selectedTransaction.charges)}
                                </span>
                            }
                        />
                    ) : null}

                    {selectedTransaction.meta_data?.customer && (
                        <ReceiptItem
                            label="Customer"
                            value={selectedTransaction.meta_data.customer}
                        />
                    )}

                    <ReceiptItem
                        label="Initiator"
                        value={selectedTransaction.initiator?.name || "System"}
                    />

                    <ReceiptItem
                        label="Approver"
                        value={selectedTransaction?.approvers?.[0]?.approver?.name || "None / Not required"}
                    />

                    <ReceiptItem
                        label="Created At"
                        value={formatDate(selectedTransaction.created_at, "lll")}
                    />

                    <ReceiptItem
                        label="Updated At"
                        value={formatDate(selectedTransaction.updated_at, "lll")}
                    />

                    {selectedTransaction.meta_data?.customer_id && (
                        <ReceiptItem
                            label="Customer ID"
                            value={<span className="font-mono text-xs">{selectedTransaction.meta_data.customer_id}</span>}
                        />
                    )}
                </div>

                {selectedTransaction.description && (
                    <div className="pt-3 border-t border-dashed border-gray-200 dark:border-gray-800">
                        <span className="block text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
                            Description / Memo
                        </span>
                        <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed bg-white/60 dark:bg-gray-900/60 p-3 rounded-xl border border-gray-100 dark:border-gray-800">
                            {selectedTransaction.description}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TransactionDetail;

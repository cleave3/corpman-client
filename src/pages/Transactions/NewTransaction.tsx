import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { useState } from "react";
import { useCreateTransaction, useGetAllCustomers } from "../../hooks/useApiHooks";
import { CreateTransactionRequest } from "../../api/types";
import CurrencyInput from "../../components/form/input/CurrencyInput";
import Label from "../../components/form/Label";
import Button from "../../components/ui/button/Button";
import TextArea from "../../components/form/input/TextArea";
import SearchableSelect from "../../components/form/SearchableSelect";
import { toast } from "react-toastify";
import Input from "../../components/form/input/InputField";
import { useModal } from "../../hooks/useModal";
import ConfirmationModal from "../../components/confirm";

const TRANSACTION_TYPES = [
    { label: "Customer Deposit", value: "customer_deposit" },
    { label: "Payout", value: "payout" },
    { label: "Income", value: "income" }
];

const NewTransaction = () => {
    const [transaction, setTransaction] = useState<CreateTransactionRequest>({
        amount: 0,
        charges: 0,
        transaction_type: "customer_deposit",
        description: "",
        meta_data: {}
    });

    const { isOpen, openModal, closeModal } = useModal();
    const { mutate, isPending } = useCreateTransaction();
    const { data } = useGetAllCustomers();

    const handleTransactionChange = (field: string, value: string | number) => {
        setTransaction((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    const handleTypeSelect = (typeValue: string) => {
        if (typeValue === "income") {
            setTransaction((prev) => ({
                ...prev,
                transaction_type: typeValue,
                meta_data: {}
            }));
        } else {
            setTransaction((prev) => ({
                ...prev,
                transaction_type: typeValue
            }));
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (transaction.amount <= 0) {
            toast.warning("Please enter a valid amount");
            return;
        }

        if (transaction.transaction_type !== "income" && !transaction?.meta_data?.customer_id) {
            toast.warning("Please select a customer");
            return;
        }

        openModal();
    };

    const handleConfirmAction = () => {
        if (transaction.transaction_type !== "income") {
            const customer = data?.data?.find?.((c) => c.id === transaction?.meta_data?.customer_id);
            transaction.meta_data.customer = customer?.name || "";
        }

        const payload = { ...transaction };
        if (transaction.transaction_type !== "payout") payload.charges = null;

        closeModal();

        mutate(payload, {
            onSuccess: async (res) => {
                toast.success(res.message);
                setTransaction({
                    amount: 0,
                    transaction_type: "customer_deposit",
                    charges: 0,
                    description: "",
                    meta_data: {}
                });
            },
            onError: (error) => {
                toast.error(error.message);
            }
        });
    };

    return (
        <div className="space-y-4 max-w-3xl mx-auto">
            <PageBreadcrumb pageTitle="Add Transaction" />

            <div className="rounded-2xl border border-gray-200/80 bg-white p-5 sm:p-7 dark:border-gray-800 dark:bg-gray-900 shadow-xs">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Step 1: Transaction Type Segmented Pills */}
                    <div>
                        <Label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-2">
                            Transaction Type <span className="text-red-500">*</span>
                        </Label>
                        <div className="grid grid-cols-3 gap-2 p-1 rounded-xl bg-gray-100 dark:bg-gray-800/60 border border-gray-200/60 dark:border-gray-800">
                            {TRANSACTION_TYPES.map((t) => {
                                const isSelected = transaction.transaction_type === t.value;
                                return (
                                    <button
                                        type="button"
                                        key={t.value}
                                        onClick={() => handleTypeSelect(t.value)}
                                        className={`flex items-center justify-center h-11 px-2 rounded-lg text-xs font-semibold transition active:scale-[0.98] ${
                                            isSelected
                                                ? "bg-white text-gray-900 shadow-xs dark:bg-gray-700 dark:text-white"
                                                : "text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
                                        }`}
                                    >
                                        <span className="truncate">{t.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Step 2: Amount & Charges */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className={transaction.transaction_type === "payout" ? "col-span-1" : "col-span-1 sm:col-span-2"}>
                            <Label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                                Transaction Amount <span className="text-red-500">*</span>
                            </Label>
                            <CurrencyInput
                                required
                                value={transaction.amount}
                                onChange={(val) => handleTransactionChange("amount", val)}
                                placeholder="₦0.00"
                            />
                        </div>

                        {transaction.transaction_type === "payout" && (
                            <div className="col-span-1">
                                <Label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                                    Processing Charges <span className="text-red-500">*</span>
                                </Label>
                                <CurrencyInput
                                    required
                                    min={1}
                                    value={transaction.charges || 0}
                                    onChange={(val) => handleTransactionChange("charges", val)}
                                    placeholder="₦0.00"
                                />
                            </div>
                        )}
                    </div>

                    {/* Step 3: Customer & Payment Details (Non-Income) */}
                    {transaction.transaction_type !== "income" && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-100 dark:border-gray-800/60">
                            <div className="col-span-1">
                                <Label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                                    Select Customer <span className="text-red-500">*</span>
                                </Label>
                                <SearchableSelect
                                    placeholder="Search by name or code..."
                                    value={transaction?.meta_data?.customer_id || ""}
                                    options={(data?.data || []).map((c) => ({
                                        value: c.id,
                                        label: `${c.name} [${c.customer_code}] ${c.phone ? `(${c.phone})` : ""}`
                                    }))}
                                    onChange={(value) =>
                                        setTransaction((prev) => ({
                                            ...prev,
                                            meta_data: {
                                                ...prev.meta_data,
                                                customer_id: value
                                            }
                                        }))
                                    }
                                />
                            </div>

                            <div className="col-span-1">
                                <Label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                                    Next Payment Date <span className="text-red-500">*</span>
                                </Label>
                                <Input
                                    type="date"
                                    value={transaction?.meta_data?.next_payment_date || ""}
                                    onChange={(e) =>
                                        setTransaction((prev) => ({
                                            ...prev,
                                            meta_data: {
                                                ...prev.meta_data,
                                                next_payment_date: e.target.value
                                            }
                                        }))
                                    }
                                    required
                                />
                            </div>
                        </div>
                    )}

                    {/* Step 4: Description */}
                    <div>
                        <Label className="block text-xs font-semibold uppercase tracking-wider text-gray-700 dark:text-gray-300 mb-1.5">
                            Description / Purpose <span className="text-red-500">*</span>
                        </Label>
                        <TextArea
                            value={transaction.description}
                            onChange={(val) => handleTransactionChange("description", val)}
                            placeholder="Enter a brief note or narration for this transaction..."
                            rows={3}
                            required
                        />
                    </div>

                    {/* Submit Button */}
                    <div className="pt-3">
                        <Button
                            disabled={isPending}
                            type="submit"
                            className="w-full h-12 text-sm font-semibold tracking-wide rounded-xl active:scale-[0.99] transition-transform shadow-xs"
                            size="md"
                        >
                            {isPending ? "Submitting..." : "Submit Transaction"}
                        </Button>
                    </div>
                </form>
            </div>

            <ConfirmationModal
                title="Please confirm this transaction submission"
                isOpen={isOpen}
                onCancel={closeModal}
                onConfirm={handleConfirmAction}
            />
        </div>
    );
};

export default NewTransaction;

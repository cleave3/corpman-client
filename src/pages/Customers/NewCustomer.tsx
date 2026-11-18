import { useState, useEffect } from "react";
import { useCreateCustomer, useUpdateCustomer } from "../../hooks/useApiHooks";
import { toast } from "react-toastify";
import CurrencyInput from "../../components/form/input/CurrencyInput";
import Label from "../../components/form/Label";
import SearchableSelect from "../../components/form/SearchableSelect";
import { currentDate } from "../../utils/date";
import Input from "../../components/form/input/InputField";
import { useQueryClient } from "@tanstack/react-query";
import { Customer, StaticFunc, UpdateCustomerRequest } from "../../api/types";
import Button from "../../components/button/Button";

const NewCustomer = ({ closeModal, customerToEdit }: { closeModal: StaticFunc; customerToEdit: Customer }) => {
    const [customer, setCustomer] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        sms_alert: "YES",
        customer_type: "regular",
        customer_code: "",
        payment_frequency: "weekly",
        next_payment_date: currentDate(),
        opening_balance: 0
    });

    const { mutate: cm, isPending: cP } = useCreateCustomer();
    const { mutate: um, isPending: uP } = useUpdateCustomer();

    useEffect(() => {
        if (customerToEdit) {
            setCustomer({
                name: customerToEdit.name || "",
                email: customerToEdit.email || "",
                phone: customerToEdit.phone || "",
                address: customerToEdit.address || "",
                payment_frequency: customerToEdit.payment_frequency || "weekly",
                next_payment_date: customerToEdit.next_payment_date?.substring(0, 10) || currentDate(),
                opening_balance: 0,
                customer_code: customerToEdit?.customer_code || "",
                customer_type: customerToEdit?.customer_type || "regular",
                sms_alert: customerToEdit?.sms_alert || "YES"
            });
        }
    }, [customerToEdit]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setCustomer((prev) => ({
            ...prev,
            [name]: name === "customer_code" ? value?.toUpperCase() : value
        }));
    };

    const queryClient = useQueryClient();

    const resetForm = () => {
        setCustomer({
            name: "",
            email: "",
            phone: "",
            address: "",
            payment_frequency: "",
            next_payment_date: "",
            opening_balance: 0,
            customer_code: "",
            customer_type: "regular",
            sms_alert: "YES"
        });
        closeModal();
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (customerToEdit) {
            const editCustomerData: UpdateCustomerRequest = {
                name: customer.name,
                email: customer.email,
                phone: customer.phone,
                address: customer.address,
                payment_frequency: customer.payment_frequency,
                customer_code: customer.customer_code,
                customer_type: customer.customer_type,
                next_payment_date: customer.next_payment_date,
                sms_alert: customer.sms_alert
            };
            um(
                { customerId: customerToEdit.id, data: editCustomerData },
                {
                    onSuccess: async (data) => {
                        queryClient.invalidateQueries({ queryKey: ["customers"] });
                        toast.success(data.message);
                        resetForm();
                    },
                    onError: (error) => {
                        toast.error(error.message);
                    }
                }
            );
        } else {
            cm(customer, {
                onSuccess: async (data) => {
                    queryClient.invalidateQueries({ queryKey: ["customers"] });
                    toast.success(data.message);
                    resetForm();
                },
                onError: (error) => {
                    toast.error(error.message);
                }
            });
        }
    };

    const isPending = uP || cP;

    return (
        <div className="flex flex-col min-h-full">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800">
                <div>
                    <h2 className="text-lg sm:text-xl font-bold tracking-tight text-gray-900 dark:text-white">
                        {customerToEdit ? "Edit Customer" : "New Customer"}
                    </h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                        {customerToEdit ? "Update customer profile details" : "Register a new client in the system"}
                    </p>
                </div>
            </div>

            {/* Form Body */}
            <form onSubmit={handleSubmit} className="flex flex-col flex-1 mt-4">
                <div className="space-y-4 flex-1">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div className="col-span-1">
                            <Label className="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">
                                Customer Name <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                type="text"
                                name="name"
                                value={customer.name}
                                onChange={handleChange}
                                required
                                placeholder="e.g. John Doe"
                            />
                        </div>

                        <div className="col-span-1">
                            <Label className="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">
                                Customer Code <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                type="text"
                                name="customer_code"
                                value={customer.customer_code}
                                onChange={handleChange}
                                maxLength={20}
                                required
                                placeholder="e.g. CM-001"
                            />
                        </div>

                        <div className="col-span-1">
                            <Label className="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">
                                Customer Type
                            </Label>
                            <SearchableSelect
                                placeholder="Select type"
                                value={customer.customer_type}
                                onChange={(value) => setCustomer((prev) => ({ ...prev, customer_type: value }))}
                                options={[
                                    { label: "Regular", value: "regular" },
                                    { label: "Premium", value: "premium" }
                                ]}
                            />
                        </div>

                        <div className="col-span-1">
                            <Label className="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">
                                SMS Alert Notifications
                            </Label>
                            <SearchableSelect
                                placeholder="Select SMS Alert"
                                value={customer.sms_alert}
                                onChange={(value) => setCustomer((prev) => ({ ...prev, sms_alert: value }))}
                                options={[
                                    { label: "YES", value: "YES" },
                                    { label: "NO", value: "NO" }
                                ]}
                            />
                        </div>

                        <div className="col-span-1">
                            <Label className="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">
                                Phone Number <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                type="tel"
                                name="phone"
                                value={customer.phone}
                                onChange={handleChange}
                                required
                                placeholder="08012345678"
                            />
                        </div>

                        <div className="col-span-1">
                            <Label className="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">
                                Email Address
                            </Label>
                            <Input
                                type="email"
                                name="email"
                                value={customer.email}
                                onChange={handleChange}
                                placeholder="customer@example.com"
                            />
                        </div>

                        <div className="col-span-1">
                            <Label className="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">
                                Payment Frequency
                            </Label>
                            <SearchableSelect
                                placeholder="Select frequency"
                                value={customer.payment_frequency}
                                onChange={(value) => setCustomer((prev) => ({ ...prev, payment_frequency: value }))}
                                options={[
                                    { label: "Daily", value: "daily" },
                                    { label: "Weekly", value: "weekly" },
                                    { label: "Biweekly", value: "biweekly" },
                                    { label: "Monthly", value: "monthly" },
                                    { label: "Yearly", value: "yearly" }
                                ]}
                            />
                        </div>

                        <div className="col-span-1">
                            <Label className="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">
                                Next Payment Date <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                type="date"
                                name="next_payment_date"
                                value={customer.next_payment_date}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {!customerToEdit && (
                            <div className="col-span-1 sm:col-span-2">
                                <Label className="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">
                                    Opening Balance <span className="text-red-500">*</span>
                                </Label>
                                <CurrencyInput
                                    required
                                    name="opening_balance"
                                    value={customer.opening_balance}
                                    onChange={(value) => setCustomer((prev) => ({ ...prev, opening_balance: value }))}
                                    placeholder="Enter opening balance"
                                />
                            </div>
                        )}

                        <div className="col-span-1 sm:col-span-2">
                            <Label className="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">
                                Physical Address
                            </Label>
                            <Input
                                type="text"
                                name="address"
                                value={customer.address}
                                onChange={handleChange}
                                placeholder="Street, City, State"
                            />
                        </div>
                    </div>
                </div>

                {/* Sticky Action Footer */}
                <div className="sticky bottom-0 pt-4 mt-6 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-3">
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={closeModal}
                        disabled={isPending}
                        className="w-1/3 sm:w-auto"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        disabled={isPending}
                        className="flex-1 sm:flex-initial sm:min-w-[160px]"
                    >
                        {isPending ? "Saving..." : customerToEdit ? "Save Changes" : "Create Customer"}
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default NewCustomer;

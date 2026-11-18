import { useState } from "react";
import { Table, TableHeader, TableRow, TableCell, TableBody, TableLoader, Pagination } from "../../components/ui/table";
import { useCustomers } from "../../hooks/useApiHooks";
import { formatCurrency, PERMISSION_VALUES } from "../../utils";
import { formatDate } from "../../utils/date";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import {
    MagnifyingGlassIcon,
    ArrowPathIcon,
    PencilSquareIcon,
    ArrowDownTrayIcon,
    UserPlusIcon,
    FunnelIcon,
    WalletIcon,
    PhoneIcon,
    CalendarIcon
} from "@heroicons/react/24/outline";
import Button from "../../components/button/Button";
import NewCustomer from "./NewCustomer";
import { useModal } from "../../hooks/useModal";
import { Modal } from "../../components/ui/modal";
import { Customer } from "../../api/types";
import Input from "../../components/form/input/InputField";
import WalletHistory from "./WalletHistory";
import useWidth from "../../hooks/useWidth";
import SearchableSelect from "../../components/form/SearchableSelect";
import AccessWrapper from "../../components/AccessController";
import { toast } from "react-toastify";
import ApiService from "../../api/apiService";

const Customers = () => {
    const [showFilters, setShowFilters] = useState(false);
    const [isDrawerOpen, setDrawerOpen] = useState(false);
    const [searchInput, setSearchInput] = useState("");
    const [selectedCustomer, setSelectedCustomer] = useState<Customer>(null);

    const { closeModal, isOpen, openModal } = useModal();
    const { notDesktop } = useWidth();

    const [filterData, setFilterData] = useState({
        page: 1,
        limit: 10,
        search: "",
        start_date: "",
        customer_type: "",
        end_date: "",
        status: ""
    });

    const { data, isLoading } = useCustomers(filterData);

    const pageData = data?.data?.customers ?? [];
    const currentPage = data?.data?.page ?? 1;
    const pageSize = data?.data?.limit ?? 10;
    const totalData = data?.data?.total ?? 0;

    const downloadReport = async () => {
        await toast.promise(async () => await ApiService.downloadCustomerList(), {
            pending: "Exporting customer list...",
            success: "List exported successfully",
            error: "Error downloading customer list. Try again"
        });
    };

    const handleSearch = () => {
        setFilterData((prev) => ({ ...prev, search: searchInput, page: 1 }));
    };

    const handleResetFilters = () => {
        setSearchInput("");
        setFilterData({
            page: 1,
            limit: 10,
            search: "",
            start_date: "",
            customer_type: "",
            end_date: "",
            status: ""
        });
        setShowFilters(false);
    };

    return (
        <div className="space-y-4">
            <PageBreadcrumb pageTitle="Customers" />

            {/* Actions & Search Controls */}
            <div className="flex flex-col gap-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    {/* Primary Button Group */}
                    <div className="flex items-center gap-2">
                        <AccessWrapper componentPermissions={[PERMISSION_VALUES.customers.create_customers]}>
                            <button
                                type="button"
                                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-500 text-white font-medium text-sm hover:bg-brand-600 active:scale-[0.98] transition shadow-xs"
                                onClick={openModal}
                            >
                                <UserPlusIcon className="size-4" />
                                <span>New Customer</span>
                            </button>
                        </AccessWrapper>

                        <AccessWrapper
                            componentPermissions={[
                                PERMISSION_VALUES.customers.view_customers,
                                PERMISSION_VALUES.customers.view_balances
                            ]}
                        >
                            <button
                                type="button"
                                className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 font-medium text-sm hover:bg-gray-50 active:scale-[0.98] dark:bg-gray-900 dark:border-gray-800 dark:text-gray-200 dark:hover:bg-gray-800 transition shadow-xs"
                                onClick={downloadReport}
                            >
                                <ArrowDownTrayIcon className="size-4" />
                                <span>Export</span>
                            </button>
                        </AccessWrapper>
                    </div>

                    {/* Search & Filter Toggles */}
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                        <div className="relative flex-1 sm:w-64">
                            <Input
                                value={searchInput}
                                placeholder="Search by name, email..."
                                onChange={(e) => setSearchInput(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                                className="pr-10"
                            />
                            <button
                                type="button"
                                onClick={handleSearch}
                                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition"
                                aria-label="Search"
                            >
                                <MagnifyingGlassIcon className="size-5" />
                            </button>
                        </div>

                        <button
                            type="button"
                            className={`flex size-11 sm:size-10 flex-shrink-0 items-center justify-center rounded-xl border transition ${
                                showFilters || filterData.status || filterData.customer_type || filterData.start_date
                                    ? "bg-brand-50 border-brand-300 text-brand-600 dark:bg-brand-500/20 dark:border-brand-500/30 dark:text-brand-400"
                                    : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50 dark:bg-gray-900 dark:border-gray-800 dark:text-gray-300"
                            }`}
                            onClick={() => setShowFilters((prev) => !prev)}
                            aria-label="Toggle Filters"
                        >
                            <FunnelIcon className="size-5" />
                        </button>
                    </div>
                </div>

                {/* Collapsible Filter Panel */}
                {showFilters && (
                    <div className="p-4 rounded-2xl border border-gray-200/80 bg-white dark:bg-gray-900/80 dark:border-gray-800 shadow-xs space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                            <div>
                                <label className="block text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1">
                                    Customer Type
                                </label>
                                <SearchableSelect
                                    value={filterData?.customer_type}
                                    options={[
                                        { value: "", label: "All Types" },
                                        { value: "regular", label: "Regular" },
                                        { value: "premium", label: "Premium" }
                                    ]}
                                    placeholder="All Types"
                                    onChange={(value) => setFilterData((prev) => ({ ...prev, customer_type: value, page: 1 }))}
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
                                        { value: "active", label: "Active" },
                                        { value: "inactive", label: "Inactive" }
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
                            <Button
                                variant="ghost"
                                className="text-xs"
                                onClick={handleResetFilters}
                            >
                                <ArrowPathIcon className="size-4 mr-1 inline" />
                                Reset
                            </Button>
                        </div>
                    </div>
                )}
            </div>

            {/* Content Area */}
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
                                        <TableCell isHeader>Name & Code</TableCell>
                                        <AccessWrapper componentPermissions={[PERMISSION_VALUES.customers.view_balances]}>
                                            <TableCell isHeader>Current Balance</TableCell>
                                        </AccessWrapper>
                                        <TableCell isHeader>Type</TableCell>
                                        <TableCell isHeader>Status</TableCell>
                                        <TableCell isHeader>Phone / Email</TableCell>
                                        <TableCell isHeader>Next Payment</TableCell>
                                        <TableCell isHeader>Actions</TableCell>
                                    </TableRow>
                                </TableHeader>
                                <TableBody className="divide-y divide-gray-100 dark:divide-gray-800">
                                    {pageData.length === 0 ? (
                                        <TableRow>
                                            <TableCell className="text-center py-10 text-gray-400" isHeader={false}>
                                                No customers found matching your criteria.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        pageData.map((customer) => (
                                            <TableRow key={customer.id}>
                                                <TableCell>
                                                    <div className="flex flex-col">
                                                        <span className="font-semibold text-gray-900 dark:text-white">
                                                            {customer.name}
                                                        </span>
                                                        <span className="text-xs font-mono text-gray-400">
                                                            {customer.customer_code || "-"}
                                                        </span>
                                                    </div>
                                                </TableCell>
                                                <AccessWrapper componentPermissions={[PERMISSION_VALUES.customers.view_balances]}>
                                                    <TableCell>
                                                        <span className="font-semibold tabular-nums text-gray-900 dark:text-emerald-400">
                                                            {formatCurrency(customer.balance)}
                                                        </span>
                                                    </TableCell>
                                                </AccessWrapper>
                                                <TableCell>
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                                                        customer.customer_type === "premium"
                                                            ? "bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
                                                            : "bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400"
                                                    }`}>
                                                        {customer.customer_type || "Regular"}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                                                        customer.status === "active"
                                                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                                                            : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                                                    }`}>
                                                        {customer.status || "Active"}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex flex-col text-xs text-gray-600 dark:text-gray-300">
                                                        <span>{customer.phone || "-"}</span>
                                                        <span className="text-gray-400 truncate max-w-[160px]">{customer.email || "-"}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <span className="text-xs text-gray-600 dark:text-gray-300">
                                                        {formatDate(customer.next_payment_date)}
                                                    </span>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1.5">
                                                        <AccessWrapper componentPermissions={[PERMISSION_VALUES.customers.update_customers]}>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setSelectedCustomer(customer);
                                                                    openModal();
                                                                }}
                                                                className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800 transition"
                                                                aria-label="Edit customer"
                                                            >
                                                                <PencilSquareIcon className="size-4" />
                                                            </button>
                                                        </AccessWrapper>
                                                        <AccessWrapper componentPermissions={[PERMISSION_VALUES.customers.view_balances]}>
                                                            <button
                                                                type="button"
                                                                onClick={() => {
                                                                    setSelectedCustomer(customer);
                                                                    setDrawerOpen(true);
                                                                }}
                                                                className="p-1.5 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800 transition"
                                                                aria-label="Wallet history"
                                                            >
                                                                <WalletIcon className="size-4" />
                                                            </button>
                                                        </AccessWrapper>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </div>

                    {/* Mobile View: High-Density Responsive Cards */}
                    <div className="block lg:hidden divide-y divide-gray-100 dark:divide-gray-800">
                        {pageData.length === 0 ? (
                            <div className="py-12 px-4 text-center text-sm text-gray-500 dark:text-gray-400">
                                No customers found matching your criteria.
                            </div>
                        ) : (
                            pageData.map((customer) => {
                                const initials = (customer.name || "C")
                                    .split(" ")
                                    .slice(0, 2)
                                    .map((n) => n[0])
                                    .join("")
                                    .toUpperCase();

                                return (
                                    <div
                                        key={customer.id}
                                        className="p-4 space-y-3 transition-colors active:bg-gray-50/60 dark:active:bg-gray-800/40"
                                    >
                                        {/* Card Header: Identity & Status */}
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex items-center gap-3 min-w-0">
                                                <div className="flex size-10 flex-shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-700 font-bold text-sm dark:bg-brand-500/15 dark:text-brand-400">
                                                    {initials}
                                                </div>
                                                <div className="min-w-0">
                                                    <h3 className="font-semibold text-gray-900 dark:text-white text-sm truncate">
                                                        {customer.name}
                                                    </h3>
                                                    <span className="text-xs font-mono text-gray-500 dark:text-gray-400">
                                                        {customer.customer_code || "No code"}
                                                    </span>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-1.5 flex-shrink-0">
                                                <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-medium capitalize ${
                                                    customer.status === "active"
                                                        ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                                                        : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                                                }`}>
                                                    {customer.status || "Active"}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Balance Row */}
                                        <AccessWrapper componentPermissions={[PERMISSION_VALUES.customers.view_balances]}>
                                            <div className="flex items-center justify-between p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                                                <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                                                    Current Balance
                                                </span>
                                                <span className="text-base font-bold tabular-nums text-gray-900 dark:text-emerald-400">
                                                    {formatCurrency(customer.balance)}
                                                </span>
                                            </div>
                                        </AccessWrapper>

                                        {/* Metadata Attributes */}
                                        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600 dark:text-gray-400">
                                            {customer.phone && (
                                                <a
                                                    href={`tel:${customer.phone}`}
                                                    className="flex items-center gap-1.5 hover:text-brand-600 transition truncate"
                                                >
                                                    <PhoneIcon className="size-3.5 text-gray-400" />
                                                    <span className="truncate">{customer.phone}</span>
                                                </a>
                                            )}
                                            {customer.next_payment_date && (
                                                <div className="flex items-center gap-1.5 truncate">
                                                    <CalendarIcon className="size-3.5 text-gray-400" />
                                                    <span className="truncate">Next: {formatDate(customer.next_payment_date)}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Card Actions Footer */}
                                        <div className="flex items-center justify-end gap-2 pt-1 border-t border-gray-100 dark:border-gray-800/60">
                                            <AccessWrapper componentPermissions={[PERMISSION_VALUES.customers.view_balances]}>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedCustomer(customer);
                                                        setDrawerOpen(true);
                                                    }}
                                                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 transition"
                                                >
                                                    <WalletIcon className="size-3.5" />
                                                    History
                                                </button>
                                            </AccessWrapper>

                                            <AccessWrapper componentPermissions={[PERMISSION_VALUES.customers.update_customers]}>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setSelectedCustomer(customer);
                                                        openModal();
                                                    }}
                                                    className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-brand-600 bg-brand-50 hover:bg-brand-100 dark:bg-brand-500/15 dark:text-brand-400 dark:hover:bg-brand-500/25 transition"
                                                >
                                                    <PencilSquareIcon className="size-3.5" />
                                                    Edit
                                                </button>
                                            </AccessWrapper>
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

            {/* Customer Edit/Create Modal */}
            <Modal
                isOpen={isOpen}
                onClose={() => {
                    closeModal();
                    setSelectedCustomer(null);
                }}
                isFullscreen={notDesktop}
                className="max-w-[700px] m-0 sm:m-2"
            >
                <NewCustomer
                    closeModal={() => {
                        closeModal();
                        setSelectedCustomer(null);
                    }}
                    customerToEdit={selectedCustomer}
                />
            </Modal>

            {/* Wallet History Drawer */}
            {!!selectedCustomer && isDrawerOpen && (
                <WalletHistory
                    customer={selectedCustomer}
                    onClose={() => {
                        setSelectedCustomer(null);
                        setDrawerOpen(false);
                    }}
                />
            )}
        </div>
    );
};

export default Customers;

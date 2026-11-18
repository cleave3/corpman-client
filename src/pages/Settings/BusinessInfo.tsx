import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { Business, SubmitBusinessRequest } from "../../api/types";
import AccessWrapper from "../../components/AccessController";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import Badge from "../../components/ui/badge/Badge";
import Button from "../../components/ui/button/Button";
import { Modal } from "../../components/ui/modal";
import { useSubmitBusiness } from "../../hooks/useApiHooks";
import { useModal } from "../../hooks/useModal";
import { PERMISSION_VALUES } from "../../utils";
import { formatDate } from "../../utils/date";
import { useEffect, useState } from "react";
import useWidth from "../../hooks/useWidth";

const BusinessInfo = ({ data }: { data: Business }) => {
    const [form, setForm] = useState<SubmitBusinessRequest>({
        business_address: data?.business_address,
        business_email: data?.business_email,
        business_name: data?.business_name,
        business_nature: data?.business_nature,
        business_phone: data?.business_phone,
        business_reg_no: data?.business_reg_no,
        business_type: data?.business_type,
        business_website: data?.business_website,
        certificate_url: data?.certificate_url,
        logo_url: data?.logo_url
    });

    const { openModal, closeModal, isOpen } = useModal();
    const { notDesktop } = useWidth();
    const { mutate, isPending, isSuccess } = useSubmitBusiness();

    useEffect(() => {
        setForm({
            business_address: data?.business_address,
            business_email: data?.business_email,
            business_name: data?.business_name,
            business_nature: data?.business_nature,
            business_phone: data?.business_phone,
            business_reg_no: data?.business_reg_no,
            business_type: data?.business_type,
            business_website: data?.business_website,
            certificate_url: data?.certificate_url,
            logo_url: data?.logo_url
        });
    }, [data]);

    useEffect(() => {
        if (isSuccess) closeModal();
    }, [closeModal, isSuccess]);

    const updateForm = (field: keyof Business, value: string) => {
        setForm((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutate(form);
    };

    return (
        <>
            <div className="p-4 sm:p-6 border border-gray-200/80 rounded-2xl bg-white dark:border-gray-800 dark:bg-gray-900 shadow-xs">
                {/* Header Profile */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-gray-100 dark:border-gray-800">
                    <div className="flex items-center gap-4">
                        <div className="size-16 sm:size-20 overflow-hidden border border-gray-200 rounded-2xl dark:border-gray-800 flex items-center justify-center bg-gray-50 dark:bg-gray-800 flex-shrink-0">
                            {data?.logo_url ? (
                                <img src={data?.logo_url} alt="Business logo" className="size-full object-cover" />
                            ) : (
                                <span className="text-xl sm:text-2xl font-bold text-gray-500 dark:text-gray-400">
                                    {`${data?.business_name?.[0] ?? ""} ${data?.business_name?.[1] ?? ""}`.toUpperCase()}
                                </span>
                            )}
                        </div>
                        <div>
                            <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                                {data?.business_name || "Enterprise"}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                                <Badge
                                    variant="light"
                                    color={data?.business_kyc_status === "approved" ? "success" : "warning"}
                                >
                                    KYC: {data?.business_kyc_status || "Pending"}
                                </Badge>
                                <span className="text-xs text-gray-400">
                                    {data?.business_type}
                                </span>
                            </div>
                        </div>
                    </div>

                    <AccessWrapper componentPermissions={[PERMISSION_VALUES.business.update_business]}>
                        <button
                            type="button"
                            onClick={openModal}
                            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 transition self-start sm:self-auto"
                        >
                            <PencilSquareIcon className="size-4" />
                            <span>Edit Profile</span>
                        </button>
                    </AccessWrapper>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 text-xs">
                    <div>
                        <p className="font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
                            RC / Reg Number
                        </p>
                        <p className="text-sm font-bold text-gray-800 dark:text-white">
                            {data?.business_reg_no || "—"}
                        </p>
                    </div>

                    <div>
                        <p className="font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
                            Nature of Business
                        </p>
                        <p className="text-sm font-medium text-gray-800 dark:text-white">
                            {data?.business_nature || "—"}
                        </p>
                    </div>

                    <div>
                        <p className="font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
                            Official Email
                        </p>
                        <p className="text-sm font-medium text-gray-800 dark:text-white truncate">
                            {data?.business_email || "—"}
                        </p>
                    </div>

                    <div>
                        <p className="font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
                            Telephone
                        </p>
                        <p className="text-sm font-medium text-gray-800 dark:text-white">
                            {data?.business_phone || "—"}
                        </p>
                    </div>

                    <div className="sm:col-span-2">
                        <p className="font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
                            Registered Office Address
                        </p>
                        <p className="text-xs text-gray-700 dark:text-gray-300">
                            {data?.business_address || "—"}
                        </p>
                    </div>

                    <div>
                        <p className="font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
                            Profile Updated
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-300">
                            {formatDate(data?.updated_at, "lll")}
                        </p>
                    </div>
                </div>
            </div>

            <Modal
                isOpen={isOpen}
                onClose={closeModal}
                isFullscreen={notDesktop}
                className="max-w-[650px] m-0 sm:m-2"
            >
                <div className="flex flex-col min-h-full">
                    <div className="pb-4 border-b border-gray-100 dark:border-gray-800">
                        <h4 className="text-base sm:text-lg font-bold tracking-tight text-gray-900 dark:text-white">
                            Edit Business Information
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            Keep enterprise organizational records accurate
                        </p>
                    </div>

                    <form className="flex flex-col flex-1 mt-4" onSubmit={handleSubmit}>
                        <div className="space-y-4 flex-1">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="col-span-1">
                                    <Label className="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">
                                        Business Name
                                    </Label>
                                    <Input
                                        type="text"
                                        value={form.business_name || ""}
                                        onChange={(e) => updateForm("business_name", e.target.value)}
                                        placeholder="e.g. Acme Corp"
                                    />
                                </div>

                                <div className="col-span-1">
                                    <Label className="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">
                                        Registration / RC Number
                                    </Label>
                                    <Input
                                        type="text"
                                        value={form.business_reg_no || ""}
                                        onChange={(e) => updateForm("business_reg_no", e.target.value)}
                                        placeholder="RC-123456"
                                    />
                                </div>

                                <div className="col-span-1">
                                    <Label className="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">
                                        Official Email Address
                                    </Label>
                                    <Input
                                        type="email"
                                        value={form.business_email || ""}
                                        onChange={(e) => updateForm("business_email", e.target.value)}
                                        placeholder="contact@company.com"
                                    />
                                </div>

                                <div className="col-span-1">
                                    <Label className="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">
                                        Phone Number
                                    </Label>
                                    <Input
                                        type="tel"
                                        value={form.business_phone || ""}
                                        onChange={(e) => updateForm("business_phone", e.target.value)}
                                        placeholder="08012345678"
                                    />
                                </div>

                                <div className="col-span-1">
                                    <Label className="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">
                                        Nature of Business
                                    </Label>
                                    <Input
                                        type="text"
                                        value={form.business_nature || ""}
                                        onChange={(e) => updateForm("business_nature", e.target.value)}
                                        placeholder="e.g. Microfinance / Retail"
                                    />
                                </div>

                                <div className="col-span-1">
                                    <Label className="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">
                                        Business Type
                                    </Label>
                                    <Input
                                        type="text"
                                        value={form.business_type || ""}
                                        onChange={(e) => updateForm("business_type", e.target.value)}
                                        placeholder="e.g. Limited Liability"
                                    />
                                </div>

                                <div className="col-span-1 sm:col-span-2">
                                    <Label className="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">
                                        Physical Business Address
                                    </Label>
                                    <Input
                                        type="text"
                                        value={form.business_address || ""}
                                        onChange={(e) => updateForm("business_address", e.target.value)}
                                        placeholder="Street Address, City, State"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="sticky bottom-0 pt-4 mt-6 bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-3">
                            <Button
                                size="sm"
                                disabled={isPending}
                                variant="outline"
                                onClick={closeModal}
                                type="button"
                            >
                                Cancel
                            </Button>
                            <Button size="sm" disabled={isPending} type="submit">
                                {isPending ? "Saving..." : "Save Changes"}
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal>
        </>
    );
};

export default BusinessInfo;

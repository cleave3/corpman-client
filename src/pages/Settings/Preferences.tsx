import { useEffect, useState } from "react";
import { Business, UpdateBusinessPreferencesRequest } from "../../api/types";
import Input from "../../components/form/input/InputField";
import Label from "../../components/form/Label";
import Button from "../../components/ui/button/Button";
import { Modal } from "../../components/ui/modal";
import { useModal } from "../../hooks/useModal";
import { formatDate } from "../../utils/date";
import { useUpdateBusinessPreferences } from "../../hooks/useApiHooks";
import AccessWrapper from "../../components/AccessController";
import { PERMISSION_VALUES } from "../../utils";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import useWidth from "../../hooks/useWidth";

const Preferences = ({ data }: { data: Business["preferences"] }) => {
    const [form, setForm] = useState<UpdateBusinessPreferencesRequest>({
        sms_id: data?.sms_id,
        sms_notification: data?.sms_notification,
        email_notification: data?.email_notification,
        require_two_factor: data?.require_two_factor
    });

    const { openModal, closeModal, isOpen } = useModal();
    const { notDesktop } = useWidth();
    const { isPending, mutate } = useUpdateBusinessPreferences();
    const queryClient = useQueryClient();

    useEffect(() => {
        setForm({
            sms_id: data?.sms_id,
            sms_notification: data?.sms_notification,
            email_notification: data?.email_notification,
            require_two_factor: data?.require_two_factor
        });
    }, [data]);

    const updateForm = (field: keyof UpdateBusinessPreferencesRequest, value: string) => {
        setForm((prev) => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        mutate(form, {
            onSuccess: () => {
                queryClient.invalidateQueries({ queryKey: ["business"] });
                toast.success("Business preference updated successfully");
                closeModal();
            },
            onError: (error) => {
                toast.error(error.message);
            }
        });
    };

    return (
        <>
            <div className="p-4 sm:p-6 border border-gray-200/80 rounded-2xl bg-white dark:border-gray-800 dark:bg-gray-900 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100 dark:border-gray-800">
                    <div>
                        <h3 className="text-base font-bold text-gray-900 dark:text-white">
                            Notification Preferences
                        </h3>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            Manage automated SMS & Email dispatch channels
                        </p>
                    </div>

                    <AccessWrapper componentPermissions={[PERMISSION_VALUES.business.update_business_preferences]}>
                        <button
                            type="button"
                            onClick={openModal}
                            className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-200 bg-white text-xs font-semibold text-gray-700 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700 transition self-start sm:self-auto"
                        >
                            <PencilSquareIcon className="size-4" />
                            <span>Edit Preferences</span>
                        </button>
                    </AccessWrapper>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 text-xs">
                    <div>
                        <p className="font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
                            SMS Sender ID
                        </p>
                        <p className="text-sm font-bold text-gray-800 dark:text-white">
                            {data?.sms_id || "Not Configured"}
                        </p>
                    </div>

                    <div>
                        <p className="font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
                            SMS Notifications
                        </p>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            data?.sms_notification ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                        }`}>
                            {data?.sms_notification ? "Enabled" : "Disabled"}
                        </span>
                    </div>

                    <div>
                        <p className="font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
                            Email Notifications
                        </p>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            data?.email_notification ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400" : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                        }`}>
                            {data?.email_notification ? "Enabled" : "Disabled"}
                        </span>
                    </div>

                    <div>
                        <p className="font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-1">
                            Last Updated
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
                className="max-w-[550px] m-0 sm:m-2"
            >
                <div className="flex flex-col min-h-full">
                    <div className="pb-4 border-b border-gray-100 dark:border-gray-800">
                        <h4 className="text-base sm:text-lg font-bold tracking-tight text-gray-900 dark:text-white">
                            Edit Preferences
                        </h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                            Update outbound messaging identification
                        </p>
                    </div>

                    <form className="flex flex-col flex-1 mt-4" onSubmit={handleSubmit}>
                        <div className="space-y-4 flex-1">
                            <div>
                                <Label className="mb-1 block text-xs font-semibold text-gray-700 dark:text-gray-300">
                                    SMS Sender ID
                                </Label>
                                <Input
                                    type="text"
                                    value={form?.sms_id || ""}
                                    placeholder="e.g. CORPMAN"
                                    maxLength={11}
                                    onChange={(e) => updateForm("sms_id", e.target.value)}
                                />
                                <p className="text-[11px] text-gray-400 mt-1">
                                    Maximum 11 alphanumeric characters as required by telecom operators.
                                </p>
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
                                {isPending ? "Saving..." : "Save Preferences"}
                            </Button>
                        </div>
                    </form>
                </div>
            </Modal>
        </>
    );
};

export default Preferences;
